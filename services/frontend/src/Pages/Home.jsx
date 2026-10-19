import { useState } from "react";
import { useNavigate } from "react-router";
import { UserRound, Plus, LogIn } from "lucide-react";
import defaultCover from "../assets/defaultCover.webp";
import PopUp from "../components/PopUp";
import AppNav from "../components/AppNav";
import Avatar from "../components/Avatar";
import { TextField } from "../components/TextField";
import yasserPhoto from "../assets/avatars/yasser.svg";


// TODO: replace with the real user from the backend (the one who signed in)
// photo = preview data only, so the UI looks complete before the backend exists
const INITIAL_USER = { username: "Yasser", email: "yasser@example.com", photo: yasserPhoto };

const MAX_SIZE_MB = 5;

// Pencil icon shown on the photos in edit mode
function PencilIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
  );
}

function Home() {
  // The saved profile (username + email)
  const [user, setUser] = useState(INITIAL_USER);
  // Saved photos: local preview URLs of uploaded images (null = use the default)
  const [avatar, setAvatar] = useState(null);
  const [cover, setCover] = useState(null);
  const [error, setError] = useState("");

  // ===== EDIT MODE =====
  // While editing, changes go into "drafts". Save applies them, Cancel throws them away.
  const [editing, setEditing] = useState(false);
  const [draftUsername, setDraftUsername] = useState("");
  const [draftEmail, setDraftEmail] = useState("");
  const [draftAvatar, setDraftAvatar] = useState(null); // null = photo not changed
  const [draftCover, setDraftCover] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({ username: "", email: "" });

  function startEditing() {
    setDraftUsername(user.username);
    setDraftEmail(user.email);
    setDraftAvatar(null);
    setDraftCover(null);
    setFieldErrors({ username: "", email: "" });
    setError("");
    setEditing(true);
  }

  function cancelEditing() {
    // Free the previews of photos that were picked but not saved
    if (draftAvatar) URL.revokeObjectURL(draftAvatar);
    if (draftCover) URL.revokeObjectURL(draftCover);
    setDraftAvatar(null);
    setDraftCover(null);
    setError("");
    setEditing(false);
  }

  function saveProfile(event) {
    event.preventDefault(); // stop the browser from reloading the page

    // Frontend validation
    const username = draftUsername.trim();
    const email = draftEmail.trim();
    const newErrors = {
      username: !/^[A-Za-z0-9_]{3,20}$/.test(username)
        ? "3 to 20 characters: letters, numbers and _ only."
        : "",
      email: !/^\S+@\S+\.\S+$/.test(email) ? "Please enter a valid email." : "",
    };
    setFieldErrors(newErrors);
    if (newErrors.username || newErrors.email) return;

    setUser({ ...user, username, email });
    // Apply the new photos (and free the old previews)
    if (draftAvatar) {
      if (avatar) URL.revokeObjectURL(avatar);
      setAvatar(draftAvatar);
    }
    if (draftCover) {
      if (cover) URL.revokeObjectURL(cover);
      setCover(draftCover);
    }
    setDraftAvatar(null);
    setDraftCover(null);
    setEditing(false);
    // TODO: send { username, email } and the new photos to the backend
  }

  // What is shown: the draft photo while editing (if one was picked), else the saved one
  const shownAvatar = (editing && draftAvatar) || avatar || user.photo;
  const shownCover = (editing && draftCover) || cover || defaultCover;

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
  const navigate = useNavigate();

  // Join Room popup: open/closed, what the user types, and the error message
  const [showPopUp, setShowPopUp] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [joinError, setJoinError] = useState("");

  function closeJoinPopUp() {
    setShowPopUp(false);
    setJoinError("");
  }

  // Called when the user clicks "Join" (or presses Enter in the input)
  function handleJoin(event) {
    event.preventDefault(); // stop the browser from reloading the page

    // Frontend validation: the field is required
    if (roomCode.trim() === "") {
      setJoinError("Please enter a room link or code.");
      return;
    }

    closeJoinPopUp();
    // TODO: send roomCode to the backend to check the room exists, then open that room
    navigate("/stream");
  }

  // Create Room popup: open/closed, the room name, and the error message
  const [showCreatePopUp, setShowCreatePopUp] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [createError, setCreateError] = useState("");

  function closeCreatePopUp() {
    setShowCreatePopUp(false);
    setCreateError("");
  }

  // Called when the user clicks "Create" (or presses Enter in the input)
  function handleCreate(event) {
    event.preventDefault(); // stop the browser from reloading the page

    // Frontend validation: name required, 3 to 40 characters
    const name = roomName.trim();
    if (name === "") {
      setCreateError("Please enter a room name.");
      return;
    }
    if (name.length < 3 || name.length > 40) {
      setCreateError("The room name must be between 3 and 40 characters.");
      return;
    }

    closeCreatePopUp();
    // TODO: send the room name to the backend to create the room, then open that room
    navigate("/stream");
  }

  return (

    <div className="min-h-screen">
      {/* ===== TOP BAR (shared with the Friends page): logo, Home / Friends links, avatar ===== */}
      <AppNav avatar={avatar ?? user.photo} name={user.username} />

      <main className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        {/* ===== PROFILE CARD ===== */}
        <section className="overflow-hidden rounded-2xl border border-accent bg-card shadow-sm">
          {/* Cover photo: the user's upload, or the default cover */}
          <div className="relative h-44 md:h-72">
            <img src={shownCover} alt="" className="h-full w-full object-cover" />

            {/* Edit mode only: pencil button to change the cover.
                The <label> is the visible button; the real file input is hidden inside it */}
            {editing && (
              <label className="absolute right-4 top-4 flex size-11 cursor-pointer items-center justify-center rounded-full bg-card text-secondary shadow-md hover:bg-accent focus-within:ring-2 focus-within:ring-ring">
                <PencilIcon className="size-5" />
                <span className="sr-only">Change cover photo</span>
                <input type="file" accept="image/*" className="sr-only" onChange={(e) => handleImage(e, setDraftCover)} />
              </label>
            )}
          </div>

          <div className="px-6 pb-8 md:px-10">
            <div className="flex flex-col gap-4 md:flex-row md:gap-8">
              {/* Big profile photo, overlapping the cover (negative margin-top) */}
              <div className="relative z-10 -mt-16 size-32 shrink-0 md:-mt-24 md:size-44">
                <Avatar
                  src={shownAvatar}
                  name={user.username}
                  className="size-full border-4 border-card text-5xl"
                />
                {/* Edit mode only: pencil button to change the profile photo */}
                {editing && (
                  <label className="absolute bottom-1 right-1 flex size-10 cursor-pointer items-center justify-center rounded-full border-2 border-card bg-secondary text-white shadow-md hover:bg-secondary-hover focus-within:ring-2 focus-within:ring-ring md:bottom-3 md:right-3">
                    <PencilIcon className="size-4" />
                    <span className="sr-only">Change profile photo</span>
                    <input type="file" accept="image/*" className="sr-only" onChange={(e) => handleImage(e, setDraftAvatar)} />
                  </label>
                )}
              </div>

              {/* A form, so pressing Enter in an input also saves */}
              <form onSubmit={saveProfile} noValidate className="flex-1 md:pt-5">
                {/* Title + Edit profile button */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-secondary md:text-3xl">
                      Welcome back, {user.username}
                    </h1>
                    <p className="mt-1 text-muted-foreground">Your space for watching together.</p>
                  </div>

                  {/* Not editing: "Edit profile". Editing: "Cancel" + "Save" */}
                  {editing ? (
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-secondary hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-white hover:bg-secondary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={startEditing}
                      className="flex w-fit shrink-0 items-center gap-2 rounded-lg border border-border py-2 pl-3 pr-4 text-sm font-medium text-secondary hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
                    >
                      <UserRound className="size-4" aria-hidden="true" />
                      Edit profile
                    </button>
                  )}
                </div>

                {/* Upload error (wrong type / too big) */}
                {error && (
                  <p role="alert" className="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {error}
                  </p>
                )}

                {/* Info: inputs in edit mode, plain text otherwise */}
                {editing ? (
                  <div className="mt-5 grid max-w-md gap-4 border-t border-border pt-5 text-sm">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="edit-username" className="font-medium text-muted-foreground">Username</label>
                      <input
                        id="edit-username"
                        type="text"
                        autoComplete="username"
                        maxLength={20}
                        value={draftUsername}
                        onChange={(e) => setDraftUsername(e.target.value)}
                        aria-invalid={fieldErrors.username ? "true" : "false"}
                        aria-describedby={fieldErrors.username ? "edit-username-error" : undefined}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-secondary outline-none focus-visible:ring-2 focus-visible:ring-ring aria-invalid:border-destructive"
                      />
                      {fieldErrors.username && (
                        <p id="edit-username-error" className="text-destructive">{fieldErrors.username}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="edit-email" className="font-medium text-muted-foreground">Email</label>
                      <input
                        id="edit-email"
                        type="email"
                        autoComplete="email"
                        value={draftEmail}
                        onChange={(e) => setDraftEmail(e.target.value)}
                        aria-invalid={fieldErrors.email ? "true" : "false"}
                        aria-describedby={fieldErrors.email ? "edit-email-error" : undefined}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-secondary outline-none focus-visible:ring-2 focus-visible:ring-ring aria-invalid:border-destructive"
                      />
                      {fieldErrors.email && (
                        <p id="edit-email-error" className="text-destructive">{fieldErrors.email}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <dl className="mt-5 grid max-w-md grid-cols-[7rem_1fr] gap-y-3 border-t border-border pt-5 text-sm">
                    <dt className="font-medium text-muted-foreground">Username</dt>
                    <dd className="text-secondary">{user.username}</dd>
                    <dt className="font-medium text-muted-foreground">Email</dt>
                    <dd className="truncate text-secondary">{user.email}</dd>
                  </dl>
                )}
              </form>
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
              {/* Opens the Create Room popup */}
              <button
                onClick={() => setShowCreatePopUp(true)}
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
                onClick={() => setShowPopUp(true)}
                type="button"
                className="mt-3 w-full max-w-60 rounded-lg border-2 border-secondary py-1.5 text-sm font-semibold text-secondary hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Join Room
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ===== JOIN ROOM POPUP (hidden until showPopUp is true) ===== */}
      <PopUp showPopUp={showPopUp} closePopUp={closeJoinPopUp} title="Join a room">
        <p className="mt-1 text-sm text-muted-foreground">
          Paste the invite link or enter the room code.
        </p>

        {/* noValidate: we show our own error message instead of the browser's */}
        <form onSubmit={handleJoin} noValidate className="mt-5 flex flex-col gap-3">
          <TextField
            id="room-code"
            label="Room link or code"
            autoFocus
            placeholder="e.g. https://syncspace.app/room/abc123"
            value={roomCode}
            onChange={setRoomCode}
            error={joinError}
          />

          <button
            type="submit"
            className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-secondary py-2.5 text-sm font-semibold text-white hover:bg-secondary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <LogIn className="size-4" aria-hidden="true" />
            Join
          </button>
        </form>
      </PopUp>

      {/* ===== CREATE ROOM POPUP (hidden until showCreatePopUp is true) ===== */}
      <PopUp showPopUp={showCreatePopUp} closePopUp={closeCreatePopUp} title="Create a room">
        <p className="mt-1 text-sm text-muted-foreground">
          Give your watch party a name, then invite your friends.
        </p>

        {/* noValidate: we show our own error message instead of the browser's */}
        <form onSubmit={handleCreate} noValidate className="mt-5 flex flex-col gap-3">
          <TextField
            id="room-name"
            label="Room name"
            autoFocus
            maxLength={40}
            placeholder="e.g. Friday movie night"
            value={roomName}
            onChange={setRoomName}
            error={createError}
          />

          <button
            type="submit"
            className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-secondary py-2.5 text-sm font-semibold text-white hover:bg-secondary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Plus className="size-4" aria-hidden="true" />
            Create
          </button>
        </form>
      </PopUp>
    </div>
  );
}

export default Home;
