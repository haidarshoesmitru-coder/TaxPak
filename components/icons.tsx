// Colorful SVG icons for the calculator cards (stroke style, 24x24).
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const IconWallet = () => (
  <svg viewBox="0 0 24 24" {...base}><path d="M20 7H5a2 2 0 0 1-2-2 2 2 0 0 1 2-2h13v4"/><path d="M3 5v13a2 2 0 0 0 2 2h16V7"/><circle cx="17" cy="13.5" r="1.2" fill="currentColor" stroke="none"/></svg>
);
export const IconPercent = () => (
  <svg viewBox="0 0 24 24" {...base}><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/><path d="M19 17v1M8 7l9 9"/></svg>
);
export const IconShip = () => (
  <svg viewBox="0 0 24 24" {...base}><path d="M3 17h18l-2 4H5l-2-4Z"/><path d="M6 17V9h12v8"/><path d="M6 12h12M9 9V6h6v3"/></svg>
);
export const IconScale = () => (
  <svg viewBox="0 0 24 24" {...base}><path d="M12 3v18M5 7l7-4 7 4"/><path d="M5 7l-2.5 6a3 3 0 0 0 5 0L5 7ZM19 7l-2.5 6a3 3 0 0 0 5 0L19 7Z"/><path d="M8 21h8"/></svg>
);
export const IconBuilding = () => (
  <svg viewBox="0 0 24 24" {...base}><rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3"/></svg>
);
export const IconMoon = () => (
  <svg viewBox="0 0 24 24" {...base}><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z"/><path d="M17 4l.6 1.8L19.5 6.4l-1.9.6L17 8.8l-.6-1.8-1.9-.6 1.9-.6L17 4Z" fill="currentColor" stroke="none"/></svg>
);
