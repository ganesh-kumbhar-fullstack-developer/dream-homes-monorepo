import io

from django.core import mail
from django.core.cache import cache
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from PIL import Image
from rest_framework.test import APIClient

from accounts.models import User
from listings.models import Favourite, Property


def photo(name="home.png"):
    buffer = io.BytesIO()
    Image.new("RGB", (40, 30), "orange").save(buffer, format="PNG")
    return SimpleUploadedFile(name, buffer.getvalue(), content_type="image/png")


def listing_payload(**overrides):
    data = {
        "title": "Two bed in Baner",
        "description": "Bright corner flat",
        "listing_type": "sale",
        "property_type": "apartment",
        "price": "8500000.00",
        "bedrooms": 2,
        "address_line": "Road 1",
        "locality": "Baner",
        "city": "Pune",
        "latitude": 18.5590,
        "longitude": 73.7868,
    }
    data.update(overrides)
    return data


class ListingLifecycleTests(TestCase):
    def setUp(self):
        self.owner = User.objects.create_user(email="owner@example.com", full_name="Owner")
        self.other = User.objects.create_user(email="other@example.com", full_name="Other")
        self.staff = User.objects.create_user(
            email="staff@example.com", full_name="Staff", role=User.Role.STAFF
        )
        self.client = APIClient()

    def create_listing(self):
        self.client.force_authenticate(self.owner)
        response = self.client.post("/api/manage/listings/", listing_payload(), format="json")
        self.assertEqual(response.status_code, 201)
        return response.json()["id"]

    def test_new_listing_is_a_draft_and_stays_private(self):
        listing_id = self.create_listing()
        self.assertEqual(Property.objects.get(pk=listing_id).status, Property.Status.DRAFT)
        self.assertNotIn(
            listing_id, [r["id"] for r in APIClient().get("/api/listings/").json()["results"]]
        )

    def test_owner_cannot_set_status_or_verification(self):
        listing_id = self.create_listing()
        self.client.patch(
            f"/api/manage/listings/{listing_id}/",
            {"status": "published", "verified_at": "2026-01-01T00:00:00Z", "featured": True},
            format="json",
        )
        prop = Property.objects.get(pk=listing_id)
        self.assertEqual(prop.status, Property.Status.DRAFT)
        self.assertIsNone(prop.verified_at)
        self.assertFalse(prop.featured)

    def test_owner_cannot_see_or_edit_another_owners_listing(self):
        listing_id = self.create_listing()
        self.client.force_authenticate(self.other)
        self.assertEqual(self.client.get(f"/api/manage/listings/{listing_id}/").status_code, 404)
        self.assertEqual(
            self.client.patch(
                f"/api/manage/listings/{listing_id}/", {"title": "x"}, format="json"
            ).status_code,
            404,
        )

    def test_submit_needs_a_photo(self):
        listing_id = self.create_listing()
        response = self.client.post(f"/api/manage/listings/{listing_id}/submit/")
        self.assertEqual(response.status_code, 400)

    def test_full_approval_path_publishes_listing(self):
        listing_id = self.create_listing()
        self.client.post(
            f"/api/manage/listings/{listing_id}/images/", {"image": photo()}, format="multipart"
        )
        self.assertEqual(
            self.client.post(f"/api/manage/listings/{listing_id}/submit/").status_code, 200
        )

        self.client.force_authenticate(self.staff)
        self.assertEqual(
            self.client.post(f"/api/manage/listings/{listing_id}/publish/").status_code, 400
        )  # not verified
        self.assertEqual(
            self.client.post(f"/api/manage/listings/{listing_id}/verify/").status_code, 200
        )
        self.assertEqual(
            self.client.post(f"/api/manage/listings/{listing_id}/publish/").status_code, 200
        )

        prop = Property.objects.get(pk=listing_id)
        self.assertEqual(prop.status, Property.Status.PUBLISHED)
        self.assertEqual(prop.verified_by, self.staff)
        self.assertIn(
            listing_id, [r["id"] for r in APIClient().get("/api/listings/").json()["results"]]
        )

    def test_owner_cannot_publish_or_verify(self):
        listing_id = self.create_listing()
        self.client.force_authenticate(self.owner)
        self.assertEqual(
            self.client.post(f"/api/manage/listings/{listing_id}/verify/").status_code, 403
        )
        self.assertEqual(
            self.client.post(f"/api/manage/listings/{listing_id}/publish/").status_code, 403
        )

    def test_owner_edit_of_published_listing_goes_back_to_review(self):
        listing_id = self.create_listing()
        Property.objects.filter(pk=listing_id).update(
            status=Property.Status.PUBLISHED, verified_at="2026-01-01T00:00:00Z"
        )
        self.client.patch(
            f"/api/manage/listings/{listing_id}/", {"price": "9000000"}, format="json"
        )
        prop = Property.objects.get(pk=listing_id)
        self.assertEqual(prop.status, Property.Status.PENDING_REVIEW)
        self.assertIsNone(prop.verified_at)

    def test_delete_archives_instead_of_removing(self):
        listing_id = self.create_listing()
        self.assertEqual(self.client.delete(f"/api/manage/listings/{listing_id}/").status_code, 204)
        self.assertEqual(Property.objects.get(pk=listing_id).status, Property.Status.ARCHIVED)

    def test_image_upload_rejects_non_images_and_accepts_png(self):
        listing_id = self.create_listing()
        bad = SimpleUploadedFile("x.txt", b"not an image", content_type="text/plain")
        self.assertEqual(
            self.client.post(
                f"/api/manage/listings/{listing_id}/images/", {"image": bad}, format="multipart"
            ).status_code,
            400,
        )
        self.assertEqual(
            self.client.post(
                f"/api/manage/listings/{listing_id}/images/", {"image": photo()}, format="multipart"
            ).status_code,
            201,
        )

    def test_listing_coordinates_round_trip(self):
        listing_id = self.create_listing()
        prop = Property.objects.get(pk=listing_id)
        self.assertAlmostEqual(prop.location.y, 18.5590, places=4)
        self.assertAlmostEqual(prop.location.x, 73.7868, places=4)


