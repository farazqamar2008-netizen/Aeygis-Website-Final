import { useEffect, useRef, useState, type ReactNode } from "react";
import { OFFERINGS, type Offering } from "../data/site";
import { usePrefersReducedMotion } from "../hooks";
import { Link } from "../router";

// Modeled on palantir.com's "Our Software" section:
//  - a large centred callout that fades up into place as it scrolls in, with one phrase in grey
//  - an indexed list; below 1480px each row stacks (80px name, description, /0.n top-right),
//    above it rows become a 4-column grid: description + index | gap | artwork | 180px-scale name
//  - on hover a full-bleed band appears, the mark gives way to a looping video, the name
//    nudges right and the index darkens
export function Services() {
  return (
    <section className="ae-services" id="services">
      <div className="ae-callout-wrap">
        <Callout>
          Aeygis brings <span className="ae-callout-dim">sovereign software</span> and specialist services to
          public sector tenders, from staffing operations to healthcare infrastructure and national cyber
          assurance.
        </Callout>
      </div>
      <div className="ae-svc-list wrap">
        <h2 className="ae-svc-heading">Our Software &amp; Services</h2>
        <ul className="ae-svc-items">
          {OFFERINGS.map((o, i) => (
            <ServiceRow key={o.name} item={o} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function ServiceRow({ item, index }: { item: Offering; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = usePrefersReducedMotion();
  const [shown, setShown] = useState(reduced);
  const [hover, setHover] = useState(false);

  // Rows fade up once as they enter the viewport.
  useEffect(() => {
    if (reduced) return setShown(true);
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (hover && !reduced) {
      v.currentTime = 0;
      v.play().catch(() => {});
    } else v.pause();
  }, [hover, reduced]);

  const num = `/0.${index + 1}`;
  const content = (
    <>
      <div className="ae-svc-aside">
        <p className="ae-svc-desc">{item.tagline}</p>
        <span className="ae-svc-num ae-svc-num-desk">
          {num}
          <Meta item={item} />
        </span>
      </div>
      <div className="ae-svc-art" aria-hidden="true">
        <ServiceMark kind={item.mark} />
        <video ref={videoRef} src={item.video} muted loop playsInline preload="none" />
      </div>
      <h3 className="ae-svc-name">{item.name}</h3>
      <span className="ae-svc-num ae-svc-num-mob">
        {num}
        <Meta item={item} />
      </span>
    </>
  );

  const rowProps = {
    className: "ae-svc-row",
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    onFocus: () => setHover(true),
    onBlur: () => setHover(false),
  };

  return (
    <li
      ref={ref}
      className={`ae-svc-item${shown ? " is-shown" : ""}${hover ? " is-hover" : ""}`}
      style={{ transitionDelay: shown && !reduced ? `${index * 70}ms` : undefined }}
    >
      <Link {...rowProps} to={`/${item.slug}/`}>
        {content}
      </Link>
    </li>
  );
}

function Meta({ item }: { item: Offering }) {
  return <span className="ae-svc-kind">{item.kind}</span>;
}

// The callout rises 80px and fades from 40% to full as it scrolls into place.
function Callout({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }
    let raf = 0;
    const update = () => {
      const top = el.parentElement!.getBoundingClientRect().top;
      const vh = window.innerHeight;
      // 0 when the block's top reaches the bottom of the viewport, 1 once it is 55% of the way up.
      const p = Math.min(1, Math.max(0, (vh - top) / (vh * 0.55)));
      el.style.opacity = String(0.4 + 0.6 * p);
      el.style.transform = `translateY(${(1 - p) * 80}px)`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced]);

  return (
    <p ref={ref} className="ae-callout">
      {children}
    </p>
  );
}

// Blocky, low-contrast marks in the spirit of Palantir's product glyphs (146px grid).
export function ServiceMark({ kind }: { kind: Offering["mark"] }) {
  const shapes: Record<Offering["mark"], ReactNode> = {
    // rising and falling bars: a rhythm, a schedule
    cadence: (
      <>
        <rect x="0" y="86" width="22" height="60" />
        <rect x="31" y="36" width="22" height="110" />
        <rect x="62" y="0" width="22" height="146" />
        <rect x="93" y="56" width="22" height="90" />
        <rect x="124" y="106" width="22" height="40" />
      </>
    ),
    // a gantry frame: beam, two legs and a hanging load
    gantry: <path d="M0 0H146V34H112V146H80V34H66V146H34V34H0Z M55 48H91V92H55Z" fillRule="evenodd" />,
    // a cross assembled from five squares
    health: <path d="M49 0H97V49H146V97H97V146H49V97H0V49H49Z" />,
    // a shield, half solid
    security: (
      <path
        d="M73 0L146 24V74C146 112 114 138 73 146C32 138 0 112 0 74V24Z M73 30V116C98 110 116 94 116 72V44Z"
        fillRule="evenodd"
      />
    ),
  };
  return (
    <svg className="ae-svc-mark" viewBox="0 0 146 146" width="146" height="146">
      {shapes[kind]}
    </svg>
  );
}
