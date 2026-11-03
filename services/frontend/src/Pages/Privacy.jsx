import { Link } from "react-router";
import LegalLayout from "../components/LegalLayout";

function Privacy() {
  return (
    <LegalLayout title="Privacy Policy" updated="October 19, 2026">
      <section>
        <p>
          SyncSpace is a web application that lets you create rooms and watch videos together in
          real time, on a shared virtual browser, while chatting with friends. SyncSpace was built
          as a student project in the 42 curriculum. This page explains what data we collect, why
          we collect it, and what you can do with it.
        </p>
      </section>

      <section>
        <h2>1. Data we collect</h2>
        <p>When you create an account and use SyncSpace, we store:</p>
        <ul>
          <li><strong>Account data:</strong> your username, your email address, and your password. Your password is never stored in plain text: it is hashed and salted.</li>
          <li><strong>Profile images:</strong> the profile picture and cover photo you choose to upload.</li>
          <li><strong>Room data:</strong> the rooms you create or join, their names, people limits, and who the host is.</li>
          <li><strong>Chat messages:</strong> the messages and emojis you send in a room.</li>
          <li><strong>Technical data:</strong> server logs (such as the time of a request and error messages) that help us keep the service running and secure.</li>
        </ul>
      </section>

      <section>
        <h2>2. Why we use your data</h2>
        <ul>
          <li>To create your account and let you sign in securely.</li>
          <li>To show your username and picture to the people in your rooms.</li>
          <li>To run rooms: sync the shared browser, show who is online, and deliver chat messages in real time.</li>
          <li>To detect problems and protect the service against abuse.</li>
        </ul>
        <p>We do not sell your data, we do not show you advertising, and we do not use your data for profiling.</p>
      </section>

      <section>
        <h2>3. The shared virtual browser</h2>
        <p>
          Everything shown in a room&apos;s virtual browser is visible to <strong>everyone in that room</strong>.
          Do not type passwords, payment details, or other personal information into the virtual browser.
          Virtual browser sessions are temporary: they are deleted when the room closes, and we do not
          record what is shown on the screen.
        </p>
      </section>

      <section>
        <h2>4. Cookies and local storage</h2>
        <p>
          We only use what is needed to keep you signed in (a session token). We do not use tracking
          or advertising cookies.
        </p>
      </section>

      <section>
        <h2>5. Who can see your data</h2>
        <ul>
          <li>People in the same room can see your username, profile picture, and the messages you send there.</li>
          <li>Your email address is never shown to other users.</li>
          <li>We do not share your data with third parties.</li>
        </ul>
      </section>

      <section>
        <h2>6. How long we keep your data</h2>
        <p>
          We keep your account data until you delete your account. Chat messages and room data are
          kept while the room exists. Server logs are kept for a limited time and then deleted.
        </p>
      </section>

      <section>
        <h2>7. Security</h2>
        <p>
          All connections to SyncSpace use HTTPS. Passwords are hashed, and secrets used by the
          service are stored separately from the application code.
        </p>
      </section>

      <section>
        <h2>8. Your rights</h2>
        <p>You can at any time:</p>
        <ul>
          <li>see the personal data we hold about you,</li>
          <li>correct it,</li>
          <li>ask us to delete your account and all the data linked to it.</li>
        </ul>
      </section>

      <section>
        <h2>9. Changes to this policy</h2>
        <p>
          If we change this policy, we will update the date at the top of this page. Please also read
          our <Link to="/terms" className="font-medium underline hover:text-primary">Terms of Service</Link>.
        </p>
      </section>

      <section>
        <h2>10. Contact</h2>
        <p>
          SyncSpace is a student project made at 42. For any question about your data, contact the
          SyncSpace team through the project repository.
        </p>
      </section>
    </LegalLayout>
  );
}

export default Privacy;
