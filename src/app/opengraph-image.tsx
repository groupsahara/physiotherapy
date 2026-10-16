import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.legalName} — ${siteConfig.contact.address.locality}, Delhi`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social share card generated at build time from site config. */
export default function OpengraphImage() {
  const { practitioner, contact } = siteConfig;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          color: "white",
          background: "linear-gradient(135deg, #061733 0%, #0d3fa6 55%, #2f7cf0 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: "white",
              color: "#1557d6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              fontWeight: 800,
            }}
          >
            MC
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: 2 }}>MOVING CURE</div>
            <div style={{ fontSize: 22, color: "#bfdbfe", letterSpacing: 3 }}>{"PHYSIOTHERAPY CLINIC & REHABILITATION CENTRE"}</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05 }}>Move freely. Live pain-free.</div>
          <div style={{ fontSize: 30, color: "#dbeafe" }}>
            {`${practitioner.name} · ${practitioner.qualifications.join(", ")} · Home visits available on call`}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#bfdbfe" }}>
          <div>{contact.phones.map((phone) => phone.display).join("  /  ")}</div>
          <div>{`${contact.address.locality}, ${contact.address.city}`}</div>
        </div>
      </div>
    ),
    size,
  );
}
