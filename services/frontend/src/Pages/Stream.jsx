import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Globe, Info, Smile, SendHorizontal, Check, Share, Settings, LogOut } from "lucide-react";
import PopUp from "../components/PopUp";
import Logo from "../components/Logo";
import Avatar from "../components/Avatar";
import Badge from "../components/Badge";
import Button from "../components/Button";
import IconButton from "../components/IconButton";
import StatusDot from "../components/StatusDot";
import Toast from "../components/Toast";
import { Tabs, TabPanel } from "../components/Tabs";
import { TextField } from "../components/TextField";
import yasserPhoto from "../assets/avatars/yasser.svg";
import linaPhoto from "../assets/avatars/lina.svg";
import adamPhoto from "../assets/avatars/adam.svg";

// TODO: replace with real data from the backend (room link, current user, participants, messages)
const ROOM_NAME = "Friday movie night";
const PEOPLE_LIMIT = 10;
const MAX_PEOPLE = 20; // highest limit the host can choose
const ROOM_LINK = `${window.location.origin}/stream`;
const CURRENT_USER = "Yasser";
// photo = preview data only, so the UI looks complete before the backend exists
const participants = [
  { name: "Yasser", host: true, photo: yasserPhoto, online: true },
  { name: "Lina", host: false, photo: linaPhoto, online: true },
  { name: "Adam", host: false, photo: adamPhoto, online: true },
];
const firstMessages = [
  { id: 1, author: "Yasser", text: "Ready for movie night?", time: "8:30 PM" },
  { id: 2, author: "Lina", text: "Ready when you are!", time: "8:31 PM" },
  { id: 3, author: "Adam", text: "Just joined!", time: "8:31 PM" },
];

// Emojis shown in the chat emoji panel — clicking one sends it right away
const EMOJIS = ["😂", "😍", "😮", "😢", "😡", "👍", "👏", "🔥", "🎉", "❤️", "🍿", "🎬"];

const findPerson = (name) => participants.find((p) => p.name === name);

