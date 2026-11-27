import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Globe, Info, Check, Share, Settings, LogOut } from "lucide-react";
import PopUp from "../components/PopUp";
import Logo from "../components/Logo";
import Avatar from "../components/Avatar";
import Button from "../components/Button";
import IconButton from "../components/IconButton";
import Toast from "../components/Toast";
import { TextField } from "../components/TextField";
import RoomSidebar from "../rooms/RoomSidebar";
import { participants } from "../rooms/previewRoom";
import { MAX_ROOM_NAME, roomNameLength, validRoomName } from "../rooms/roomName";

// TODO: replace with real data from the backend (room link, current user, participants, messages)
const ROOM_NAME = "Friday movie night";
const PEOPLE_LIMIT = 10;
const MAX_PEOPLE = 20; // highest limit the host can choose

function Stream() {
  const navigate = useNavigate();

  const [copied, setCopied] = useState(false);   // shows a checkmark after copying the invite link
  const copyTimer = useRef(null);
  useEffect(() => () => clearTimeout(copyTimer.current), []);
  const [started, setStarted] = useState(false); // VBrowser started or not
  const [toast, setToast] = useState("");        // "Room settings saved" message
  const [confirmLeave, setConfirmLeave] = useState(false); // "Leave this room?" popup

  // Room settings (what is shown on the page)
  const [roomName, setRoomName] = useState(ROOM_NAME);
  const [peopleLimit, setPeopleLimit] = useState(PEOPLE_LIMIT);
  // Settings popup: open/closed + what the user is typing (saved only when clicking Save)
  const [showSettings, setShowSettings] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftLimit, setDraftLimit] = useState("");
  const [settingsError, setSettingsError] = useState("");

  // The limit can't be lower than the number of people already in the room
  const minPeople = Math.max(2, participants.length);

  function openSettings() {
    setDraftName(roomName);
    setDraftLimit(String(peopleLimit));
    setSettingsError("");
    setShowSettings(true);
  }

  function closeSettings() {
    setShowSettings(false);
    setSettingsError("");
  }

  function saveSettings(event) {
    event.preventDefault(); // stop the browser from reloading the page

    // Frontend validation
    const name = draftName.trim();
    const limit = Number(draftLimit);
    if (!validRoomName(name)) {
      setSettingsError(`The room name needs ${roomNameLength}`);
      return;
    }
    if (!Number.isInteger(limit) || limit < minPeople || limit > MAX_PEOPLE) {
      setSettingsError(`The people limit must be a whole number from ${minPeople} to ${MAX_PEOPLE}`);
      return;
    }

    setRoomName(name);
    setPeopleLimit(limit);
    closeSettings();
    setToast("Room settings saved");
    // TODO: send { name, limit } to the backend so everyone in the room gets the new settings
  }

  // Copy the invite link (used by the share button in the header)
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.origin + window.location.pathname);
      setCopied(true);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setToast("Could not copy the invite link");
    }
  }

  // TODO: tell the backend you left the room
  function leaveRoom() {
    setConfirmLeave(false);
    navigate("/home");
  }

  return (
    <div className="flex min-h-screen flex-col lg:h-screen">
      {/* ===== HEADER: logo + room name left — people + share / settings / leave right ===== */}
      <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border px-4 md:px-6">
        {/* Left: logo + room name */}
        <div className="flex min-w-0 items-center gap-4">
          <Logo to="/home" compact />
          {/* Separator: thin vertical line between the logo and the room name */}
          <span className="hidden h-6 w-px shrink-0 bg-secondary/15 md:block" aria-hidden="true" />
          {/* The room name is the main title of the page; truncate cuts it with "…" if too long */}
          <h1 className="hidden truncate text-base font-medium text-secondary md:block">{roomName}</h1>
        </div>

        {/* Right: people + buttons */}
        <div className="flex shrink-0 items-center gap-3">
          {/* People: overlapping avatars (-space-x-2) + count — hidden on small screens */}
          <div className="hidden items-center gap-2 lg:flex">
            <div className="flex -space-x-2">
              {participants.map((p) => (
                <Avatar key={p.name} src={p.photo} name={p.name} className="size-8 text-xs ring-2 ring-background" />
              ))}
            </div>
            <span className="text-sm tabular-nums text-muted-foreground">{participants.length} of {peopleLimit}</span>
          </div>
          <span className="hidden h-6 w-px shrink-0 bg-secondary/15 lg:block" aria-hidden="true" />

          {/* Room actions: invite link, settings, leave */}
          <div className="flex items-center gap-1">
            {/* Invite link: copies the room link, then shows a checkmark for 2 seconds */}
            <IconButton label={copied ? "Invite link copied" : "Copy invite link"} onClick={copyLink}>
              {copied ? (
                <Check className="size-[18px] text-success" aria-hidden="true" />
              ) : (
                <Share className="size-[18px]" aria-hidden="true" />
              )}
            </IconButton>
            {/* Screen readers announce "Invite link copied" when it changes */}
            <span className="sr-only" aria-live="polite">{copied ? "Invite link copied" : ""}</span>

            <IconButton label="Room settings" onClick={openSettings}>
              <Settings className="size-[18px]" aria-hidden="true" />
            </IconButton>

            {/* Leave room → asks for confirmation first */}
            <IconButton label="Leave room" variant="danger" onClick={() => setConfirmLeave(true)}>
              <LogOut className="size-[18px]" aria-hidden="true" />
            </IconButton>
          </div>
        </div>
      </header>

      {/* ===== BODY: player column + chat column ===== */}
      <div className="grid flex-1 lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_22rem]">

        {/* ----- LEFT: player + status ----- */}
        <main className="flex min-w-0 flex-col gap-4 p-4 md:p-6 lg:min-h-0">

          {/* PLAYER — later this is where the Neko iframe goes */}
          <section aria-labelledby="vbrowser-title" className="flex min-w-0 flex-col lg:min-h-0 lg:flex-1">
            {/* Browser-style tab attached to the viewing area: same navy as the screen, so they read as one piece */}
            <h2 id="vbrowser-title" className="flex h-10 w-48 max-w-full shrink-0 items-center gap-2 rounded-t-xl bg-secondary px-4 text-sm font-medium text-white/80">
              <Globe className="size-4 shrink-0 text-white/60" aria-hidden="true" />
              Virtual browser
            </h2>
            {/* The screen: a soft light in the middle, like a TV in a dark room (one navy, two tones) */}
            <div className="relative flex aspect-video min-h-96 w-full min-w-0 items-center justify-center overflow-hidden rounded-2xl rounded-tl-none bg-secondary bg-[radial-gradient(ellipse_at_50%_45%,#17364D_0%,#0D2434_65%)] text-white lg:aspect-auto lg:min-h-0 lg:flex-1">
              {started ? (
                // TODO: replace this with the Neko iframe: <iframe src={nekoUrl} className="h-full w-full" allow="autoplay; fullscreen" />
                <p className="text-white/70">Starting the browser…</p>
              ) : (
                <div className="flex max-w-xl flex-col items-center px-6 text-center">
                  <h3 className="text-[32px] font-normal leading-[1.1] tracking-[-0.02em] md:text-[44px]">
                    Nothing on screen <span className="accent-word">yet</span>
                  </h3>
                  <p className="mt-4 max-w-md leading-relaxed text-white/70">
                    The host starts the virtual browser for everyone. Then open any site and watch in sync.
                  </p>
                  {/* TODO: ask the backend to start the Neko container for this room */}
                  <Button variant="primary" size="lg" onClick={() => setStarted(true)} className="mt-8">
                    Start the browser
                  </Button>
                </div>
              )}
            </div>
          </section>

          {/* Status bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[13px]">
            <p className="flex items-center gap-2 text-secondary">
              <span className="size-2 rounded-full bg-success" aria-hidden="true" />
              Room connected
            </p>
            <p className="flex items-center gap-1.5 text-muted-foreground">
              Browser control <span className="font-medium text-secondary">Host</span>
              <Info className="size-4" aria-label="Only the host can control the browser" />
            </p>
          </div>
        </main>

        {/* ----- RIGHT: Chat / People ----- */}
        <RoomSidebar />
      </div>

      {/* ===== ROOM SETTINGS POPUP (hidden until showSettings is true) ===== */}
      <PopUp showPopUp={showSettings} closePopUp={closeSettings} title="Room settings">
        {/* noValidate: we show our own error message instead of the browser's */}
        <form onSubmit={saveSettings} noValidate className="mt-6 flex flex-col gap-4">
          <TextField
            id="settings-room-name"
            label="Room name"
            maxLength={MAX_ROOM_NAME}
            value={draftName}
            onChange={setDraftName}
          />
          <TextField
            id="settings-people-limit"
            label="People limit"
            type="number"
            min={minPeople}
            max={MAX_PEOPLE}
            step={1}
            value={draftLimit}
            onChange={setDraftLimit}
            hint={`Between ${minPeople} and ${MAX_PEOPLE}. ${participants.length} people are in the room now.`}
          />

          {settingsError && (
            <p role="alert" className="text-[13px] text-destructive">{settingsError}</p>
          )}

          <Button type="submit" className="mt-1">Save</Button>
        </form>
      </PopUp>

      {/* ===== LEAVE CONFIRMATION POPUP ===== */}
      <PopUp showPopUp={confirmLeave} closePopUp={() => setConfirmLeave(false)} title="Leave this room?">
        <p className="mt-2 text-muted-foreground">You can come back later with the invite link</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="subtle" onClick={() => setConfirmLeave(false)}>Cancel</Button>
          <Button variant="danger" onClick={leaveRoom}>
            <LogOut className="size-4" aria-hidden="true" />
            Leave room
          </Button>
        </div>
      </PopUp>

      <Toast message={toast} onDone={() => setToast("")} />
    </div>
  );
}

export default Stream;
