# ADR 0001: Technology stack

- **Status:** Accepted
- **Date:** 2026-10-25

## Context

Dream Homes is being rebuilt from a prototype (Vite React frontend, Express and MongoDB backend) into a production platform. It needs SEO-indexed listing pages, location search, verified listings, lead management, and an internal operations console. It starts in Pune and is planned to expand.

## Decision

| Concern | Choice |
|---|---|
| Web | Next.js (App Router), TypeScript, Tailwind CSS v4 |
| API | Django 5.2 LTS with Django REST Framework |
| Database | PostgreSQL 16 with PostGIS |
| Images | S3-compatible object storage (Cloudflare R2 in production) behind a CDN. Local `media/` in development |
| Background jobs | Redis and Celery, added in Phase 2 |
| Local development | Docker Compose |

## Alternatives considered

- **MongoDB for images or data.** Rejected. It adds a second primary database to operate, does not serve files better than object storage, and has a 16 MB document limit. The prototype stored binary data there.
- **Django 6.1.** Newest release, but LTS support is what matters for a production base. Revisit on the next LTS.
- **Next.js full-stack with an ORM, no Django.** Simpler for one team, but Django's admin, ORM maturity and Python data tooling fit the planned operations and pricing work better.
- **Client-only React (the prototype).** Rejected. Listing pages must be server-rendered to be indexed.

## Consequences

- Two languages (TypeScript and Python). The API contract is defined by an OpenAPI schema generated from DRF, so the web app's types can be generated from it.
- GeoDjango needs GDAL and GEOS. Development runs the API inside Docker to avoid installing them locally.
- Django's session auth is the default for now. JWT in httpOnly cookies is the planned production auth.
