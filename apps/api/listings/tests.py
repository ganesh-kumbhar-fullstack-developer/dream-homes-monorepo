from django.contrib.gis.geos import Point
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from accounts.models import User
from listings.models import Property


class PublicListingTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        owner = User.objects.create_user(
            email="owner@example.com", password="x-test-pass-123", full_name="Owner"
        )
        common = dict(
            owner=owner,
            description="Test listing",
            listing_type=Property.ListingType.SALE,
            property_type=Property.PropertyType.APARTMENT,
            price=1000000,
            address_line="1 Test Road",
            locality="Kothrud",
            city="Pune",
        )
        cls.published = Property.objects.create(
            title="Published flat",
            status=Property.Status.PUBLISHED,
            published_at=timezone.now(),
            location=Point(73.8077, 18.5074, srid=4326),
            **common,
        )
        Property.objects.create(title="Draft flat", status=Property.Status.DRAFT, **common)
        Property.objects.create(
            title="Far away flat",
            status=Property.Status.PUBLISHED,
            published_at=timezone.now(),
            location=Point(77.2090, 28.6139, srid=4326),  # New Delhi
            **common,
        )
        cls.client = APIClient()

    def test_only_published_listings_are_listed(self):
        response = self.client.get("/api/listings/")
        self.assertEqual(response.status_code, 200)
        titles = {item["title"] for item in response.json()["results"]}
        self.assertNotIn("Draft flat", titles)
        self.assertIn("Published flat", titles)

    def test_draft_listing_detail_is_not_found(self):
        draft = Property.objects.get(title="Draft flat")
        response = self.client.get(f"/api/listings/{draft.pk}/")
        self.assertEqual(response.status_code, 404)

    def test_radius_search_filters_by_distance(self):
        response = self.client.get("/api/listings/", {"near": "18.5074,73.8077", "radius_km": 10})
        titles = {item["title"] for item in response.json()["results"]}
        self.assertEqual(titles, {"Published flat"})

    def test_invalid_radius_is_rejected(self):
        response = self.client.get("/api/listings/", {"near": "18.5,73.8", "radius_km": 500})
        self.assertEqual(response.status_code, 400)
