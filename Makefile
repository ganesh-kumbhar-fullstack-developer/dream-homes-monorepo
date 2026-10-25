# Common tasks for the monorepo. Run `make help` for the list.
.DEFAULT_GOAL := help
COMPOSE := docker compose
API_RUN := $(COMPOSE) run --rm api

.PHONY: help dev down logs migrate makemigrations superuser test api-test web-check e2e lint fmt

help: ## Show available commands
	@grep -E '^[a-zA-Z_-]+:.*## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*## "}; {printf "  %-16s %s\n", $$1, $$2}'

dev: ## Start database, API and web in the background
	$(COMPOSE) up --build -d
	@echo "web: http://localhost:3000   api: http://localhost:8001/api/health/   docs: http://localhost:8001/api/docs/"

down: ## Stop the local stack
	$(COMPOSE) down

logs: ## Follow logs for all services
	$(COMPOSE) logs -f

migrate: ## Apply database migrations
	$(API_RUN) python manage.py migrate

makemigrations: ## Create migrations for model changes
	$(API_RUN) python manage.py makemigrations

superuser: ## Create a Django admin user
	$(COMPOSE) exec api python manage.py createsuperuser

test: api-test web-check ## Run all tests and checks

api-test: ## Run Django tests in the API container
	$(API_RUN) python manage.py test --settings=config.settings.test --verbosity=2

e2e: ## Browser test of sign-in, saving and sign-out (needs `make dev`)
	python3 tests/e2e/smoke_flows.py

web-check: ## Typecheck, lint and build the web app
	cd apps/web && npm ci && npm run typecheck && npm run lint && npm run build

lint: ## Lint the API with ruff
	$(API_RUN) ruff check .

fmt: ## Format the API with ruff
	$(API_RUN) ruff format .
