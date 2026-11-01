# PostgreSQL configuration

The local database is PostgreSQL 17 (`postgres:17-alpine`). Its Compose service
hostname is `postgres`, its internal port is `5432`, and its named volume is
`postgres_data`, mounted at `/var/lib/postgresql/data`.

## Environment

Compose uses `.env` if present, otherwise `.env.example`, through the Makefile.
Set POSTGRES_USER, POSTGRES_PASSWORD and POSTGRES_DB. DATABASE_URL is derived from
these variables in `.env.example`. If you already maintain a local `.env`, replace
its old MONGO_* settings with the PostgreSQL block from `.env.example`.
URL-encode reserved characters in the username/password when constructing a
DATABASE_URL; the raw POSTGRES_PASSWORD value must remain the actual password.

Use `postgres:5432` from backend containers on the `database` network. PostgreSQL
has no published host port. The frontend needs neither database credentials nor
direct database access. The backend Compose example now uses DATABASE_URL and
waits for PostgreSQL readiness, but remains commented out because backend code
has not been supplied. The backend developer still needs to choose/configure the
PostgreSQL driver or ORM and write schema migrations.

## Start and test

```sh
make config
make db-up
make db-test
```

`make db-up` starts PostgreSQL and waits until it is ready. `make db-test` uses a
password-authenticated TCP connection and prints the database name, user and
connection_ok = 1. `make up` starts the frontend, Nginx and database together.
The existing `make test` target checks frontend/Nginx delivery separately.

Initialization variables apply when the data directory is first created. Changing
a password in the environment file does not change a password in an existing
PostgreSQL database. Change that role's password using SQL when required.
`make down` preserves named volumes. This change does not migrate MongoDB data
or delete any old MongoDB volumes; a data migration would be a separate task.

## Monitoring

Prometheus scrapes `postgres-exporter:9187` under job `postgresql`; PostgreSQLDown
uses the `pg_up` metric. Start the database/exporter pair with:

```sh
make up SERVICES="postgres postgres-exporter"
```

The exporter uses the local development database credentials. Use a dedicated,
restricted monitoring account for deployment. Other monitoring/logging components
retain their existing unfinished configuration; this is not a complete monitoring
setup. WAF vendor rules mentioning MongoDB are generic attack signatures, not
application configuration, and remain intact.

References:
- https://hub.docker.com/_/postgres
- https://github.com/prometheus-community/postgres_exporter
