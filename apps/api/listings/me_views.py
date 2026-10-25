from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from listings.models import Favourite, Property
from listings.serializers import PropertySerializer


class FavouriteListView(generics.ListAPIView):
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Property.objects.filter(
                favourited_by__user=self.request.user, status=Property.Status.PUBLISHED
            )
            .prefetch_related("images")
            .order_by("-favourited_by__created_at")
        )


class FavouriteDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        listing = get_object_or_404(Property, pk=pk, status=Property.Status.PUBLISHED)
        Favourite.objects.get_or_create(user=request.user, property=listing)
        return Response({"saved": True})

    def delete(self, request, pk):
        Favourite.objects.filter(user=request.user, property_id=pk).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
