import { useEffect, useRef, useState } from "react";
import { UserRound, Pencil } from "lucide-react";
import defaultCover from "../assets/defaultCover.webp";
import AppNav from "../components/AppNav";
import Avatar from "../components/Avatar";
import { TextField } from "../components/TextField";
import Button from "../components/Button";
import Card from "../components/Card";
import Toast from "../components/Toast";
import { currentUser } from "../people/previewPeople";
import { validateEmail } from "../account/validation";
import RoomActions from "../rooms/RoomActions";

const MAX_SIZE_MB = 5;

function Home() {
  const [user, setUser] = useState({
    username: currentUser.name, email: currentUser.email, avatar: currentUser.photo, cover: defaultCover,
  });
  const [draft, setDraft] = useState(null);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [toast, setToast] = useState("");
  const previewUrls = useRef(new Set());
  const shown = draft ?? user;

  useEffect(() => {
    const urls = previewUrls.current;
    return () => {
      for (const url of urls) URL.revokeObjectURL(url);
      urls.clear();
    };
  }, []);

  useEffect(() => {
    const shownUrls = new Set([user.avatar, user.cover, draft?.avatar, draft?.cover]);
    for (const url of previewUrls.current) {
      if (!shownUrls.has(url)) {
        URL.revokeObjectURL(url);
        previewUrls.current.delete(url);
      }
    }
  }, [user, draft]);

  function startEditing() {
    setDraft(user);
    setFieldErrors({});
    setError("");
  }

  function cancelEditing() {
    setDraft(null);
    setError("");
  }

  function saveProfile(event) {
    event.preventDefault(); // stop the browser from reloading the page

    // Frontend validation
    if (!draft) return;
    const username = draft.username.trim();
    const email = draft.email.trim();
    const newErrors = {
      username: !/^[A-Za-z0-9_]{3,20}$/.test(username)
        ? "3 to 20 characters: letters, numbers and _ only"
        : "",
      email: validateEmail(email),
    };
    setFieldErrors(newErrors);
    if (newErrors.username || newErrors.email) return;

    setUser({ ...draft, username, email });
    setDraft(null);
    setError("");
    setToast("Profile saved");
    // TODO: send { username, email } and the new photos to the backend
  }

  // Shared by both uploads: checks the file, then shows a preview
  function handleImage(event, field) {
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
    const url = URL.createObjectURL(file);
    previewUrls.current.add(url);
    setDraft({ ...draft, [field]: url });
    // TODO: upload the file to the backend
  }
  return (

    <div className="min-h-screen">
      <AppNav />

      <main className="mx-auto max-w-6xl px-4 pt-6 pb-16 md:px-6 md:pt-8">
        {/* ===== PROFILE CARD ===== */}
        <Card as="section" className="overflow-hidden">
          {/* Cover photo: the user's upload, or the default cover */}
          <div className="relative h-44 md:h-72">
            {/* object-right: the default cover has its logo on the right, keep it visible on narrow screens */}
            <img src={shown.cover} alt="" className={`h-full w-full object-cover ${shown.cover === defaultCover ? "object-right" : ""}`} />

            {/* Edit mode only: pencil button to change the cover.
                The <label> is the visible button; the real file input is hidden inside it */}
            {draft && (
              <label className="absolute right-4 top-4 flex size-10 cursor-pointer items-center justify-center rounded-full bg-card text-secondary shadow-[0_2px_8px_rgb(13_36_52/16%)] transition-colors duration-150 hover:bg-accent focus-within:ring-2 focus-within:ring-ring">
                <Pencil className="size-[18px]" aria-hidden="true" />
                <span className="sr-only">Change cover photo</span>
                <input type="file" accept="image/*" className="sr-only" onChange={(e) => handleImage(e, "cover")} />
              </label>
            )}
          </div>

          <div className="px-6 pb-8 md:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:gap-8">
              {/* Big profile photo, overlapping the cover (negative margin-top) */}
              <div className="relative z-10 -mt-16 size-32 shrink-0 md:-mt-20 md:size-40">
                <Avatar
                  src={shown.avatar}
                  name={user.username}
                  className="size-full border-4 border-card text-5xl"
                />
                {/* Edit mode only: pencil button to change the profile photo */}
                {draft && (
                  <label className="absolute bottom-1 right-1 flex size-10 cursor-pointer items-center justify-center rounded-full border-2 border-card bg-secondary text-white transition-colors duration-150 hover:bg-secondary-hover focus-within:ring-2 focus-within:ring-ring md:bottom-2 md:right-2">
                    <Pencil className="size-4" aria-hidden="true" />
                    <span className="sr-only">Change profile photo</span>
                    <input type="file" accept="image/*" className="sr-only" onChange={(e) => handleImage(e, "avatar")} />
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
                  {draft ? (
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
                {draft && (
                  <div className="mt-6 grid max-w-md gap-4 border-t border-border pt-6">
                    <TextField
                      id="edit-username"
                      label="Username"
                      autoComplete="username"
                      maxLength={20}
                      value={draft.username}
                      onChange={(username) => setDraft({ ...draft, username })}
                      error={fieldErrors.username}
                    />
                    <TextField
                      id="edit-email"
                      label="Email"
                      type="email"
                      autoComplete="email"
                      value={draft.email}
                      onChange={(email) => setDraft({ ...draft, email })}
                      error={fieldErrors.email}
                    />
                  </div>
                )}
              </form>
            </div>
          </div>
        </Card>

        <RoomActions />
      </main>

      <Toast message={toast} onDone={() => setToast("")} />
    </div>
  );
}

export default Home;
