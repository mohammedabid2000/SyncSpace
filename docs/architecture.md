# SyncSpace Architecture Overview

This document outlines the high-level architecture, team roles, and data flow for the SyncSpace project. It serves as a guide for all developers to understand how their individual components fit into the larger system.

## 1. Team Roles & Responsibilities

To ensure clean ownership boundaries and minimize merge conflicts, the project is divided into five distinct domains. Think of SyncSpace as a restaurant:

*   **Dev 1 (Frontend - Yasser): The Waiter.**
    *   **Responsibilities:** Builds the React/TypeScript application. Handles the chat UI, user profiles, friends list, and dashboards. Renders the incoming video stream and captures mouse/keyboard events for interactive overlays.
    *   **Focus:** Client-side state synchronization, UI/UX, and routing.

*   **Dev 2 (Streaming / Neko Engine - Hamza): The Kitchen Equipment.**
    *   **Responsibilities:** Manages the Docker Engine API for container lifecycles. Handles WebRTC negotiation (SDP/ICE/STUN) and input injection into the virtual display (X11).
    *   **Focus:** The hardest, most self-contained domain. Ensures the virtual browser runs smoothly and streams low-latency audio/video.

*   **Dev 3 (Backend Core - aelbouss): The Restaurant Manager.**
    *   **Responsibilities:** Builds the microservices architecture (Auth, Room, Messaging). Designs the database schema, ORM, and migrations. Manages the WebSocket messaging core for chat, cursor sync, and presence using Redis pub/sub.
    *   **Focus:** API contracts, database integrity, and real-time state management.

*   **Dev 4 (Identity & Access - aelbouss): The Bouncer.**
    *   **Responsibilities:** Implements JWT authentication, refresh token rotation, and password hashing. Manages RBAC (global and per-room roles) and OAuth 2.0 (42/Google/GitHub). Integrates HashiCorp Vault for secrets management.
    *   **Focus:** Security, permissions, and protecting sensitive credentials.

*   **DevOps (You): The Building Inspector & Electrician.**
    *   **Responsibilities:** Manages Docker Compose orchestration, Nginx reverse proxy, and WAF/ModSecurity. Sets up the ELK stack for centralized logging and monitors overall system health.
    *   **Focus:** Infrastructure, perimeter security, and ensuring all containers communicate without crashing.

---

## 2. System Data Flow

When a user interacts with SyncSpace, the data flows through the system in the following sequence:

1.  **Request Initiation:** Yasser (Frontend) sends a request from the user's browser.
2.  **Authentication:** aelbouss (Auth) verifies the user's identity and permissions.
3.  **Action Processing:** If authorized, aelbouss (Backend) processes the request (e.g., creating a room or sending a message).
4.  **Container Orchestration:** If a new room is requested, Hamza (Neko) spins up a new isolated Docker container running a virtual browser.
5.  **Streaming:** Hamza (Neko) captures the browser's display and audio, encoding it into a WebRTC stream.
6.  **Delivery:** The stream is sent back to Yasser (Frontend), who renders it for the user.
7.  **Infrastructure:** DevOps ensures all these containers (Frontend, Backend, Neko, Database, Vault, ELK) are running on the same network, can communicate securely, and that logs are being collected in Kibana.

---

## 3. Infrastructure Architecture

The infrastructure is designed to be highly decoupled and secure. The system runs in a single Docker Compose environment with the following layers:

*   **Perimeter Layer:**
    *   **Nginx:** Acts as the reverse proxy and entry point for all external traffic. Handles SSL/TLS termination.
    *   **ModSecurity WAF:** Inspects incoming payloads to prevent malicious actors from exploiting the API that spawns Docker containers.
*   **Orchestration Layer:**
    *   **Docker Engine API:** Used by the Neko Orchestrator to programmatically spawn isolated containers.
    *   **HashiCorp Vault:** Centralized secrets management. Injects database passwords, JWT secrets, and OAuth IDs into microservices at runtime. No credentials are hardcoded.
*   **Application Layer:**
    *   **Microservices:** Separate services for Auth, WebSockets, and Container Orchestration.
    *   **Neko Containers:** Dynamic, isolated containers running lightweight X11 servers and headless browsers for each active room.
*   **Observability Layer:**
    *   **ELK Stack (Elasticsearch, Logstash, Kibana, Filebeat):** Collects logs from all containers. Allows developers to monitor room spin-up times, track WebSocket disconnects, and audit security events in real-time.

---

## 4. Development Workflow & Coordination

To maintain a clean codebase and avoid merge conflicts, the team follows a strict Git and task management workflow.

### Branching Strategy
*   `main`: Production-ready code. Protected branch. No direct pushes allowed.
*   `feat/name`: For new features (e.g., `feat/login-ui`).
*   `fix/name`: For bug fixes.
*   `devops`: Dedicated branch for infrastructure changes (owned by DevOps).

### Task Management (GitHub Projects)
*   **Status Columns:** `Todo`, `In Progress`, `In Review`, `Done`.
*   **Custom Fields:**
    *   `Priority`: P0 (Critical), P1 (High), P2 (Normal), P3 (Low).
    *   `Type of task`: Feature, Bug, Infrastructure, Security, Documentation, Chore.
    *   `Target Date`: Deadline for the task.

### Pull Requests & Code Reviews
*   No code is merged into `main` without a Pull Request (PR).
*   Every PR requires at least one approval from a team member.
*   DevOps must review any PR that modifies `docker-compose.yml`, `.env.example`, or the `infra/` directory.
*   **CI Pipeline:** Every PR triggers a GitHub Action that builds the code and runs a Trivy vulnerability scan. If the pipeline fails, the PR cannot be merged.

### CI/CD Overview
*   **Continuous Integration (CI):** Automatically builds and tests code on every PR to catch syntax errors and security flaws early.
*   **Continuous Deployment (CD):** Automatically deploys code to the production server when merged into `main`. It pulls the latest code, rebuilds Docker images, and restarts the containers.

### Synchronization
*   **Daily Standup (Discord):** 15-minute sync. Each member answers: What I did yesterday, what I'm doing today, what is blocking me.
*   **DevOps as Unblocker:** If a developer faces a network or environment issue, DevOps fixes the `docker-compose.yml` or infrastructure configuration immediately.
*   **Weekly Merge Party:** Every Friday, all pending PRs are reviewed, approved, and merged into `main` for a fresh deployment.