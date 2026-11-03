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

## Update the configured database password

Requires Bash, jq, Docker and Compose v2. Edit POSTGRES_PASSWORD in the selected
`.env` file (or `.env.example` when no `.env` exists), then run:

```sh
make update-db
make db-test
# To explicitly select a different file:
make update-db ENV_FILE=.env.example
```

This command synchronizes the PostgreSQL role password with the resolved Compose
configuration, recreates the database container when its configuration changes,
checks password-authenticated TCP access, and refreshes the exporter if it was
already running. It preserves the existing named volume, tables and records.
There is a brief database interruption if the container needs to be recreated.
Other application clients must also reload their connection credentials when
integrated; the current backend service is still commented out.

The command refuses POSTGRES_USER or POSTGRES_DB changes on an existing container.
It uses local Unix-socket administration supported by the official development
image. If local authentication has been hardened to require an unavailable old
password, it fails; it does not weaken authentication or erase the volume.
Passwords are supplied to psql through stdin with its password command rather
than interpolated into SQL or printed in shell commands.

This is a credential update, not a schema migration, database rename or import of
new application data. Those require migrations or a separate explicit import.
Deleting/replacing the data volume would reset the database rather than update it.
