import { validateEmail } from "../account/validation";
import AuthLayout from "../auth/AuthLayout";
import CredentialForm from "../auth/CredentialForm";

const fields = [
  {
    id: "username", label: "Username", type: "text", autoComplete: "username",
    validate: (value) => value.trim() ? "" : "Enter a username",
  },
  {
    id: "email", label: "Email", type: "email", autoComplete: "email",
    validate: validateEmail,
  },
  {
    id: "password", label: "Password", type: "password", autoComplete: "new-password",
    hint: "At least 8 characters",
    validate: (value) => value.length < 8 ? "Use at least 8 characters" : "",
  },
];

export default function SignUp() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start rooms and watch together with friends"
      footer="Already have an account?"
      linkTo="/signin"
      linkText="Sign in"
    >
      <CredentialForm
        fields={fields}
        submitLabel="Create account"
        googleLabel="Sign up with Google"
        dividerText="or create an account with email"
      />
    </AuthLayout>
  );
}
