import AuthIllustrationPanel from "./AuthIllustrationPanel";
import Logo from "./Logo";

// Card shared by the Sign in and Sign up pages:
// illustration on the left (desktop only), logo + title + the form (children) on the right,
// and a quiet line under the form to switch page (footer).
function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 md:p-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[20px] border border-border bg-card shadow-[0_16px_48px_-16px_rgb(13_36_52/18%)] md:min-h-[44rem] md:grid-cols-2">
        <AuthIllustrationPanel />

        <div className="flex flex-col items-center justify-center px-6 py-12 md:px-12">
          <Logo size="sm" to="/" className="mb-8" />
          <h1 className="text-center font-serif text-[40px] leading-[1.1] text-secondary md:text-5xl">{title}</h1>
          <p className="mt-3 text-center text-[15px] text-muted-foreground">{subtitle}</p>
          {children}
          {footer && <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
