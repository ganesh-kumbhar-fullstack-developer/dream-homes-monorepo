from django.test import TestCase
from rest_framework.test import APIClient

from leads.models import Lead


class LeadSubmissionTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = "/api/leads/"
        self.payload = {
            "name": "Asha Patil",
            "phone": "+91 98765 43210",
            "email": "asha@example.com",
            "message": "Is the flat still available?",
            "consent_contact": True,
        }

    def test_consented_lead_is_stored_with_consent_timestamp(self):
        response = self.client.post(self.url, self.payload, format="json")
        self.assertEqual(response.status_code, 201)
        lead = Lead.objects.get()
        self.assertEqual(lead.phone, "+919876543210")
        self.assertTrue(lead.consent_contact)
        self.assertIsNotNone(lead.consent_recorded_at)

    def test_lead_without_consent_is_rejected(self):
        self.payload["consent_contact"] = False
        response = self.client.post(self.url, self.payload, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertFalse(Lead.objects.exists())

    def test_invalid_phone_is_rejected(self):
        self.payload["phone"] = "12ab"
        response = self.client.post(self.url, self.payload, format="json")
        self.assertEqual(response.status_code, 400)


class HoneypotTests(TestCase):
    def test_bot_submission_with_honeypot_is_rejected(self):
        payload = {
            "name": "Bot",
            "phone": "9876543210",
            "consent_contact": True,
            "website": "http://spam.example",
        }
        response = APIClient().post("/api/leads/", payload, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertFalse(Lead.objects.exists())


class LegacyPropertyReferenceTests(TestCase):
    def setUp(self):
        from accounts.models import User
        from listings.models import Property

        owner = User.objects.create_user(
            email="legacy@example.com", password="x-test-pass-123", full_name="L"
        )
        self.home = Property.objects.create(
            owner=owner,
            title="Legacy home",
            description="x",
            listing_type=Property.ListingType.SALE,
            property_type=Property.PropertyType.APARTMENT,
            price=1,
            address_line="a",
            locality="b",
            city="Pune",
            status=Property.Status.PUBLISHED,
            legacy_id="68985374dbbf4828366536ff",
        )

    def test_enquiry_accepts_legacy_listing_id(self):
        payload = {
            "name": "Asha",
            "phone": "9876543210",
            "consent_contact": True,
            "property": "68985374dbbf4828366536ff",
        }
        response = APIClient().post("/api/leads/", payload, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Lead.objects.get().property, self.home)

    def test_enquiry_for_unknown_listing_is_rejected(self):
        payload = {
            "name": "A",
            "phone": "9876543210",
            "consent_contact": True,
            "property": "000000000000000000000000",
        }
        response = APIClient().post("/api/leads/", payload, format="json")
        self.assertEqual(response.status_code, 400)
