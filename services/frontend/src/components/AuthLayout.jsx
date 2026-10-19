import AuthIllustrationPanel from "./AuthIllustrationPanel";
import Logo from "./Logo";

// Card shared by the Sign in and Sign up pages:
// illustration on the left (desktop only), logo + title + the form (children) on the right.
function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 md:p-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-card shadow-xl md:min-h-[47rem] md:grid-cols-2">
        <AuthIllustrationPanel />

        <div className="flex flex-col items-center justify-center px-6 py-12 md:px-12">
          <Logo size="sm" to="/" className="mb-10" />
          <h1 className="text-center font-serif text-4xl text-secondary md:text-5xl">{title}</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
