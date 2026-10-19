# SyncSpace — Frontend

The web interface of SyncSpace: create or join a room and watch together on a shared virtual browser, with live chat.

## Stack

- **React 19** + **Vite** (build tool and dev server)
- **React Router** for pages
- **Tailwind CSS v4** for styling (theme in `src/index.css`)
- **Lucide** icons

## Run it

```bash
npm install
npm run dev       # dev server on http://localhost:5173
npm run lint      # ESLint
npm run build     # production build in dist/
```

With Docker (from the repo root, as part of the whole project):

```bash
docker compose up --build
```

The image builds the app, then serves it with nginx on port **3000** (`Dockerfile`, `nginx.conf`).

## Pages

| URL | Page |
|---|---|
| `/` | Landing page |
| `/signin`, `/signup` | Sign in / sign up |
| `/home` | Profile (edit mode, photos) + Create / Join room |
| `/friends` | Friends, requests, search, online status |
| `/stream` | Room: shared browser, chat, people, settings |
| `/privacy`, `/terms` | Privacy Policy / Terms of Service |
| anything else | 404 page |

## Structure

```
src/
├── App.jsx          landing page
├── main.jsx         routes
├── index.css        theme (colors, fonts) + landing page styles
├── Pages/           one file per page
├── components/      shared pieces: Logo, Avatar, TextField, PopUp, AppNav, layouts…
└── assets/          images and preview avatars
public/              files served as-is (logo / favicon)
```

## Not connected yet

The backend is not plugged in yet: users, rooms, friends and chat messages use **preview data**.
Every place that will call the backend is marked with a `// TODO` comment.

## Credits

- Preview avatars: [DiceBear](https://www.dicebear.com) "Lorelei" by Lisa Wischofsky, licensed **CC0 1.0**
- Icons: [Lucide](https://lucide.dev) (ISC license)
