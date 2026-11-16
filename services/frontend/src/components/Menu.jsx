import { useEffect, useRef, useState } from "react";

// Dropdown menu opened by a button (e.g. the avatar in the top bar).
// Keyboard: opens with the first item focused, ↑ ↓ move, Escape closes and goes back to the button.
// label: what screen readers say for the button — button: what is shown (e.g. an <Avatar />)
// items: [{ label, icon: LucideIcon, onSelect }]
function Menu({ label, button, items }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const buttonRef = useRef(null);
  const itemRefs = useRef([]);

  // When the menu opens: focus the first item. While open: close on a click outside.
  useEffect(() => {
    if (!open) return;
    itemRefs.current[0]?.focus();
    function handleClickOutside(event) {
      if (!wrapperRef.current.contains(event.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  function close() {
    setOpen(false);
    buttonRef.current?.focus(); // keyboard users land back on the button
  }

  function handleKeyDown(event) {
    const current = itemRefs.current.indexOf(document.activeElement);
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      itemRefs.current[(current + step + items.length) % items.length]?.focus();
    } else if (event.key === "Tab") {
      setOpen(false); // leaving the menu with Tab closes it
    }
  }

  return (
    <div ref={wrapperRef} className="relative" onKeyDown={open ? handleKeyDown : undefined}>
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {button}
      </button>

      {open && (
        // end-0: aligned to the right edge of the button
        <div role="menu" aria-label={label} className="absolute end-0 top-full z-40 mt-2 w-52 rounded-xl border border-accent bg-card p-1.5 shadow-lg">
          {items.map((item, index) => (
            <button
              key={item.label}
              ref={(el) => (itemRefs.current[index] = el)}
              type="button"
              role="menuitem"
              tabIndex={-1}
              onClick={() => {
                setOpen(false);
                item.onSelect();
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-start text-sm text-secondary hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
            >
              {item.icon && <item.icon className="size-4 shrink-0" aria-hidden="true" />}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Menu;
