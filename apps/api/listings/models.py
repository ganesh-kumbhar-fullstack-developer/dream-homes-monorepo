import uuid

from django.conf import settings
from django.contrib.gis.db import models as gis_models
from django.db import models


class Property(models.Model):
    class ListingType(models.TextChoices):
        SALE = "sale", "For sale"
        RENT = "rent", "For rent"

    class PropertyType(models.TextChoices):
        APARTMENT = "apartment", "Apartment"
        VILLA = "villa", "Villa"
        HOUSE = "house", "Independent house"
        PLOT = "plot", "Plot"
        OFFICE = "office", "Office"
        SHOP = "shop", "Shop"

    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PENDING_REVIEW = "pending_review", "Pending review"
        PUBLISHED = "published", "Published"
        REJECTED = "rejected", "Rejected"
        ARCHIVED = "archived", "Archived"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="listings",
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    listing_type = models.CharField(max_length=10, choices=ListingType.choices)
    property_type = models.CharField(max_length=20, choices=PropertyType.choices)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)

    price = models.DecimalField(max_digits=14, decimal_places=2)
    currency = models.CharField(max_length=3, default="INR")

    bedrooms = models.PositiveSmallIntegerField(null=True, blank=True)
    bathrooms = models.PositiveSmallIntegerField(null=True, blank=True)
    area_sqft = models.PositiveIntegerField(null=True, blank=True)

    address_line = models.CharField(max_length=255)
    locality = models.CharField(max_length=120)
    city = models.CharField(max_length=120)
    state = models.CharField(max_length=120, blank=True)
    postal_code = models.CharField(max_length=12, blank=True)
    country = models.CharField(max_length=2, default="IN")
    location = gis_models.PointField(srid=4326, null=True, blank=True, spatial_index=True)

    featured = models.BooleanField(default=False)
    # Amenities, features, nearby places and other fields without a column of their own.
    details = models.JSONField(default=dict, blank=True)
    legacy_id = models.CharField(max_length=24, unique=True, null=True, blank=True)

    # Verification fields. A listing is only shown as verified once a moderator
    # has checked the owner and, where applicable, the RERA registration.
    rera_number = models.CharField(max_length=50, blank=True)
    verified_at = models.DateTimeField(null=True, blank=True)

    verified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="verified_properties",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-published_at", "-created_at"]
        indexes = [
            models.Index(fields=["status", "listing_type"]),
            models.Index(fields=["city", "locality"]),
        ]

    def __str__(self):
        return self.title


class PropertyImage(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="properties/%Y/%m/", blank=True)
    source_url = models.URLField(max_length=500, blank=True)
    alt_text = models.CharField(max_length=200, blank=True)
    position = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["position"]

    def __str__(self):
        return f"{self.property_id} #{self.position}"


class Favourite(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="favourites"
    )
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="favourited_by")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "property"], name="unique_favourite")
        ]
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user_id} saved {self.property_id}"
