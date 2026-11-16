import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

// Thin bar at the top of every page when the connection is lost.
// The app still opens offline (service worker), but live features need the network.
function OfflineBanner() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  if (online) return null;
  return (
    <p role="status" className="flex items-center justify-center gap-2 bg-secondary px-4 py-2 text-sm text-white">
      <WifiOff className="size-4" aria-hidden="true" />
      You&apos;re offline — rooms, chat and friends need a connection.
    </p>
  );
}

export default OfflineBanner;
