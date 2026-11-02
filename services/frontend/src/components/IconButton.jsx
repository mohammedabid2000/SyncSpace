// Round button that only shows an icon. "label" is required: it's what screen readers say
// (aria-label) and the tooltip on hover (title), since there is no visible text.

const VARIANTS = {
  ghost: "text-secondary hover:bg-accent",                                 // navy icon, no background
  muted: "text-muted-foreground hover:bg-accent hover:text-secondary",     // grey icon (e.g. close X)
  solid: "bg-secondary text-white hover:bg-secondary-hover",               // navy circle
  light: "bg-card text-secondary shadow-md hover:bg-accent",               // white circle (on photos)
  primary: "bg-primary text-white hover:bg-primary-hover",                 // red circle
  danger: "text-muted-foreground hover:bg-destructive/10 hover:text-destructive", // grey, red on hover
};

const SIZES = { sm: "size-8", md: "size-10", lg: "size-11" };

function IconButton({ label, variant = "ghost", size = "md", className = "", type = "button", ...props }) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={`inline-flex shrink-0 items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    />
  );
}

export default IconButton;
