import { useState } from "react";
import { useNavigate } from "react-router";
import AuthLayout from "../components/AuthLayout";
import Button from "../components/Button";
import { TextField, PasswordField } from "../components/TextField";

function SignUp() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ username: "", email: "", password: "" }); // "" = no error

  // Called when the user clicks "Connect" or presses Enter
  function handleSubmit(event) {
    event.preventDefault(); // stop the browser from reloading the page

    // Frontend validation
    const newErrors = {
      username: username.trim() === "" ? "Please enter a username." : "",
      email: !/^\S+@\S+\.\S+$/.test(email) ? "Please enter a valid email." : "", // something@something.something
      password: password.length < 8 ? "Password must be at least 8 characters." : "",
    };
    setErrors(newErrors);
    if (newErrors.username || newErrors.email || newErrors.password) return; // stop here, show the errors

    // TODO: send { username, email, password } to the backend sign up API, then go home only if it succeeds
    navigate("/home");
  }

  return (
    <AuthLayout title="First time here?" subtitle="Create your account to start watching together.">
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
        <TextField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          value={email}
          onChange={setEmail}
          error={errors.email}
        />
        <PasswordField
          id="password"
          label="Password"
          autoComplete="new-password"
          placeholder="Enter your password"
          value={password}
          onChange={setPassword}
          error={errors.password}
        />

        <Button type="submit" className="mt-2 w-full">Connect</Button>
        <Button variant="outline" className="w-full" onClick={() => navigate("/signin")}>
          Sign in
        </Button>
      </form>
    </AuthLayout>
  );
}

export default SignUp;
