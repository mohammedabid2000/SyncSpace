import { useState } from "react";
import { Plus, LogIn, Share, Settings, Trash2, UserRound, LogOut, Globe, MessagesCircle, Check, X } from "lucide-react";
import Logo from "../components/Logo";
import Button from "../components/Button";
import IconButton from "../components/IconButton";
import Card from "../components/Card";
import Badge from "../components/Badge";
import StatusDot from "../components/StatusDot";
import Avatar from "../components/Avatar";
import PopUp from "../components/PopUp";
import Menu from "../components/Menu";
import Toast from "../components/Toast";
import { Tabs, TabPanel } from "../components/Tabs";
import { TextField, PasswordField } from "../components/TextField";
import linaPhoto from "../assets/avatars/lina.svg";

// The theme colors (defined once in src/index.css → @theme)
const COLORS = [
  { name: "background", use: "page background" },
  { name: "card", use: "cards, popups" },
  { name: "secondary", use: "navy: text, buttons" },
  { name: "secondary-hover", use: "navy hover" },
  { name: "primary", use: "logo red: one main action per screen" },
  { name: "primary-hover", use: "red hover" },
  { name: "accent", use: "light navy: hover backgrounds" },
  { name: "muted-foreground", use: "secondary text" },
  { name: "border", use: "every hairline: cards, dividers, menus" },
  { name: "destructive", use: "errors, remove" },
  { name: "success", use: "online dots" },
];

const ICONS = { Plus, LogIn, Share, Settings, Trash2, UserRound, LogOut, Globe, MessagesCircle, Check, X };

// One block of the page: a title and a card with the examples
function Block({ title, children }) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-medium text-secondary">{title}</h2>
      <Card className="p-6">{children}</Card>
    </section>
  );
}

