"use client";

import { useRef, type CSSProperties, type ReactNode, type MouseEvent } from "react";

type Props = {
  children: ReactNode;
  /** max tilt in degrees at the card edge */
  max?: number;
  className?: string;
  style?: CSSProperties;
};

/** 3D tilt-on-hover wrapper. Purely visual; no layout shift. */
export default function Tilt({ children, max = 9, className = "", style }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform =
      `perspective(900px) rotateY(${(x * max * 2).toFixed(2)}deg) ` +
      `rotateX(${(-y * max * 2).toFixed(2)}deg) translateY(-4px)`;
  };

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{ transition: "transform .18s ease", willChange: "transform", ...style }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </div>
  );
}
