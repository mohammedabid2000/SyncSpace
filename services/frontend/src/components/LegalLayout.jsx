import { Link } from "react-router";
import Logo from "./Logo";

// Shared layout for the legal pages (Privacy Policy, Terms of Service):
// logo header, a readable text column, and links between the two pages.
// title: page title — updated: "last updated" date — children: the page content
function LegalLayout({ title, updated, children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center border-b border-border px-6">
        <Logo to="/" className="w-fit" />
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <h1 className="text-[40px] font-medium leading-[1.1] tracking-[-0.02em] text-secondary">{title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated {updated}</p>

        {/* Styles for the content: every h2, p and ul inside get the same look */}
        <div className="mt-10 space-y-8 text-secondary [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-medium [&_strong]:font-medium [&_li]:mt-1 [&_p]:leading-relaxed [&_p+p]:mt-3 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-6">
          {children}
        </div>
      </main>

      <footer className="border-t border-border px-6 py-8">
        <nav className="mx-auto flex max-w-3xl flex-wrap gap-6 text-sm text-muted-foreground">
          <Link to="/" className="transition-colors duration-150 hover:text-secondary">Home</Link>
          <Link to="/privacy" className="transition-colors duration-150 hover:text-secondary">Privacy Policy</Link>
          <Link to="/terms" className="transition-colors duration-150 hover:text-secondary">Terms of Service</Link>
        </nav>
      </footer>
    </div>
  );
}

export default LegalLayout;
