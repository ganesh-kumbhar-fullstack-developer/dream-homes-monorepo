from django.contrib.gis.geos import Point
from rest_framework import serializers

from listings.models import Property, PropertyImage
from listings.serializers import PropertyImageSerializer

WRITABLE_FIELDS = [
    "title",
    "description",
    "listing_type",
    "property_type",
    "price",
    "currency",
    "bedrooms",
    "bathrooms",
    "area_sqft",
    "address_line",
    "locality",
    "city",
    "state",
    "postal_code",
    "country",
    "rera_number",
    "details",
]


class ManagedPropertySerializer(serializers.ModelSerializer):
    """Owner and staff view of a listing. Staff actions set status, verification and featured."""

    latitude = serializers.FloatField(required=False, allow_null=True, min_value=-90, max_value=90)
    longitude = serializers.FloatField(
        required=False, allow_null=True, min_value=-180, max_value=180
    )
    images = PropertyImageSerializer(many=True, read_only=True)

    class Meta:
        model = Property
        fields = [
            "id",
            *WRITABLE_FIELDS,
            "latitude",
            "longitude",
            "status",
            "featured",
            "verified_at",
            "published_at",
            "created_at",
            "updated_at",
            "images",
        ]
        read_only_fields = [
            "id",
            "status",
            "featured",
            "verified_at",
            "published_at",
            "created_at",
            "updated_at",
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["latitude"] = instance.location.y if instance.location else None
        data["longitude"] = instance.location.x if instance.location else None
        return data

    def _with_location(self, validated):
        if "latitude" in validated or "longitude" in validated:
            lat = validated.pop("latitude", None)
            lng = validated.pop("longitude", None)
            validated["location"] = (
                Point(lng, lat, srid=4326) if lat is not None and lng is not None else None
            )
        return validated

    def create(self, validated_data):
        return super().create(self._with_location(validated_data))

    def update(self, instance, validated_data):
        return super().update(instance, self._with_location(validated_data))


MAX_IMAGE_BYTES = 10 * 1024 * 1024
MAX_IMAGES_PER_LISTING = 20
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}


class PropertyImageUploadSerializer(serializers.Serializer):
    image = serializers.ImageField()

    def validate_image(self, file):
        if file.size > MAX_IMAGE_BYTES:
            raise serializers.ValidationError("Photos must be 10 MB or smaller")
        if file.content_type not in ALLOWED_IMAGE_TYPES:
            raise serializers.ValidationError("Upload a JPEG, PNG or WebP photo")
        return file

    def create(self, validated_data):
        prop = self.context["property"]
        position = prop.images.count()
        return PropertyImage.objects.create(
            property=prop, image=validated_data["image"], position=position
        )
