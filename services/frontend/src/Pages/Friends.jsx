import { useState } from "react";
import { Search, UserPlus, UserMinus, Check, X } from "lucide-react";
import AppNav from "../components/AppNav";
import PopUp from "../components/PopUp";
import Avatar from "../components/Avatar";
import Button from "../components/Button";
import IconButton from "../components/IconButton";
import Card from "../components/Card";
import StatusDot from "../components/StatusDot";
import Toast from "../components/Toast";
import yasserPhoto from "../assets/avatars/yasser.svg";
import linaPhoto from "../assets/avatars/lina.svg";
import adamPhoto from "../assets/avatars/adam.svg";
import saraPhoto from "../assets/avatars/sara.svg";
import omarPhoto from "../assets/avatars/omar.svg";
import nadiaPhoto from "../assets/avatars/nadia.svg";
import karimPhoto from "../assets/avatars/karim.svg";
import youssefPhoto from "../assets/avatars/youssef.svg";
import inesPhoto from "../assets/avatars/ines.svg";

// TODO: replace ALL of this preview data with real data from the backend
// (photos/online status = preview only, so the UI looks complete before the backend exists)
const CURRENT_USER = { name: "Yasser", photo: yasserPhoto };
const USERS = [
  { name: "Lina", photo: linaPhoto, online: true },
  { name: "Adam", photo: adamPhoto, online: false },
  { name: "Sara", photo: saraPhoto, online: true },
  { name: "Omar", photo: omarPhoto, online: false },
  { name: "Nadia", photo: nadiaPhoto, online: true },
  { name: "Karim", photo: karimPhoto, online: false },
  { name: "Youssef", photo: youssefPhoto, online: true },
  { name: "Ines", photo: inesPhoto, online: false },
];
const findUser = (name) => USERS.find((u) => u.name === name);

