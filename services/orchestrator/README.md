# SyncSpace Neko orchestrator

This is the local NestJS prototype for SyncSpace's Neko orchestrator. Creating a session starts a Neko Firefox container; deleting it stops the container. Session records are kept in memory and disappear when the process restarts.

## Run locally

Use Node.js 22.22.3 or newer and a running Docker daemon. Dockerode reads `DOCKER_HOST`; on a rootless Docker setup, set it to your user socket before starting the app.

```sh
cd services/orchestrator
npx --yes npm@12.2.1 ci
DOCKER_HOST=unix:///run/user/$(id -u)/docker.sock npm run start:dev
```

If your Docker daemon uses `/var/run/docker.sock`, start the app with `npm run start:dev` instead. The API listens on port 3000 by default; set `PORT` to change it.

Pull the Neko Firefox image before starting a session:

```sh
docker pull ghcr.io/m1k1o/neko/firefox:latest
```

This local prototype binds Neko to `http://localhost:8080` and UDP port `55000`, so only one session can run at a time. Use the configured local Neko password to open the browser. Stop a session before creating another. Multi-session port allocation and integration with SyncSpace room authentication are still to come.

## Current routes

| Request | Result |
| --- | --- |
| `POST /sessions` | Start a Neko browser and return its session and container IDs |
| `GET /sessions` | List sessions |
| `GET /sessions/:id` | Read one session, or return 404 |
| `DELETE /sessions/:id` | Stop its Neko container and delete the session (204), or return 404 |
| `GET /docker/health` | Ping the local Docker daemon |
| `POST /neko/local` | Start a local Neko container and return its Docker ID |
| `DELETE /neko/local/:id` | Stop a local Neko container by Docker ID |

Run `npm run build`, `npm test`, and `npm run test:e2e` to verify the prototype. Docker health requires access to a Docker socket; the session tests use a mock and do not create containers.

The SyncSpace Compose and Nginx configuration still need to agree on the orchestrator port and `/neko/` URL prefix before this service is enabled in the full stack.
