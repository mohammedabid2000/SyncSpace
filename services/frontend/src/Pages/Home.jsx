import { useState } from "react";
import { useNavigate } from "react-router";
import { UserRound, Plus, LogIn, Pencil } from "lucide-react";
import defaultCover from "../assets/defaultCover.webp";
import PopUp from "../components/PopUp";
import AppNav from "../components/AppNav";
import Avatar from "../components/Avatar";
import { TextField } from "../components/TextField";
import Button from "../components/Button";
import Card from "../components/Card";
import Toast from "../components/Toast";
import yasserPhoto from "../assets/avatars/yasser.svg";


// TODO: replace with the real user from the backend (the one who signed in)
// photo = preview data only, so the UI looks complete before the backend exists
const INITIAL_USER = { username: "Yasser", email: "yasser@example.com", photo: yasserPhoto };

const MAX_SIZE_MB = 5;

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
  const [toast, setToast] = useState(""); // "Profile saved" message after Save

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
        ? "3 to 20 characters: letters, numbers and _ only"
        : "",
      email: !/^\S+@\S+\.\S+$/.test(email) ? "Enter a valid email" : "",
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
    setToast("Profile saved");
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
      setError("Choose an image file (JPG, PNG or WebP)");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`The image must be smaller than ${MAX_SIZE_MB} MB`);
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
      setJoinError("Enter a room link or code");
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
      setCreateError("Enter a room name");
      return;
    }
    if (name.length < 3 || name.length > 40) {
      setCreateError("Use 3 to 40 characters");
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

      <main className="mx-auto max-w-6xl px-4 pt-6 pb-16 md:px-6 md:pt-8">
        {/* ===== PROFILE CARD ===== */}
        <Card as="section" className="overflow-hidden">
          {/* Cover photo: the user's upload, or the default cover */}
          <div className="relative h-44 md:h-72">
            {/* object-right: the default cover has its logo on the right, keep it visible on narrow screens */}
            <img src={shownCover} alt="" className={`h-full w-full object-cover ${shownCover === defaultCover ? "object-right" : ""}`} />

            {/* Edit mode only: pencil button to change the cover.
                The <label> is the visible button; the real file input is hidden inside it */}
            {editing && (
              <label className="absolute right-4 top-4 flex size-10 cursor-pointer items-center justify-center rounded-full bg-card text-secondary shadow-[0_2px_8px_rgb(13_36_52/16%)] transition-colors duration-150 hover:bg-accent focus-within:ring-2 focus-within:ring-ring">
                <Pencil className="size-[18px]" aria-hidden="true" />
                <span className="sr-only">Change cover photo</span>
                <input type="file" accept="image/*" className="sr-only" onChange={(e) => handleImage(e, setDraftCover)} />
              </label>
            )}
          </div>

          <div className="px-6 pb-8 md:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:gap-8">
              {/* Big profile photo, overlapping the cover (negative margin-top) */}
              <div className="relative z-10 -mt-16 size-32 shrink-0 md:-mt-20 md:size-40">
                <Avatar
                  src={shownAvatar}
                  name={user.username}
                  className="size-full border-4 border-card text-5xl"
                />
                {/* Edit mode only: pencil button to change the profile photo */}
                {editing && (
                  <label className="absolute bottom-1 right-1 flex size-10 cursor-pointer items-center justify-center rounded-full border-2 border-card bg-secondary text-white transition-colors duration-150 hover:bg-secondary-hover focus-within:ring-2 focus-within:ring-ring md:bottom-2 md:right-2">
                    <Pencil className="size-4" aria-hidden="true" />
                    <span className="sr-only">Change profile photo</span>
                    <input type="file" accept="image/*" className="sr-only" onChange={(e) => handleImage(e, setDraftAvatar)} />
                  </label>
                )}
              </div>

              {/* A form, so pressing Enter in an input also saves */}
              <form onSubmit={saveProfile} noValidate className="min-w-0 flex-1 md:pt-6">
                {/* Title + Edit profile button */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h1 className="truncate text-[28px] font-medium leading-tight tracking-[-0.01em] text-secondary md:text-[32px]">
                      {user.username}
                    </h1>
                    <p className="mt-1 truncate text-muted-foreground">{user.email}</p>
                  </div>

                  {/* Not editing: "Edit profile". Editing: "Cancel" + "Save" */}
                  {editing ? (
                    <div className="flex shrink-0 gap-2">
                      <Button variant="subtle" onClick={cancelEditing}>Cancel</Button>
                      <Button type="submit">Save</Button>
                    </div>
                  ) : (
                    <Button variant="subtle" onClick={startEditing} className="w-fit shrink-0">
                      <UserRound className="size-4" aria-hidden="true" />
                      Edit profile
                    </Button>
                  )}
                </div>

                {/* Upload error (wrong type / too big) */}
                {error && (
                  <p role="alert" className="mt-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {error}
                  </p>
                )}

                {/* Edit mode: the inputs (the name and email are shown in the title otherwise) */}
                {editing && (
                  <div className="mt-6 grid max-w-md gap-4 border-t border-border pt-6">
                    <TextField
                      id="edit-username"
                      label="Username"
                      autoComplete="username"
                      maxLength={20}
                      value={draftUsername}
                      onChange={setDraftUsername}
                      error={fieldErrors.username}
                    />
                    <TextField
                      id="edit-email"
                      label="Email"
                      type="email"
                      autoComplete="email"
                      value={draftEmail}
                      onChange={setDraftEmail}
                      error={fieldErrors.email}
                    />
                  </div>
                )}
              </form>
            </div>
          </div>
        </Card>

        {/* ===== WATCH TOGETHER: create (wide, navy) | join (narrow, white) ===== */}
        <section aria-labelledby="watch-title" className="mt-12">
          <h2 id="watch-title" className="text-2xl font-medium tracking-[-0.01em] text-secondary">Watch together</h2>
          <p className="mt-1 text-muted-foreground">
            Create a room to invite friends, or join one with a code
          </p>

          {/* Stacked on phones, 3:2 on desktop */}
          <div className="mt-6 grid gap-4 md:grid-cols-[3fr_2fr]">
            <div className="flex flex-col items-start rounded-2xl bg-secondary p-6 text-white md:p-8">
              <h3 className="text-xl font-medium">Start a room</h3>
              <p className="mt-1 text-white/70">Pick a name, then send the invite link to your friends</p>
              {/* Opens the Create Room popup */}
              <Button variant="light" onClick={() => setShowCreatePopUp(true)} className="mt-6">
                <Plus className="size-4" aria-hidden="true" />
                Create room
              </Button>
            </div>

            <Card className="flex flex-col items-start p-6 md:p-8">
              <h3 className="text-xl font-medium text-secondary">Join a room</h3>
              <p className="mt-1 text-muted-foreground">Paste an invite link or a room code</p>
              {/* Opens the Join Room popup */}
              <Button variant="outline" onClick={() => setShowPopUp(true)} className="mt-6">
                <LogIn className="size-4" aria-hidden="true" />
                Join room
              </Button>
            </Card>
          </div>
        </section>
      </main>

      {/* ===== JOIN ROOM POPUP (hidden until showPopUp is true) ===== */}
      <PopUp showPopUp={showPopUp} closePopUp={closeJoinPopUp} title="Join a room">
        <p className="mt-1 text-sm text-muted-foreground">
          Paste the invite link or enter the room code
        </p>

        {/* noValidate: we show our own error message instead of the browser's */}
        <form onSubmit={handleJoin} noValidate className="mt-6 flex flex-col gap-4">
          <TextField
            id="room-code"
            label="Room link or code"
            placeholder="e.g. https://syncspace.app/room/abc123"
            value={roomCode}
            onChange={setRoomCode}
            error={joinError}
          />

          <Button type="submit" className="mt-1">
            <LogIn className="size-4" aria-hidden="true" />
            Join
          </Button>
        </form>
      </PopUp>

      {/* ===== CREATE ROOM POPUP (hidden until showCreatePopUp is true) ===== */}
      <PopUp showPopUp={showCreatePopUp} closePopUp={closeCreatePopUp} title="Create a room">
        <p className="mt-1 text-sm text-muted-foreground">
          Give your watch party a name, then invite your friends
        </p>

        {/* noValidate: we show our own error message instead of the browser's */}
        <form onSubmit={handleCreate} noValidate className="mt-6 flex flex-col gap-4">
          <TextField
            id="room-name"
            label="Room name"
            maxLength={40}
            placeholder="e.g. Friday movie night"
            value={roomName}
            onChange={setRoomName}
            error={createError}
          />

          <Button type="submit" className="mt-1">
            <Plus className="size-4" aria-hidden="true" />
            Create
          </Button>
        </form>
      </PopUp>

      <Toast message={toast} onDone={() => setToast("")} />
    </div>
  );
}

export default Home;
