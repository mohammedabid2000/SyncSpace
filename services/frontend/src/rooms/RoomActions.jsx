import { useState } from "react";
import { useNavigate } from "react-router";
import { Plus, LogIn } from "lucide-react";
import PopUp from "../components/PopUp";
import { TextField } from "../components/TextField";
import Button from "../components/Button";
import Card from "../components/Card";
import { MAX_ROOM_NAME, roomNameLength, validRoomName } from "./roomName";

export default function RoomActions() {
  const navigate = useNavigate();

  const [dialog, setDialog] = useState(null);
  const [roomCode, setRoomCode] = useState("");
  const [roomName, setRoomName] = useState("");
  const [error, setError] = useState("");

  function closeDialog() {
    setDialog(null);
    setError("");
  }

  function enterRoom(event) {
    event.preventDefault();
    if (dialog === "join" && !roomCode.trim()) {
      setError("Enter a room link or code");
      return;
    }
    if (dialog === "create") {
      const name = roomName.trim();
      if (!validRoomName(name)) {
        setError(name ? `Use ${roomNameLength}` : "Enter a room name");
        return;
      }
    }
    // TODO: resolve the invite or create the named room through the backend.
    navigate("/stream");
  }

  return (
    <>
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
            <Button variant="light" onClick={() => setDialog("create")} className="mt-6">
              <Plus className="size-4" aria-hidden="true" />
              Create room
            </Button>
          </div>

          <Card className="flex flex-col items-start p-6 md:p-8">
            <h3 className="text-xl font-medium text-secondary">Join a room</h3>
            <p className="mt-1 text-muted-foreground">Paste an invite link or a room code</p>
            {/* Opens the Join Room popup */}
            <Button variant="outline" onClick={() => setDialog("join")} className="mt-6">
              <LogIn className="size-4" aria-hidden="true" />
              Join room
            </Button>
          </Card>
        </div>
      </section>

      {/* ===== JOIN ROOM POPUP ===== */}
      <PopUp showPopUp={dialog === "join"} closePopUp={closeDialog} title="Join a room">
        <p className="mt-1 text-sm text-muted-foreground">
          Paste the invite link or enter the room code
        </p>

        {/* noValidate: we show our own error message instead of the browser's */}
        <form onSubmit={enterRoom} noValidate className="mt-6 flex flex-col gap-4">
          <TextField
            id="room-code"
            label="Room link or code"
            placeholder="e.g. https://syncspace.app/room/abc123"
            value={roomCode}
            onChange={setRoomCode}
            error={error}
          />

          <Button type="submit" className="mt-1">
            <LogIn className="size-4" aria-hidden="true" />
            Join
          </Button>
        </form>
      </PopUp>

      {/* ===== CREATE ROOM POPUP ===== */}
      <PopUp showPopUp={dialog === "create"} closePopUp={closeDialog} title="Create a room">
        <p className="mt-1 text-sm text-muted-foreground">
          Give your watch party a name, then invite your friends
        </p>

        {/* noValidate: we show our own error message instead of the browser's */}
        <form onSubmit={enterRoom} noValidate className="mt-6 flex flex-col gap-4">
          <TextField
            id="room-name"
            label="Room name"
            maxLength={MAX_ROOM_NAME}
            placeholder="e.g. Friday movie night"
            value={roomName}
            onChange={setRoomName}
            error={error}
          />

          <Button type="submit" className="mt-1">
            <Plus className="size-4" aria-hidden="true" />
            Create
          </Button>
        </form>
      </PopUp>

    </>
  );
}
