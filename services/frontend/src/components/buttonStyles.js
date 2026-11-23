// Every button of the app comes from here, so they all look and behave the same.
// Rule: a button gets DARKER on hover in its own color (navy → darker navy, red → darker red).

const VARIANTS = {
  primary: "bg-primary text-white hover:bg-primary-hover",            // red: main action
  secondary: "bg-secondary text-white hover:bg-secondary-hover",      // navy: important action
  outline: "border border-secondary text-secondary hover:bg-accent",  // navy border: second action
  subtle: "border border-border text-secondary hover:bg-accent",      // light border: small actions
  light: "bg-white text-secondary hover:bg-accent",                   // white: on navy backgrounds
  danger: "bg-destructive text-white hover:bg-destructive-hover",     // red: destructive action
  dangerOutline: "border border-destructive text-destructive hover:bg-destructive/10", // red border
};

// Each size sets its own height, padding, text size, corners AND gap (never set twice = no conflicts)
// Icons inside: size-4 for sm / md, size-[18px] for base / lg
const SIZES = {
  sm: "h-9 gap-1.5 rounded-lg px-3 text-sm",
  md: "h-10 gap-2 rounded-lg px-4 text-sm",
  base: "h-11 gap-2 rounded-lg px-5 text-[15px]",
  lg: "h-12 gap-2 rounded-[10px] px-6 text-base",
};

// Classes only — also used to style a <Link> like a button
export function buttonClasses({ variant = "secondary", size = "md", className = "" } = {}) {
  return `inline-flex shrink-0 items-center justify-center font-medium transition-[color,background-color,border-color,transform] duration-150 ease-out active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`;
}
