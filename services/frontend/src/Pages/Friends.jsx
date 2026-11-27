import { useState } from "react";
import { useOutletContext } from "react-router";
import { Search, UserPlus, UserMinus, Check, X } from "lucide-react";
import AppNav from "../components/AppNav";
import PopUp from "../components/PopUp";
import Avatar from "../components/Avatar";
import Button from "../components/Button";
import IconButton from "../components/IconButton";
import Card from "../components/Card";
import StatusDot from "../components/StatusDot";
import Toast from "../components/Toast";
import { users, findUser } from "../people/previewPeople";

function Friends() {
  const { relationships, setRelationships } = useOutletContext();
  const [query, setQuery] = useState("");

  const [profile, setProfile] = useState(null);      // friend whose profile popup is open
  const [toRemove, setToRemove] = useState(null);    // friend waiting for "remove" confirmation
  const [toast, setToast] = useState("");            // confirmation message ("Request sent to…")

  const friends = [];
  const requests = [];
  for (const [name, status] of relationships) {
    if (status === "friend") friends.push(findUser(name));
    if (status === "incoming") requests.push(findUser(name));
  }
  const onlineCount = friends.filter((friend) => friend.online).length;
  const search = query.trim().toLowerCase();
  const results = search ? users.filter((user) => user.name.toLowerCase().includes(search)) : [];

  function updateRelationship(name, status) {
    setRelationships((previous) => {
      const next = new Map(previous);
      next.delete(name);
      if (status) next.set(name, status);
      return next;
    });
  }

  function sendRequest(name) {
    updateRelationship(name, "outgoing");
    setToast(`Request sent to ${name}`);
    // TODO: send the friend request to the backend
  }

  function acceptRequest(name) {
    updateRelationship(name, "friend");
    setToast(`You and ${name} are now friends`);
    // TODO: tell the backend the request was accepted
  }

  function declineRequest(name) {
    updateRelationship(name, null);
    // TODO: tell the backend the request was declined
  }

  function confirmRemove() {
    updateRelationship(toRemove, null);
    setToast(`${toRemove} was removed from your friends`);
    setToRemove(null);
    setProfile(null);
    // TODO: tell the backend to remove this friend
  }

  // The right button for a search result, depending on the relationship
  function searchAction(name) {
    if (relationships.get(name) === "friend") {
      return <span className="text-sm text-muted-foreground">Friends</span>;
    }
    if (relationships.get(name) === "outgoing") {
      return <span className="text-sm text-muted-foreground">Requested</span>;
    }
    if (relationships.get(name) === "incoming") {
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
      <AppNav />

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <h1 className="text-[32px] font-medium leading-tight tracking-[-0.01em] text-secondary">Friends</h1>
        <p className="mt-1 text-muted-foreground">Find people, answer requests and see who&apos;s online</p>

        {/* 2 columns on big screens: friends list | add friends + requests */}
        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_23rem]">

          {/* ===== YOUR FRIENDS ===== */}
          <Card as="section" aria-labelledby="friends-title" className="p-6">
            <div className="flex items-baseline justify-between gap-4">
              <h2 id="friends-title" className="text-lg font-medium text-secondary">
                Your friends <span className="ms-1 tabular-nums text-muted-foreground">{friends.length}</span>
              </h2>
              <span className="text-sm tabular-nums text-muted-foreground">{onlineCount} online</span>
            </div>

            {friends.length === 0 ? (
              <p className="mt-6 text-muted-foreground">No friends yet. Search for people to add them.</p>
            ) : (
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {friends.map((friend) => {
                  const { name } = friend;
                  return (
                    <li key={name} className="flex items-center gap-3 rounded-xl border border-border p-3 transition-colors duration-150 hover:bg-background/60">
                      {/* Click the photo/name to view the profile */}
                      <button
                        type="button"
                        onClick={() => setProfile(friend)}
                        className="flex min-w-0 flex-1 items-center gap-3 rounded-lg text-left focus-visible:outline-2 focus-visible:outline-ring"
                      >
                        <Avatar src={friend.photo} name={friend.name} className="size-11 text-sm" />
                        <span className="min-w-0">
                          <span className="block truncate font-medium text-secondary">{name}</span>
                          <StatusDot online={friend.online} />
                        </span>
                      </button>
                      <IconButton variant="danger" label={`Remove ${name} from friends`} onClick={() => setToRemove(name)}>
                        <UserMinus className="size-[18px]" aria-hidden="true" />
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
              <h2 id="add-title" className="text-lg font-medium text-secondary">Add friends</h2>
              <label htmlFor="friend-search" className="sr-only">Search by username</label>
              <div className="mt-4 flex h-10 items-center gap-2 rounded-lg border border-input bg-background px-3 transition-colors duration-150 focus-within:border-secondary/40 focus-within:ring-2 focus-within:ring-ring/20">
                <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <input
                  id="friend-search"
                  type="search"
                  placeholder="Search by username"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-full min-w-0 flex-1 bg-transparent text-sm text-secondary outline-none placeholder:text-muted-foreground/80"
                />
              </div>

              {query.trim() !== "" && (
                results.length === 0 ? (
                  <p className="mt-4 text-sm text-muted-foreground">No one named &quot;{query.trim()}&quot;</p>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {results.map((u) => (
                      <li key={u.name} className="flex items-center gap-3">
                        <Avatar src={u.photo} name={u.name} className="size-9 text-sm" />
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
              <h2 id="requests-title" className="text-lg font-medium text-secondary">
                Requests <span className="ms-1 tabular-nums text-muted-foreground">{requests.length}</span>
              </h2>
              {requests.length === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">No pending requests</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {requests.map(({ name, photo }) => (
                    <li key={name} className="flex items-center gap-3">
                      <Avatar src={photo} name={name} className="size-9 text-sm" />
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
      <PopUp showPopUp={profile !== null && toRemove === null} closePopUp={() => setProfile(null)} title="Profile">
        {profile && (
          <div className="mt-5 flex flex-col items-center gap-2 text-center">
            <Avatar src={profile.photo} name={profile.name} className="size-24 text-3xl" />
            <p className="mt-2 text-xl font-medium text-secondary">{profile.name}</p>
            <StatusDot online={profile.online} />
            <Button variant="dangerOutline" onClick={() => setToRemove(profile.name)} className="mt-6">
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
