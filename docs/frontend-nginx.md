# Frontend and Nginx local test

Run from the repository root with Docker Engine and Docker Compose v2 installed:

```sh
make config
make up
make ps
make test
```

`make up` starts `frontend`, `nginx` and `postgres`, including their health checks. It uses
`.env` if present, otherwise `.env.example`. Override with `make up ENV_FILE=path`.
The `--env-file` option provides Compose interpolation; a service's `env_file`
is a separate mechanism that injects variables into that container.

Open https://localhost:8443 (accept the local certificate warning). The direct frontend
is available at http://localhost:3000. HTTP http://localhost:8080/ should redirect to
HTTPS. Test the redirect separately with `curl -I http://localhost:8080/` (expect 301).
The `--insecure` options in `make test` are only for this local certificate.

Verify the page renders, refresh /signin to check React Router fallback, and inspect
browser console/network errors. The frontend presently has no implemented backend
integration, so these checks establish UI delivery, not working login/chat/rooms.

```sh
make logs
# Exit log following with Ctrl-C; containers continue running.
make down
```

The proxy keeps the OWASP image's main Nginx configuration and ModSecurity/CRS
integration. Its Dockerfile copies our tracked `infra/nginx/conf.d/default.conf.template`
over the image's site template; startup renders it into the active site configuration.
Compose sets its backend to frontend:3000, maps host ports 8080/8443, and mounts
the local certificate/key. Older `infra/nginx/nginx.conf`, `conf.d/default.conf`
and local ModSecurity files remain unused by this image. Logs go to container output.
`/healthz` checks the proxy itself; `/` checks delivery from the frontend.

This configuration does not provide backend API, messaging or orchestrator routes.
Add those when the services are ready. Root .env VITE_* values are not automatically
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
