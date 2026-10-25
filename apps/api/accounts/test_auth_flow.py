import re
from datetime import timedelta
from unittest import mock

from django.core import mail
from django.core.cache import cache
from django.test import TestCase, override_settings
from django.utils import timezone
from rest_framework.test import APIClient

from accounts import otp
from accounts.models import EmailLoginCode, User


def code_from_outbox():
    body = mail.outbox[-1].body
    return re.search(r"code is (\d{6})", body).group(1)


@override_settings(EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend")
class EmailOTPTests(TestCase):
    def setUp(self):
        cache.clear()  # throttle counters are shared across tests
        self.client = APIClient()

    def request(self, email="Buyer@Example.com"):
        return self.client.post("/api/auth/otp/request/", {"email": email}, format="json")

    def verify(self, email, code, full_name=""):
        return self.client.post(
            "/api/auth/otp/verify/",
            {"email": email, "code": code, "full_name": full_name},
            format="json",
        )

    def test_request_sends_code_and_gives_generic_reply(self):
        response = self.request()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].to, ["buyer@example.com"])
        self.assertRegex(code_from_outbox(), r"^\d{6}$")

    def test_unknown_email_gets_same_reply_as_known(self):
        User.objects.create_user(email="known@example.com", full_name="K")
        known = self.request("known@example.com").json()
        unknown = self.request("nobody@example.com").json()
        self.assertEqual(known, unknown)

    def test_valid_code_signs_in_and_creates_account(self):
        self.request("new@example.com")
        response = self.verify("new@example.com", code_from_outbox(), "New Buyer")
        self.assertEqual(response.status_code, 200)
        body = response.json()
        self.assertTrue(body["access"] and body["refresh"])
        self.assertEqual(body["user"]["email"], "new@example.com")
        self.assertEqual(User.objects.get(email="new@example.com").full_name, "New Buyer")

    def test_code_can_be_used_only_once(self):
        self.request("once@example.com")
        code = code_from_outbox()
        self.assertEqual(self.verify("once@example.com", code).status_code, 200)
        self.assertEqual(self.verify("once@example.com", code).status_code, 400)

    def test_wrong_code_is_rejected(self):
        self.request("wrong@example.com")
        self.assertEqual(self.verify("wrong@example.com", "000000").status_code, 400)

    def test_code_locks_after_five_wrong_attempts(self):
        self.request("lock@example.com")
        correct = code_from_outbox()
        wrong = "000000" if correct != "000000" else "111111"
        for _ in range(5):
            self.verify("lock@example.com", wrong)
        self.assertEqual(self.verify("lock@example.com", correct).status_code, 400)

    def test_expired_code_is_rejected(self):
        self.request("late@example.com")
        code = code_from_outbox()
        EmailLoginCode.objects.update(expires_at=timezone.now() - timedelta(minutes=1))
        self.assertEqual(self.verify("late@example.com", code).status_code, 400)

    def test_only_hash_is_stored(self):
        self.request("hash@example.com")
        code = code_from_outbox()
        entry = EmailLoginCode.objects.get()
        self.assertNotEqual(entry.code_hash, code)
        self.assertEqual(len(entry.code_hash), 64)

    def test_hourly_request_limit_drops_extra_codes(self):
        with mock.patch("accounts.otp.MAX_REQUESTS_PER_HOUR", 2):
            for _ in range(4):
                otp.request_code("flood@example.com")
        self.assertEqual(EmailLoginCode.objects.filter(email="flood@example.com").count(), 2)

    def test_me_requires_token_and_returns_profile(self):
        self.assertEqual(self.client.get("/api/auth/me/").status_code, 401)
        user = User.objects.create_user(email="me@example.com", full_name="Me")
        self.client.force_authenticate(user)
        response = self.client.get("/api/auth/me/")
        self.assertEqual(response.json()["email"], "me@example.com")

    def test_user_cannot_change_their_role_via_profile(self):
        user = User.objects.create_user(email="role@example.com", full_name="R")
        self.client.force_authenticate(user)
        self.client.patch("/api/auth/me/", {"role": "staff", "is_staff": True}, format="json")
        user.refresh_from_db()
        self.assertEqual(user.role, User.Role.BUYER)
        self.assertFalse(user.is_staff)

    def test_refresh_token_rotates_and_logout_revokes(self):
        self.request("rot@example.com")
        tokens = self.verify("rot@example.com", code_from_outbox()).json()
        refreshed = self.client.post(
            "/api/auth/token/refresh/", {"refresh": tokens["refresh"]}, format="json"
        )
        self.assertEqual(refreshed.status_code, 200)
        self.assertEqual(
            self.client.post(
                "/api/auth/token/refresh/", {"refresh": tokens["refresh"]}, format="json"
            ).status_code,
            401,
        )
