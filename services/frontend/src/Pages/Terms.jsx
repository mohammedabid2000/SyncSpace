import { Link } from "react-router";
import LegalLayout from "../components/LegalLayout";

function Terms() {
  return (
    <LegalLayout title="Terms of Service" updated="October 19, 2026">
      <section>
        <p>
          Welcome to SyncSpace, a web application for watching videos together in shared rooms.
          By creating an account or using SyncSpace, you agree to these terms. If you do not agree,
          please do not use the service.
        </p>
      </section>

      <section>
        <h2>1. Your account</h2>
        <ul>
          <li>You need an account (username, email, and password) to create or join rooms.</li>
          <li>The information you give must be accurate, and you must not impersonate someone else.</li>
          <li>You are responsible for keeping your password secret and for everything done with your account.</li>
        </ul>
      </section>

      <section>
        <h2>2. Rooms and hosts</h2>
        <ul>
          <li>The person who creates a room is its <strong>host</strong>.</li>
          <li>The host can rename the room, set the people limit, and starts and controls the shared virtual browser.</li>
          <li>Anyone who has a room&apos;s invite link can join it, as long as the room is not full. Only share your invite link with people you trust.</li>
        </ul>
      </section>

      <section>
        <h2>3. Acceptable use</h2>
        <p>When you use SyncSpace, you must not:</p>
        <ul>
          <li>share or stream content you do not have the right to share, or that breaks copyright law;</li>
          <li>share illegal, violent, hateful, or sexually explicit content;</li>
          <li>harass, threaten, or insult other users in the chat or in rooms;</li>
          <li>use the virtual browser to attack other websites, spread malware, or send spam;</li>
          <li>try to break, overload, or get around the security of the service.</li>
        </ul>
      </section>

      <section>
        <h2>4. The shared virtual browser</h2>
        <p>
          Everything shown in the virtual browser is visible to everyone in the room. Never enter
          passwords, payment details, or private information in it. Virtual browser sessions are
          temporary and are deleted when the room closes.
        </p>
      </section>

      <section>
        <h2>5. Your content</h2>
        <p>
          You are responsible for what you send and share: chat messages, profile pictures, cover
          photos, and what you display in the virtual browser. You keep the rights to your content,
          and you allow SyncSpace to show it to the people in your rooms so the service can work.
        </p>
      </section>

      <section>
        <h2>6. Suspension and deletion</h2>
        <p>
          We may remove content, close rooms, or suspend accounts that break these terms. You can
          delete your account at any time.
        </p>
      </section>

      <section>
        <h2>7. Availability</h2>
        <p>
          SyncSpace is a student project made at 42. It is provided &quot;as is&quot;: we do our best to keep
          it running, but we cannot guarantee that it will always be available or free of errors.
        </p>
      </section>

      <section>
        <h2>8. Privacy</h2>
        <p>
          How we collect and use your data is explained in our{" "}
          <Link to="/privacy" className="font-medium underline hover:text-primary">Privacy Policy</Link>.
        </p>
      </section>

      <section>
        <h2>9. Changes to these terms</h2>
        <p>
          We may update these terms. When we do, we will change the date at the top of this page.
          Continuing to use SyncSpace after a change means you accept the new terms.
        </p>
      </section>

      <section>
        <h2>10. Contact</h2>
        <p>For any question about these terms, contact the SyncSpace team through the project repository.</p>
      </section>
    </LegalLayout>
  );
}

export default Terms;
