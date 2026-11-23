import { Link } from "react-router";
import { House } from "lucide-react";
import { buttonClasses } from "../components/buttonStyles";

// Shown for any URL that doesn't match a route (see path="*" in main.jsx)
function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <img src="/syncspace-logo.svg" alt="" className="h-12 w-auto" />
      <p className="mt-8 text-sm tabular-nums text-muted-foreground">Error 404</p>
      <h1 className="mt-2 text-[40px] font-normal leading-[1.1] tracking-[-0.02em] text-secondary md:text-5xl">
        This page doesn&apos;t <span className="accent-word">exist</span>
      </h1>
      <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">The link may be broken, or the page may have moved. Let&apos;s get you back to the party.</p>
      {/* A link styled like a button: it changes page, so it's a <Link>, not a <button> */}
      <Link to="/" className={buttonClasses({ variant: "secondary", size: "base", className: "mt-8" })}>
        <House className="size-[18px]" aria-hidden="true" />
        Back to home
      </Link>
    </main>
  );
}

export default NotFound;
