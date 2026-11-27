import AuthLayout from "../auth/AuthLayout";
import CredentialForm from "../auth/CredentialForm";

const fields = [
  {
    id: "username", label: "Username", type: "text", autoComplete: "username",
    validate: (value) => value.trim() ? "" : "Enter your username",
  },
  {
    id: "password", label: "Password", type: "password", autoComplete: "current-password",
    validate: (value) => value ? "" : "Enter your password",
  },
];

export default function SignIn() {
  return (
    <AuthLayout
      title="Sign in"
      subtitle="Choose how you want to sign in"
      footer="New to SyncSpace?"
      linkTo="/signup"
      linkText="Create an account"
    >
      <CredentialForm fields={fields} submitLabel="Sign in" dividerText="or use your username" />
    </AuthLayout>
  );
}
