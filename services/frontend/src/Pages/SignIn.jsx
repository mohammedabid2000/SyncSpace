import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import AuthIllustrationPanel from "../components/AuthIllustrationPanel";

function SignIn() {
  const navigate = useNavigate();

  // What the user types in each field
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // Show or hide the password (eye button)
  const [showPassword, setShowPassword] = useState(false);
  // Error message for each field ("" = no error)
  const [errors, setErrors] = useState({ username: "", password: "" });

  // Called when the user clicks "Connect" or presses Enter
  function handleSubmit(event) {
    event.preventDefault(); // stop the browser from reloading the page

    // Frontend validation: both fields are required
    const newErrors = {
      username: username.trim() === "" ? "Please enter your username." : "",
      password: password === "" ? "Please enter your password." : "",
    };
    setErrors(newErrors);

    if (newErrors.username || newErrors.password) {
      return; // stop here, show the errors
    }

    // TODO: send { username, password } to the backend login API
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 md:p-8">
      {/* Card: 2 columns on desktop (image | form), only the form on phones */}
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-card shadow-xl md:min-h-[47rem] md:grid-cols-2">

        <AuthIllustrationPanel />

        {/* RIGHT: the form */}
        <div className="flex flex-col items-center justify-center px-6 py-12 md:px-12">
          {/* Logo → back to the home page */}
          <Link to="/" className="mb-10 flex items-center gap-2">
            <img src="/syncspace-logo.svg" alt="" className="h-8 w-auto" />
            <span className="text-xl font-bold tracking-tight text-secondary">SyncSpace</span>
          </Link>

          <h1 className="text-center font-serif text-4xl text-secondary md:text-5xl">
            Welcome back
          </h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Enter your username and password to connect.
          </p>

          {/* noValidate: we show our own error messages instead of the browser's */}
          <form onSubmit={handleSubmit} noValidate className="mt-8 flex w-full max-w-sm flex-col gap-5">

            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="username" className="text-sm font-medium text-secondary">
                Username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                aria-invalid={errors.username ? "true" : "false"}
                aria-describedby={errors.username ? "username-error" : undefined}
                className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring aria-invalid:border-destructive"
              />
              {errors.username && (
                <p id="username-error" className="text-sm text-destructive">{errors.username}</p>
              )}
            </div>

            {/* Password + eye button */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-secondary">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  className="w-full rounded-md border border-input bg-background py-2.5 pl-3 pr-10 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring aria-invalid:border-destructive"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-secondary"
                >
                  {showPassword ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            {/* Connect = submit the form */}
            <button
              onClick={() => navigate("/home")}
              type="submit"
              className="mt-2 w-full rounded-md bg-secondary py-3 text-sm font-medium text-white hover:bg-secondary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Connect
            </button>

            {/* Sign Up = go to the sign up page */}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="w-full rounded-md border border-secondary py-3 text-sm font-medium text-secondary hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
