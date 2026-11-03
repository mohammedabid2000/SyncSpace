// Every button of the app comes from here, so they all look and behave the same.
// Rule: a button gets DARKER on hover in its own color (navy → darker navy, red → darker red).

const VARIANTS = {
  primary: "bg-primary text-white hover:bg-primary-hover",            // red: main action
  secondary: "bg-secondary text-white hover:bg-secondary-hover",      // navy: important action
  outline: "border border-secondary text-secondary hover:bg-accent",  // navy border: second action
  subtle: "border border-border text-secondary hover:bg-accent",      // light border: small actions
  light: "bg-white text-secondary hover:bg-accent",                   // white: on navy backgrounds
  danger: "bg-destructive text-white hover:bg-primary-hover",         // red: destructive action
  dangerOutline: "border border-destructive text-destructive hover:bg-destructive/10", // red border
};

// Each size sets its own padding, text size, corners AND gap (never set twice = no conflicts)
const SIZES = {
  sm: "gap-1.5 rounded-lg px-3 py-1.5 text-sm",
  md: "gap-2 rounded-lg px-4 py-2.5 text-sm",
  base: "gap-2 rounded-lg px-6 py-3 text-base",
  lg: "gap-3.5 rounded-xl px-8 py-4 text-xl",
};

// Classes only — also used to style a <Link> like a button
export function buttonClasses({ variant = "secondary", size = "md", className = "" } = {}) {
  return `inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`;
}
