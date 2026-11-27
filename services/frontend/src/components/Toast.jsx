import { useEffect, useEffectEvent } from "react";
import { Check } from "lucide-react";

// Small confirmation message at the bottom of the screen ("Profile saved").
// It disappears by itself after 3 seconds. role="status": screen readers read it out.
// Usage: const [toast, setToast] = useState("");  →  <Toast message={toast} onDone={() => setToast("")} />
function Toast({ message, onDone }) {
  const dismiss = useEffectEvent(onDone);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => dismiss(), 3000);
    return () => clearTimeout(timer); // a new message restarts the 3 seconds
  }, [message]);

  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4">
      {message && (
        <p className="animate-pop flex h-11 items-center gap-2 rounded-xl bg-secondary px-4 text-sm font-medium text-white shadow-[0_8px_24px_rgb(13_36_52/20%)]">
          <Check className="size-4 text-white/70" aria-hidden="true" />
          {message}
        </p>
      )}
    </div>
  );
}

export default Toast;
