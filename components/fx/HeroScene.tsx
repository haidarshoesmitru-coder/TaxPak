"use client";

import { useEffect, useRef } from "react";

const CARDS = [
  { k: "Income tax · FY 2026-27", v: "Rs 6,000", s: "/mo", d: "on Rs 150,000 monthly salary", tag: "FBR slabs", depth: 26, cls: "f1" },
  { k: "Sales tax (GST)", v: "18%", s: "", d: "standard rate · unchanged", tag: "Finance Act 2026", depth: 48, cls: "f2" },
  { k: "Customs estimator", v: "6", s: " duties", d: "step-by-step landed cost", tag: "HS-code aware", depth: 34, cls: "f3" },
];

/**
 * Floating 3D cards in the hero. Each card drifts on its own float loop and
 * parallaxes with the mouse (depth per card). Disabled for touch / reduced motion.
 */
export default function HeroScene() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = ref.current;
    if (!scene) return;
    const hero = scene.closest(".hero") as HTMLElement | null;
    if (!hero) return;
    if (!window.matchMedia("(pointer:fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cards = Array.from(scene.querySelectorAll<HTMLElement>(".fcard"));
    const onMove = (e: MouseEvent) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      cards.forEach((c) => {
        const d = parseFloat(c.dataset.depth || "30");
        c.style.transform =
          `translate3d(${(x * d).toFixed(1)}px, ${(y * d).toFixed(1)}px, 0) ` +
          `rotateY(${(x * 10).toFixed(2)}deg) rotateX(${(-y * 10).toFixed(2)}deg)`;
      });
    };
    const onLeave = () => cards.forEach((c) => { c.style.transform = ""; });

    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);
    return () => {
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="scene" ref={ref} aria-hidden="true">
      {CARDS.map((c) => (
        <div key={c.k} className={`fcard ${c.cls} float-anim`} data-depth={c.depth}>
          <div className="fk">{c.k}</div>
          <div className="fv">{c.v}<span>{c.s}</span></div>
          <div className="fs">{c.d}</div>
          <span className="tag3d">{c.tag}</span>
        </div>
      ))}
    </div>
  );
}
