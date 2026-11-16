import { useRef } from "react";

// Accessible tabs (WAI-ARIA "tabs" pattern):
// - click a tab, or use ← → (and Home / End) to move between tabs
// - only the selected tab is reachable with Tab (tabIndex 0), the others are -1
// tabs: [{ id, label }] — value: selected id — onChange(id) — idPrefix: unique name for the ids
export function Tabs({ tabs, value, onChange, idPrefix, className = "" }) {
  const refs = useRef({});

  function handleKeyDown(event) {
    const index = tabs.findIndex((tab) => tab.id === value);
    const next = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    let newIndex = null;
    if (next) newIndex = (index + next + tabs.length) % tabs.length;
    if (event.key === "Home") newIndex = 0;
    if (event.key === "End") newIndex = tabs.length - 1;
    if (newIndex === null) return;

    event.preventDefault();
    const id = tabs[newIndex].id;
    onChange(id);
    refs.current[id]?.focus();
  }

  return (
    <div role="tablist" onKeyDown={handleKeyDown} className={`flex border-b border-border ${className}`}>
      {tabs.map((tab) => {
        const selected = tab.id === value;
        return (
          <button
            key={tab.id}
            ref={(el) => (refs.current[tab.id] = el)}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${tab.id}`}
            aria-selected={selected}
            aria-controls={`${idPrefix}-panel-${tab.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={`-mb-px border-b-2 px-4 py-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-ring ${
              selected ? "border-primary text-secondary" : "border-transparent text-muted-foreground hover:text-secondary"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

// The content of one tab. Linked to its tab button for screen readers.
export function TabPanel({ idPrefix, id, className = "", ...props }) {
  return (
    <div
      role="tabpanel"
      id={`${idPrefix}-panel-${id}`}
      aria-labelledby={`${idPrefix}-tab-${id}`}
      className={className}
      {...props}
    />
  );
}
