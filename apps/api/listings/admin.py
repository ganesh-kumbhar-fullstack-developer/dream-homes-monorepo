from django.contrib import admin
from django.contrib.gis.admin import GISModelAdmin
from django.utils import timezone

from listings.models import Property, PropertyImage


class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 0


@admin.register(Property)
class PropertyAdmin(GISModelAdmin):
    inlines = [PropertyImageInline]
    list_display = [
        "title",
        "city",
        "listing_type",
        "property_type",
        "price",
        "status",
        "verified_at",
    ]
    list_filter = ["status", "listing_type", "property_type", "city"]
    search_fields = ["title", "locality", "city", "rera_number"]
    readonly_fields = ["id", "created_at", "updated_at", "published_at"]
    actions = ["mark_published", "mark_verified"]

    @admin.action(description="Publish selected listings")
    def mark_published(self, request, queryset):
        queryset.update(status=Property.Status.PUBLISHED, published_at=timezone.now())

    @admin.action(description="Mark selected listings as verified")
    def mark_verified(self, request, queryset):
        queryset.update(verified_at=timezone.now())
