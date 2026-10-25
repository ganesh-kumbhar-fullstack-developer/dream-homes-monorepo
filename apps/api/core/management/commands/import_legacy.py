"""Import listings and users from the previous Dream Homes MongoDB database.

Run with the connection string in the environment, never on the command line:

    MONGODB_URI=... python manage.py import_legacy --database test --dry-run

The import is idempotent. Each record keeps its old MongoDB _id in `legacy_id`,
so re-running updates existing rows instead of duplicating them.
"""

import re
from datetime import UTC
from decimal import Decimal, InvalidOperation

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils import timezone

from listings.models import Favourite, Property, PropertyImage

User = get_user_model()

PROPERTY_TYPE_MAP = {
    "Villa": Property.PropertyType.VILLA,
    "Duplex": Property.PropertyType.HOUSE,
    # Apartment variants, including studios and penthouses, are apartments.
    "1BHK": Property.PropertyType.APARTMENT,
    "2BHK": Property.PropertyType.APARTMENT,
    "3BHK": Property.PropertyType.APARTMENT,
    "4BHK": Property.PropertyType.APARTMENT,
    "5BHK": Property.PropertyType.APARTMENT,
    "Studio": Property.PropertyType.APARTMENT,
    "Penthouse": Property.PropertyType.APARTMENT,
}

# Spelling mistakes found in the legacy data.
STATE_FIXES = {"Maharastra": "Maharashtra"}

PHONE_PATTERN = re.compile(r"^[0-9]{10}$")
LEGACY_OWNER_EMAIL = "legacy-import@dreamhomes.local"


def split_city(raw_city):
    """'Hadapsar, Pune' becomes locality 'Hadapsar' and city 'Pune'."""
    if "," in raw_city:
        locality, city = (part.strip() for part in raw_city.split(",", 1))
        return locality, city
    return "", raw_city.strip()


