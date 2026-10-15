"use client";
import { useState } from "react";

/** Copy-summary + WhatsApp-share + Print buttons for a calculator result. */
export default function ShareButtons({ title, lines, url }: { title: string; lines: string[]; url: string }) {
  const [copied, setCopied] = useState(false);
  const text = `${title}\n${lines.join("\n")}\nCalculated via PKTaxHub: ${url}`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="share-row">
      <button type="button" className="btn-copy" onClick={copy}>{copied ? "✓ Copied!" : "⧉ Copy Summary"}</button>
      <a className="btn-wa" href={`https://wa.me/?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener noreferrer">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.4 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.4-.7-2.9-1.2-4.7-4.1-4.9-4.3-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5s.8 1.9.8 2c.1.1.1.2 0 .4l-.4.5c-.1.2-.3.3-.1.6.2.3.9 1.5 2 2.4 1.4 1.2 2.5 1.6 2.9 1.8.3.2.5.1.7-.1l.9-1c.2-.3.4-.2.7-.1l1.9.9c.3.1.5.2.5.4 0 .1 0 .4-.2 1Z"/></svg>
        WhatsApp
      </a>
      <button type="button" className="btn-print" onClick={() => window.print()}>🖨 Print Breakdown</button>
    </div>
  );
}
