// White box with a light navy border and a soft shadow, used to group content.
// "as" lets it be a <section>, <li>… instead of a <div> (better HTML meaning).
function Card({ as: Tag = "div", className = "", ...props }) {
  return <Tag className={`rounded-2xl border border-accent bg-card shadow-sm ${className}`} {...props} />;
}

export default Card;
