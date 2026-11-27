import { useEffect, useRef, useState } from "react";
import { Link, useOutletContext, useSearchParams } from "react-router";
import { ChevronLeft, MessageCircle, SendHorizontal } from "lucide-react";
import AppNav from "../components/AppNav";
import Avatar from "../components/Avatar";
import Card from "../components/Card";
import IconButton from "../components/IconButton";
import StatusDot from "../components/StatusDot";
import { findUser } from "../people/previewPeople";

const focusRing = "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring";

function Conversation({ friend, messages, onSend, className }) {
  const [draft, setDraft] = useState("");
  const log = useRef(null);
  const input = useRef(null);

  useEffect(() => {
    const history = log.current;
    if (history) history.scrollTop = history.scrollHeight;
  }, [messages.length]);

  function submitMessage(event) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    onSend(friend.name, text);
    setDraft("");
    input.current?.focus();
  }

  return (
    <section aria-labelledby="conversation-title" className={className}>
      <header className="flex min-h-18 shrink-0 items-center gap-3 border-b border-border px-4 sm:px-6">
        <Link to="/messages" className={`grid size-11 shrink-0 place-items-center rounded-lg text-secondary sm:hidden ${focusRing}`} aria-label="Back to conversations">
          <ChevronLeft className="size-5" aria-hidden="true" />
        </Link>
        <Avatar src={friend.photo} name={friend.name} />
        <div className="min-w-0">
          <h2 id="conversation-title" className="truncate font-medium text-secondary">{friend.name}</h2>
          <StatusDot online={friend.online} />
        </div>
      </header>

      <div ref={log} role="log" aria-label={`Messages with ${friend.name}`} tabIndex={0} className={`min-h-0 flex-1 overflow-y-auto bg-background/45 p-4 sm:p-6 ${focusRing}`}>
        {messages.length ? (
          <ul className="space-y-4">
            {messages.map((message) => (
              <li key={message.id} className={`flex flex-col gap-1 ${message.outgoing ? "items-end" : "items-start"}`}>
                <p className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed wrap-anywhere ${message.outgoing ? "rounded-tr-sm bg-secondary text-white" : "rounded-tl-sm border border-border bg-card text-secondary"}`}>
                  <span className="sr-only">{message.outgoing ? "You: " : `${friend.name}: `}</span>
                  {message.text}
                </p>
                <span className="px-1 text-xs tabular-nums text-muted-foreground">{message.time}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="grid h-full place-content-center justify-items-center gap-2 px-4 text-center">
            <MessageCircle className="size-6 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">Start a conversation with {friend.name}.</p>
          </div>
        )}
      </div>

      <form onSubmit={submitMessage} noValidate className="flex shrink-0 items-center gap-2 border-t border-border p-4 sm:px-6">
        <label htmlFor="direct-message" className="sr-only">Message</label>
        <input
          ref={input}
          id="direct-message"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={`Message ${friend.name}`}
          className="h-11 min-w-0 flex-1 rounded-xl border border-input bg-background px-3 text-base text-secondary placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring"
        />
        <IconButton type="submit" label="Send message" variant="solid" size="lg" disabled={!draft.trim()} className="cursor-pointer disabled:cursor-default disabled:opacity-50">
          <SendHorizontal className="size-[18px]" aria-hidden="true" />
        </IconButton>
      </form>
    </section>
  );
}

export default function Messages() {
  const { relationships, threads, sendMessage } = useOutletContext();
  const [params] = useSearchParams();
  const friends = [...relationships]
    .filter(([, status]) => status === "friend")
    .map(([name]) => findUser(name));
  const selected = friends.find((friend) => friend.name === params.get("with"));
  const active = selected ?? friends[0];

  return (
    <div className="min-h-screen">
      <AppNav />
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <h1 className="text-[32px] font-medium leading-tight tracking-[-0.01em] text-secondary">Messages</h1>
        <p className="mt-1 text-sm text-muted-foreground">Preview messages stay on this device until you leave the preview or refresh.</p>
        <Card className="mt-6 grid overflow-hidden sm:h-[clamp(25rem,65dvh,42rem)] sm:grid-cols-[14rem_minmax(0,1fr)] lg:grid-cols-[18rem_minmax(0,1fr)]">
          <nav aria-labelledby="conversations-title" className={`min-h-0 overflow-y-auto sm:block sm:border-r sm:border-border ${selected ? "hidden" : ""}`}>
            <h2 id="conversations-title" className="border-b border-border px-4 py-5 font-medium text-secondary">Conversations</h2>
            {friends.length ? (
              <ul className="space-y-1 p-2">
                {friends.map((friend) => {
                  const isActive = active?.name === friend.name;
                  const latest = threads[friend.name]?.at(-1);
                  return (
                    <li key={friend.name}>
                      <Link
                        to={`/messages?with=${encodeURIComponent(friend.name)}`}
                        aria-current={selected?.name === friend.name ? "true" : undefined}
                        className={`flex min-h-16 items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-accent/50 ${focusRing} ${isActive ? "sm:bg-accent/60" : ""}`}
                      >
                        <Avatar src={friend.photo} name={friend.name} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-secondary">{friend.name}</span>
                          <span className="block truncate text-sm text-muted-foreground">
                            {latest ? `${latest.outgoing ? "You: " : ""}${latest.text}` : "No messages yet"}
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="p-4 text-sm text-muted-foreground">
                <Link to="/friends" className="font-medium text-secondary underline underline-offset-4">Add a friend</Link> to start a conversation.
              </p>
            )}
          </nav>
          {active ? (
            <Conversation
              key={active.name}
              friend={active}
              messages={threads[active.name] ?? []}
              onSend={sendMessage}
              className={`h-[clamp(21rem,62dvh,38rem)] min-h-0 min-w-0 flex-col sm:flex sm:h-full ${selected ? "flex" : "hidden"}`}
            />
          ) : (
            <div className="hidden bg-background/45 sm:block" />
          )}
        </Card>
      </main>
    </div>
  );
}
