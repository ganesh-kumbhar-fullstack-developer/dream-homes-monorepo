"""Plain-text emails about new enquiries. Plain text means visitor input can't inject HTML."""

from django.conf import settings
from django.core.mail import send_mail


def notify_team(lead):
    if not settings.LEADS_NOTIFY_EMAIL:
        return
    listing = lead.property.title if lead.property else "General enquiry"
    send_mail(
        subject=f"New enquiry: {listing}",
        message=(
            f"Name: {lead.name}\n"
            f"Phone: {lead.phone}\n"
            f"Email: {lead.email or '-'}\n"
            f"Listing: {listing}\n"
            f"Consent to contact: yes, recorded {lead.consent_recorded_at:%d %b %Y %H:%M} UTC\n\n"
            f"Message:\n{lead.message or '-'}\n"
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[settings.LEADS_NOTIFY_EMAIL],
    )


def confirm_to_enquirer(lead):
    if not lead.email:
        return
    send_mail(
        subject="We received your enquiry",
        message=(
            f"Hi {lead.name},\n\n"
            "Thanks for your enquiry. A member of the Dream Homes team will contact you on the "
            "phone number you gave, because you agreed to be contacted.\n\n"
            "If you did not make this enquiry, reply to this email and we will remove your details."
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[lead.email],
    )
