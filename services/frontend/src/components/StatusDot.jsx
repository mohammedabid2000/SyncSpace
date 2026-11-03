
// Green dot + "Online" or grey dot + "Offline".
// The text is always there: color alone is not enough for color-blind users.
// showText={false} hides the text visually but keeps it for screen readers.
function StatusDot({ online, showText = true }) {
  const label = online ? "Online" : "Offline";
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
      <span className={`size-2.5 shrink-0 rounded-full ${online ? "bg-success" : "bg-muted-foreground/40"}`} aria-hidden="true" />
      <span className={showText ? "" : "sr-only"}>{label}</span>
    </span>
  );
}

export default StatusDot;
