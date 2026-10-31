import { useEffect } from "react";
import { X } from "lucide-react";

// Reusable popup (modal): a dark overlay + a centered card.
// showPopUp: true/false — closePopUp: function to close it — title: heading — children: what goes inside
function PopUp({ showPopUp, closePopUp, title, children }) {
  // Close the popup with the Escape key
  useEffect(() => {
    if (!showPopUp) return;
    function handleKey(event) {
      if (event.key === "Escape") closePopUp();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [showPopUp, closePopUp]);

  if (!showPopUp) return null;

  return (
    // Dark overlay covering the whole page — clicking it closes the popup
    <div
      onClick={closePopUp}
      className="fixed inset-0 z-50 flex items-center justify-center bg-secondary/60 p-4"
    >
      {/* The card — stopPropagation: clicking INSIDE the card must not close it */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-title"
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl border border-accent bg-card p-6 shadow-xl"
      >
        <button
          type="button"
          onClick={closePopUp}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-secondary focus-visible:outline-2 focus-visible:outline-ring"
        >
          <X className="size-5" aria-hidden="true" />
        </button>

        {title && (
          <h2 id="popup-title" className="pr-8 text-xl font-bold tracking-tight text-secondary">
            {title}
          </h2>
        )}

        {children}
      </div>
    </div>
  );
}

export default PopUp;
