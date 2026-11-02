import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import IconButton from "./IconButton";

// Everything that can receive keyboard focus inside the popup
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

// Reusable popup (modal): a dark overlay + a centered card.
// showPopUp: true/false — closePopUp: function to close it — title: heading — children: what goes inside
function PopUp({ showPopUp, closePopUp, title, children }) {
  const cardRef = useRef(null);

  // Keep the latest closePopUp without re-running the effect on every render
  const closeRef = useRef(closePopUp);
  useEffect(() => {
    closeRef.current = closePopUp;
  });

  useEffect(() => {
    if (!showPopUp) return;
    const opener = document.activeElement; // the button that opened the popup
    const card = cardRef.current;

    // 1. Move focus inside: the first field if there is one, otherwise the first button
    //    (popups don't use autoFocus, so "opener" above is still the button that opened it)
    (card.querySelector("input, select, textarea") ?? card.querySelector(FOCUSABLE))?.focus();

    // 2. Don't let the page behind scroll
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // 3. Escape closes — Tab / Shift+Tab loop inside the popup (focus trap)
    function handleKey(event) {
      if (event.key === "Escape") closeRef.current();
      if (event.key !== "Tab") return;
      const focusable = [...card.querySelectorAll(FOCUSABLE)];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", handleKey);

    // When the popup closes: undo everything and give focus back to the opener
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
      opener?.focus?.();
    };
  }, [showPopUp]);

  if (!showPopUp) return null;

  return (
    // Dark overlay covering the whole page — clicking it closes the popup
    <div onClick={closePopUp} className="fixed inset-0 z-50 flex items-center justify-center bg-secondary/60 p-4">
      {/* The card — stopPropagation: clicking INSIDE the card must not close it */}
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-title"
        onClick={(event) => event.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-accent bg-card p-6 shadow-xl"
      >
        <IconButton label="Close" variant="muted" size="sm" onClick={closePopUp} className="absolute end-3 top-3">
          <X className="size-5" aria-hidden="true" />
        </IconButton>

        {title && (
          <h2 id="popup-title" className="pe-8 text-xl font-bold tracking-tight text-secondary">
            {title}
          </h2>
        )}

        {children}
      </div>
    </div>
  );
}

export default PopUp;
