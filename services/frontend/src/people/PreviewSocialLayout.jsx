import { useState } from "react";
import { Outlet } from "react-router";

const previewThreads = {
  Lina: [
    { id: 1, text: "Are we still on for movie night?", time: "8:24 PM" },
    { id: 2, text: "Yep! I’ll start the room in a bit.", time: "8:25 PM", outgoing: true },
    { id: 3, text: "Perfect, send me the invite when it’s ready.", time: "8:26 PM" },
  ],
  Adam: [
    { id: 1, text: "I’ve got a film for the next watch party.", time: "6:12 PM" },
  ],
};

export default function PreviewSocialLayout() {
  const [relationships, setRelationships] = useState(() => new Map([
    ["Lina", "friend"], ["Adam", "friend"], ["Sara", "friend"], ["Omar", "friend"],
    ["Nadia", "incoming"], ["Karim", "incoming"],
  ]));
  const [threads, setThreads] = useState(previewThreads);

  function sendMessage(name, text) {
    const time = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    setThreads((previous) => {
      const thread = previous[name] ?? [];
      const id = (thread.at(-1)?.id ?? 0) + 1;
      return { ...previous, [name]: [...thread, { id, text, time, outgoing: true }] };
    });
  }

  return <Outlet context={{ relationships, setRelationships, threads, sendMessage }} />;
}
