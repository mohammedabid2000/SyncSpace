// Round profile picture. Without a photo, shows the first letter of the name (default avatar).
// className sets the size (and text size for the letter), e.g. "size-10 text-sm"
function Avatar({ src, name, className = "size-10 text-sm" }) {
  return src ? (
    <img src={src} alt="" className={`shrink-0 rounded-full object-cover ${className}`} />
  ) : (
    <div className={`flex shrink-0 items-center justify-center rounded-full bg-primary font-bold uppercase text-white ${className}`}>
      {name[0]}
    </div>
  );
}

export default Avatar;
