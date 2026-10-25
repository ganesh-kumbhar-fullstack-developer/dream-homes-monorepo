import re

from django.core.exceptions import ValidationError as DjangoValidationError
from django.utils import timezone
from rest_framework import serializers

from leads.models import Lead
from listings.models import Property

PHONE_PATTERN = re.compile(r"^\+?[0-9]{10,15}$")


class LeadCreateSerializer(serializers.ModelSerializer):
    # Accepts the new UUID or the legacy MongoDB id, because the current UI still
    # reads listings from the old backend, where legacy ids are what it knows.
    property = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    consent_contact = serializers.BooleanField()
    website = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = Lead
        fields = [
            "id",
            "property",
            "name",
            "email",
            "phone",
            "message",
            "consent_contact",
            "source",
            "website",
        ]
        read_only_fields = ["id"]
        extra_kwargs = {"source": {"required": False}}

    def validate_property(self, value):
        if not value:
            return None
        published = Property.objects.filter(status=Property.Status.PUBLISHED)
        try:
            return published.get(pk=value)
        except (Property.DoesNotExist, ValueError, DjangoValidationError):
            pass
        try:
            return published.get(legacy_id=value)
        except Property.DoesNotExist:
            raise serializers.ValidationError("This home is not available for enquiries") from None

    def validate_phone(self, value):
        cleaned = re.sub(r"[\s\-()]", "", value)
        if not PHONE_PATTERN.match(cleaned):
            raise serializers.ValidationError("Enter a valid phone number with 10 to 15 digits")
        return cleaned

    def validate_consent_contact(self, value):
        if value is not True:
            raise serializers.ValidationError("You must agree to be contacted about this enquiry")
        return value

    def validate(self, attrs):
        # Honeypot: the web form hides this field from people. Any value means a bot.
        if attrs.pop("website", ""):
            raise serializers.ValidationError("Submission rejected")
        return attrs

    def create(self, validated_data):
        validated_data["consent_recorded_at"] = timezone.now()
        return super().create(validated_data)
