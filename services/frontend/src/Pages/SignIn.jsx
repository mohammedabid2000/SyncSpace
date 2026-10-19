import { useState } from "react";
import { useNavigate } from "react-router";
import AuthLayout from "../components/AuthLayout";
import { TextField, PasswordField } from "../components/TextField";

function SignIn() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ username: "", password: "" }); // "" = no error

  // Called when the user clicks "Connect" or presses Enter
  function handleSubmit(event) {
    event.preventDefault(); // stop the browser from reloading the page

    // Frontend validation: both fields are required
    const newErrors = {
      username: username.trim() === "" ? "Please enter your username." : "",
      password: password === "" ? "Please enter your password." : "",
    };
    setErrors(newErrors);
    if (newErrors.username || newErrors.password) return; // stop here, show the errors

    // TODO: send { username, password } to the backend login API, then go home only if it succeeds
    navigate("/home");
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Enter your username and password to connect.">
      {/* noValidate: we show our own error messages instead of the browser's */}
      <form onSubmit={handleSubmit} noValidate className="mt-8 flex w-full max-w-sm flex-col gap-5">
        <TextField
          id="username"
          label="Username"
          autoComplete="username"
          placeholder="Enter your username"
          value={username}
          onChange={setUsername}
          error={errors.username}
        />
        <PasswordField
          id="password"
          label="Password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={setPassword}
          error={errors.password}
        />

        <button
          type="submit"
          className="mt-2 w-full rounded-md bg-secondary py-3 text-sm font-medium text-white hover:bg-secondary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Connect
        </button>
        <button
          type="button"
          onClick={() => navigate("/signup")}
          className="w-full rounded-md border border-secondary py-3 text-sm font-medium text-secondary hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Sign Up
        </button>
      </form>
    </AuthLayout>
  );
}

export default SignIn;
