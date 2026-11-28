# Task 1 — Pure Theory: Building Your First Microservice Brain

> **Goal of This Lesson:** Understand **everything** happening under the hood of Task 1 *before* we write a single file of code.  
> **Estimated Reading Time:** ~15–20 minutes (short, bite-sized steps — no heavy walls of text!).  
> **Rule of the Game:** Read Steps 1 → 6, then answer the **Validation Quiz** at the bottom in chat. Once we verify your answers together, we unlock **`TASK1_PRACTICE.md`** where you'll build everything line by line by hand — including **hacking our own intentionally broken code first**, then securing it!

---

## Quick Acronym Pocket Guide (Zero Mystery Words!)

Whenever you see an acronym in this lesson, here is what every single letter stands for:

| Acronym | Stands For | 1-Sentence Plain English |
| :--- | :--- | :--- |
| **HTTP** | **H**yper**T**ext **T**ransfer **P**rotocol | The request/response text language browsers and servers speak (you literally built this in C++98 `webserv`!). |
| **API** | **A**pplication **P**rogramming **I**nterface | A menu of URLs a program exposes so *other* programs can talk to it (instead of human-clickable web pages). |
| **REST** | **RE**presentational **S**tate **T**ransfer | A clean style of building HTTP APIs using standard methods (`GET` read, `POST` create, `PATCH` update, `DELETE` remove) and status codes (`200`, `400`, `401`, `403`, `404`). |
| **JSON** | **J**ava**S**cript **O**bject **N**otation | Lightweight key-value text format for sending data over HTTP, like `{"status": "ok", "port": 4000}`. |
| **JS** | **J**ava**S**cript | The programming language Node.js runs (curly braces `{ }` like C/C++, no manual `malloc`/`free`!). |
| **ESM** | **E**CMA**S**cript **M**odules | The modern JS way of splitting code across files using `import` and `export` (like `#include` in C/C++, except way cleaner). |
| **NPM** | **N**ode **P**ackage **M**anager | The tool that downloads libraries into `node_modules/` using a recipe file called `package.json` (like a smart `Makefile` + library downloader). |
| **DNS** | **D**omain **N**ame **S**ystem | The phonebook that translates a human name like `postgres` into an IP address like `172.18.0.3` (just like in your **Inception** Docker network!). |
| **SQL** | **S**tructured **Q**uery **L**anguage | The language used to ask a database to store, read, update, or delete rows in tables (`SELECT`, `INSERT`, `UPDATE`, `DELETE`). |
| **SQLi** | **SQL** **I**njection | A classic hacker attack where evil user text tricks your database into running hacker SQL commands. |
| **UUID** | **U**niversally **U**nique **I**dentifier | A 128-bit random ID like `550e8400-e29b-41d4-a716-446655440000` (impossible to guess, unlike `user_id = 1, 2, 3`). |
| **DoS** | **D**enial **o**f **S**ervice | Any attack (or bug!) that freezes or crashes your server so legitimate users can't use it. |
| **RCE** | **R**emote **C**ode **E**xecution | The scariest hack: an attacker manages to run shell commands inside your server container. |
| **OpenAPI** | **Open** **API** Specification | A standard blueprint describing every route in your API — **Swagger** reads it and draws a clickable test page at `/docs`. |

---

## Step 1 — What Is a Microservice, and Why Does `auth` Get Its OWN Database Schema?

### Real-Life Analogy: Airport Security vs. the Food Court
Imagine an international airport:
- **A Monolith** is putting the **Passport Control Officer**, the **Baggage Handler**, and the **Burger Cashier** in the *same small room*, sharing the *same drawer* of keys, cash, and master passport stamps.
  - If a sneaky thief distracts the Burger Cashier and reaches into the drawer, they steal the **master passport stamps** too!
  - And if the Burger Cashier tries to reorganize the drawer, the Passport Officer crashes!
- **Microservices** put each job in its **own locked room** with a **small service window** (an HTTP **API**):
  - **Room 1 (`services/auth` — YOU):** Passport Control. Owns the vault of passports, passwords, tokens, and security clearances.
  - **Room 2 (`services/backend` — Dev 3):** The Lounge & Cinema. Owns rooms, chat messages, and friends lists.
  - **Room 3 (`services/orchestrator` — Dev 2):** The Projection Booth. Spins up Firefox browser containers.

