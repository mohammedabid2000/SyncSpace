// Small label next to a name, e.g. "Host".
const TONES = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-accent text-secondary",
};

function Badge({ tone = "primary", children }) {
  return <span className={`rounded-md px-1.5 py-0.5 text-xs font-medium ${TONES[tone]}`}>{children}</span>;
}

export default Badge;
