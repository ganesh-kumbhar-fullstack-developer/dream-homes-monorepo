from rest_framework import mixins, viewsets
from rest_framework.permissions import IsAuthenticated

from accounts.permissions import IsStaffMember
from leads.manage_serializers import ManagedLeadSerializer
from leads.models import Lead


class StaffLeadViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    """Staff see every enquiry, change its status or assignee. Contact details are read only."""

    serializer_class = ManagedLeadSerializer
    permission_classes = [IsAuthenticated, IsStaffMember]
    http_method_names = ["get", "patch", "head", "options"]

    def get_queryset(self):
        qs = Lead.objects.select_related("property", "assigned_to")
        status_filter = self.request.query_params.get("status")
        if status_filter in Lead.Status.values:
            qs = qs.filter(status=status_filter)
        return qs
