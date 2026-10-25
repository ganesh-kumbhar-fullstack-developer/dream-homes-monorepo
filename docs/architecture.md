# Architecture

## Overview

```
Browser ──> Next.js web (SSR for SEO) ──> Django API ──> PostgreSQL + PostGIS
                                              │
                                              ├──> Object storage (S3 / Cloudflare R2) ──> CDN
                                              ├──> Redis + Celery   (background jobs, added in Phase 2)
                                              └──> Email / SMS / WhatsApp providers
```

- **web** renders listing and detail pages on the server so search engines can index them.
- **api** owns all business rules, permissions, validation and data access.
- **PostgreSQL + PostGIS** stores relational data and location data (points, radius queries).
- **Object storage + CDN** serves property photos. The database stores keys and dimensions only.

## Domains

| App | Responsibility | Status |
|---|---|---|
| `accounts` | Users, roles, authentication | Custom user model with UUID IDs and email login |
| `listings` | Properties, images, public search | Published-only read API, radius search, admin tools |
| `leads` | Buyer and renter enquiries | Consent-gated public submission with rate limiting |
| `core` | Health check, shared utilities | Health endpoint |

## Public API (v1)

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/health/` | none | Liveness and database check |
| GET | `/api/listings/` | none | Published listings. Filters: `listing_type`, `property_type`, `city`, `min_price`, `max_price`, `near=lat,lng` with `radius_km` |
| GET | `/api/listings/{id}/` | none | Published listing detail |
| POST | `/api/leads/` | none | Enquiry. Requires `consent_contact: true`. Rate limited |
| GET | `/api/schema/`, `/api/docs/` | none | OpenAPI schema and Swagger UI |

Authentication for buyers, owners and agents comes next (phone OTP or email link, JWT in httpOnly cookies). Until then, the default permission on the API is `IsAuthenticated`, so new endpoints are closed unless they opt in.

## Principles

1. Public reads never expose drafts, owner contact details or internal fields.
2. Every write endpoint has an explicit permission class. Nothing is open by accident.
3. Consent and its timestamp are stored with every lead.
4. Settings come from the environment. Development and production differ only in `config/settings/`.
5. Models hold no storage paths. Switching from local files to S3 is a settings change.
