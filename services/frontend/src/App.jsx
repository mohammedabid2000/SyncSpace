import { Globe, Cast, Link, MessagesCircle, RefreshCw, ListPlus, TvMinimalPlay } from "lucide-react";
import imghero from "./assets/hero.webp";
import image from "./assets/image.webp";
import startnow from "./assets/gsnow.webp";
import { useNavigate } from "react-router";

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

function App() {

  const navigate = useNavigate();

  function handleClick() {
    navigate("/SignIn");
  }
  return (
    <div className="min-h-screen">

      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">

          <img
            src="/syncspace-logo.svg"
            alt=""
            className="h-10 w-auto md:h-12"
          />
          <span className="text-2xl font-bold tracking-tight text-secondary md:text-4xl">
            SyncSpace
          </span>
        </div>

        <button onClick={handleClick} className="flex items-center gap-2 rounded-md bg-secondary py-2 pl-3 pr-4 text-sm leading-none font-normal tracking-tight text-white hover:bg-primary-hover md:text-base">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
          </svg>

          Sign in
        </button>
      </header>

      <main>
        <section className="hero px-6 py-16">
          <div className="section-layout relative z-10">
            <div className="flex flex-col items-start gap-6">
              <h1 className="text-4xl font-normal md:text-6xl">
                <span className="block tracking-tight text-secondary">Your people.</span>
                <span className="block font-serif italic text-primary">Your screen.</span>
              </h1>

              <p className="text-lg text-muted-foreground">
                Start a room, invite your friends, and enjoy videos in sync.
              </p>

              <button className="flex items-center gap-2 rounded-md bg-secondary py-3 pl-5 pr-6 text-base leading-none tracking-tight text-white hover:bg-primary-hover">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                New Room
              </button>
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

        {/* FEATURES — 3 columns on desktop (md:grid-cols-3), stacked on phones */}
        <section className="px-6 py-16">
          <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-3">
            {features.map((feature) => (
              /* One card: flex-col + items-center + text-center = everything centered */
              <div key={feature.title} className="flex flex-col items-center gap-4 text-center">
                <feature.icon className="size-16 text-secondary" strokeWidth={1.5} aria-hidden="true" />
                <h3 className="text-lg font-bold uppercase tracking-widest text-secondary">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="curve-navy px-6 py-16">
          <div className="section-layout">
            <div className="section-media">
              <img
                src={image}
                alt="A group of friends reacting to a funny scene in a movie"
                className="section-image"
              />
            </div>
            <div className="flex flex-col items-start gap-6 text-left" >
              <h2 className="text-3xl font-normal tracking-tight text-secondary md:text-5xl">
                React to moments <span className="font-serif italic text-primary">together.</span>
              </h2>
              <p  className="text-lg text-muted-foreground">
                Chat, laugh, and share the best scenes with your friends in real time.
              </p>
            </div>

          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-3">
            {features2.map((features2) => (
              /* One card: flex-col + items-center + text-center = everything centered */
              <div key={features2.title} className="flex flex-col items-center gap-4 text-center">
                <features2.icon className="size-16 text-secondary" strokeWidth={1.5} aria-hidden="true" />
                <h3 className="text-lg font-bold uppercase tracking-widest text-secondary">
                  {features2.title}
                </h3>
                <p className="text-muted-foreground">{features2.text}</p>
              </div>
            ))}
          </div>
        </section>
            
        {/* Movie-night invit+ation: cream canvas and a connector anchored to the ticket. */}
        <section className="curve-surface px-6 py-16">
          <div className="section-layout invitation-layout">
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
                <span className="block font-serif italic text-primary">your people.</span>
              </h2>
              <p className="invitation-description text-secondary">
                Bring your friends together for the next great scene.
              </p>
              <button className="invitation-button bg-secondary text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary">
                <TvMinimalPlay className="size-6" aria-hidden="true" />
                Get started
              </button>
            </div>
          </div>
        </section>
      </main>
      <div className="py-8"></div>
      <footer className="bg-secondary px-6 py-12 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm md:flex-row">
          <p>&copy; 2026 SyncSpace. All rights reserved.</p>
          <nav className="flex gap-6">
            <a href="/privacy" className="hover:underline">Privacy Policy</a>
            <a href="/terms" className="hover:underline">Terms of Service</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

export default App;
