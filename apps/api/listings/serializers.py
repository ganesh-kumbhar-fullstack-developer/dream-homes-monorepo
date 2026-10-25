from rest_framework import serializers

from listings.models import Property, PropertyImage


class PropertyImageSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = PropertyImage
        fields = ["url", "alt_text", "position"]

    def get_url(self, obj):
        if not obj.image:
            return obj.source_url
        request = self.context.get("request")
        return request.build_absolute_uri(obj.image.url) if request else obj.image.url


class PropertySerializer(serializers.ModelSerializer):
    """Public representation. Owner, status and internal fields are not exposed."""

    images = PropertyImageSerializer(many=True, read_only=True)
    lat = serializers.SerializerMethodField()
    lng = serializers.SerializerMethodField()
    verified = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = [
            "id",
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
            "lat",
            "lng",
            "verified",
            "featured",
            "details",
            "published_at",
            "images",
        ]

    def get_lat(self, obj):
        return obj.location.y if obj.location else None

    def get_lng(self, obj):
        return obj.location.x if obj.location else None

    def get_verified(self, obj):
        return obj.verified_at is not None
