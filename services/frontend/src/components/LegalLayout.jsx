import { Link } from "react-router";
import Logo from "./Logo";

// Shared layout for the legal pages (Privacy Policy, Terms of Service):
// logo header, a readable text column, and links between the two pages.
// title: page title — updated: "last updated" date — children: the page content
function LegalLayout({ title, updated, children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border px-6 py-4">
        <Logo to="/" className="w-fit" />
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <h1 className="text-4xl font-bold tracking-tight text-secondary">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {updated}</p>

        {/* Styles for the content: every h2, p and ul inside get the same look */}
        <div className="mt-10 space-y-8 text-secondary [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_li]:mt-1 [&_p]:leading-relaxed [&_p+p]:mt-3 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-6">
          {children}
        </div>
      </main>

      <footer className="border-t border-border px-6 py-6">
        <nav className="mx-auto flex max-w-3xl flex-wrap gap-6 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-secondary hover:underline">Home</Link>
          <Link to="/privacy" className="hover:text-secondary hover:underline">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-secondary hover:underline">Terms of Service</Link>
        </nav>
      </footer>
    </div>
  );
}

export default LegalLayout;
