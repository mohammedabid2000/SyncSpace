import { Link } from "react-router";
import { House } from "lucide-react";

// Shown for any URL that doesn't match a route (see path="*" in main.jsx)
function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <img src="/syncspace-logo.svg" alt="" className="h-16 w-auto" />
      <p className="text-7xl font-bold tracking-tight text-primary">404</p>
      <h1 className="text-3xl font-bold tracking-tight text-secondary">
        This page doesn&apos;t <span className="font-serif font-normal italic text-primary">exist.</span>
      </h1>
      <p className="max-w-md text-muted-foreground">
        The link may be broken, or the page may have been moved. Let&apos;s get you back to the party.
      </p>
      <Link
        to="/"
        className="mt-2 flex items-center gap-2 rounded-lg bg-secondary py-3 pl-5 pr-6 font-medium text-white hover:bg-secondary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <House className="size-5" aria-hidden="true" />
        Back to home
      </Link>
    </main>
  );
}

export default NotFound;
