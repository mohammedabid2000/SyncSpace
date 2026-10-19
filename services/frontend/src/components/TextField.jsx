import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const LABEL = "text-sm font-medium text-secondary";
const INPUT =
  "w-full rounded-md border border-input bg-background py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring aria-invalid:border-destructive";

// Label + input + error message under it.
// Any extra prop (type, placeholder, autoComplete, maxLength, autoFocus...) goes to the <input>.
export function TextField({ id, label, value, onChange, error, ...inputProps }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={LABEL}>{label}</label>
      <input
        id={id}
        type="text"
        {...inputProps}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${INPUT} px-3`}
      />
      {error && <p id={`${id}-error`} className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

// Same as TextField, for passwords: adds the eye button to show / hide the password
export function PasswordField({ id, label, value, onChange, error, ...inputProps }) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={LABEL}>{label}</label>
      <div className="relative">
        <input
          id={id}
          {...inputProps}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${INPUT} pl-3 pr-10`}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-secondary"
        >
          {show ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
        </button>
      </div>
      {error && <p id={`${id}-error`} className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
