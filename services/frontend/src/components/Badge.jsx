// Small quiet label next to a name, e.g. "Host".
const TONES = {
  primary: "bg-primary/10 text-primary-hover",
  secondary: "bg-accent text-secondary",
};

function Badge({ tone = "secondary", children }) {
  return <span className={`inline-flex h-5 items-center rounded-[5px] px-1.5 text-xs font-medium ${TONES[tone]}`}>{children}</span>;
}

export default Badge;
