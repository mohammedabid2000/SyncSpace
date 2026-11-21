import movieNight from "../assets/signin-movie-night.webp";

// Navy panel with the movie-night illustration, on the left of the sign in / sign up card (desktop only)
export default function AuthIllustrationPanel() {
  return (
    <div className="relative hidden flex-col bg-secondary p-10 text-white md:flex">
      <div className="flex flex-1 items-center justify-center">
        <img
          src={movieNight}
          alt=""
          width={1448}
          height={1086}
          className="h-auto w-full max-w-md"
        />
      </div>
      <p className="text-sm text-white/60">Watch together</p>
    </div>
  );
}
