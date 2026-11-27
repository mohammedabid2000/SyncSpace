import { Globe, Cast, Link, MessagesCircle, RefreshCw, ListPlus, TvMinimalPlay, Plus, LogIn, UserPlus, UserRound } from "lucide-react";
import imghero from "./assets/hero.webp";
import image from "./assets/image.webp";
import startnow from "./assets/gsnow.webp";
import { Link as RouterLink, useNavigate } from "react-router";
import Logo from "./components/Logo";
import Menu from "./components/Menu";
import { buttonClasses } from "./components/buttonStyles";
import "./landing.css";

const features = [
  {
    icon: Globe,
    title: "Virtual browser",
    text: "Watch together on a virtual browser running in the cloud.",
  },
  {
    icon: RefreshCw,
    title: "Sync playback",
    text: "Playback is synced for everyone in the room, so you can pause, rewind, or fast forward together.",
  },
  {
    icon: Link,
    title: "Invite link",
    text: "Send a link to your friends and start watching together.",
  },
];

const features2 = [
  {
    icon: MessagesCircle,
    title: "Chat",
    text: "Chat with others in your room, and share your thoughts in real time.",
  },
  {
    icon: Cast,
    title: "Screen sharing",
    text: "Share a browser tab or your desktop. Your friends can watch along in sync.",
  },
  {
    icon: ListPlus,
    title: "Playlists",
    text: "Create and share playlists with your friends. Add videos to the queue and watch them together.",
  },
];

// A row of features: a hairline, icon, title and text for each item (3 columns on desktop, stacked on phones)
function FeatureGrid({ items }) {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto grid max-w-6xl gap-x-12 gap-y-10 md:grid-cols-3">
        {items.map((feature) => (
          <div key={feature.title} className="border-t border-secondary/15 pt-6">
            <feature.icon className="size-6 text-secondary" aria-hidden="true" />
            <h3 className="mt-4 text-lg font-medium text-secondary">{feature.title}</h3>
            <p className="mt-2 max-w-xs leading-relaxed text-muted-foreground">{feature.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function App() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">

      <header className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-6">
        <Logo size="lg" />
        <Menu
          label="Account"
          button={
            <span className="grid size-11 cursor-pointer place-items-center rounded-full bg-muted-foreground/10 text-muted-foreground transition-colors hover:bg-muted-foreground/20">
              <UserRound className="size-5" aria-hidden="true" />
            </span>
          }
          items={[
            { label: "Sign in", icon: LogIn, onSelect: () => navigate("/signin") },
            { label: "Create an account", icon: UserPlus, onSelect: () => navigate("/signup") },
          ]}
        />
      </header>

      <main className="pb-8">
        <section className="hero px-6 pt-12 pb-24 md:pt-20 md:pb-32">
          <div className="section-layout relative z-10">
            <div className="flex flex-col items-start gap-6">
              <h1 className="text-[44px] font-normal leading-[1.04] tracking-[-0.03em] text-secondary md:text-[68px]">
                <span className="block">Your people,</span>
                <span className="accent-word block">your screen</span>
              </h1>

              <p className="max-w-md text-lg leading-relaxed text-muted-foreground md:text-xl">
                Start a room, invite your friends and watch videos in sync on one shared browser
              </p>

              <RouterLink to="/signin" className={buttonClasses({ size: "lg", className: "mt-2 w-[153px] px-3! whitespace-nowrap" })}>
                <Plus className="size-[18px] shrink-0" aria-hidden="true" />
                Start a room
              </RouterLink>
            </div>
            <div className="section-media">
              <img
                src={imghero}
                alt="A video playing on a big screen, with a row of friends watching together"
                className="section-image"
              />
            </div>
          </div>
        </section>

        {/* FEATURES — 3 columns on desktop, stacked on phones */}
        <FeatureGrid items={features} />

        <section className="curve-navy px-6 py-20 md:py-24">
          <div className="section-layout">
            <div className="section-media">
              <img
                src={image}
                alt="A group of friends reacting to a funny scene in a movie"
                className="section-image"
              />
            </div>
            <div className="flex flex-col items-start gap-6 text-start">
              <h2 className="text-[36px] font-normal leading-[1.08] tracking-[-0.02em] text-secondary md:text-5xl">
                React to moments <span className="accent-word">together</span>
              </h2>
              <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
                Chat, laugh and share the best scenes with your friends in real time
              </p>
            </div>

          </div>
        </section>

        <FeatureGrid items={features2} />

        {/* INVITATION — ticket image on the left, joined to the text by a curved line */}
        <section className="curve-surface px-6 py-20 md:py-24">
          <div className="section-layout">
            <div className="section-media invitation-art">
              <img
                src={startnow}
                alt="Friends getting ready to watch a movie together"
                className="section-image section-image-ticket"
              />
              <svg
                viewBox="0 0 200 160"
                fill="none"
                aria-hidden="true"
                className="invitation-connector text-primary"
              >
                <path
                  d="M 8 15 C 125 -5, 75 145, 192 145"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
                <circle cx="8" cy="15" r="4" fill="currentColor" />
                <circle cx="192" cy="145" r="4" fill="currentColor" />
              </svg>
            </div>

            <div className="invitation-copy">
              <h2 id="invitation-title" className="invitation-title text-secondary">
                <span className="block">Save a seat for</span>
                <span className="accent-word block">your people</span>
              </h2>
              <p className="invitation-description text-muted-foreground">
                Bring your friends together for the next great scene
              </p>
              <RouterLink to="/signin" className={buttonClasses({ size: "lg" })}>
                <TvMinimalPlay className="size-[18px]" aria-hidden="true" />
                Get started
              </RouterLink>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-secondary px-6 py-12 text-white/70">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm md:flex-row">
          <p>&copy; 2026 SyncSpace. All rights reserved.</p>
          <nav className="flex flex-wrap justify-center gap-6">
            <RouterLink to="/privacy" className="transition-colors duration-150 hover:text-white">Privacy Policy</RouterLink>
            <RouterLink to="/terms" className="transition-colors duration-150 hover:text-white">Terms of Service</RouterLink>
            <RouterLink to="/design-system" className="transition-colors duration-150 hover:text-white">Design system</RouterLink>
          </nav>
        </div>
      </footer>
    </div>
  );
}

export default App;
