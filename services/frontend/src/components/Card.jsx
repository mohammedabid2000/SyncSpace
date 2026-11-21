// White box with a warm hairline and a soft shadow, used to group content.
// "as" lets it be a <section>, <li>… instead of a <div> (better HTML meaning).
function Card({ as: Tag = "div", className = "", ...props }) {
  return <Tag className={`rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgb(13_36_52/4%)] ${className}`} {...props} />;
}

export default Card;
