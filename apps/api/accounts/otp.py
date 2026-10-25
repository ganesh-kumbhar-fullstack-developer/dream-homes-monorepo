"""Email one-time sign-in codes.

A code is six digits, valid for ten minutes, usable once, and locked after five
wrong attempts. Only a keyed hash is stored. Requests beyond the hourly limit are
dropped silently, so the response never reveals whether an account exists.
"""

import hashlib
import hmac
import secrets
from datetime import timedelta

from django.conf import settings
from django.core.mail import send_mail
from django.db import transaction
from django.utils import timezone

from accounts.models import EmailLoginCode, User

CODE_TTL = timedelta(minutes=10)
MAX_ATTEMPTS = 5
MAX_REQUESTS_PER_HOUR = 5


class InvalidCode(Exception):
    """Raised for any failure, so callers cannot tell which check failed."""


def _normalise(email):
    return email.strip().lower()


def _hash(email, code):
    key = settings.SECRET_KEY.encode()
    return hmac.new(key, f"{email}:{code}".encode(), hashlib.sha256).hexdigest()


def request_code(email):
    email = _normalise(email)
    since = timezone.now() - timedelta(hours=1)
    if (
        EmailLoginCode.objects.filter(email=email, created_at__gte=since).count()
        >= MAX_REQUESTS_PER_HOUR
    ):
        return

    code = f"{secrets.randbelow(1_000_000):06d}"
    EmailLoginCode.objects.create(
        email=email,
        code_hash=_hash(email, code),
        expires_at=timezone.now() + CODE_TTL,
    )
    send_mail(
        subject="Your Dream Homes sign-in code",
        message=(
            f"Your sign-in code is {code}.\n\n"
            "It expires in 10 minutes and works once. "
            "If you did not ask for this code, you can ignore this email."
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
    )


def verify_code(email, code, full_name=""):
    email = _normalise(email)
    now = timezone.now()
    # Failures are recorded inside the transaction and raised after it commits.
    # Raising inside the block would roll back the attempt counter, so the lockout would never work.
    with transaction.atomic():
        entry = (
            EmailLoginCode.objects.select_for_update()
            .filter(email=email, consumed_at__isnull=True, expires_at__gt=now)
            .order_by("-created_at")
            .first()
        )
        if entry is None or entry.attempts >= MAX_ATTEMPTS:
            matched = False
        else:
            entry.attempts += 1
            entry.save(update_fields=["attempts"])
            matched = hmac.compare_digest(entry.code_hash, _hash(email, code))
            if matched:
                entry.consumed_at = now
                entry.save(update_fields=["consumed_at"])

        if not matched:
            user = None
        else:
            user = User.objects.filter(email=email).first()
            if user is None:
                user = User.objects.create_user(
                    email=email, full_name=(full_name or email.split("@")[0])[:150]
                )

    if user is None or not user.is_active:
        raise InvalidCode
    return user
