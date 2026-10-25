from rest_framework.routers import SimpleRouter

from leads.manage_views import StaffLeadViewSet

router = SimpleRouter()
router.register("", StaffLeadViewSet, basename="staff-lead")
urlpatterns = router.urls
