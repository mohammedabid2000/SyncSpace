import { useState } from "react";
import { useNavigate, Link } from "react-router";
import AuthLayout from "../components/AuthLayout";
import Button from "../components/Button";
import { TextField, PasswordField } from "../components/TextField";

function SignIn() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ username: "", password: "" }); // "" = no error

  // Called when the user clicks "Sign in" or presses Enter
  function handleSubmit(event) {
    event.preventDefault(); // stop the browser from reloading the page

    // Frontend validation: both fields are required
    const newErrors = {
      username: username.trim() === "" ? "Enter your username" : "",
      password: password === "" ? "Enter your password" : "",
    };
    setErrors(newErrors);
    if (newErrors.username || newErrors.password) return; // stop here, show the errors

    // TODO: send { username, password } to the backend login API, then go home only if it succeeds
    navigate("/home");
  }

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Use your username and password"
      footer={<>New to SyncSpace? <Link to="/signup" className="font-medium text-secondary underline decoration-secondary/30 underline-offset-4 transition-colors duration-150 hover:decoration-secondary">Create an account</Link></>}
    >
      {/* noValidate: we show our own error messages instead of the browser's */}
      <form onSubmit={handleSubmit} noValidate className="mt-8 flex w-full max-w-sm flex-col gap-4">
        <TextField
          id="username"
          label="Username"
          autoComplete="username"
          value={username}
          onChange={setUsername}
          error={errors.username}
        />
        <PasswordField
          id="password"
          label="Password"
          autoComplete="current-password"
          value={password}
          onChange={setPassword}
          error={errors.password}
        />

        <Button type="submit" className="mt-2 w-full">Sign in</Button>
      </form>
    </AuthLayout>
  );
}

export default SignIn;