function Stream() {
  const navigate = useNavigate();

  const [copied, setCopied] = useState(false);   // shows a checkmark after copying the invite link
  const [started, setStarted] = useState(false); // VBrowser started or not
  const [tab, setTab] = useState("chat");        // "chat" or "people"
  const [messages, setMessages] = useState(firstMessages);
  const [newMessage, setNewMessage] = useState("");
  const [toast, setToast] = useState("");        // "Room settings saved" message
  const [profile, setProfile] = useState(null);  // name of the person whose profile popup is open
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
    if (name.length < 3 || name.length > 40) {
      setSettingsError("The room name needs 3 to 40 characters");
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

  // Keep the chat scrolled to the newest message
  const chatEndRef = useRef(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, tab]);

  // Copy the invite link (used by the share button in the header)
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(ROOM_LINK);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not allowed (e.g. not HTTPS)
    }
  }

  // Adds one message to the chat (used by the Send button AND the emoji panel)
  function addMessage(text) {
    const time = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    setMessages((previous) => [...previous, { id: Date.now(), author: CURRENT_USER, text, time }]);
    // TODO: send the message to the backend (WebSocket) so everyone in the room sees it
  }

  function sendMessage(event) {
    event.preventDefault();
    const text = newMessage.trim();
    if (text === "") return; // don't send empty messages
    addMessage(text);
    setNewMessage("");
  }

  // Emoji panel: open/closed. Clicking an emoji sends it immediately and closes the panel
  const [showEmojis, setShowEmojis] = useState(false);
  const emojiPanelRef = useRef(null);

  function sendEmoji(emoji) {
    addMessage(emoji);
    setShowEmojis(false);
  }

  // Close the emoji panel with Escape, or when clicking anywhere outside it
  useEffect(() => {
    if (!showEmojis) return;
    function handleKey(event) {
      if (event.key === "Escape") setShowEmojis(false);
    }
    function handleClickOutside(event) {
      if (emojiPanelRef.current && !emojiPanelRef.current.contains(event.target)) setShowEmojis(false);
    }
    document.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojis]);

  // TODO: tell the backend you left the room
  function leaveRoom() {
    setConfirmLeave(false);
    navigate("/home");
  }

  const profilePerson = profile ? findPerson(profile) : null;

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
        <aside className="flex h-[32rem] flex-col border-t border-border bg-card lg:h-auto lg:min-h-0 lg:border-l lg:border-t-0">
          {/* Tabs: click, or use the ← → keys */}
          <Tabs
            idPrefix="room"
            value={tab}
            onChange={setTab}
            className="px-4"
            tabs={[
              { id: "chat", label: "Chat" },
              { id: "people", label: "People", count: participants.length },
            ]}
          />

          {tab === "chat" ? (
            <TabPanel idPrefix="room" id="chat" className="flex min-h-0 flex-1 flex-col">
              {/* Messages */}
              <ul className="flex-1 space-y-4 overflow-y-auto p-4">
                {messages.map((m) => (
                  <li key={m.id} className="flex gap-3">
                    <Avatar src={findPerson(m.author)?.photo} name={m.author} className="size-9 text-sm" />
                    <div className="min-w-0 flex-1">
                      <div className="flex h-5 items-center gap-2">
                        <span className="text-sm font-medium text-secondary">{m.author}</span>
                        {findPerson(m.author)?.host && <Badge>Host</Badge>}
                        <span className="ml-auto text-xs tabular-nums text-muted-foreground">{m.time}</span>
                      </div>
                      <p className="mt-1 w-fit max-w-full break-words rounded-xl rounded-tl-[4px] bg-background px-3 py-2 text-sm text-secondary">
                        {m.text}
                      </p>
                    </div>
                  </li>
                ))}
                <li ref={chatEndRef} aria-hidden="true" />
              </ul>

              {/* Message input */}
              <form onSubmit={sendMessage} className="flex items-center gap-2 border-t border-border p-4">
                <div className="flex h-11 flex-1 items-center rounded-xl border border-input bg-background pr-2 transition-colors duration-150 focus-within:border-secondary/40 focus-within:ring-2 focus-within:ring-ring/20">
                  <label htmlFor="chat-message" className="sr-only">Message</label>
                  <input
                    id="chat-message"
                    type="text"
                    placeholder="Message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-secondary outline-none placeholder:text-muted-foreground/80"
                  />
                  {/* Emoji button + panel. The panel floats ABOVE the input (bottom-full) */}
                  <div ref={emojiPanelRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setShowEmojis(!showEmojis)}
                      aria-label="Send an emoji"
                      aria-expanded={showEmojis}
                      aria-controls="emoji-panel"
                      className={`flex size-8 items-center justify-center rounded-lg transition-colors duration-150 hover:text-secondary focus-visible:outline-2 focus-visible:outline-ring ${showEmojis ? "text-secondary" : "text-muted-foreground"}`}
                    >
                      <Smile className="size-[18px]" aria-hidden="true" />
                    </button>

                    {showEmojis && (
                      <div
                        id="emoji-panel"
                        role="group"
                        aria-label="Emojis"
                        className="animate-pop absolute bottom-full right-0 z-20 mb-3 grid w-60 grid-cols-6 gap-1 rounded-xl border border-border bg-card p-1.5 shadow-[0_8px_24px_rgb(13_36_52/10%)]"
                      >
                        {EMOJIS.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => sendEmoji(emoji)}
                            aria-label={`Send ${emoji}`}
                            className="flex size-9 items-center justify-center rounded-lg text-xl transition-colors duration-150 hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <IconButton type="submit" label="Send message" variant="solid" size="lg">
                  <SendHorizontal className="size-[18px]" aria-hidden="true" />
                </IconButton>
              </form>
            </TabPanel>
          ) : (
            <TabPanel idPrefix="room" id="people" className="min-h-0 flex-1 overflow-y-auto p-4">
              {/* People list — click a person to see their profile */}
              <ul className="space-y-0.5">
                {participants.map((p) => (
                  <li key={p.name}>
                    <button
                      type="button"
                      onClick={() => setProfile(p.name)}
                      aria-label={`View ${p.name}'s profile`}
                      className="flex h-12 w-full items-center gap-3 rounded-lg px-2 text-left transition-colors duration-150 hover:bg-background focus-visible:outline-2 focus-visible:outline-ring"
                    >
                      <Avatar src={p.photo} name={p.name} className="size-9 text-sm" />
                      <span className="text-sm font-medium text-secondary">{p.name}</span>
                      {p.host && <Badge>Host</Badge>}
                      <span className="ml-auto">
                        <StatusDot online={p.online} showText={false} />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </TabPanel>
          )}
        </aside>
      </div>

      {/* ===== ROOM SETTINGS POPUP (hidden until showSettings is true) ===== */}
      <PopUp showPopUp={showSettings} closePopUp={closeSettings} title="Room settings">
        {/* noValidate: we show our own error message instead of the browser's */}
        <form onSubmit={saveSettings} noValidate className="mt-6 flex flex-col gap-4">
          <TextField
            id="settings-room-name"
            label="Room name"
            maxLength={40}
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

      {/* ===== PERSON PROFILE POPUP (click someone in the People tab) ===== */}
      <PopUp showPopUp={profilePerson !== null} closePopUp={() => setProfile(null)} title="Profile">
        {profilePerson && (
          <div className="mt-5 flex flex-col items-center gap-2 text-center">
            <Avatar src={profilePerson.photo} name={profilePerson.name} className="size-24 text-3xl" />
            <p className="mt-2 flex items-center gap-2 text-xl font-medium text-secondary">
              {profilePerson.name}
              {profilePerson.host && <Badge>Host</Badge>}
            </p>
            <StatusDot online={profilePerson.online} />
          </div>
        )}
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
