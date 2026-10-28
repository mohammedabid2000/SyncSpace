# SyncSpace Neko orchestrator

This is the local NestJS prototype for SyncSpace's Neko orchestrator. It currently has an in-memory session API and a Docker connectivity check. Session creation does **not** start a Neko container yet; the session records disappear when the process restarts.

## Run locally

Use Node.js 22.22.3 or newer and a running Docker daemon. Dockerode reads `DOCKER_HOST`; on a rootless Docker setup, set it to your user socket before starting the app.

```sh
cd services/orchestrator
npx --yes npm@12.2.1 ci
DOCKER_HOST=unix:///run/user/$(id -u)/docker.sock npm run start:dev
```

If your Docker daemon uses `/var/run/docker.sock`, start the app with `npm run start:dev` instead. The API listens on port 3000 by default; set `PORT` to change it.

## Current routes

| Request | Result |
| --- | --- |
| `POST /sessions` | Create an in-memory session |
| `GET /sessions` | List sessions |
| `GET /sessions/:id` | Read one session, or return 404 |
| `DELETE /sessions/:id` | Delete one session (204), or return 404 |
| `GET /docker/health` | Ping the local Docker daemon |

Run `npm run build`, `npm test`, and `npm run test:e2e` to verify the prototype. Docker health requires access to a Docker socket; the tests use a mock and do not create containers.

The SyncSpace Compose and Nginx configuration still need to agree on the orchestrator port and `/neko/` URL prefix before this service is enabled in the full stack.
