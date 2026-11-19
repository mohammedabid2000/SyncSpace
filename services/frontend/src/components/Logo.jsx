import { Link } from "react-router";

const SIZES = {
  sm: { gap: "gap-2", img: "h-7", text: "text-lg" },
  md: { gap: "gap-2", img: "h-8", text: "text-lg" },
  lg: { gap: "gap-2.5", img: "h-9", text: "text-[22px]" },
};

// SyncSpace logo + name. With "to", it's a link (e.g. back to the home page).
// compact: on phones only the logo image is shown (the name comes back from 640px), to save space.
function Logo({ size = "md", to, compact = false, className = "" }) {
  const s = SIZES[size];
  const content = (
    <>
      <img src="/syncspace-logo.svg" alt="" className={`${s.img} w-auto`} />
      <span className={`${s.text} font-semibold leading-none tracking-[-0.01em] text-secondary ${compact ? "sr-only sm:not-sr-only" : ""}`}>
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
