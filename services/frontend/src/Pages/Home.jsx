import { useState } from "react";
import { Link } from "react-router";
import { ImageIcon, UserRound, Plus, LogIn } from "lucide-react";
import defaultCover from "../assets/defaultCover.webp";

// TODO: replace with the real user from the backend (the one who signed in)
const user = { username: "Yasser", email: "yasser@example.com" };

const MAX_SIZE_MB = 5;

// Profile photo, or the first letter of the username if there's none (default avatar).
// Used twice: small in the top bar, big in the profile card.
function Avatar({ src, letter, className }) {
  return src ? (
    <img src={src} alt="" className={`rounded-full object-cover ${className}`} />
  ) : (
    <div className={`flex items-center justify-center rounded-full bg-primary font-bold uppercase text-white ${className}`}>
      {letter}
    </div>
  );
}

function Home() {
  // Local preview URLs of the chosen images (null = no image yet)
  const [avatar, setAvatar] = useState(null);
  const [cover, setCover] = useState(null);
  const [error, setError] = useState("");

  // Shared by both uploads: checks the file, then shows a preview
  function handleImage(event, setImage) {
    const file = event.target.files[0];
    event.target.value = ""; // lets the user pick the same file again later
    if (!file) return;

    // Frontend validation: type and size
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (JPG, PNG or WebP).");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`The image must be smaller than ${MAX_SIZE_MB} MB.`);
      return;
    }

    setError("");
    // Show the new image right away (and free the old preview)
    setImage((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return URL.createObjectURL(file);
    });
    // TODO: upload the file to the backend
  }

  return (
    <div className="min-h-screen">
      {/* ===== TOP BAR: logo left, "Home" + small avatar right ===== */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center gap-2">
            <img src="/syncspace-logo.svg" alt="" className="h-9 w-auto" />
            <span className="text-2xl font-bold tracking-tight text-secondary">SyncSpace</span>
          </Link>

          <nav className="flex items-center gap-6">
            {/* Current page: underlined */}
            <Link to="/home" aria-current="page" className="border-b-2 border-secondary py-1 text-sm font-medium text-secondary">
              Home
            </Link>
            <Avatar src={avatar} letter={user.username[0]} className="size-10 text-sm" />
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        {/* ===== PROFILE CARD ===== */}
        <section className="overflow-hidden rounded-2xl border border-accent bg-card shadow-sm">
          {/* Cover photo: the user's upload, or the default green cover */}
          <div className="relative h-44 md:h-72">
            <img src={cover ?? defaultCover} alt="" className="h-full w-full object-cover" />

            {/* The <label> is the visible button; the real file input is hidden inside it */}
            <label className="absolute right-4 top-4 flex cursor-pointer items-center gap-2 rounded-lg bg-secondary/90 py-2 pl-3 pr-4 text-sm font-medium text-white hover:bg-secondary focus-within:ring-2 focus-within:ring-white">
              <ImageIcon className="size-4" aria-hidden="true" />
              Edit cover
              <input type="file" accept="image/*" className="sr-only" onChange={(e) => handleImage(e, setCover)} />
            </label>
          </div>

          <div className="px-6 pb-8 md:px-10">
            <div className="flex flex-col gap-4 md:flex-row md:gap-8">
              {/* Big profile photo, overlapping the cover (negative margin-top) */}
              <Avatar
                src={avatar}
                letter={user.username[0]}
                className="relative z-10 -mt-16 size-32 shrink-0 border-4 border-card text-5xl md:-mt-24 md:size-44"
              />

              <div className="flex-1 md:pt-5">
                {/* Title + Edit profile button */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-secondary md:text-3xl">
                      Welcome back, {user.username}
                    </h1>
                    <p className="mt-1 text-muted-foreground">Your space for watching together.</p>
                  </div>

                  {/* Edit profile = change the profile photo */}
                  <label className="flex w-fit shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-border py-2 pl-3 pr-4 text-sm font-medium text-secondary hover:bg-accent focus-within:ring-2 focus-within:ring-ring">
                    <UserRound className="size-4" aria-hidden="true" />
                    Edit profile
                    <input type="file" accept="image/*" className="sr-only" onChange={(e) => handleImage(e, setAvatar)} />
                  </label>
                </div>

                {/* Upload error (wrong type / too big) */}
                {error && (
                  <p role="alert" className="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {error}
                  </p>
                )}

                {/* Info — read only (what the user entered when signing up) */}
                <dl className="mt-5 grid max-w-md grid-cols-[7rem_1fr] gap-y-3 border-t border-border pt-5 text-sm">
                  <dt className="font-medium text-muted-foreground">Username</dt>
                  <dd className="text-secondary">{user.username}</dd>
                  <dt className="font-medium text-muted-foreground">Email</dt>
                  <dd className="truncate text-secondary">{user.email}</dd>
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* ===== READY TO WATCH ===== */}
        <section className="mx-auto mt-12 max-w-5xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-secondary">Ready to watch?</h2>
          <p className="mt-2 text-muted-foreground">
            Create a room to invite others or join with a code to watch together.
          </p>

          {/* 2 cards side by side on desktop, stacked on phones */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {/* Create Room — navy card */}
            <div className="flex flex-col items-center gap-1 rounded-2xl bg-secondary px-6 py-5 text-white">
              <div className="flex size-10 items-center justify-center rounded-full bg-white/10">
                <Plus className="size-5" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">Create Room</h3>
              <p className="text-white/80">Start a new watch party and invite your friends.</p>
              {/* TODO: go to the create room page */}
              <button
                type="button"
                className="mt-3 w-full max-w-60 rounded-lg bg-white py-2 text-sm font-semibold text-secondary hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Create Room
              </button>
            </div>

            {/* Join Room — white card */}
            <div className="flex flex-col items-center gap-1 rounded-2xl border border-accent bg-card px-6 py-5 shadow-sm">
              <div className="flex size-10 items-center justify-center rounded-full bg-accent text-secondary">
                <LogIn className="size-5" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-secondary">Join Room</h3>
              <p className="text-muted-foreground">Enter a room code to join a watch party.</p>
              {/* TODO: open the "enter room code" form */}
              <button
                type="button"
                className="mt-3 w-full max-w-60 rounded-lg border-2 border-secondary py-1.5 text-sm font-semibold text-secondary hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Join Room
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
