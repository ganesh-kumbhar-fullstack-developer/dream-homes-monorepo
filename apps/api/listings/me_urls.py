from django.urls import path

from listings.me_views import FavouriteDetailView, FavouriteListView

urlpatterns = [
    path("favourites/", FavouriteListView.as_view(), name="favourites"),
    path("favourites/<uuid:pk>/", FavouriteDetailView.as_view(), name="favourite-detail"),
]
