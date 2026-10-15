"use client";
import { useEffect, useRef, useState } from "react";

const items = [
  { value: 6, suffix: "", label: "Precision calculators" },
  { value: 8, suffix: "", label: "Income tax slabs tracked" },
  { value: 18, suffix: "%", label: "Standard GST rate" },
  { value: 6, suffix: "", label: "Duty types in customs estimator" },
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => {
        if (es[0].isIntersecting && !started.current) {
          started.current = true;
          const t0 = performance.now(), dur = 1100;
          const tick = (t: number) => {
            const p = Math.min(1, (t - t0) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            setN(Math.round(eased * to));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return (
    <div className="v" ref={ref}>
      {n}
      <span className="suf">{suffix}</span>
    </div>
  );
}

export default function Stats() {
  return (
    <div className="stats">
      {items.map((s) => (
        <div className="stat" key={s.label}>
          <Counter to={s.value} suffix={s.suffix} />
          <div className="l">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
