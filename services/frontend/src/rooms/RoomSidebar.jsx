import { useEffect, useRef, useState } from "react";
import { Smile, SendHorizontal } from "lucide-react";
import PopUp from "../components/PopUp";
import Avatar from "../components/Avatar";
import Badge from "../components/Badge";
import IconButton from "../components/IconButton";
import StatusDot from "../components/StatusDot";
import { Tabs, TabPanel } from "../components/Tabs";
import { currentUser } from "../people/previewPeople";
import { participants } from "./previewRoom";

const firstMessages = [
  { id: 1, author: currentUser.name, text: "Ready for movie night?", time: "8:30 PM" },
  { id: 2, author: "Lina", text: "Ready when you are!", time: "8:31 PM" },
  { id: 3, author: "Adam", text: "Just joined!", time: "8:31 PM" },
];

// Emojis shown in the chat emoji panel — clicking one sends it right away
const EMOJIS = ["😂", "😍", "😮", "😢", "😡", "👍", "👏", "🔥", "🎉", "❤️", "🍿", "🎬"];

const findPerson = (name) => participants.find((p) => p.name === name);

export default function RoomSidebar() {
  const [tab, setTab] = useState("chat");        // "chat" or "people"
  const [messages, setMessages] = useState(firstMessages);
  const [newMessage, setNewMessage] = useState("");
  const [profile, setProfile] = useState(null);  // name of the person whose profile popup is open

  // Keep the chat scrolled to the newest message
  const chatEndRef = useRef(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, tab]);
  // Adds one message to the chat (used by the Send button AND the emoji panel)
  function addMessage(text) {
    const time = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    setMessages((previous) => [
      ...previous,
      { id: (previous.at(-1)?.id ?? 0) + 1, author: currentUser.name, text, time },
    ]);
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

  const profilePerson = profile ? findPerson(profile) : null;

  return (
    <>
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
    </>
  );
}
