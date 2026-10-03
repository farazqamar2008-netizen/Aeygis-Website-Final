import { useEffect, useRef, useState } from "react";
import { Icon } from "@blueprintjs/core";
import { usePrefersReducedMotion } from "../hooks";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = usePrefersReducedMotion();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (reduced) v.pause();
    else v.play().catch(() => {});
  }, [reduced]);

  // The scroll cue retires once the visitor has started scrolling.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="ae-hero bp6-dark ae-on-dark" id="top">
      <video
        ref={videoRef}
        className="ae-hero-video"
        autoPlay={!reduced}
        muted
        loop
        playsInline
        preload="auto"
        poster="/media/hero-poster.jpg"
        aria-hidden="true"
      >
        <source src="/media/hero-loop.webm" type="video/webm" />
        <source src="/media/hero-loop.mp4" type="video/mp4" />
      </video>
      <div className="ae-hero-scan" />
      <span className="ae-corner tl" />
      <span className="ae-corner tr" />

      <div className="ae-hero-body wrap">
        <h1 className="ae-hero-title">
          <span>Sovereign Systems</span> <span>for Public Service</span>
        </h1>
      </div>

      <button
        type="button"
        className={`ae-scroll-cue${scrolled ? " is-hidden" : ""}`}
        aria-label="Scroll down"
        onClick={() => document.querySelector("#updates")?.scrollIntoView({ behavior: "smooth" })}
      >
        <Icon icon="arrow-down" size={18} />
      </button>
    </section>
  );
}
