import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Icon } from "@blueprintjs/core";
import { UPDATES, type UpdateItem } from "../data/site";
import { usePrefersReducedMotion } from "../hooks";
import { Link } from "../router";

const DWELL_MS = 6000;

// Modeled on palantir.com's "Featured News": topic chips over a horizontally
// scrolling track of full-width media cards, the next card peeking in at the edge.
export function Updates() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const reduced = usePrefersReducedMotion();

  const goTo = useCallback(
    (i: number) => {
      const track = trackRef.current;
      if (!track) return;
      const n = (i + UPDATES.length) % UPDATES.length;
      const first = track.children[0] as HTMLElement;
      const card = track.children[n] as HTMLElement | undefined;
      if (card) track.scrollTo({ left: card.offsetLeft - first.offsetLeft, behavior: reduced ? "auto" : "smooth" });
    },
    [reduced],
  );

  // Active index follows the scroll position, so swipes and trackpad scrolls update the chips too.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const step = (track.children[1] as HTMLElement | undefined)?.offsetLeft ?? 0;
        const first = (track.children[0] as HTMLElement).offsetLeft;
        const i = step > first ? Math.round(track.scrollLeft / (step - first)) : 0;
        setIndex(Math.min(UPDATES.length - 1, Math.max(0, i)));
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Autoplay only runs while the section is on screen.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.5 });
    io.observe(track);
    return () => io.disconnect();
  }, []);

  // Autoplay: advance and wrap around; pauses on hover/focus, off-screen and under reduced motion.
  useEffect(() => {
    if (paused || reduced || !inView) return;
    const id = window.setTimeout(() => goTo(index + 1), DWELL_MS);
    return () => window.clearTimeout(id);
  }, [index, paused, reduced, inView, goTo]);

  return (
    <section className="ae-feature" id="updates" aria-label="Latest updates">
      <div className="wrap">
        <div className="ae-feature-chips" role="tablist" aria-label="Update topics">
          {UPDATES.map((u, i) => (
            <button
              key={u.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              className={`ae-chip${i === index ? " is-active" : ""}`}
              onClick={() => goTo(i)}
            >
              {u.chip}
            </button>
          ))}
        </div>

        <div
          ref={trackRef}
          className="ae-feature-track"
          aria-roledescription="carousel"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") goTo(index + 1);
            if (e.key === "ArrowLeft") goTo(index - 1);
          }}
        >
          {UPDATES.map((u, i) => (
            <FeatureCard
              key={u.id}
              item={u}
              active={i === index && inView}
              reduced={reduced}
              position={`${i + 1} of ${UPDATES.length}`}
              onPrev={() => goTo(i - 1)}
              onNext={() => goTo(i + 1)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard(props: {
  item: UpdateItem;
  active: boolean;
  reduced: boolean;
  position: string;
  onPrev: () => void;
  onNext: () => void;
}) {
  const { item, active, reduced, position, onPrev, onNext } = props;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  // Only the card in view plays.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (active && !reduced) v.play().catch(() => {});
    else v.pause();
  }, [active, reduced]);

  const label = (
    <div className="ae-feature-label">
      <span className="ae-feature-topic">{item.tag}</span>
      <h3>
        {item.cta ? <TitleWithArrow title={item.title} /> : item.title}
      </h3>
      <p>{item.body}</p>
    </div>
  );

  return (
    <article className="ae-feature-card bp6-dark ae-on-dark" aria-roledescription="slide" aria-label={position}>
      <div className="ae-feature-media">
        {item.video && !failed && (
          <video
            ref={videoRef}
            src={item.video}
            poster={item.poster}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            onError={() => setFailed(true)}
          />
        )}
      </div>
      {item.cta ? (
        <Link
          className="ae-feature-link"
          to={item.cta.href}
          tabIndex={active ? 0 : -1}
          aria-label={`${item.title}: ${item.cta.label}`}
        >
          {label}
        </Link>
      ) : (
        label
      )}
      <div className="ae-feature-nav">
        <Button icon="arrow-left" aria-label="Previous update" onClick={onPrev} tabIndex={active ? 0 : -1} />
        <Button icon="arrow-right" aria-label="Next update" onClick={onNext} tabIndex={active ? 0 : -1} />
      </div>
    </article>
  );
}

// Keeps the arrow glued to the last word so it never wraps onto a line by itself.
function TitleWithArrow({ title }: { title: string }) {
  const cut = title.lastIndexOf(" ");
  return (
    <>
      {title.slice(0, cut + 1)}
      <span className="ae-nowrap">
        {title.slice(cut + 1)}
        <Icon icon="arrow-top-right" size={20} className="ae-feature-arrow" />
      </span>
    </>
  );
}