class FavouriteTests(TestCase):
    def setUp(self):
        owner = User.objects.create_user(email="o@example.com", full_name="O")
        self.home = Property.objects.create(
            owner=owner,
            title="Live",
            description="d",
            listing_type="sale",
            property_type="villa",
            price=1,
            address_line="a",
            locality="b",
            city="Pune",
            status=Property.Status.PUBLISHED,
        )
        self.draft = Property.objects.create(
            owner=owner,
            title="Draft",
            description="d",
            listing_type="sale",
            property_type="villa",
            price=1,
            address_line="a",
            locality="b",
            city="Pune",
            status=Property.Status.DRAFT,
        )
        self.user = User.objects.create_user(email="fav@example.com", full_name="F")
        self.client = APIClient()

    def test_favourites_require_sign_in(self):
        self.assertEqual(self.client.get("/api/me/favourites/").status_code, 401)

    def test_save_list_and_remove(self):
        self.client.force_authenticate(self.user)
        self.assertEqual(self.client.put(f"/api/me/favourites/{self.home.pk}/").status_code, 200)
        self.client.put(f"/api/me/favourites/{self.home.pk}/")  # saving twice is harmless
        self.assertEqual(Favourite.objects.count(), 1)
        self.assertEqual(
            [r["title"] for r in self.client.get("/api/me/favourites/").json()["results"]], ["Live"]
        )
        self.assertEqual(self.client.delete(f"/api/me/favourites/{self.home.pk}/").status_code, 204)
        self.assertEqual(self.client.get("/api/me/favourites/").json()["count"], 0)

    def test_cannot_save_an_unpublished_listing(self):
        self.client.force_authenticate(self.user)
        self.assertEqual(self.client.put(f"/api/me/favourites/{self.draft.pk}/").status_code, 404)

    def test_favourites_are_private_to_each_user(self):
        other = User.objects.create_user(email="x@example.com", full_name="X")
        Favourite.objects.create(user=other, property=self.home)
        self.client.force_authenticate(self.user)
        self.assertEqual(self.client.get("/api/me/favourites/").json()["count"], 0)


@override_settings(
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
    LEADS_NOTIFY_EMAIL="team@dreamhomes.test",
)
class StaffLeadTests(TestCase):
    def setUp(self):
        cache.clear()
        self.client = APIClient()
        self.staff = User.objects.create_user(
            email="s@example.com", full_name="S", role=User.Role.STAFF
        )
        self.buyer = User.objects.create_user(email="b@example.com", full_name="B")

    def submit_enquiry(self, email="asha@example.com"):
        # Email is sent after commit, so run the on-commit callbacks the way production does.
        with self.captureOnCommitCallbacks(execute=True):
            return self._post_enquiry(email)

    def _post_enquiry(self, email):
        return APIClient().post(
            "/api/leads/",
            {
                "name": "Asha",
                "phone": "9876543210",
                "email": email,
                "message": "<b>hi</b>",
                "consent_contact": True,
            },
            format="json",
        )

    def test_enquiry_emails_team_and_confirms_to_enquirer(self):
        self.assertEqual(self.submit_enquiry().status_code, 201)
        recipients = sorted(addr for m in mail.outbox for addr in m.to)
        self.assertEqual(recipients, ["asha@example.com", "team@dreamhomes.test"])

    def test_team_email_is_plain_text(self):
        self.submit_enquiry()
        team = next(m for m in mail.outbox if "team@dreamhomes.test" in m.to)
        self.assertIn("<b>hi</b>", team.body)  # shown literally, not rendered as HTML
        self.assertEqual(team.alternatives, [])

    def test_no_email_without_a_contact_address_on_enquirer_side(self):
        self.submit_enquiry(email="")
        self.assertEqual(len(mail.outbox), 1)

    def test_only_staff_can_list_leads(self):
        self.submit_enquiry()
        self.assertEqual(APIClient().get("/api/manage/leads/").status_code, 401)
        self.client.force_authenticate(self.buyer)
        self.assertEqual(self.client.get("/api/manage/leads/").status_code, 403)
        self.client.force_authenticate(self.staff)
        self.assertEqual(self.client.get("/api/manage/leads/").status_code, 200)

    def test_staff_can_change_status_and_assignee_but_not_contact_details(self):
        self.submit_enquiry()
        self.client.force_authenticate(self.staff)
        lead_id = self.client.get("/api/manage/leads/").json()["results"][0]["id"]
        response = self.client.patch(
            f"/api/manage/leads/{lead_id}/",
            {"status": "contacted", "assigned_to": str(self.staff.pk), "phone": "0000000000"},
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        body = response.json()
        self.assertEqual(body["status"], "contacted")
        self.assertEqual(body["phone"], "9876543210")
