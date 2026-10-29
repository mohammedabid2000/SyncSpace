# SyncSpace Neko orchestrator

This is the local NestJS prototype for SyncSpace's Neko orchestrator. Creating a session starts a Neko Firefox container; deleting it stops the container. On startup, the app restores sessions from running containers with its Docker labels.

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

Each running session gets a unique port pair. The app currently uses HTTP ports `8080–8179` and UDP ports `55000–55099`, reusing a pair after its session stops. Open the URL using the `httpPort` returned by `POST /sessions`, for example `http://localhost:8080`. The local Neko password is `neko`. These ports and credentials are development defaults; integration with SyncSpace room authentication is still to come.

The session list is reconstructed from running, labeled Docker containers when Nest restarts. Session reads and creation also remove records for containers that stopped outside the API and release their ports. This prototype expects the Docker daemon to be available at startup.

## Current routes

| Request | Result |
| --- | --- |
| `POST /sessions` | Start a Neko browser and return its session ID, container ID, and ports |
| `GET /sessions` | List sessions |
| `GET /sessions/:id` | Read one running session, return 404 if missing, or 400 for an invalid ID |
| `DELETE /sessions/:id` | Stop its Neko container and delete the session (204), or return 404; already stopped containers can be deleted |
| `GET /docker/health` | Ping the local Docker daemon |

Run `npm run build`, `npm test`, and `npm run test:e2e` to verify the prototype. Docker health requires access to a Docker socket; the session tests use a mock and do not create containers.

The SyncSpace Compose and Nginx configuration still need to agree on the orchestrator port and `/neko/` URL prefix before this service is enabled in the full stack.
