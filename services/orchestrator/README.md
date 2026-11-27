# SyncSpace Neko orchestrator

This is the local NestJS prototype for SyncSpace's Neko orchestrator. Creating a session starts a Neko Firefox container; deleting it stops the container. On startup, the app restores sessions from running containers with its Docker labels.

## Run locally

Use Node.js 22.22.3 or newer and a running Docker daemon. Dockerode reads `DOCKER_HOST`; on a rootless Docker setup, set it to your user socket before starting the app.

```sh
cd services/orchestrator
npm ci
ORCHESTRATOR_API_TOKEN=local-dev-token npm run start:dev
```

Dockerode uses the default Docker socket. For rootless Docker, set `DOCKER_HOST=unix:///run/user/$(id -u)/docker.sock` before starting the app. The API listens on port 3000 by default; set `PORT` to change it. The token above is only a local example. Use a long random token for any shared environment, keep it out of Git, and give it only to the main backend.

Pull the Neko Firefox image before starting a session:

```sh
docker pull ghcr.io/m1k1o/neko/firefox:latest
```

Each running session gets a unique port pair. The app currently uses HTTP ports `8180–8279` and UDP ports `55000–55099`, reusing a pair after its session stops. For local testing, open the URL using the `httpPort` returned by `POST /sessions`, for example `http://localhost:8180`. The creation response includes separate random owner and viewer passwords. The owner can watch and control Firefox without Neko admin rights; viewers can watch but cannot control. Neither role can share media or access the Neko clipboard.

The session list is reconstructed from running, labeled Docker containers when Nest restarts. Session reads and creation also remove records for containers that stopped outside the API and release their ports. This prototype expects the Docker daemon to be available at startup. Credentials appear only in the creation response; the trusted backend must save them because GET and list do not return them later.

## Local API example

All `/sessions` routes require an `x-orchestrator-token` header matching `ORCHESTRATOR_API_TOKEN`. A missing or incorrect token returns 401. With the local example token above:

```sh
curl -H 'x-orchestrator-token: local-dev-token' -X POST http://localhost:3000/sessions
curl -H 'x-orchestrator-token: local-dev-token' http://localhost:3000/sessions
```

The POST response contains `credentials.ownerPassword` and `credentials.viewerPassword` in addition to the session ID, container ID, and ports. Use those credentials only for local role testing or hand them to the trusted SyncSpace backend. Do not send either password through a public room API or put the orchestrator token in the frontend. The default Neko WebRTC address is for same-computer testing; other clients need a reachable address and a protected connection path.

## Current routes

| Request | Result |
| --- | --- |
| `POST /sessions` | Start a Neko browser and return its session details plus one-time owner and viewer credentials |
| `GET /sessions` | List sessions without credentials |
| `GET /sessions/:id` | Read one running session without credentials; return 404 if missing or 400 for an invalid ID |
| `DELETE /sessions/:id` | Stop its Neko container and delete the session (204), or return 404; already stopped containers can be deleted |
| `GET /docker/health` | Ping the local Docker daemon |

Run `npm run build`, `npm test`, and `npm run test:e2e` to verify the prototype. Docker health requires access to a Docker socket; the automated session tests use a mock and do not create containers.

## Run with Compose

From the repository root, start the service with a private token:

```sh
export ORCHESTRATOR_API_TOKEN="$(openssl rand -hex 32)"
docker compose up -d --build orchestrator
curl -H "x-orchestrator-token: $ORCHESTRATOR_API_TOKEN" -X POST http://127.0.0.1:3100/sessions
```

The orchestrator listens on `orchestrator:3100` for the backend and on `127.0.0.1:3100` for local testing. Compose mounts `/var/run/docker.sock`, so this setup uses a Docker daemon with that socket and an account allowed to access it. Use the returned `httpPort` for the Neko browser. New sessions begin at `http://localhost:8180`. Sessions created with the earlier port range can still be found and stopped after an orchestrator restart.

Neko advertises `127.0.0.1` for WebRTC by default. When the browser runs on Windows and Docker runs in WSL with NAT networking, set `NEKO_WEBRTC_NAT1TO1` to the WSL IPv4 address before running Compose:

```sh
export NEKO_WEBRTC_NAT1TO1="$(ip -4 -o addr show dev eth0 | awk '{print $4}' | cut -d/ -f1)"
```

Recreate an existing Neko session after changing that value. The WSL address can change after a restart. Other viewers need an address they can reach and a protected HTTP connection path. Neko's UDP port must also be reachable for WebRTC. Compose does not configure the frontend or main backend to create room sessions yet.
