from django.test import TestCase

from accounts.models import User


class UserModelTests(TestCase):
    def test_email_is_normalised_and_login_field(self):
        user = User.objects.create_user(
            email="Buyer@Example.COM", password="x-test-pass-123", full_name="Test"
        )
        self.assertEqual(user.email, "buyer@example.com")
        self.assertTrue(user.check_password("x-test-pass-123"))

    def test_user_ids_are_uuids(self):
        user = User.objects.create_user(
            email="a@example.com", password="x-test-pass-123", full_name="A"
        )
        self.assertEqual(len(str(user.pk)), 36)
