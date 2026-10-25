import uuid

from django.conf import settings
from django.db import models


class Lead(models.Model):
    class Source(models.TextChoices):
        WEBSITE_FORM = "website_form", "Website form"
        PROPERTY_ENQUIRY = "property_enquiry", "Property enquiry"
        WHATSAPP = "whatsapp", "WhatsApp"
        PHONE = "phone", "Phone"
        OTHER = "other", "Other"

    class Status(models.TextChoices):
        NEW = "new", "New"
        CONTACTED = "contacted", "Contacted"
        VISIT_SCHEDULED = "visit_scheduled", "Visit scheduled"
        CLOSED_WON = "closed_won", "Closed won"
        CLOSED_LOST = "closed_lost", "Closed lost"
        SPAM = "spam", "Spam"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    property = models.ForeignKey(
        "listings.Property",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="leads",
    )
    name = models.CharField(max_length=150)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20)
    message = models.TextField(max_length=2000, blank=True)
    source = models.CharField(max_length=30, choices=Source.choices, default=Source.WEBSITE_FORM)
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.NEW)
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_leads",
    )
    # Recorded at submission time so the consent basis for contact is auditable.
    consent_contact = models.BooleanField(default=False)
    consent_recorded_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["status", "created_at"])]

    def __str__(self):
        return f"{self.name} ({self.phone})"
