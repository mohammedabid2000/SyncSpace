# SyncSpace — Frontend

The web interface of **SyncSpace**: sign in, create or join a room, and watch together on a shared virtual browser while chatting with friends.

> **Status:** the interface is complete, but the backend is **not connected yet**. Users, rooms, friends and chat messages use **preview data**. Every place that will call the backend is marked with a `// TODO` comment.

---

## Table of contents

1. [Stack](#1-stack)
2. [Run it](#2-run-it)
3. [Pages](#3-pages)
4. [Folder structure](#4-folder-structure)
5. [Shared components](#5-shared-components)
6. [How it works — the patterns used everywhere](#6-how-it-works--the-patterns-used-everywhere) (+ [layout recipes](#layout-recipes-the-tailwind-combos-that-come-back-again-and-again))
7. [Page by page](#7-page-by-page)
8. [Styling](#8-styling)
9. [Subject requirements — where they are met](#9-subject-requirements--where-they-are-met)
10. [Modules — what the frontend covers](#10-modules--what-the-frontend-covers)
11. [Design decisions (FAQ)](#11-design-decisions-faq)
12. [How to make common changes](#12-how-to-make-common-changes)
13. [Not connected yet (TODO)](#13-not-connected-yet-todo)
14. [Docker](#14-docker)
15. [How AI was used](#15-how-ai-was-used)
16. [Credits](#16-credits)
17. [Changelog](#17-changelog)

---

## 1. Stack

| Tool | Role |
|---|---|
| **React 19** | UI components |
| **Vite** | dev server (instant reload) and production build |
| **React Router** | pages / URLs |
| **Tailwind CSS v4** | styling (theme in `src/index.css`) |
| **Lucide** | icons |
| **ESLint** | finds mistakes in the code (`npm run lint`) |
| **nginx** (Docker) | serves the built app in production |

## 2. Run it

**With Node.js 20+** (best for working on the code):

```bash
cd services/frontend
npm install       # installs every package listed in package.json / package-lock.json
npm run dev       # http://localhost:5173
npm run lint      # check the code
npm run build     # production build in dist/
```

**With Docker** (nothing else to install):

```bash
cd services/frontend
docker build -t syncspace-frontend .
docker run --rm -p 3000:3000 syncspace-frontend    # http://localhost:3000
```

Or the whole project from the repo root: `docker compose up --build` (needs the other services and the `.env` file).

**On another computer:** clone the repo, `git checkout feature/ui`, then one of the two options above. Packages (React Router, Tailwind, Lucide…) are **not** copied by hand: `npm install` (or `npm ci` inside Docker) reads `package.json` + `package-lock.json` and installs the exact same versions. `node_modules/` is never committed.

## 3. Pages

| URL | Page | File |
|---|---|---|
| `/` | Landing page | `src/App.jsx` |
| `/signin` | Sign in | `src/Pages/SignIn.jsx` |
| `/signup` | Sign up | `src/Pages/SignUp.jsx` |
| `/home` | Profile (edit mode, photos) + Create / Join room | `src/Pages/Home.jsx` |
| `/friends` | Friends, requests, search, online status | `src/Pages/Friends.jsx` |
| `/stream` | Room: shared browser, chat, people, settings | `src/Pages/Stream.jsx` |
| `/privacy` | Privacy Policy | `src/Pages/Privacy.jsx` |
| `/terms` | Terms of Service | `src/Pages/Terms.jsx` |
| `/design-system` | Design system: palette, typography, icons, every component (linked in the landing footer) | `src/Pages/DesignSystem.jsx` |
| anything else | 404 page | `src/Pages/NotFound.jsx` |

All routes are declared in `src/main.jsx`. The `*` route (404) must stay **last**.

## 4. Folder structure

```
services/frontend/
├── index.html            the only HTML page; React draws everything inside <div id="root">
├── Dockerfile            build with Node, serve with nginx (port 3000)
├── nginx.conf            nginx config: every URL returns index.html (so /friends works on refresh)
├── .dockerignore         files kept out of the Docker image (node_modules, .env…)
├── package.json          list of packages + scripts (dev, build, lint)
├── package-lock.json     exact versions of every package
├── vite.config.js        Vite + React + Tailwind plugins
├── eslint.config.js      lint rules
├── public/               files served as-is
│   ├── syncspace-logo.svg   logo, also the favicon
│   ├── manifest.webmanifest PWA: app name, colors, icons (makes the app installable)
│   ├── sw.js                PWA: service worker (works offline)
│   └── icon-*.png, apple-touch-icon.png   app icons (rendered from the logo)
└── src/
    ├── main.jsx          entry point: router + all routes
    ├── App.jsx           landing page
    ├── index.css         theme (colors, fonts, radius) + landing page styles
    ├── Pages/            one file per page
    ├── components/       shared building blocks (see section 5)
    └── assets/           images imported by the code
        └── avatars/      preview profile pictures (CC0)
```

## 5. Shared components

All in `src/components/`. They are the **design system**: every page is built from them, so the app looks and behaves the same everywhere. See them all live on `/design-system`.

**Building blocks (UI)**

| Component | What it does |
|---|---|
| `Button` | every text button: variants `primary` (red), `secondary` (navy), `outline`, `subtle`, `light`, `danger`, `dangerOutline`; sizes `sm`, `md`, `base`, `lg`. Rule: hover = darker version of the same color. Styles live in `buttonStyles.js` (also used to style a `<Link>` like a button) |
| `IconButton` | round button with only an icon; `label` is required (screen readers + tooltip). Variants `ghost`, `muted`, `solid`, `primary`, `light`, `danger` |
| `Card` | white box + light navy border + soft shadow; `as="section"` to change the HTML tag |
| `Badge` | small label next to a name (e.g. "Host") |
| `StatusDot` | green / grey dot **with** "Online" / "Offline" text (color alone is not enough) |
| `Avatar` | round photo; without a photo, the first letter of the name (default avatar) |
| `TextField` | label + input + hint or error message, linked for screen readers (`aria-describedby`) |
| `PasswordField` | `TextField` + eye button to show / hide the password |
| `Tabs` + `TabPanel` | accessible tabs: click, or ← → / Home / End keys (WAI-ARIA tabs pattern) |
| `PopUp` | modal: overlay + card. **Focus trap**: focus goes inside on open, Tab stays inside, Escape / X / click outside closes, focus returns to the button that opened it; the page behind doesn't scroll |
| `Menu` | dropdown (avatar menu): opens with the first item focused, ↑ ↓ to move, Escape closes and returns to the button, click outside closes |
| `Toast` | "Saved ✓" message at the bottom, disappears after 3 s, read by screen readers (`role="status"`) |
| `Logo` | logo + name in 3 sizes; `compact` = logo only on phones |
| `OfflineBanner` | bar at the top when the connection is lost |

**Layouts**

| Component | What it does | Used in |
|---|---|---|
| `AppNav` | top bar of signed-in pages: logo, Home / Friends, avatar **menu** (My profile, Sign out) | Home, Friends |
| `AuthLayout` + `AuthIllustrationPanel` | card of the auth pages: illustration + logo + title + form | Sign in, Sign up |
| `LegalLayout` | header, text column, footer links | Privacy, Terms |
| `FeatureGrid` (in `App.jsx`) | row of features: icon + title + text | landing page |

## 6. How it works — the patterns used everywhere

The whole frontend is built from these patterns. Understanding them = understanding every file.

| # | Pattern | Explanation | Example |
|---|---|---|---|
| 1 | **Component + props** | a function that returns JSX; props are its inputs | `<Logo size="lg" to="/home" />` |
| 2 | **`useState`** | a value that re-draws the page when it changes | `const [tab, setTab] = useState("chat")` |
| 3 | **Controlled input** | the input shows a state value; `onChange` updates it | `value={username}` + `onChange={setUsername}` |
| 4 | **Form submit + validation** | `onSubmit` → `event.preventDefault()` (no page reload) → check fields → show errors, or continue | `handleSubmit` in Sign in / Sign up |
| 5 | **Error display** | show the message only if there is one; `aria-invalid` turns the border red and tells screen readers | `{error && <p>…</p>}` in `TextField` |
| 6 | **Lists: `.map()` + `key`** | turn an array into JSX; `key` lets React track each item | messages, friends, emojis, features |
| 7 | **Conditional rendering** | `cond && <A/>` or `cond ? <A/> : <B/>` | Chat / People tabs, edit mode |
| 8 | **Popup** | `<PopUp showPopUp closePopUp title>`; `useEffect` listens to Escape while open; `stopPropagation` keeps clicks inside the card from closing it | Join / Create room |
| 9 | **Draft → Save / Cancel** | edit a copy ("draft"); Save copies it into the real state, Cancel throws it away | Edit profile, Room settings |
| 10 | **Navigation** | routes in `main.jsx`; `Link` / `NavLink` for links; `useNavigate()` when code decides (e.g. after validation) | Sign in → `/home` |
| 11 | **Theme tokens** | `--color-primary` in `@theme` → classes `bg-primary`, `text-primary`… | all styling |
| 12 | **Responsive + states** | `md:` / `lg:` = bigger screens; `hover:`, `focus-visible:`, `aria-invalid:` = states | `grid md:grid-cols-2` |
| 13 | **Variants** | a component takes `variant` / `size` props and picks its classes from an object, so styles are never repeated | `<Button variant="outline" size="sm">` |
| 14 | **Feedback message** | `const [toast, setToast] = useState("")` → `setToast("Saved")` after an action → `<Toast message onDone>` | profile, settings, friends |
| 15 | **Keyboard support** | `onKeyDown` + `event.key` (Escape, Tab, arrows) + `ref.current.focus()` | `PopUp`, `Menu`, `Tabs` |

### Layout recipes (the Tailwind combos that come back again and again)

**Centering and spacing**

| Goal | Classes | How it works | Used in |
|---|---|---|---|
| Center something in the whole screen | `flex min-h-screen items-center justify-center` | full-height flex box; `justify-center` = left↔right, `items-center` = top↕bottom | `AuthLayout`, `NotFound` |
| Center a block of content on big screens | `mx-auto max-w-6xl px-6` | max width + equal auto margins left/right; `px-6` keeps space on phones | `AppNav`, Home, Friends, landing |
| Push two things to opposite sides | `flex items-center justify-between` | first child goes left, last child goes right | every header, cards titles |
| Same space between items | `flex gap-3` / `grid gap-6` | gap only *between* items, never on the outer edges | everywhere |
| Text column that's easy to read | `max-w-3xl` / `max-w-md` | long lines are hard to read: limit the width | legal pages, descriptions |

**Wrappers / cards**

| Goal | Classes | How it works | Used in |
|---|---|---|---|
| A card wrapper | `rounded-2xl border border-accent bg-card p-6 shadow-sm` | white box + light navy line + soft shadow + inner space | Home, Friends, Stream |
| Card whose image corners are rounded too | `overflow-hidden rounded-3xl` on the wrapper | children that go past the rounded corner are cut | `AuthLayout`, profile card |
| Same card height on two pages | `md:min-h-[47rem]` | *minimum* height: the card can still grow, never cuts content | `AuthLayout` |
| Pill around several icon buttons | `flex items-center gap-1 rounded-full border-2 border-primary p-1` | one rounded border around the group | Stream header |
| Round icon button | `flex size-10 items-center justify-center rounded-full` | fixed square + `rounded-full` = circle, icon centered | Stream header, pencils |

**Two columns that stack on phones**

| Goal | Classes | How it works | Used in |
|---|---|---|---|
| 2 equal columns from tablet size | `grid gap-12 md:grid-cols-2` | 1 column on phones, 2 from 768px | landing sections, auth card |
| Main column + fixed sidebar | `grid lg:grid-cols-[minmax(0,1fr)_22rem]` | sidebar is 22rem; main takes the rest; `minmax(0,1fr)` lets it shrink instead of overflowing | Stream (chat), Friends |
| Which side an item goes on | order in the code | in a grid, 1st child = left, 2nd child = right | landing sections |
| Hide on phones | `hidden md:block` / `hidden lg:flex` | `hidden` everywhere, shown again from the breakpoint | room name, people, illustration panel |

**Full-height layouts and scrolling**

| Goal | Classes | How it works | Used in |
|---|---|---|---|
| Header + content filling the rest | `flex min-h-screen flex-col` on the page, `flex-1` on the content | the content takes all remaining height | Stream, `LegalLayout` |
| A list that scrolls *inside* the page | `flex-1 overflow-y-auto` + `min-h-0` on its flex parents | without `min-h-0`, flex children refuse to shrink and the page grows instead of scrolling | Stream chat |
| Video-shaped box | `aspect-video` | keeps a 16:9 ratio at any width | Stream player |
| Image filling its box without stretching | `h-full w-full object-cover` | crops the edges instead of squashing | cover photo, avatars |

**Positioning (putting things on top of / at the corner of others)**

| Goal | Classes | How it works | Used in |
|---|---|---|---|
| Something in a corner of a box | parent `relative`, child `absolute right-4 top-4` | `absolute` is placed relative to the nearest `relative` parent | pencil on the cover |
| Button at the right edge of an input | parent `relative`, button `absolute inset-y-0 right-0` + input `pr-10` | `inset-y-0` = full height; `pr-10` leaves room so text doesn't go under it | password eye (`TextField`) |
| Overlap the previous element | `-mt-16` (negative margin) | pulls the avatar up into the cover | Home avatar |
| Bring it in front | `relative z-10` | higher z = in front; needs a position (`relative`) to work | Home avatar, landing hero |
| Panel floating *above* a button | parent `relative`, panel `absolute bottom-full right-0 mb-3` | `bottom-full` = the panel's bottom sits at the parent's top | emoji panel |
| Full-screen overlay (modal) | `fixed inset-0 z-50 bg-secondary/60` | `fixed` = relative to the screen; `inset-0` = all 4 sides at 0; `/60` = 60% opacity | `PopUp` |
| Click inside the card must not close the modal | `onClick={(e) => e.stopPropagation()}` on the card | stops the click from reaching the overlay's `onClick` | `PopUp` |
| Overlapping avatars | `flex -space-x-2` + `ring-2 ring-background` on each | negative space overlaps them; the ring separates them | Stream header |
| Curved background | `::before` with `position: absolute; inset: 0; border-bottom-right-radius: 55% 45%` | a decorative layer behind the section with one huge rounded corner | `hero`, `curve-*` in `index.css` |

**Small details**

| Goal | Classes | How it works | Used in |
|---|---|---|---|
| Long text cut with "…" | `truncate` (+ `min-w-0` on its flex parent) | one line, ellipsis when too long | room name, friend names |
| Thin vertical separator | `h-8 w-px bg-secondary/20` | 1px wide, 32px tall line | Stream header |
| Text only for screen readers | `sr-only` | invisible, but read aloud | icon buttons, file inputs |
| Focus ring on a wrapper | `focus-within:ring-2` | shows the ring when the input *inside* has focus | search box, chat input, file labels |
| Keyboard focus outline | `focus-visible:outline-2 focus-visible:outline-ring` | outline only when using the keyboard, not on mouse click | all buttons |
| Balanced button with an icon | `pl-3 pr-4` (icon on the left) | icons have empty space inside: less padding on the icon side looks centered | landing / Stream buttons |
| Transparent version of a color | `bg-primary/10`, `text-white/70` | `/N` = N% opacity | badges, overlay, muted text |
| Exact value not in Tailwind | `w-[22rem]`, `md:min-h-[47rem]` | square brackets = any CSS value | layouts |

## 7. Page by page

### Landing (`App.jsx`)
- Sections: hero, two `FeatureGrid` rows, "React to moments together", "Save a seat for your people" with a curved connector line (SVG).
- Curved backgrounds come from CSS classes `hero`, `curve-navy`, `curve-surface` (`::before` layer with one rounded corner).
- Header: logo + **Sign in** button. **New Room** and **Get started** (`Button size="lg"`) → `useNavigate("/signin")`.
- Footer links → `/privacy`, `/terms`, `/design-system` (React Router `Link`, imported as `RouterLink` because Lucide also has an icon called `Link`).

### Sign in / Sign up
- `AuthLayout` + `TextField` / `PasswordField`.
- Validation: Sign in = both fields required. Sign up = username required, email like `name@site.com`, password ≥ 8 characters.
- Navigation to `/home` happens **inside `handleSubmit`, only after validation passes**.

### Home / profile (`/home`)
- **Edit profile** → edit mode: username and email become inputs; **pencil buttons** appear on the profile photo and the cover. **Save** validates (username 3–20 chars, letters / numbers / `_`; valid email) then applies everything; **Cancel** discards everything.
- Photo upload: a hidden `<input type="file">` inside a `<label>`; checks type (image) and size (< 5 MB); preview with `URL.createObjectURL` (old previews freed with `URL.revokeObjectURL`).
- Default cover image when none is uploaded; preview avatar for the user.
- **Create Room** popup (name 3–40 chars) and **Join Room** popup (link or code required) → `/stream`.
- **"Profile saved"** toast after Save. Top bar avatar → menu with **My profile** and **Sign out**.
- Phones: the default cover is aligned right (`object-right`) so its logo stays visible.

### Friends (`/friends`)
- Your friends (photo, name, **online / offline** as a dot **and** text), click a friend → profile popup.
- Remove friend → confirmation popup.
- Add friends: search by username (`.filter()`), button changes to Add / Requested / Friends / Accept.
- Requests: Accept (becomes a friend) / Decline.
- Toasts: "Request sent to …", "You and … are now friends", "… was removed from your friends".

### Stream / room (`/stream`)
- Header: logo, room name, stacked avatars + "3 / 10 people", red pill with **invite link** (copies with `navigator.clipboard`, shows a check for 2 s), **settings**, **leave room**.
- Player area with a browser-style "VBrowser" tab; **Start VBrowser** button (the Neko iframe will go here).
- Chat: messages, auto-scroll to the newest (`useRef` + `useEffect`), **emoji panel** (click an emoji = sent immediately; closes on Escape or click outside), People tab.
- **Settings** popup: room name + people limit (between the number of people inside and 20), draft → Save → "Room settings saved" toast.
- Chat / People are `Tabs` (← → keys). People tab: click a person → **profile popup**.
- **Leave room** asks for confirmation first (Cancel / Leave room).

### Privacy / Terms / 404
- `LegalLayout` + real content about SyncSpace (data stored, shared browser warning, rules, rights).
- 404: route `path="*"`, button back home.

## 8. Styling

- **Tailwind CSS v4**: classes directly in JSX (`flex`, `px-6`, `md:grid-cols-2`…).
- **Theme** in `src/index.css` (`@theme`): fonts (Helvetica for text, Times italic for accents), colors and corner radius. Changing a value there changes it everywhere.

| Token | Value | Use |
|---|---|---|
| `background` | `#F4F0E8` cream | page background |
| `primary` | `#DC2223` logo red | main actions, accents |
| `secondary` | `#0D2434` logo navy | text, buttons |
| `accent` | `#D5DEE8` light navy | hovers, card borders |
| `muted-foreground` | `#5B6B78` grey | secondary text |
| `destructive` | `#B91C1C` | errors, remove |
| `success` | `#166534` | online dots |

- **Custom CSS** (landing page only): `section-layout`, `section-media`, `section-image`, `invitation-*`, `hero`, `curve-navy`, `curve-surface`.
- **Icons:** Lucide components (`<Plus />`) or Lucide SVGs pasted in JSX with React attribute names (`strokeWidth`, `className`, never `class` / `stroke-width`, which cause console warnings).

## 9. Subject requirements — where they are met

| Requirement | How |
|---|---|
| Frontend framework | React + React Router |
| CSS framework | Tailwind CSS v4 |
| Responsive on all devices | `md:` / `lg:` classes; layouts stack on phones |
| Accessible | labels on every input, `aria-label` on icon buttons, `focus-visible` outlines, focus trap in popups, keyboard menus and tabs, status as text (not only color), `role="status"` toasts |
| Forms validated on the frontend | every form validates before continuing and shows errors |
| Privacy Policy + Terms of Service | `/privacy`, `/terms`, linked in the footer, real content |
| No console errors / warnings | React attribute names, `key` on every list, 404 route for unknown URLs |
| Latest Google Chrome | tested in **Chrome for Testing 151**: every page, desktop + phone size, **0 console errors / warnings** (see "Testing" below) |
| Single command (containers) | `Dockerfile` + `nginx.conf`, used by `docker compose up --build` |
| HTTPS | handled by the main nginx in `infra/` (DevOps); the frontend container serves HTTP on port 3000 behind it |

### Testing (how this was checked)

Automated checks in a real browser (headless **Chrome for Testing 151**, with Playwright):

- **Every page** (`/`, `/signin`, `/signup`, `/home`, `/friends`, `/stream`, `/privacy`, `/terms`, `/design-system`, 404) at **desktop (1440px)** and **phone (390px)** sizes: screenshots + **0 console errors or warnings**.
- **25 interaction checks, all passing:** sign in validation, popup focus trap (Tab / Shift+Tab stay inside, Escape closes, focus returns to the opener), "Profile saved" toast (and it disappears after 3 s), avatar menu (keyboard + Sign out), tabs with arrow keys, profile popup, settings validation + toast, leave confirmation, friend request toast.
- **PWA:** service worker active, **installable** (Chrome reports no installability errors), pages open **offline**.
- **Firefox 157:** landing, sign in, home, friends, stream and design system render the same as in Chrome.

### Browser support

- **Chrome / Edge** (same engine): tested (Chrome). **Firefox:** tested. **Safari:** not tested (no Mac).
- Tailwind CSS v4 needs **Chrome 111+, Edge 111+, Firefox 128+, Safari 16.4+** (older browsers show a broken layout).
- Copying the invite link and the PWA (service worker) need **HTTPS** (or `localhost`).

## 10. Modules — what the frontend covers

A module only counts at evaluation if it is **fully functional** (tested live). Status of the frontend side:

| Module | Status | Notes |
|---|---|---|
| Minor: frontend framework (React) | ✅ valid | — |
| Minor: custom design system (≥ 10 reusable components + palette + typography + icons) | ✅ ready | 14 UI components + 4 layouts in `src/components/`, theme in `index.css`, Lucide icons, all shown on `/design-system` |
| Minor: PWA (installable + offline) | ✅ ready | manifest + icons + service worker; tested installable and offline in Chrome |
| Minor: additional browsers | ⚠️ partly | Firefox tested; test Edge (or Safari) and keep the "Browser support" notes in section 9 |
| Major: frontend + backend frameworks | ⏳ depends on the backend | backend must use a framework |
| Major: user interaction (chat, profile, friends) | ⚠️ UI done | backend: messages must reach other users, friends must be saved |
| Major: standard user management | ⚠️ UI done | backend: save profile / photos, real friends, real online status |
| Major: real-time features (WebSockets) | ❌ not started | WebSocket client for chat, online status, room events |
| Minor: multiple languages / RTL | ➖ not planned | optional, not needed to validate |
| Major: accessibility (WCAG 2.1 AA) | ⚠️ good base | focus trap, keyboard menus / tabs, labels, focus outlines, status text; a full audit (contrast of every color pair, screen reader pass) is still needed to claim it |
| Minor: file upload system | ❌ not claimable | needs several file types, server checks, storage, progress, delete |
| Minor: OAuth / 2FA | ❌ no UI | buttons / screens |

Also required for the app itself: the **Neko iframe** in the Stream page (still a placeholder).

### Goal: 125% (bonus)

125% = mandatory part + **14 validated points** + **5 bonus points** (max) = **19 points** for the team.
Bonus modules count only if the first 14 points are all validated, and each needs a justification in the main README.

Frontend modules that need **no backend**: design system (✅), PWA (✅), additional browsers (⚠️ test Edge) = **3 points**. The other bonus points come from the team's modules (or the accessibility Major after a full audit).

## 11. Design decisions (FAQ)

- **Why `key` in `.map()`?** So React knows which item is which when the list changes.
- **Why `event.preventDefault()` in forms?** A form submit normally reloads the page.
- **Why `useEffect` in `PopUp` and the emoji panel?** To listen for Escape / outside clicks only while open, and to remove the listener when closed (the `return` cleanup).
- **Why `NavLink` in the top bar?** It knows if its page is the current one: underline + `aria-current="page"` automatically.
- **`Link` vs `useNavigate`?** `Link` is a link the user clicks; `useNavigate` moves from code (e.g. after validation succeeds).
- **Why do routes like `/friends` work after a refresh in Docker?** `nginx.conf` returns `index.html` for unknown paths (`try_files`), then React Router shows the right page.
- **Why drafts in edit mode / settings?** So Cancel can undo everything; nothing changes until Save.
- **Why shared components?** One place to change, consistent design, fewer bugs (and it counts for the design system module).
- **Why WebP images?** Same quality, much smaller (≈ 5 MB → 0.5 MB for the illustrations): faster pages.
- **Why is the logo in `public/` and not `src/assets/`?** It's used by `index.html` as the favicon, which can only load files from `public/`.

## 12. How to make common changes

| I want to… | Where |
|---|---|
| change a color everywhere | `src/index.css` → `@theme` (e.g. `--color-primary`) |
| add a page | new file in `src/Pages/` with `export default`, a `<Route>` in `src/main.jsx` (before `*`), a `Link` to it |
| add a feature card on the landing page | `features` / `features2` arrays at the top of `src/App.jsx` |
| add a chat emoji | `EMOJIS` in `src/Pages/Stream.jsx` |
| change the max people limit | `MAX_PEOPLE` in `src/Pages/Stream.jsx` |
| change the password rule | `handleSubmit` in `src/Pages/SignUp.jsx` |
| change the max photo size | `MAX_SIZE_MB` in `src/Pages/Home.jsx` |
| add a form field | `<TextField id label value onChange error />` + a `useState` + a check in the submit function |
| add an icon | `import { Name } from "lucide-react"` → `<Name className="size-5" aria-hidden="true" />` (names on lucide.dev, written in PascalCase) |
| add a package | `npm install <name>`, then commit `package.json` + `package-lock.json` |
| change how all buttons look | `src/components/buttonStyles.js` (variants + sizes) |
| show a "saved" message | `const [toast, setToast] = useState("")` → `setToast("…")` → `<Toast message={toast} onDone={() => setToast("")} />` |
| add a popup | a `useState(false)` + a button that sets it to `true` + `<PopUp showPopUp closePopUp title>…</PopUp>` |
| update the PWA after a big change | bump `VERSION` in `public/sw.js` |

## 13. Not connected yet (TODO)

Search the code for `// TODO` to find every spot. Main ones:

- **Auth:** send sign in / sign up to the backend; go to `/home` only if it succeeds.
- **Profile:** save username, email and photos (backend must check username / email are not taken).
- **Rooms:** create / join for real, then go to the room's own URL (e.g. `/stream/abc123`); real room name, link, people and limit.
- **Stream:** start the Neko container and show its `<iframe>`; chat and emojis through WebSocket so everyone sees them; settings saved for everyone (host only).
- **Friends:** real lists, requests, and live online status (WebSocket).
- **Preview data** to remove when the backend arrives: the users, photos and messages at the top of `Home.jsx`, `Stream.jsx`, `Friends.jsx`.

### Frontend experience checklist (no backend needed)

- [x] **Sign out:** avatar menu in the top bar (Profile, Sign out)
- [x] **Sign in** button back in the landing page header
- [x] Auth illustration label says "profile" → change it (e.g. "Watch together")
- [x] **Focus trap** in `PopUp` + return focus to the opening button (keyboard users)
- [x] "Saved ✓" feedback after saving the profile / room settings
- [x] Consistent buttons (same corners, navy hover on navy buttons) → `Button` component
- [x] Stream: click a person → profile; confirm before "Leave room"
- [x] Chat / People tabs: arrow-key navigation
- [x] Phones: top bar no longer cramped (logo only), default cover keeps its logo visible

## 14. Docker

- **`Dockerfile`** (two steps):
  1. `node:24-alpine`: copy `package.json` + `package-lock.json`, `npm ci` (installs all packages), copy the code, `npm run build` → `dist/`.
  2. `nginx:alpine`: copy only `dist/` + `nginx.conf` → small image (~100 MB), no source code, no `node_modules`.
- **`nginx.conf`:** listens on **3000** (matches `docker-compose.yml`); `try_files $uri $uri/ /index.html` so every route works; long cache for built assets (their names change on every build).
- **`.dockerignore`:** keeps `node_modules`, `dist`, `.env` files and local notes out of the image.
- **Environment variables:** Vite puts `VITE_…` variables into the code **at build time**, so they must be passed as Docker build arguments (not via `env_file` at runtime).
- **`nginx.conf` + PWA:** `sw.js` is sent with `Cache-Control: no-cache` (browsers always get the newest service worker); `manifest.webmanifest` gets its correct type `application/manifest+json`.

### PWA (installable + offline)

- **`public/manifest.webmanifest`:** name, start page (`/home`), colors, icons → Chrome / Edge / Android show "Install app".
- **Icons:** `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` (logo in the safe center, for round phone icons), `apple-touch-icon.png` (iPhone). Rendered from `syncspace-logo.svg`.
- **`public/sw.js` (service worker):** pages = network first, offline → cached app; built files (`/assets/…`) = cache first (their names change on every build); never touches `/api` or WebSockets. Change `VERSION` to drop old caches.
- **Registered in `src/main.jsx`, production build only** (in `npm run dev` a cache would hide your changes). To test: `npm run build && npx vite preview`, or Docker.
- **`OfflineBanner`:** tells the user when the connection is lost.

## 15. How AI was used

As required by the subject, here is how AI (Claude) was used on the frontend:

- **Learning:** explanations of the subject, React, Tailwind, React Router, Docker, Git, and of each pattern listed in section 6.
- **Scaffolding and coding help:** setting up Vite + Tailwind, building pages from my design references (Dribbble / mockups), the popups, edit mode, chat, emoji panel, friends page, legal pages.
- **Fixing bugs:** e.g. icons hidden behind the cover (`z-index`), wrong image paths (case-sensitive file names), invalid Tailwind classes, HTML attributes in JSX (`class` → `className`), navigation that skipped form validation.
- **Cleanup:** removing unused files / packages / CSS, turning duplicated code into shared components, compressing images, writing the Dockerfile and this README.
- **Design system, UX and PWA:** the `Button` / `IconButton` / `Card` / `Badge` / `StatusDot` / `Tabs` / `Toast` / `Menu` components, the focus trap, the avatar menu, the `/design-system` page, the manifest and service worker.
- **Testing:** automated checks in headless Chrome and Firefox (screenshots, console errors, keyboard interactions, offline mode).
- **Assets:** profile pictures are CC0 avatars (DiceBear), not AI images.

I chose the designs, reviewed every change, and I can explain every file using the patterns in section 6.

## 16. Credits

- Preview avatars: [DiceBear](https://www.dicebear.com) "Lorelei" by Lisa Wischofsky, licensed **CC0 1.0**
- Icons: [Lucide](https://lucide.dev) (ISC license)

## 17. Changelog

- **Setup** — React + Vite project, Tailwind CSS v4, ESLint; theme with the logo colors (cream / navy / red), Helvetica + Times italic.
- **Landing page** — hero, feature rows, curved sections, connector line, footer with legal links; buttons lead to sign in.
- **Auth** — Sign in / Sign up with validation, password eye button, shared illustration panel, same card size on both pages.
- **Home / profile** — cover + avatar, edit mode (username, email, photos with pencil buttons), Create / Join room popups.
- **Stream / room** — header with room name, people and icon pill (invite link, settings, leave), VBrowser tab + player area, chat with emoji panel, People tab, settings popup (name + people limit).
- **Friends** — friends list with online status, profile popup, remove with confirmation, search + requests.
- **Legal & 404** — Privacy Policy, Terms of Service (real content), 404 page.
- **Docker** — multi-stage `Dockerfile`, `nginx.conf` (port 3000, routes work on refresh), `.dockerignore`.
- **Cleanup** — removed unused images, files, shadcn packages and CSS (0 npm vulnerabilities); shared components (`Logo`, `Avatar`, `TextField`, `PasswordField`, `AuthLayout`, `FeatureGrid`); fixed sign in / sign up navigating before validation; images compressed to WebP (≈ 5 MB → 0.5 MB).
- **Module status** — honest frontend status per module + plan (section 10).
- **UX review** — frontend experience checklist (section 13).
- **125% plan** — the 5 bonus points the frontend can deliver alone (section 10).
- **Docs** — this README; layout recipes (centering, wrappers, columns, scrolling, positioning) added to section 6.
- **Design system** — `Button`, `IconButton`, `Card`, `Badge`, `StatusDot`, `Tabs`, `Toast`, `Menu` components used on every page (consistent buttons: hover = darker same color); `/design-system` page.
- **UX fixes** — avatar menu with Sign out, Sign in on the landing page, focus trap in popups, "Saved" toasts, Stream profile popup + leave confirmation, tabs with arrow keys, phone top bar and cover fixes, auth panel label.
- **PWA** — manifest, icons, service worker, offline banner; nginx headers for `sw.js` and the manifest.
- **Testing** — Chrome: all pages, 0 console errors, 25 interaction checks, PWA installable + offline; Firefox: same rendering.
- **Languages (EN/FR/AR) tried then dropped** — not needed to validate the project.