### Why Our Own Isolated PostgreSQL `auth` Schema?
Inside our single PostgreSQL server (`syncspace-postgres`), PostgreSQL lets you create separate locked "folders" called **schemas**:
- **`public` schema (Dev 3's room):** Stores public profiles, chat messages, rooms, and friendships.
- **`auth` schema (YOUR room):** Stores secret password hashes, refresh tokens, OAuth accounts, and security roles.

### What Goes Wrong WITHOUT This Separation? (Real Hacker & Engineering Disasters!)
1. **Hacker Story — The Chat-Bug-to-Full-Takeover Domino Effect:**
   Imagine Dev 3 writes a search bar for chat messages and accidentally leaves a bug that lets a hacker dump tables in the `public` schema.
   - **Without separation:** The hacker dumps `users` and `refresh_tokens` too — **every user's password hash and active session is stolen** because of a bug in *chat*!
   - **With separation (`auth` schema + least-privilege DB access):** A bug in chat NEVER touches your authentication secrets.
2. **Team Disaster — Prisma Schema Drift:**
   Dev 3 uses a tool called **Prisma** to manage `public` tables automatically. If your code alters *his* tables, Prisma thinks the database is corrupted and tries to **wipe the whole database**! By owning your own `auth` schema, you and Dev 3 NEVER step on each other's toes.

---

## Step 2 — From C++98 `webserv` to Node.js: The Event Loop & `async / await`

You already built `webserv` in C++98! Remember how hard it was to handle **100 clients at the same time** without using 100 threads?
You wrote a giant `while (true)` loop around `poll()` or `epoll()`:
1. Ask the OS kernel: *"Which sockets are ready to read or write?"*
2. Handle one tiny piece of work for Client A **without blocking**.
3. Immediately switch to Client B while Client A waits for disk or network!

**CONGRATULATIONS — YOU JUST EXPLAINED NODE.JS!**

Node.js runs your JavaScript on **ONE single main thread** driven by an **Event Loop** (literally powered by `epoll` on Linux under the hood, via a C library called `libuv`!).

### Real-Life Analogy: The Single Genius Chef with Kitchen Timers
Imagine a restaurant with **ONE super-fast chef** (the Node.js main thread):
- **The WRONG way (Blocking / Synchronous):**
  Customer #1 orders a steak that takes 10 minutes in the oven. The chef puts the steak in the oven and **stares at the oven door for 10 full minutes without moving**. Customers #2 through #500 starve at the counter!
- **The RIGHT way (`async` / `await` — Non-Blocking):**
  The chef puts Customer #1's steak in the oven, sets a timer (`await oven.cook()`), and **immediately turns around to chop salad for Customer #2, #3, #4...** When the timer dings, the chef resumes Customer #1's order and plates the steak!

### How `async` and `await` Look in Plain English
In C++ `webserv`, you had to manually store state structs across `poll()` calls. In Node.js, JavaScript hides that ugly state machine behind **two magic words**:
- Put **`async`** before a function that does waiting (talking to PostgreSQL, calling Google OAuth, hashing a password).
- Put **`await`** before the slow operation:
  ```js
  // Inside an async function:
  const result = await db.query("SELECT 1");
  // While PostgreSQL is answering (say, 2ms), Node.js freely serves 50 other users!
  // The moment PostgreSQL replies, this line continues cleanly with `result`.
  ```

### What Goes Wrong If You Block the Event Loop? (Self-Inflicted **DoS**!)
If you put a heavy synchronous loop (like a bad `while` loop or synchronous crypto hashing) on Node's main thread, **every single user on SyncSpace freezes** until that one operation finishes.
> **Hacker Story — ReDoS (Regular Expression Denial of Service):**  
> Attackers love sending a 50-character evil email string like `aaaaaaaaaaaaaaaaaaaaaaaaaaaaa!` to a badly written email regex on a Node.js server. Because regex matching runs synchronously on the main thread, one single HTTP request from a teenager's laptop can freeze the entire server's CPU for 30 seconds — taking the whole site offline (**DoS**)!  
> *(Good news: Fastify uses battle-tested JSON Schema validators so you don't write broken regexes!)*

---

## Step 3 — How Fastify Works (Compare Directly to Your `webserv`!)

In `webserv`, when bytes arrived on a TCP socket, you manually wrote code to:
1. Parse `POST /auth/login HTTP/1.1`
2. Parse headers (`Content-Type`, `Authorization`, `Cookie`)
3. Read `Content-Length` bytes of body
4. Match the URL path to a handler function
5. Build `HTTP/1.1 200 OK\r\nContent-Type: application/json\r\n\r\n{...}`

**Fastify does ALL 5 steps automatically — and wraps every request in a clean 4-stage pipeline:**

```text
Incoming HTTP Request
        │
        ▼
[1. JSON Schema Validator] ──► Bad types / missing fields / extra junk?
        │                      AUTOMATICALLY rejects with 400 Bad Request!
        ▼
[2. preHandler Hooks]      ──► Security Bouncers (check JWT, check ADMIN role!)
        │                      Not allowed? Stops right here with 401 or 403!
        ▼
[3. Route Handler]         ──► Your clean business logic (talk to DB, return object)
        │
        ▼
[4. Response Serializer]   ──► Fastify converts your JS object to JSON + sends HTTP reply
                               (AND strips secret fields like password_hash if schema says so!)
```

### Why Step 1 (JSON Schema Validation) Is a Security Superpower!
**Real-Life Analogy:** A bouncer who checks your luggage *outside* the club before you even step near the bar.

**Hacker Story — Mass Assignment Attack (Real GitHub Vulnerability, 2012!):**
In 2012, a developer hacked GitHub's own Rails repository! How?
- The signup/update form only asked for `username` and `email`.
- The server blindly took the entire JSON body sent by the user and shoved it into the database.
- The attacker manually edited the HTTP request using `curl` and snuck in an extra field:
  ```json
  { "username": "evil_guy", "email": "evil@mail.com", "global_role": "ADMIN" }
  ```
- Because the server didn't strictly whitelist allowed fields, the attacker promoted themselves to **ADMIN**!

**How Fastify Stops This Automatically:**
When you define a Fastify JSON Schema with `additionalProperties: false` (or explicitly pick schema fields), Fastify **drops or rejects any unexpected field like `"global_role": "ADMIN"`** before your code even sees the request!

And as a bonus: Fastify's **`@fastify/swagger`** plugin reads those exact same schemas and automatically builds a live interactive testing webpage at **`http://localhost:4000/docs`** (OpenAPI / Swagger)!

---

## Step 4 — Talking to PostgreSQL Safely (Container DNS, Connection Pools, & SQL Injection)

Remember your **Inception** project where WordPress connected to `mariadb:3306`? SyncSpace works the **exact same way**:
- Your `services/auth` container connects to hostname **`postgres`** on TCP port **`5432`**.
- Docker's internal **DNS** translates `postgres` -> the private IP of `syncspace-postgres` on the `database` (`internal: true`) network.

### Why a **Connection Pool (`pg.Pool`)** Instead of Opening a New Connection Per Request?
**Real-Life Analogy:**
Imagine a busy pizza shop calling its delivery warehouse:
- **Without a Pool (New TCP Connection every request):** For *every single HTTP request*, you pick up the phone, dial PostgreSQL, complete the TCP handshake, authenticate username/password, ask 1 tiny question, and hang up! If 500 users log in at once, PostgreSQL hits its `max_connections` limit (usually 100) and **crashes with `FATAL: too many clients already`**!
- **With a Connection Pool (`pg.Pool`):** Your server opens a small reusable group of phone lines (e.g., max 10 connections) and keeps them warm. Request #1 borrows line #1 for 1 millisecond, returns it, and Request #2 immediately reuses line #1. **Fast, safe, never crashes PostgreSQL!**

### The Most Famous Hack in History: **SQL Injection (SQLi)**

> **Experiment Preview:** In `TASK1_PRACTICE.md`, we will briefly build a tiny test query the **WRONG way**, hack it ourselves with `curl` to watch it break live, and then rewrite it the **SECURE way** so you never forget it!

Suppose a server looks up a user by `username`:

- **THE WRONG WAY (String Concatenation — Glueing user text into SQL!):**
  ```sql
  -- Server code: "SELECT id, username FROM auth.users WHERE username = '" + userInput + "'"
  ```
  If a normal user types `ayman`, PostgreSQL runs:
  ```sql
  SELECT id, username FROM auth.users WHERE username = 'ayman'
  ```
  **Now watch a hacker type:** `' OR '1'='1`
  PostgreSQL glues the text together and runs:
  ```sql
  SELECT id, username FROM auth.users WHERE username = '' OR '1'='1'
  ```
  Because `'1'='1'` is ALWAYS TRUE, PostgreSQL happily hands the hacker **EVERY USER IN THE ENTIRE DATABASE** (or worse: `'; DROP TABLE auth.users; --` deletes your whole table!!).

- **THE SECURE WAY (Parameterized Queries with `$1, $2` in `pg`):**
  ```js
  await pool.query(
    'SELECT id, username FROM auth.users WHERE username = $1',
    [userInput]
  );
  ```
  Why is this **100% immune** to SQL Injection?
  Because the SQL command template (`WHERE username = $1`) and the user's data (`"' OR '1'='1"`) are sent to PostgreSQL in **two completely separate protocol channels**! PostgreSQL compiles the SQL logic *first*, then treats `$1` strictly as a dead literal string — it simply searches for a weird person whose literal name is `' OR '1'='1` and finds nobody!

---

## Step 5 — Docker Security & Health Checks (Upgrading Your Inception Knowledge!)

You already built Dockerfiles in **Inception**. For a **security-critical Auth microservice**, we add **3 critical hardening habits**:

### 1. Never Run Your Container as `root` (`USER node`)
- **What happens WITHOUT `USER node`?**
  Inside Docker, the default user is `root` (UID 0). If a hacker ever finds an **RCE** (Remote Code Execution) bug in an npm package, they land inside your container as `root` — they can rewrite your JavaScript files, install crypto-miners, modify `/etc`, or exploit kernel/container misconfigurations to escape onto the host machine!
- **With `USER node`:** Even if a hacker gets a shell, they are trapped as an unprivileged user who can't modify system files or install tools. (Notice Dev 3 already did `USER node` in `services/backend/Dockerfile` — we will do the exact same!)

### 2. Two-Network Sandwich (`backend` + `database` Internal)
- Remember from our architecture:
  - **`database` network (`internal: true`):** NO internet! Only `postgres`, `backend`, and `auth` live here. Even if someone compromises `frontend` or `nginx`, they literally have **zero network route** to PostgreSQL port `5432`!
  - **`backend` network:** Connects `nginx`, `auth`, `backend`, `orchestrator`, and `vault` (and allows outbound internet so `auth` can talk to Google / 42 / GitHub OAuth later!).

### 3. Why `GET /health` + Docker `healthcheck` Matters (The Startup Race Bug!)
- **What happens WITHOUT a healthcheck?**
  You run `docker compose up`. Docker starts `postgres` and `auth` at the exact same millisecond. `auth` boots in 0.3 seconds and tries to connect to PostgreSQL — but PostgreSQL takes 3 seconds to initialize! Result: **`ECONNREFUSED` crash loop!**
- **With a healthcheck:**
  1. `auth` waits for `postgres: condition: service_healthy` (so PostgreSQL is *actually* accepting SQL queries before `auth` starts!).
  2. `auth` exposes `GET /health`, which runs a real `SELECT 1` ping to PostgreSQL and returns `200 OK` (`{"status": "ok", "database": "connected"}`) — or `503 Service Unavailable` if PostgreSQL goes down! That way Nginx & Docker know your service is genuinely alive, not a zombie process.

---

## Step 6 — Task 1 Validation Quiz!

Answer these **7 short questions** directly in chat (in your own simple words — short 1–2 sentence answers are totally fine!). I will grade and correct every answer, clarify any tricky spot, and then unlock **`TASK1_PRACTICE.md`** so we start coding!

1. **Acronym Check:** Without scrolling up if you can, what do **API**, **JSON**, **SQLi**, and **DoS** stand for?
2. **Microservice Isolation:** Why are we putting our authentication tables inside a dedicated **`auth` PostgreSQL schema** instead of adding columns directly to Dev 3's `public.users` table? *(Give 2 reasons: 1 security reason + 1 teamwork/engineering reason!)*
3. **Node.js & `webserv`:** Node.js only has ONE main thread for your JavaScript. How can it handle 500 users talking to PostgreSQL at the same time without freezing? What happens if someone runs a heavy blocking loop on that main thread?
4. **Hacker Defense #1 (Mass Assignment):** A hacker sends `POST /auth/register` with `{"username": "hacker", "email": "h@x.com", "password": "Password123", "global_role": "ADMIN"}`. Which stage of Fastify's 4-stage pipeline stops this *before* our handler code even runs, and how?
5. **Hacker Defense #2 (SQL Injection):** Why does `pool.query("SELECT * FROM auth.users WHERE username = $1", [input])` stop `' OR '1'='1`, while `"SELECT * FROM auth.users WHERE username = '" + input + "'"` gets hacked?
6. **Crash Prevention (Connection Pool):** Why shouldn't our Auth service open a brand-new TCP connection to PostgreSQL on every single HTTP request and close it afterward?
7. **Docker Hardening:** Why do we add `USER node` in our `Dockerfile`, AND why should `GET /health` actually run `SELECT 1` against PostgreSQL instead of just blindly returning `{"status": "ok"}`?

---

*Reply in chat with your answers (1 through 7) whenever you're ready!*
