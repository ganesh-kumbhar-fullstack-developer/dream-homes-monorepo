from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from listings.manage_serializers import (
    MAX_IMAGES_PER_LISTING,
    ManagedPropertySerializer,
    PropertyImageUploadSerializer,
)
from listings.models import Property, PropertyImage


class ManagedPropertyViewSet(viewsets.ModelViewSet):
    """Owners manage their own listings. Staff manage all listings and approve them."""

    serializer_class = ManagedPropertySerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser]
    http_method_names = ["get", "post", "patch", "delete", "head", "options"]

    def get_queryset(self):
        qs = Property.objects.select_related("owner").prefetch_related("images")
        if self.request.user.is_staff_member:
            return qs
        return qs.filter(owner=self.request.user)

    def _require_staff(self):
        if not self.request.user.is_staff_member:
            raise PermissionDenied("Only the Dream Homes team can do this")

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user, status=Property.Status.DRAFT)

    def perform_update(self, serializer):
        instance = serializer.instance
        if not self.request.user.is_staff_member and instance.status == Property.Status.PUBLISHED:
            # An owner edit takes the listing off the public site until staff re-approve it.
            serializer.save(
                status=Property.Status.PENDING_REVIEW, verified_at=None, verified_by=None
            )
        else:
            serializer.save()

    def destroy(self, request, *args, **kwargs):
        # Archive instead of deleting, so enquiry history keeps pointing at a real record.
        instance = self.get_object()
        instance.status = Property.Status.ARCHIVED
        instance.save(update_fields=["status", "updated_at"])
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=["post"])
    def submit(self, request, pk=None):
        listing = self.get_object()
        if listing.status not in (Property.Status.DRAFT, Property.Status.REJECTED):
            raise ValidationError({"status": "Only drafts and rejected listings can be submitted"})
        if not listing.images.exists():
            raise ValidationError({"images": "Add at least one photo before submitting"})
        listing.status = Property.Status.PENDING_REVIEW
        listing.save(update_fields=["status", "updated_at"])
        return Response(self.get_serializer(listing).data)

    @action(detail=True, methods=["post"])
    def verify(self, request, pk=None):
        self._require_staff()
        listing = self.get_object()
        listing.verified_at = timezone.now()
        listing.verified_by = request.user
        listing.save(update_fields=["verified_at", "verified_by", "updated_at"])
        return Response(self.get_serializer(listing).data)

    @action(detail=True, methods=["post"])
    def publish(self, request, pk=None):
        self._require_staff()
        listing = self.get_object()
        if listing.verified_at is None:
            raise ValidationError({"verified": "Verify the listing before publishing it"})
        listing.status = Property.Status.PUBLISHED
        listing.published_at = listing.published_at or timezone.now()
        listing.save(update_fields=["status", "published_at", "updated_at"])
        return Response(self.get_serializer(listing).data)

    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):
        self._require_staff()
        listing = self.get_object()
        listing.status = Property.Status.REJECTED
        listing.save(update_fields=["status", "updated_at"])
        return Response(self.get_serializer(listing).data)

    @action(
        detail=True,
        methods=["post"],
        url_path="images",
        parser_classes=[MultiPartParser, FormParser],
    )
    def upload_image(self, request, pk=None):
        listing = self.get_object()
        if listing.images.count() >= MAX_IMAGES_PER_LISTING:
            raise ValidationError(
                {"images": f"A listing can have up to {MAX_IMAGES_PER_LISTING} photos"}
            )
        serializer = PropertyImageUploadSerializer(data=request.data, context={"property": listing})
        serializer.is_valid(raise_exception=True)
        image = serializer.save()
        return Response(
            {"id": image.id, "position": image.position}, status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=["delete"], url_path=r"images/(?P<image_id>[0-9]+)")
    def delete_image(self, request, pk=None, image_id=None):
        listing = self.get_object()
        image = PropertyImage.objects.filter(property=listing, pk=image_id).first()
        if image is None:
            raise ValidationError({"image": "Photo not found on this listing"})
        image.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
