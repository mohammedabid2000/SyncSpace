import { Link } from "react-router";

const SIZES = {
  sm: { gap: "gap-2", img: "h-8", text: "text-xl" },
  md: { gap: "gap-2", img: "h-9", text: "text-2xl" },
  lg: { gap: "gap-3", img: "h-10 md:h-12", text: "text-2xl md:text-4xl" },
};

// SyncSpace logo + name. With "to", it's a link (e.g. back to the home page).
// compact: on phones only the logo image is shown (the name comes back from 640px), to save space.
function Logo({ size = "md", to, compact = false, className = "" }) {
  const s = SIZES[size];
  const content = (
    <>
      <img src="/syncspace-logo.svg" alt="" className={`${s.img} w-auto`} />
      <span className={`${s.text} font-bold tracking-tight text-secondary ${compact ? "sr-only sm:not-sr-only" : ""}`}>
        SyncSpace
      </span>
    </>
  );
  const classes = `flex shrink-0 items-center ${s.gap} ${className}`;

  return to ? (
    <Link to={to} className={classes}>{content}</Link>
  ) : (
    <div className={classes}>{content}</div>
  );
}

export default Logo;
