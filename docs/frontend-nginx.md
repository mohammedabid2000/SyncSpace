# Local stack and gateway checks

Run from the repository root with Docker Engine, Compose v2, Make, Bash, OpenSSL and curl installed.

```sh
make config
make up
make ps
make test db-test
```

`make up` starts `frontend`, `nginx`, `postgres` and `backend`. It uses
`.env` if present, otherwise `.env.example`. Override with `make up ENV_FILE=path`.
The `--env-file` option provides Compose interpolation; a service's `env_file`
is a separate mechanism that injects variables into that container.

Open https://localhost:8443 (accept the local certificate warning). The direct frontend
is available at http://localhost:3000. HTTP http://localhost:8080/ should redirect to
HTTPS. Test the redirect separately with `curl -I http://localhost:8080/` (expect 301).
The `--insecure` options in `make test` are only for this local certificate.

`make test` checks both Nginx configurations, frontend delivery, gateway liveness
and the exact NestJS response at `/api/test`. If the backend is still starting,
check `make logs SERVICES=backend` before retrying. `make db-test` runs an
authenticated SQL query over TCP to PostgreSQL.

Refresh `/signin` to check the React Router fallback. Login, chat and room
creation remain UI previews until React calls the corresponding backend endpoints.

```sh
make logs
# Exit log following with Ctrl-C; containers continue running.
make down
```

The proxy keeps the OWASP image's main Nginx configuration and ModSecurity/CRS
integration. Its Dockerfile copies our tracked `infra/nginx/conf.d/default.conf.template`
over the image's site template; startup renders it into the active site configuration.
Compose sets the default upstream to `frontend:3000`, maps host ports 8080/8443,
and mounts the local certificate and key. Logs go to container output.
`/healthz` checks the proxy itself, and `/` checks delivery from the frontend.

The HTTPS gateway forwards the exact path `/api/test` to `backend:3000/test`.
For direct local testing, use `curl -fsS http://127.0.0.1:3002/test`.
Both paths return `The Back end Already healthy`. The message comes from a
hardcoded NestJS handler. PostgreSQL connectivity is checked separately by
`make db-test`.

Additional API, messaging and orchestrator routes depend on the service owners
agreeing on paths and implementing the endpoints. Root .env VITE_* values are not automatically
injected into the static frontend: Vite requires them during image build if used.
Never pass JWT/database/OAuth secrets as VITE_* variables.

Other infrastructure definitions remain in Compose, but starting them is separate
work: Logstash configuration, Kibana credential initialization, dashboards and
exporters still need completion. A clean Compose config check does not prove those
services are operational. Do not start the full stack expecting it to be complete.
The example credentials and Vault dev mode are for local development only.

Rootless Docker cannot bind privileged host ports 80/443 by default. The local
ports above avoid changing host security settings. Override HTTP_PORT/HTTPS_PORT
in the environment file if necessary; use matching HTTP_URL/HTTPS_URL overrides
for `make test`. Published ports bind to loopback for this local test.

For PostgreSQL connection settings and database tests, see [postgresql.md](postgresql.md).

Local startup requires OpenSSL. `make up` runs `make certs`, which creates missing
TLS files in `infra/nginx/certs/`. Certificates and private keys are ignored by Git.
Use `make certs FORCE=1` to rotate the development pair, then recreate Nginx with
`docker compose --env-file .env.example up -d --force-recreate nginx`.
See [ci-cd.md](ci-cd.md) for CI checks and the current deployment-template status.
