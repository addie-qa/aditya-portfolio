import { ImageResponse } from "next/og";

export const alt = "Aditya Arora — I don't just test software. I challenge it.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#08070D",
          color: "#F4F1FB",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", color: "#C4A5FF", fontSize: 22, letterSpacing: 6 }}>
          THE QUALITY DIMENSION
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 68, lineHeight: 1.05, maxWidth: 900 }}>
          <span>I don&apos;t just test software.</span>
          <span>I challenge it.</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28 }}>
          <span>Aditya Arora</span>
          <span style={{ color: "#C4A5FF" }}>SDET / QA Automation</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
