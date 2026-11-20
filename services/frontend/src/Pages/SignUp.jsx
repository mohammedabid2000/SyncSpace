import { useState } from "react";
import { useNavigate, Link } from "react-router";
import AuthLayout from "../components/AuthLayout";
import Button from "../components/Button";
import GoogleAuthOption from "../components/GoogleAuthOption";
import { TextField, PasswordField } from "../components/TextField";

function SignUp() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ username: "", email: "", password: "" }); // "" = no error

  // Called when the user clicks "Create account" or presses Enter
  function handleSubmit(event) {
    event.preventDefault(); // stop the browser from reloading the page

    // Frontend validation
    const newErrors = {
      username: username.trim() === "" ? "Enter a username" : "",
      email: !/^\S+@\S+\.\S+$/.test(email) ? "Enter a valid email" : "", // something@something.something
      password: password.length < 8 ? "Use at least 8 characters" : "",
    };
    setErrors(newErrors);
    if (newErrors.username || newErrors.email || newErrors.password) return; // stop here, show the errors

    // TODO: send { username, email, password } to the backend sign up API, then go home only if it succeeds
    navigate("/home");
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start rooms and watch together with friends"
      footer={<>Already have an account? <Link to="/signin" className="font-medium text-secondary underline decoration-secondary/30 underline-offset-4 transition-colors duration-150 hover:decoration-secondary">Sign in</Link></>}
    >
      <div className="mt-8 w-full max-w-sm">
        <GoogleAuthOption
          label="Sign up with Google"
          dividerText="or create an account with email"
        />

        {/* noValidate: we show our own error messages instead of the browser's */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <TextField
            id="username"
            label="Username"
            autoComplete="username"
            value={username}
            onChange={setUsername}
            error={errors.username}
          />
          <TextField
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={setEmail}
            error={errors.email}
          />
          <PasswordField
            id="password"
            label="Password"
            autoComplete="new-password"
            hint="At least 8 characters"
            value={password}
            onChange={setPassword}
            error={errors.password}
          />

          <Button type="submit" className="mt-2 w-full">Create account</Button>
        </form>
      </div>
    </AuthLayout>
  );
}

export default SignUp;
