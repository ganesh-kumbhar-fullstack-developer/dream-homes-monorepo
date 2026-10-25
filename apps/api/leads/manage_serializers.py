from rest_framework import serializers

from accounts.models import User
from leads.models import Lead


class ManagedLeadSerializer(serializers.ModelSerializer):
    property_title = serializers.CharField(source="property.title", read_only=True, default=None)
    assigned_to = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(is_staff=True) | User.objects.filter(role=User.Role.STAFF),
        allow_null=True,
        required=False,
    )

    class Meta:
        model = Lead
        fields = [
            "id",
            "property",
            "property_title",
            "name",
            "email",
            "phone",
            "message",
            "source",
            "status",
            "assigned_to",
            "consent_contact",
            "consent_recorded_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "property",
            "property_title",
            "name",
            "email",
            "phone",
            "message",
            "source",
            "consent_contact",
            "consent_recorded_at",
            "created_at",
            "updated_at",
        ]
