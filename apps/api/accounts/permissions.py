from rest_framework.permissions import BasePermission


class IsStaffMember(BasePermission):
    """Staff verify, publish and manage leads. Owners and buyers do not pass this check."""

    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and user.is_staff_member)
