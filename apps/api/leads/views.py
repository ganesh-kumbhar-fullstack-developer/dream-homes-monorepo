from django.db import transaction
from rest_framework import generics, permissions
from rest_framework.throttling import ScopedRateThrottle

from leads.notifications import confirm_to_enquirer, notify_team
from leads.serializers import LeadCreateSerializer


class LeadCreateView(generics.CreateAPIView):
    """Public enquiry form. Anonymous, consent-gated and rate-limited."""

    serializer_class = LeadCreateSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "lead_submit"

    def perform_create(self, serializer):
        lead = serializer.save()
        # Send only after the enquiry is committed, so a rolled-back request never emails anyone.
        transaction.on_commit(lambda: (notify_team(lead), confirm_to_enquirer(lead)))
