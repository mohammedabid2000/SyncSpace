import { useEffect, useRef } from "react";
import { Check } from "lucide-react";

// Small confirmation message at the bottom of the screen ("Profile saved ✓").
// It disappears by itself after 3 seconds. role="status": screen readers read it out.
// Usage: const [toast, setToast] = useState("");  →  <Toast message={toast} onDone={() => setToast("")} />
function Toast({ message, onDone }) {
  // Keep the latest onDone without restarting the timer on every render
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => onDoneRef.current(), 3000);
    return () => clearTimeout(timer); // a new message restarts the 3 seconds
  }, [message]);

  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4">
      {message && (
        <p className="flex items-center gap-2 rounded-xl bg-secondary px-4 py-3 text-sm font-medium text-white shadow-lg">
          <Check className="size-4" strokeWidth={3} aria-hidden="true" />
          {message}
        </p>
      )}
    </div>
  );
}

export default Toast;
