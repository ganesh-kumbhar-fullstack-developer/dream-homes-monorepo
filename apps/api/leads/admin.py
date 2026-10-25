from django.contrib import admin

from leads.models import Lead


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ["name", "phone", "property", "source", "status", "assigned_to", "created_at"]
    list_filter = ["status", "source"]
    search_fields = ["name", "phone", "email"]
    readonly_fields = ["id", "consent_recorded_at", "created_at", "updated_at"]
