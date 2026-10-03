import type { ReactNode } from "react";

export function SectionHead({ title, lede, meta }: { title: ReactNode; lede?: ReactNode; meta?: ReactNode }) {
  return (
    <header className="ae-section-head">
      <div>
        <h2>{title}</h2>
        {lede && <p>{lede}</p>}
      </div>
      {meta && <div className="ae-section-meta">{meta}</div>}
    </header>
  );
}
