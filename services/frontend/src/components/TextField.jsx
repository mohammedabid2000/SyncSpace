import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const LABEL = "text-sm font-medium text-secondary";
const INPUT =
  "h-10 w-full rounded-lg border border-input bg-background text-sm text-secondary outline-none transition-colors duration-150 placeholder:text-muted-foreground/80 focus-visible:border-secondary/40 focus-visible:ring-2 focus-visible:ring-ring/20 aria-invalid:border-destructive";

// Label + input + error message under it.
// Any extra prop (type, placeholder, autoComplete, maxLength, autoFocus…) goes to the <input>.
export function TextField({ id, label, value, onChange, error, hint, ...inputProps }) {
  // the error (or the hint) is linked to the input, so screen readers read it with the field
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
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
        aria-describedby={describedBy}
        className={`${INPUT} px-3`}
      />
      {hint && !error && <p id={`${id}-hint`} className="text-[13px] text-muted-foreground">{hint}</p>}
      {error && <p id={`${id}-error`} className="text-[13px] text-destructive">{error}</p>}
    </div>
  );
}

// Same as TextField, for passwords: adds the eye button to show / hide the password
export function PasswordField({ id, label, value, onChange, error, hint, ...inputProps }) {
  const [show, setShow] = useState(false);
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
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
          aria-describedby={describedBy}
          className={`${INPUT} ps-3 pe-10`}
        />
        {/* end-0: the eye sits at the end (right side) of the input */}
        <button
          type="button"
          onClick={() => setShow(!show)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute inset-y-0 end-0 flex items-center rounded-e-lg px-3 text-muted-foreground transition-colors duration-150 hover:text-secondary focus-visible:outline-2 focus-visible:outline-ring"
        >
          {show ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
        </button>
      </div>
      {hint && !error && <p id={`${id}-hint`} className="text-[13px] text-muted-foreground">{hint}</p>}
      {error && <p id={`${id}-error`} className="text-[13px] text-destructive">{error}</p>}
    </div>
  );
}
