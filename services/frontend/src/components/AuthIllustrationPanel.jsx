import movieNight from "../assets/signin-movie-night.png";

export default function AuthIllustrationPanel() {
  return (
    <div className="relative hidden flex-col justify-between bg-secondary p-10 text-white md:flex">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
        Watch together
      </p>
      <div className="flex flex-1 items-center justify-center pt-16 pb-6">
        <img
          src={movieNight}
          alt=""
          width={1448}
          height={1086}
          className="h-auto w-full max-w-md"
        />
      </div>
      <h2 className="text-5xl font-normal leading-tight">
        <span className="block tracking-tight">Your people.</span>
        <span className="block font-serif italic text-primary">Your screen.</span>
      </h2>
    </div>
  );
}
