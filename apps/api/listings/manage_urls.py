from rest_framework.routers import SimpleRouter

from listings.manage_views import ManagedPropertyViewSet

router = SimpleRouter()
router.register("", ManagedPropertyViewSet, basename="managed-listing")
urlpatterns = router.urls
