import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          justifyContent: "center", padding: "80px", background: "#0f172a", color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: 28 }}>
          <div style={{ display: "flex", width: 18, height: 18, borderRadius: 9, background: "#34d399", marginRight: 14 }} />
          <div style={{ display: "flex", fontSize: 30, letterSpacing: 6, fontWeight: 800 }}>
            PK<span style={{ color: "#34d399" }}>TAXHUB</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 68, fontWeight: 800, lineHeight: 1.15, letterSpacing: -1 }}>
          <div style={{ display: "flex" }}>Pakistan&rsquo;s tax, GST &amp; customs</div>
          <div style={{ display: "flex", color: "#34d399" }}>calculated in seconds.</div>
        </div>
        <div style={{ display: "flex", marginTop: 36, fontSize: 26, color: "#94a3b8" }}>
          Income Tax · Sales Tax · Customs · WHT · Property · Zakat — FY 2026-27
        </div>
      </div>
    ),
    { ...size }
  );
}