class Command(BaseCommand):
    help = "Import properties and users from the legacy MongoDB database."

    def add_arguments(self, parser):
        parser.add_argument("--database", default="test", help="MongoDB database name")
        parser.add_argument("--dry-run", action="store_true", help="Run everything, then roll back")

    def handle(self, *args, **options):
        import os

        from pymongo import MongoClient

        uri = os.environ.get("MONGODB_URI")
        if not uri:
            raise CommandError("Set MONGODB_URI in the environment")

        mongo = MongoClient(uri, serverSelectionTimeoutMS=20000)[options["database"]]
        self.stats = {
            "users": 0,
            "users_unusable_password": 0,
            "properties": 0,
            "images": 0,
            "skipped": 0,
        }

        with transaction.atomic():
            owner = self.get_legacy_owner()
            self.import_users(mongo)
            self.import_properties(mongo, owner)
            self.import_favourites(mongo)
            if options["dry_run"]:
                transaction.set_rollback(True)
                self.stdout.write(self.style.WARNING("Dry run: all changes rolled back"))

        for key, value in self.stats.items():
            self.stdout.write(f"{key}: {value}")

    def get_legacy_owner(self):
        owner, _ = User.objects.get_or_create(
            email=LEGACY_OWNER_EMAIL,
            defaults={
                "full_name": "Legacy import",
                "role": User.Role.STAFF,
                "is_active": False,  # Owns imported listings; cannot log in.
            },
        )
        return owner

    def import_users(self, mongo):
        for doc in mongo["users"].find():
            email = (doc.get("email") or "").strip().lower()
            if not email:
                self.stats["skipped"] += 1
                continue
            if User.objects.filter(email=email).exclude(legacy_id=str(doc["_id"])).exists():
                # Duplicate email in the legacy data, for example the same address in two cases.
                self.stderr.write(f"Skipping user {doc['_id']}: email already imported")
                self.stats["skipped"] += 1
                continue

            phone = (doc.get("phone") or "").strip()
            phone_value = f"+91{phone}" if PHONE_PATTERN.match(phone) else None
            if (
                phone_value
                and User.objects.filter(phone=phone_value)
                .exclude(legacy_id=str(doc["_id"]))
                .exists()
            ):
                phone_value = None  # Phone already used by another account; keep the email.

            user, _ = User.objects.update_or_create(
                legacy_id=str(doc["_id"]),
                defaults={
                    "email": email,
                    "full_name": (doc.get("name") or email.split("@")[0])[:150],
                    "phone": phone_value,
                    "is_active": bool(doc.get("isActive", True)),
                    "role": User.Role.BUYER,
                },
            )

            # Old passwords were stored in plain text. Hash them now. Values that
            # look like bcrypt hashes cannot be verified here, so those accounts
            # get an unusable password and must reset it.
            raw_password = doc.get("password") or ""
            if raw_password and not raw_password.startswith("$2"):
                user.set_password(raw_password)
            else:
                user.set_unusable_password()
                self.stats["users_unusable_password"] += 1
            user.save()
            self.stats["users"] += 1

    def import_properties(self, mongo, owner):
        for doc in mongo["properties"].find():
            try:
                fields = self.map_property(doc, owner)
            except (InvalidOperation, ValueError, TypeError, KeyError) as error:
                self.stderr.write(f"Skipping {doc.get('_id')}: {error}")
                self.stats["skipped"] += 1
                continue

            prop, _ = Property.objects.update_or_create(legacy_id=str(doc["_id"]), defaults=fields)

            # Replace images on every run so the set always matches the source.
            prop.images.all().delete()
            position = 0
            for url in doc.get("images") or []:
                if not isinstance(url, str) or not url.startswith(("http://", "https://")):
                    continue  # Skips "/placeholder.svg" and other local placeholders.
                PropertyImage.objects.create(
                    property=prop, source_url=url, alt_text=prop.title[:200], position=position
                )
                position += 1
                self.stats["images"] += 1
            self.stats["properties"] += 1

    def map_property(self, doc, owner):
        loc = doc.get("location") or {}
        raw_city = (loc.get("city") or "").strip()
        locality, city = split_city(raw_city)
        if not city:
            raise ValueError("missing city")

        listing_type = {"buy": Property.ListingType.SALE, "rent": Property.ListingType.RENT}[
            doc["type"]
        ]
        created = doc.get("createdAt")
        if created is not None and created.tzinfo is None:
            created = created.replace(tzinfo=UTC)

        return {
            "owner": owner,
            "title": (doc.get("title") or "Untitled listing").strip()[:200],
            "description": (doc.get("description") or "").strip() or "No description provided.",
            "listing_type": listing_type,
            "property_type": PROPERTY_TYPE_MAP.get(
                doc.get("propertyType"), Property.PropertyType.APARTMENT
            ),
            "status": Property.Status.PUBLISHED,
            "price": Decimal(str(doc["price"])),
            "currency": "INR",
            "bedrooms": doc.get("bedrooms") or None,
            "bathrooms": doc.get("bathrooms") or None,
            "area_sqft": doc.get("size") or None,
            "address_line": (loc.get("address") or locality or city).strip()[:255],
            "locality": (locality or city)[:120],
            "city": city[:120],
            "state": STATE_FIXES.get(loc.get("state", ""), loc.get("state", ""))[:120],
            "postal_code": str(loc.get("zipCode") or "")[:12],
            "country": "IN",
            "featured": bool(doc.get("featured")),
            "details": {
                "amenities": doc.get("amenities") or [],
                "features": doc.get("features") or [],
                "nearby_places": doc.get("nearbyPlaces") or [],
                "parking": doc.get("parking"),
                "pets_allowed": bool(doc.get("petsAllowed")),
                "year_built": doc.get("yearBuilt"),
            },
            # No coordinates in the legacy data. Geocoding is a separate step.
            "location": None,
            "published_at": created or timezone.now(),
        }

    def import_favourites(self, mongo):
        """Saved homes move across by matching each legacy listing id to its imported listing."""
        for doc in mongo["users"].find({"likedProperties.0": {"$exists": True}}):
            user = User.objects.filter(legacy_id=str(doc["_id"])).first()
            if user is None:
                continue
            for legacy_listing_id in doc.get("likedProperties") or []:
                listing = Property.objects.filter(legacy_id=str(legacy_listing_id)).first()
                if listing is None:
                    self.stats["skipped"] += 1
                    continue
                Favourite.objects.get_or_create(user=user, property=listing)
                self.stats["favourites"] = self.stats.get("favourites", 0) + 1
