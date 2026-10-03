import { useEffect, useState, type AnchorHTMLAttributes } from "react";

// A minimal path router: "/" is the home page, "/<slug>" an offering page.
// The host must serve index.html for unknown paths (Vite's dev and preview servers do).
const EVENT = "ae-navigate";

export function usePath() {
  const [path, setPath] = useState(() => window.location.pathname);
  useEffect(() => {
    const sync = () => setPath(window.location.pathname);
    window.addEventListener("popstate", sync);
    window.addEventListener(EVENT, sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener(EVENT, sync);
    };
  }, []);
  return path;
}

/** Scrolls to the URL's hash target, or to the top when there is none. */
export function scrollToHash(smooth: boolean) {
  const { hash } = window.location;
  const el = hash ? document.querySelector(hash) : null;
  if (el) el.scrollIntoView({ behavior: smooth ? "smooth" : "instant" });
  else window.scrollTo({ top: 0, behavior: "instant" });
}

export function navigate(to: string) {
  const url = new URL(to, window.location.href);
  const samePage = url.pathname === window.location.pathname;
  history.pushState(null, "", url.pathname + url.hash);
  // A page change scrolls once the new page renders (see App); same-page links scroll now.
  if (samePage) scrollToHash(true);
  else window.dispatchEvent(new Event(EVENT));
}

export function Link({ to, onClick, ...rest }: { to: string } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...rest}
      href={to}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        navigate(to);
      }}
    />
  );
}
