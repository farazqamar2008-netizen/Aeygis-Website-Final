import { useEffect, useState } from "react";
import { Alignment, Button, Navbar, NavbarDivider, NavbarGroup, Tag } from "@blueprintjs/core";
import { Logo } from "./Logo";
import { useClock, useTheme } from "../hooks";
import { Link, navigate } from "../router";

const LINKS = [
  { href: "/#updates", label: "Updates" },
  { href: "/#services", label: "Services" },
  { href: "/#contact", label: "Contact" },
];

export function TopNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const now = useClock();
  const { theme, toggle } = useTheme();
  // Palantir-style: in light mode the bar stays dark and transparent over the hero, then turns light on scroll.
  const onDark = theme === "dark" || !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const utc = now.toISOString().slice(11, 19);

  return (
    <>
      <Navbar className={`ae-nav${scrolled ? " is-scrolled" : ""}${onDark ? " bp6-dark ae-on-dark" : ""}`}>
        <NavbarGroup align={Alignment.START}>
          <Link className="ae-nav-brand" to="/" aria-label="Aeygis home">
            <Logo height={20} />
          </Link>
          <NavbarDivider className="ae-nav-links" />
          <div className="ae-nav-links">
            {LINKS.map((l) => (
              <Button key={l.href} variant="minimal" text={l.label} onClick={() => navigate(l.href)} />
            ))}
          </div>
        </NavbarGroup>
        <NavbarGroup align={Alignment.END}>
          <div className="ae-nav-meta mono">
            <Tag minimal intent="success" icon="dot">
              CPCSC L1 · 200+ in 2027
            </Tag>
            <span className="faint">UTC {utc}</span>
          </div>
          <NavbarDivider className="ae-nav-links" />
          <Button className="ae-cta ae-nav-links" icon="document-share" text="Submit a tender" onClick={() => navigate("/#contact")} />
          <Button
            variant="minimal"
            icon={theme === "dark" ? "flash" : "moon"}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Light mode" : "Dark mode"}
            onClick={toggle}
          />
          <Button
            className="ae-nav-toggle"
            variant="minimal"
            icon={open ? "cross" : "menu"}
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          />
        </NavbarGroup>
      </Navbar>
      {open && (
        <div className={`ae-mobile-menu${onDark ? " bp6-dark ae-on-dark" : ""}`}>
          {LINKS.map((l) => (
            <Button
              key={l.href}
              variant="minimal"
              size="large"
              text={l.label}
              onClick={() => {
                setOpen(false);
                navigate(l.href);
              }}
            />
          ))}
          <Button className="ae-cta" size="large" icon="document-share" text="Submit a tender" onClick={() => { setOpen(false); navigate("/#contact"); }} />
        </div>
      )}
    </>
  );
}
