from django.urls import path

from listings.views import PropertyDetailView, PropertyListView

urlpatterns = [
    path("", PropertyListView.as_view(), name="property-list"),
    path("<uuid:pk>/", PropertyDetailView.as_view(), name="property-detail"),
]
