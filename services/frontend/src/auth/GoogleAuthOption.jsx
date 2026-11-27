import Button from "../components/Button";
import GoogleIcon from "./GoogleIcon";

const API_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");
const GOOGLE_AUTH_URL = import.meta.env.VITE_GOOGLE_AUTH_URL || `${API_URL}/auth/google`;

function GoogleAuthOption({ label = "Continue with Google", dividerText }) {
  function handleGoogleAuth() {
    window.location.assign(GOOGLE_AUTH_URL);
  }

  return (
    <>
      <Button
        variant="subtle"
        type="button"
        onClick={handleGoogleAuth}
        className="w-full bg-card"
      >
        <GoogleIcon />
        {label}
      </Button>

      <div
        className="my-5 flex items-center gap-3"
        role="separator"
        aria-label="Alternative authentication option"
      >
        <span className="h-px flex-1 bg-border" aria-hidden="true" />
        <span className="text-xs font-medium text-muted-foreground">{dividerText}</span>
        <span className="h-px flex-1 bg-border" aria-hidden="true" />
      </div>
    </>
  );
}

export default GoogleAuthOption;
