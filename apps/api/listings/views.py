from decimal import Decimal, InvalidOperation

from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D
from rest_framework import generics, permissions
from rest_framework.exceptions import ValidationError

from listings.models import Property
from listings.serializers import PropertySerializer


class PublishedPropertyQuerysetMixin:
    """Only published listings are ever visible through the public API."""

    serializer_class = PropertySerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def get_queryset(self):
        return Property.objects.filter(status=Property.Status.PUBLISHED).prefetch_related("images")


class PropertyListView(PublishedPropertyQuerysetMixin, generics.ListAPIView):
    def get_queryset(self):
        qs = super().get_queryset()
        params = self.request.query_params

        listing_type = params.get("listing_type")
        if listing_type in Property.ListingType.values:
            qs = qs.filter(listing_type=listing_type)

        property_type = params.get("property_type")
        if property_type in Property.PropertyType.values:
            qs = qs.filter(property_type=property_type)

        city = params.get("city")
        if city:
            qs = qs.filter(city__iexact=city.strip())

        for param, lookup in (("min_price", "price__gte"), ("max_price", "price__lte")):
            raw = params.get(param)
            if raw:
                try:
                    value = Decimal(raw)
                except InvalidOperation:
                    raise ValidationError({param: "Must be a number"}) from None
                qs = qs.filter(**{lookup: value})

        # Radius search: ?near=lat,lng&radius_km=5
        near = params.get("near")
        if near:
            try:
                lat, lng = (float(part) for part in near.split(","))
                radius_km = float(params.get("radius_km", 5))
            except ValueError:
                raise ValidationError(
                    {"near": "Use near=lat,lng and a numeric radius_km"}
                ) from None
            if not (-90 <= lat <= 90 and -180 <= lng <= 180) or not (0 < radius_km <= 100):
                raise ValidationError({"near": "Coordinates or radius are out of range"})
            qs = qs.filter(location__distance_lte=(Point(lng, lat, srid=4326), D(km=radius_km)))

        return qs


class PropertyDetailView(PublishedPropertyQuerysetMixin, generics.RetrieveAPIView):
    pass