function Friends() {
  // Names only: the details (photo, online) come from USERS
  const [friends, setFriends] = useState(["Lina", "Adam", "Sara", "Omar"]);
  const [requests, setRequests] = useState(["Nadia", "Karim"]); // requests other people sent YOU
  const [sent, setSent] = useState([]);                         // requests YOU sent, still waiting
  const [query, setQuery] = useState("");

  const [profile, setProfile] = useState(null);      // friend whose profile popup is open
  const [toRemove, setToRemove] = useState(null);    // friend waiting for "remove" confirmation
  const [toast, setToast] = useState("");            // confirmation message ("Request sent to…")

  const onlineCount = friends.filter((name) => findUser(name).online).length;

  // Search: users whose name contains what you typed (not case sensitive)
  const results =
    query.trim() === ""
      ? []
      : USERS.filter((u) => u.name.toLowerCase().includes(query.trim().toLowerCase()));

  function sendRequest(name) {
    setSent([...sent, name]);
    setToast(`Request sent to ${name}`);
    // TODO: send the friend request to the backend
  }

  function acceptRequest(name) {
    setRequests(requests.filter((n) => n !== name));
    setFriends([...friends, name]);
    setToast(`You and ${name} are now friends`);
    // TODO: tell the backend the request was accepted
  }

  function declineRequest(name) {
    setRequests(requests.filter((n) => n !== name));
    // TODO: tell the backend the request was declined
  }

  function confirmRemove() {
    setFriends(friends.filter((n) => n !== toRemove));
    setToast(`${toRemove} was removed from your friends`);
    setToRemove(null);
    setProfile(null);
    // TODO: tell the backend to remove this friend
  }

  // The right button for a search result, depending on the relationship
  function searchAction(name) {
    if (friends.includes(name)) {
      return <span className="text-sm text-muted-foreground">Friends</span>;
    }
    if (sent.includes(name)) {
      return <span className="text-sm text-muted-foreground">Requested</span>;
    }
    if (requests.includes(name)) {
      return <Button size="sm" onClick={() => acceptRequest(name)}>Accept</Button>;
    }
    return (
      <Button variant="outline" size="sm" onClick={() => sendRequest(name)}>
        <UserPlus className="size-4" aria-hidden="true" />
        Add
      </Button>
    );
  }

  return (
    <div className="min-h-screen">
      <AppNav avatar={CURRENT_USER.photo} name={CURRENT_USER.name} />

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <h1 className="text-3xl font-bold tracking-tight text-secondary">Friends</h1>
        <p className="mt-1 text-muted-foreground">Find people, answer requests, and see who&apos;s online.</p>

        {/* 2 columns on big screens: friends list | add friends + requests */}
        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">

          {/* ===== YOUR FRIENDS ===== */}
          <Card as="section" aria-labelledby="friends-title" className="p-6">
            <div className="flex items-baseline justify-between gap-4">
              <h2 id="friends-title" className="text-xl font-bold text-secondary">
                Your friends <span className="font-normal text-muted-foreground">({friends.length})</span>
              </h2>
              <span className="text-sm text-muted-foreground">{onlineCount} online</span>
            </div>

            {friends.length === 0 ? (
              <p className="mt-6 text-muted-foreground">No friends yet. Search for people to add them.</p>
            ) : (
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {friends.map((name) => {
                  const friend = findUser(name);
                  return (
                    <li key={name} className="flex items-center gap-3 rounded-xl border border-border p-3">
                      {/* Click the photo/name to view the profile */}
                      <button
                        type="button"
                        onClick={() => setProfile(name)}
                        className="flex min-w-0 flex-1 items-center gap-3 rounded-lg text-left focus-visible:outline-2 focus-visible:outline-ring"
                      >
                        <Avatar src={friend.photo} name={friend.name} className="size-12 text-sm" />
                        <span className="min-w-0">
                          <span className="block truncate font-semibold text-secondary hover:underline">{name}</span>
                          <StatusDot online={friend.online} />
                        </span>
                      </button>
                      <IconButton variant="danger" label={`Remove ${name} from friends`} onClick={() => setToRemove(name)}>
                        <UserMinus className="size-5" aria-hidden="true" />
                      </IconButton>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          <div className="flex flex-col gap-6">
            {/* ===== ADD FRIENDS (search) ===== */}
            <Card as="section" aria-labelledby="add-title" className="p-6">
              <h2 id="add-title" className="text-xl font-bold text-secondary">Add friends</h2>
              <label htmlFor="friend-search" className="sr-only">Search by username</label>
              <div className="mt-4 flex items-center gap-2 rounded-md border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
                <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <input
                  id="friend-search"
                  type="search"
                  placeholder="Search by username"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none"
                />
              </div>

              {query.trim() !== "" && (
                results.length === 0 ? (
                  <p className="mt-4 text-sm text-muted-foreground">No user found for &quot;{query.trim()}&quot;.</p>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {results.map((u) => (
                      <li key={u.name} className="flex items-center gap-3">
                        <Avatar src={u.photo} name={u.name} />
                        <span className="flex-1 truncate font-medium text-secondary">{u.name}</span>
                        {searchAction(u.name)}
                      </li>
                    ))}
                  </ul>
                )
              )}
            </Card>

            {/* ===== FRIEND REQUESTS ===== */}
            <Card as="section" aria-labelledby="requests-title" className="p-6">
              <h2 id="requests-title" className="text-xl font-bold text-secondary">
                Requests <span className="font-normal text-muted-foreground">({requests.length})</span>
              </h2>
              {requests.length === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">No pending requests.</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {requests.map((name) => (
                    <li key={name} className="flex items-center gap-3">
                      <Avatar src={findUser(name).photo} name={name} />
                      <span className="flex-1 truncate font-medium text-secondary">{name}</span>
                      <IconButton variant="solid" size="sm" label={`Accept ${name}'s request`} onClick={() => acceptRequest(name)}>
                        <Check className="size-4" aria-hidden="true" />
                      </IconButton>
                      <IconButton variant="danger" size="sm" label={`Decline ${name}'s request`} onClick={() => declineRequest(name)}>
                        <X className="size-4" aria-hidden="true" />
                      </IconButton>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </div>
      </main>

      {/* ===== FRIEND PROFILE POPUP ===== */}
      <PopUp showPopUp={profile !== null} closePopUp={() => setProfile(null)} title="Profile">
        {profile && (
          <div className="mt-5 flex flex-col items-center gap-2 text-center">
            <Avatar src={findUser(profile).photo} name={profile} className="size-24 text-3xl" />
            <p className="mt-2 text-xl font-bold text-secondary">{profile}</p>
            <StatusDot online={findUser(profile).online} />
            <Button variant="dangerOutline" onClick={() => setToRemove(profile)} className="mt-4">
              <UserMinus className="size-4" aria-hidden="true" />
              Remove friend
            </Button>
          </div>
        )}
      </PopUp>

      {/* ===== REMOVE CONFIRMATION POPUP ===== */}
      <PopUp showPopUp={toRemove !== null} closePopUp={() => setToRemove(null)} title="Remove friend?">
        <p className="mt-2 text-muted-foreground">
          {toRemove} will be removed from your friends. You can add them again later.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="subtle" onClick={() => setToRemove(null)}>Cancel</Button>
          <Button variant="danger" onClick={confirmRemove}>Remove</Button>
        </div>
      </PopUp>

      <Toast message={toast} onDone={() => setToast("")} />
    </div>
  );
}

export default Friends;
