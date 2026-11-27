import { NavLink, useNavigate } from "react-router";
import { LogOut } from "lucide-react";
import Logo from "./Logo";

function AppNav() {
  const navigate = useNavigate();

  function signOut() {
    // TODO: tell the backend to end the session before leaving
    navigate("/");
  }

  // NavLink knows if its page is the current one (isActive) and sets aria-current="page" for us
  const linkClass = ({ isActive }) =>
    `flex h-16 items-center border-b-2 text-sm font-medium transition-colors duration-150 ${
      isActive ? "border-secondary text-secondary" : "border-transparent text-muted-foreground hover:text-secondary"
    }`;

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 md:gap-4 md:px-6">
        <Logo to="/home" compact />

        <nav aria-label="Main navigation" className="flex items-center gap-3 sm:gap-6">
          <NavLink to="/home" end className={linkClass}>Home</NavLink>
          <NavLink to="/friends" className={linkClass}>Friends</NavLink>
          <NavLink to="/messages" className={linkClass}>Messages</NavLink>
          <button
            type="button"
            aria-label="Sign out"
            title="Sign out"
            onClick={signOut}
            className="grid h-16 w-8 cursor-pointer place-items-center border-b-2 border-transparent text-muted-foreground transition-colors hover:text-secondary focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
          >
            <LogOut className="size-4" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </header>
  );
}

export default AppNav;