// Living documentation of the design system: every reusable component, shown with its variants
function DesignSystem() {
  const [palette] = useState(() => {
    const theme = getComputedStyle(document.documentElement);
    return COLORS.map((color) => ({
      ...color,
      value: theme.getPropertyValue(`--color-${color.name}`).trim(),
    }));
  });
  const [tab, setTab] = useState("one");
  const [popup, setPopup] = useState(false);
  const [toast, setToast] = useState("");
  const [text, setText] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen">
      <header className="flex h-16 items-center border-b border-border px-6">
        <Logo to="/" className="w-fit" />
      </header>

      <main className="mx-auto max-w-5xl space-y-10 px-6 py-12">
        <div>
          <h1 className="text-[40px] font-medium leading-[1.1] tracking-[-0.02em] text-secondary">Design system</h1>
          <p className="mt-2 text-muted-foreground">The colors, typography, icons and components SyncSpace is built from.</p>
        </div>

        <Block title="Colors">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {palette.map((c) => (
              <li key={c.name} className="flex items-center gap-3">
                <span className="size-12 shrink-0 rounded-xl border border-border" style={{ backgroundColor: c.value }} aria-hidden="true" />
                <span className="text-sm">
                  <span className="block font-medium text-secondary">{c.name}</span>
                  <span className="block text-muted-foreground">{c.value.startsWith("#") ? c.value.toUpperCase() : c.value} — {c.use}</span>
                </span>
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Typography">
          <div className="space-y-3">
            <p className="text-4xl font-medium tracking-[-0.02em] text-secondary">Heading — Instrument Sans 500</p>
            <p className="text-4xl tracking-[-0.02em] text-secondary">The <span className="accent-word">accent word</span> — Instrument Serif italic</p>
            <p className="text-secondary">Body text — friends watching a movie together</p>
            <p className="text-sm text-muted-foreground">Small text — hints, dates and descriptions</p>
            <p className="max-w-xl text-sm text-muted-foreground">
              Weights are 400 and 500 (600 only for the wordmark), sentence case everywhere. The red italic accent word
              (class <code className="text-secondary">accent-word</code>) appears once per main headline and nowhere else.
            </p>
          </div>
        </Block>

        <Block title="Icons">
          <p className="mb-4 text-sm text-muted-foreground">
            Lucide icons at 16px or 18px with a 1.5 stroke, in the color of their text. Hidden from screen readers (aria-hidden) next to a text label.
          </p>
          <ul className="flex flex-wrap gap-4 text-secondary">
            {Object.entries(ICONS).map(([name, Icon]) => (
              <li key={name} title={name}>
                <Icon className="size-[18px]" aria-hidden="true" />
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Buttons">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary"><Plus className="size-4" aria-hidden="true" />Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="subtle">Subtle</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="dangerOutline">Danger outline</Button>
            <Button disabled>Disabled</Button>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="base">Base</Button>
            <Button size="lg">Large</Button>
          </div>
          <div className="mt-4 inline-flex rounded-xl bg-secondary p-3">
            <Button variant="light">Light (on navy)</Button>
          </div>
        </Block>

        <Block title="Icon buttons">
          <div className="flex flex-wrap items-center gap-3">
            <IconButton label="Ghost"><Settings className="size-[18px]" aria-hidden="true" /></IconButton>
            <IconButton label="Muted" variant="muted"><X className="size-[18px]" aria-hidden="true" /></IconButton>
            <IconButton label="Solid" variant="solid"><Check className="size-[18px]" aria-hidden="true" /></IconButton>
            <IconButton label="Primary" variant="primary"><Plus className="size-[18px]" aria-hidden="true" /></IconButton>
            <IconButton label="Light" variant="light"><Share className="size-[18px]" aria-hidden="true" /></IconButton>
            <IconButton label="Danger" variant="danger"><Trash2 className="size-[18px]" aria-hidden="true" /></IconButton>
          </div>
        </Block>

        <Block title="Form fields">
          <div className="grid max-w-md gap-4">
            <TextField id="ds-text" label="Text field" placeholder="Type something" value={text} onChange={setText} hint="A hint under the field." />
            <TextField id="ds-error" label="With an error" value="" onChange={() => {}} error="This field shows an error." />
            <PasswordField id="ds-password" label="Password field" value={password} onChange={setPassword} />
          </div>
        </Block>

        <Block title="Badges, status & avatars">
          <div className="flex flex-wrap items-center gap-6">
            <Badge>Host</Badge>
            <Badge tone="secondary">Member</Badge>
            <StatusDot online />
            <StatusDot online={false} />
            <Avatar src={linaPhoto} name="Lina" />
            <Avatar name="Yasser" />
            <Avatar src={linaPhoto} name="Lina" className="size-16 text-xl" />
          </div>
        </Block>

        <Block title="Tabs">
          <Tabs
            idPrefix="ds"
            value={tab}
            onChange={setTab}
            tabs={[{ id: "one", label: "First tab" }, { id: "two", label: "Second tab" }]}
          />
          <TabPanel idPrefix="ds" id={tab} className="pt-4 text-secondary">
            {tab === "one" ? "Use the ← → arrow keys to move between tabs." : "Tabs follow the WAI-ARIA tabs pattern."}
          </TabPanel>
        </Block>

        <Block title="Popup, menu & toast">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" onClick={() => setPopup(true)}>Open popup</Button>
            <Button variant="outline" onClick={() => setToast("This is a toast message")}>Show toast</Button>
            <Menu
              label="Example menu"
              button={<Avatar src={linaPhoto} name="Lina" />}
              items={[
                { label: "My profile", icon: UserRound, onSelect: () => {} },
                { label: "Sign out", icon: LogOut, onSelect: () => {} },
              ]}
            />
          </div>
        </Block>

        <Block title="Cards">
          <p className="text-secondary">Cards group related content: white background, warm hairline, a very soft shadow.</p>
        </Block>
      </main>

      <PopUp showPopUp={popup} closePopUp={() => setPopup(false)} title="Example popup">
        <p className="mt-2 text-muted-foreground">
          Focus stays inside the popup. Press Escape or click outside to close it.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="subtle" onClick={() => setPopup(false)}>Cancel</Button>
          <Button onClick={() => setPopup(false)}>OK</Button>
        </div>
      </PopUp>

      <Toast message={toast} onDone={() => setToast("")} />
    </div>
  );
}

export default DesignSystem;
