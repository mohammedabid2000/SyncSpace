import { NavLink, useNavigate } from "react-router";
import { UserRound, LogOut } from "lucide-react";
import Logo from "./Logo";
import Avatar from "./Avatar";
import Menu from "./Menu";

// Top bar shared by the signed-in pages (Home, Friends):
// logo on the left — page links and the avatar menu (My profile, Sign out) on the right.
// avatar: image URL (or null) — name: its first letter is shown when there is no avatar
function AppNav({ avatar, name }) {
  const navigate = useNavigate();

  // NavLink knows if its page is the current one (isActive) and sets aria-current="page" for us
  const linkClass = ({ isActive }) =>
    `border-b-2 py-1 text-sm font-medium ${
      isActive ? "border-secondary text-secondary" : "border-transparent text-muted-foreground hover:text-secondary"
    }`;

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Logo to="/home" compact />

        <nav className="flex items-center gap-4 sm:gap-6">
          <NavLink to="/home" end className={linkClass}>Home</NavLink>
          <NavLink to="/friends" className={linkClass}>Friends</NavLink>
          <Menu
            label="Account menu"
            button={<Avatar src={avatar} name={name} />}
            items={[
              { label: "My profile", icon: UserRound, onSelect: () => navigate("/home") },
              // TODO: tell the backend to end the session before leaving
              { label: "Sign out", icon: LogOut, onSelect: () => navigate("/") },
            ]}
          />
        </nav>
      </div>
    </header>
  );
}

export default AppNav;
