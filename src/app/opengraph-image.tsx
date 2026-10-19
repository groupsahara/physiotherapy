import { ImageResponse } from "next/og";
import { getSite } from "@/lib/cms/get-site";
import { joinParts } from "@/lib/contact-links";
import { OG_IMAGE_SIZE, OG_IMAGE_TYPE } from "@/lib/seo/share-image";

export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_TYPE;

const background = "linear-gradient(135deg, #061733 0%, #0d3fa6 55%, #2f7cf0 100%)";

/**
 * Social share card generated from CMS content. Used unless a share image is set in
 * the CMS (`site.seo.shareImage`), in which case the metadata points to that image.
 */
export default async function OpengraphImage() {
  const site = await getSite();

  // CMS unreachable: a plain, brand-less card (cached briefly, like the page).
  if (!site) {
    return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", background }} />, size);
  }

  const {
    "site.identity": identity,
    "site.seo": seo,
    "site.contact": contact,
    "site.practitioner": practitioner,
    "site.layout": layout,
  } = site.documents;
  const credentials = joinParts(
    [practitioner.name, practitioner.qualifications.join(", "), layout.topBarNotice],
    " · ",
  );

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
          background,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {identity.monogram ? (
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                background: "white",
                color: identity.themeColor || "#1557d6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 40,
                fontWeight: 800,
              }}
            >
              {identity.monogram}
            </div>
          ) : null}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: 2 }}>{identity.name.toUpperCase()}</div>
            <div style={{ fontSize: 22, color: "#bfdbfe", letterSpacing: 3 }}>{identity.tagline.toUpperCase()}</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05 }}>{seo.shareHeadline}</div>
          <div style={{ fontSize: 30, color: "#dbeafe" }}>{credentials}</div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#bfdbfe" }}>
          <div>{contact.phones.map((phone) => phone.display).join("  /  ")}</div>
          <div>{joinParts([contact.address.locality, contact.address.city], ", ")}</div>
        </div>
      </div>
    ),
    size,
  );
}
