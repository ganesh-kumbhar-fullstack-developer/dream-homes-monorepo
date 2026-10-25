# Dream Homes

Real estate platform for verified homes and rentals. Starts in Pune, India, and is built to expand to other cities and countries.

## Repository layout

```
apps/
  web/     Next.js (App Router) frontend, TypeScript, Tailwind CSS
  api/     Django 5.2 LTS API with Django REST Framework and PostGIS
docs/
  architecture.md   System overview and data flows
  adr/              Architecture decision records
infra/      Deployment configuration (added when hosting is chosen)
compose.yaml        Local development stack (PostGIS, API, web)
Makefile            Common commands
```

## Prerequisites

- Docker and Docker Compose v2
- Node.js 22 (only if you run the web app outside Docker)
- Python 3.12 (only if you run the API outside Docker)

## Getting started

```bash
cp apps/api/.env.example apps/api/.env   # optional; compose sets dev values already
make dev                                  # starts db, api and web
make migrate                              # applies migrations
make superuser                            # creates an admin login at /admin/
```

Then open:

- Web: http://localhost:3000
- API health: http://localhost:8001/api/health/
- API docs (Swagger): http://localhost:8001/api/docs/
- Django admin: http://localhost:8001/admin/

Host ports are chosen to avoid common clashes: the API is on 8001 (8000 is often used by other tools) and PostgreSQL is on 5433 (5432 is often a local install).

## Common commands

Run `make help` to see every target. The important ones:

| Command | What it does |
|---|---|
| `make dev` | Start the full local stack in the background |
| `make down` | Stop the local stack |
| `make migrate` | Apply database migrations |
| `make makemigrations` | Create migrations after model changes |
| `make test` | Run API tests, web typecheck, lint and build |
| `make e2e` | Browser test of sign-in, saving and sign-out. Needs Playwright (`pip install playwright && playwright install chromium`) |
| `make lint` | Run ruff on the API |
| `make fmt` | Format the API with ruff |

## Engineering rules

- Every model that is user-visible gets a UUID primary key, so IDs cannot be guessed.
- Images live in object storage behind a CDN. Only file keys and metadata go in PostgreSQL.
- Public API endpoints return published listings only. Drafts, owner details and internal fields are never serialised publicly.
- Every enquiry records explicit consent with a timestamp.
- Secrets live in environment variables. `.env` files are never committed.
- Sign-in is by a one-time email code. Browsers never see tokens. See [ADR 0003](docs/adr/0003-auth-and-gateway.md).

See [docs/architecture.md](docs/architecture.md) and [docs/adr/](docs/adr/) for the reasoning behind these choices.
# dream-homes-monorepo
