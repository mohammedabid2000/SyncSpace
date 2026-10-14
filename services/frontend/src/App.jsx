import "./index.css";
import imghero from "./assets/hero.webp";

function App() {
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

        <button className="flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-normal tracking-tight text-white hover:bg-primary-hover md:px-4 md:py-2 md:text-base">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
          </svg>

          Sign in
        </button>
      </header>

      <main className="hero px-6 py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          {/* Left column: text */}
          <div className="flex flex-col items-start gap-6">
            <h1 className="text-4xl font-normal md:text-6xl">
              <span className="block tracking-tight text-secondary">Your people.</span>
              <span className="block font-serif italic text-primary">Your screen.</span>
            </h1>

            <p className="text-lg text-muted">
              Start a room, invite your friends, and enjoy videos in sync.
            </p>

            <button className="flex items-center gap-2 rounded-md bg-secondary px-6 py-3 text-base tracking-tight text-white hover:bg-primary-hover">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              New Room
            </button>
          </div>

          {/* Right column: image */}
          <img
            src={imghero}
            alt="A video playing on a big screen, with a row of friends watching together"
            className="w-full rounded-xl shadow-xl"
          />
        </div>
      </main>

    </div>
  );
}

export default App;
