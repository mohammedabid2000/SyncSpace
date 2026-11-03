# Prefer local configuration; fall back to the local development example.
ENV_FILE ?= $(if $(wildcard .env),.env,.env.example)
COMPOSE = docker compose --env-file $(ENV_FILE)
SERVICES ?= frontend nginx postgres
HTTP_URL ?= http://localhost:8080
HTTPS_URL ?= https://localhost:8443

.DEFAULT_GOAL := up
.PHONY: up down logs re config ps test db-up db-test update-db

up:
	$(COMPOSE) up -d --build $(SERVICES)

down:
	$(COMPOSE) down

logs:
	$(COMPOSE) logs -f $(SERVICES)

re:
	$(COMPOSE) up -d --build --force-recreate $(SERVICES)

config:
	$(COMPOSE) config --quiet

ps:
	$(COMPOSE) ps

test:
	$(COMPOSE) exec -T frontend nginx -t
	$(COMPOSE) exec -T nginx nginx -t
	curl --fail --silent --show-error --output /dev/null http://localhost:3000/
	curl --fail --silent --show-error --insecure --output /dev/null $(HTTPS_URL)/
	curl --fail --silent --show-error --insecure --output /dev/null $(HTTPS_URL)/signin
	curl --fail --silent --show-error --insecure $(HTTPS_URL)/healthz

db-up:
	$(COMPOSE) up -d --wait postgres

db-test:
	$(COMPOSE) exec -T postgres sh -ec 'PGPASSWORD="$$POSTGRES_PASSWORD" psql -h postgres -U "$$POSTGRES_USER" -d "$$POSTGRES_DB" -v ON_ERROR_STOP=1 -c "SELECT current_database(), current_user, 1 AS connection_ok;"'

# Apply the configured password without deleting PostgreSQL data.
update-db:
	bash scripts/update-db.sh "$(ENV_FILE)"
