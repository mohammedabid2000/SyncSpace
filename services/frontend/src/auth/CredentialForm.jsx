import { useState } from "react";
import { useNavigate } from "react-router";
import Button from "../components/Button";
import { PasswordField, TextField } from "../components/TextField";
import GoogleAuthOption from "./GoogleAuthOption";

export default function CredentialForm({ fields, submitLabel, googleLabel, dividerText }) {
  const navigate = useNavigate();
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    for (const { id, validate } of fields) {
      const error = validate(values[id] ?? "");
      if (error) nextErrors[id] = error;
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    // TODO: submit credentials to the backend and navigate on success.
    navigate("/home");
  }

  return (
    <div className="mt-8 w-full max-w-sm">
      <GoogleAuthOption label={googleLabel} dividerText={dividerText} />
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {fields.map(({ id, label, type, autoComplete, hint }) => {
          const Field = type === "password" ? PasswordField : TextField;
          return (
            <Field
              key={id}
              id={id}
              label={label}
              type={type}
              autoComplete={autoComplete}
              hint={hint}
              value={values[id] ?? ""}
              onChange={(value) => setValues((previous) => ({ ...previous, [id]: value }))}
              error={errors[id]}
            />
          );
        })}
        <Button type="submit" className="mt-2 w-full">{submitLabel}</Button>
      </form>
    </div>
  );
}
