import { NavLink } from "react-router";
import Logo from "./Logo";
import Avatar from "./Avatar";

// Top bar shared by the signed-in pages (Home, Friends):
// logo on the left — page links + small avatar on the right.
// avatar: image URL (or null) — name: its first letter is shown when there is no avatar
function AppNav({ avatar, name }) {
  // NavLink knows if its page is the current one (isActive) and sets aria-current="page" for us
  const linkClass = ({ isActive }) =>
    `border-b-2 py-1 text-sm font-medium ${
      isActive ? "border-secondary text-secondary" : "border-transparent text-muted-foreground hover:text-secondary"
    }`;

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Logo to="/" />

        <nav className="flex items-center gap-6">
          <NavLink to="/home" className={linkClass}>Home</NavLink>
          <NavLink to="/friends" className={linkClass}>Friends</NavLink>
          <Avatar src={avatar} name={name} />
        </nav>
      </div>
    </header>
  );
}

export default AppNav;
