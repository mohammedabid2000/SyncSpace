import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Globe, Info, Smile, SendHorizontal, Check } from "lucide-react";
import PopUp from "../components/PopUp";
import Logo from "../components/Logo";
import Avatar from "../components/Avatar";
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
  { name: "Yasser", host: true, photo: yasserPhoto },
  { name: "Lina", host: false, photo: linaPhoto },
  { name: "Adam", host: false, photo: adamPhoto },
];
const firstMessages = [
  { id: 1, author: "Yasser", text: "Ready for movie night?", time: "8:30 PM" },
  { id: 2, author: "Lina", text: "Ready when you are!", time: "8:31 PM" },
  { id: 3, author: "Adam", text: "Just joined!", time: "8:31 PM" },
];

// Emojis shown in the chat emoji panel — clicking one sends it right away
const EMOJIS = ["😂", "😍", "😮", "😢", "😡", "👍", "👏", "🔥", "🎉", "❤️", "🍿", "🎬"];

// Photo of a participant (undefined if they have none → Avatar shows the first letter)
const photoOf = (name) => participants.find((p) => p.name === name)?.photo;

function HostBadge() {
  return <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">Host</span>;
}

function Stream() {
  const navigate = useNavigate();

  const [copied, setCopied] = useState(false); // shows a checkmark after copying the invite link
  const [started, setStarted] = useState(false);         // VBrowser started or not
  const [tab, setTab] = useState("chat");                // "chat" or "people"
  const [messages, setMessages] = useState(firstMessages);
  const [newMessage, setNewMessage] = useState("");

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
      setSettingsError("The room name must be between 3 and 40 characters.");
      return;
    }
    if (!Number.isInteger(limit) || limit < minPeople || limit > MAX_PEOPLE) {
      setSettingsError(`The people limit must be a whole number between ${minPeople} and ${MAX_PEOPLE}.`);
      return;
    }

    setRoomName(name);
    setPeopleLimit(limit);
    closeSettings();
    // TODO: send { name, limit } to the backend so everyone in the room gets the new settings
  }

  // Keep the chat scrolled to the newest message
  const chatEndRef = useRef(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, tab]);

  // Copy the invite link (used by the link button in the header)
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

  const isHost = (name) => participants.some((p) => p.name === name && p.host);

  return (
    <div className="flex min-h-screen flex-col lg:h-screen">
      {/* ===== HEADER: logo left — settings + leave room right ===== */}
      <header className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
        {/* Left: logo + room name */}
        <div className="flex min-w-0 items-center gap-6">
          <Logo size="lg" to="/home" />
          {/* Separator: thin vertical line between the logo and the room name */}
          <span className="hidden h-8 w-px shrink-0 bg-secondary/20 md:block" aria-hidden="true" />
          {/* The room name is the main title of the page; truncate cuts it with "…" if too long */}
          <h1 className="hidden truncate text-xl font-semibold text-secondary md:block">{roomName}</h1>
        </div>

        {/* Right: people + buttons */}
        <div className="flex shrink-0 items-center gap-4">
        {/* People: overlapping avatars (-space-x-2) + count — hidden on small screens */}
        <div className="hidden items-center gap-2 lg:flex">
          <div className="flex -space-x-2">
            {participants.map((p) => (
              <Avatar key={p.name} src={p.photo} name={p.name} className="size-9 text-sm ring-2 ring-background" />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">{participants.length} / {peopleLimit} people</span>
        </div>

        {/* Pill wrapper with a red border around the icon buttons */}
        <div className="flex items-center gap-1 rounded-full border-2 border-primary p-1 shadow-md shadow-primary/30">
          {/* Invite link: copies the room link, then shows a checkmark for 2 seconds */}
          <button
            type="button"
            onClick={copyLink}
            aria-label={copied ? "Invite link copied" : "Copy invite link"}
            title={copied ? "Link copied!" : "Copy invite link"}
            className="flex size-10 items-center justify-center rounded-full text-secondary hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
          >
            {copied ? (
              <Check className="size-6 text-success" aria-hidden="true" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6" aria-hidden="true"><path d="M12 2v13"/><path d="m16 6-4-4-4 4"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/></svg>
            )}
          </button>
          {/* Screen readers announce "Invite link copied" when it changes */}
          <span className="sr-only" aria-live="polite">{copied ? "Invite link copied" : ""}</span>

          {/* Opens the room settings popup */}
          <button
            type="button"
            onClick={openSettings}
            aria-label="Room settings"
            className="flex size-10 items-center justify-center rounded-full text-secondary hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/></svg>
          </button>

          {/* Leave room → back to the home page */}
          <button
            type="button"
            onClick={() => navigate("/home")}
            aria-label="Leave room"
            className="flex size-10 items-center justify-center rounded-full text-secondary hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
            </svg>
          </button>
        </div>
        </div>
      </header>

      {/* ===== BODY: expanded player column + chat column ===== */}
      <div className="grid flex-1 lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_22rem]">

        {/* ----- LEFT: player + status ----- */}
        <main className="flex min-w-0 flex-col gap-4 p-4 md:p-6 lg:min-h-0">

          {/* PLAYER — later this is where the Neko iframe goes */}
          <section aria-labelledby="vbrowser-title" className="flex min-w-0 flex-col lg:min-h-0 lg:flex-1">
            {/* Browser-style tab attached to the viewing area.
                White + light navy border so it stands out from the cream page,
                no bottom border: the tab sits directly on the navy viewing area */}
            <h2 id="vbrowser-title" className="flex w-44 max-w-full shrink-0 items-center gap-2 rounded-t-xl border border-b-0 border-accent bg-card px-4 py-2.5 text-sm font-semibold text-secondary shadow-sm">
              <Globe className="size-4 shrink-0" aria-hidden="true" />
              VBrowser
            </h2>
            <div className="relative flex aspect-video min-h-96 w-full min-w-0 items-center justify-center overflow-hidden rounded-2xl rounded-tl-none bg-secondary text-white lg:aspect-auto lg:min-h-0 lg:flex-1">
              {started ? (
                // TODO: replace this with the Neko iframe: <iframe src={nekoUrl} className="h-full w-full" allow="autoplay; fullscreen" />
                <p className="text-white/70">Starting VBrowser…</p>
              ) : (
                <div className="flex max-w-md flex-col items-center gap-3 px-6 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-16 md:size-20" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                  <h3 className="text-2xl font-bold md:text-3xl">Your shared browser is ready to start</h3>
                  <p className="text-white/80">Start VBrowser to browse and watch together.</p>
                  {/* TODO: ask the backend to start the Neko container for this room */}
                  <button
                    type="button"
                    onClick={() => setStarted(true)}
                    className="mt-2 rounded-lg bg-primary px-8 py-3 font-semibold hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    Start VBrowser
                  </button>
                  <p className="text-sm text-white/70">The host starts the browser for everyone.</p>
                </div>
              )}
            </div>
          </section>

          {/* Status bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <p className="flex items-center gap-2 text-secondary">
              <span className="size-2.5 rounded-full bg-success" aria-hidden="true" />
              Room connected
            </p>
            <p className="flex items-center gap-1.5 text-muted-foreground">
              Browser control: <strong className="text-secondary">Host</strong>
              <Info className="size-4" aria-label="Only the host can control the browser" />
            </p>
          </div>
        </main>

        {/* ----- RIGHT: Chat / People ----- */}
        <aside className="flex h-[32rem] flex-col border-t border-border bg-card lg:h-auto lg:min-h-0 lg:border-l lg:border-t-0">
            {/* Tabs */}
            <div role="tablist" className="flex border-b border-border px-4">
              {[
                { id: "chat", label: "Chat" },
                { id: "people", label: `People (${participants.length})` },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={`-mb-px border-b-2 px-4 py-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-ring ${
                    tab === t.id ? "border-primary text-secondary" : "border-transparent text-muted-foreground hover:text-secondary"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {tab === "chat" ? (
              <>
                {/* Messages */}
                <ul className="flex-1 space-y-5 overflow-y-auto p-4">
                  {messages.map((m) => (
                    <li key={m.id} className="flex gap-3">
                      <Avatar src={photoOf(m.author)} name={m.author} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-secondary">{m.author}</span>
                          {isHost(m.author) && <HostBadge />}
                          <span className="ml-auto text-xs text-muted-foreground">{m.time}</span>
                        </div>
                        <p className="mt-1 w-fit max-w-full break-words rounded-xl bg-background px-3 py-2 text-sm text-secondary">
                          {m.text}
                        </p>
                      </div>
                    </li>
                  ))}
                  <li ref={chatEndRef} aria-hidden="true" />
                </ul>

                {/* Message input */}
                <form onSubmit={sendMessage} className="flex items-center gap-2 border-t border-border p-4">
                  <div className="flex flex-1 items-center rounded-xl border border-input bg-background pr-2 focus-within:ring-2 focus-within:ring-ring">
                    <label htmlFor="chat-message" className="sr-only">Message</label>
                    <input
                      id="chat-message"
                      type="text"
                      placeholder="Send a message…"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm outline-none"
                    />
                    {/* Emoji button + panel. The panel floats ABOVE the input (bottom-full) */}
                    <div ref={emojiPanelRef} className="relative">
                      <button
                        type="button"
                        onClick={() => setShowEmojis(!showEmojis)}
                        aria-label="Send an emoji"
                        aria-expanded={showEmojis}
                        aria-controls="emoji-panel"
                        className={`rounded-md p-1 hover:text-secondary focus-visible:outline-2 focus-visible:outline-ring ${showEmojis ? "text-secondary" : "text-muted-foreground"}`}
                      >
                        <Smile className="size-5" aria-hidden="true" />
                      </button>

                      {showEmojis && (
                        <div
                          id="emoji-panel"
                          role="group"
                          aria-label="Emojis"
                          className="absolute bottom-full right-0 z-20 mb-3 grid w-60 grid-cols-6 gap-1 rounded-xl border border-accent bg-card p-2 shadow-lg"
                        >
                          {EMOJIS.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => sendEmoji(emoji)}
                              aria-label={`Send ${emoji}`}
                              className="flex size-9 items-center justify-center rounded-lg text-xl hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    type="submit"
                    aria-label="Send message"
                    className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <SendHorizontal className="size-5" aria-hidden="true" />
                  </button>
                </form>
              </>
            ) : (
              /* People list */
              <ul className="flex-1 space-y-4 overflow-y-auto p-4">
                {participants.map((p) => (
                  <li key={p.name} className="flex items-center gap-3">
                    <Avatar src={p.photo} name={p.name} />
                    <span className="font-semibold text-secondary">{p.name}</span>
                    {p.host && <HostBadge />}
                    <span className="ml-auto size-2.5 rounded-full bg-success" aria-label="Online" />
                  </li>
                ))}
              </ul>
            )}
        </aside>
      </div>

      {/* ===== ROOM SETTINGS POPUP (hidden until showSettings is true) ===== */}
      <PopUp showPopUp={showSettings} closePopUp={closeSettings} title="Room settings">
        {/* noValidate: we show our own error message instead of the browser's */}
        <form onSubmit={saveSettings} noValidate className="mt-5 flex flex-col gap-4">
          <TextField
            id="settings-room-name"
            label="Room name"
            autoFocus
            maxLength={40}
            value={draftName}
            onChange={setDraftName}
          />

          {/* People limit */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="settings-people-limit" className="text-sm font-medium text-secondary">
              People limit
            </label>
            <input
              id="settings-people-limit"
              type="number"
              min={minPeople}
              max={MAX_PEOPLE}
              step={1}
              value={draftLimit}
              onChange={(e) => setDraftLimit(e.target.value)}
              aria-describedby="people-limit-hint"
              className="w-32 rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <p id="people-limit-hint" className="text-xs text-muted-foreground">
              Between {minPeople} and {MAX_PEOPLE}. {participants.length} people are in the room now.
            </p>
          </div>

          {settingsError && (
            <p role="alert" className="text-sm text-destructive">{settingsError}</p>
          )}

          <button
            type="submit"
            className="mt-1 rounded-lg bg-secondary py-2.5 text-sm font-semibold text-white hover:bg-secondary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Save
          </button>
        </form>
      </PopUp>
    </div>
  );
}

export default Stream;
