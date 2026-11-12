import { ImageResponse } from "next/og";

export const alt = "CAMBIUM RESEARCH — The Enterprise Research Operating System";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#FAF7F0",
          padding: "60px 80px",
          fontFamily: "sans-serif",
          border: "16px solid #E4DCCB",
        }}
      >
        {/* Top Brand Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "24px",
                backgroundColor: "#3E6248",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FAF7F0",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              C
            </div>
            <div
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                letterSpacing: "-0.03em",
                color: "#202920",
              }}
            >
              CAMBIUM RESEARCH
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "9999px",
              backgroundColor: "#DCE6D7",
              color: "#3E6248",
              fontSize: "15px",
              fontWeight: 600,
            }}
          >
            <span>v2.0 Enterprise OS</span>
          </div>
        </div>

        {/* Center Main Pitch */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: "56px",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              color: "#202920",
              maxWidth: "1000px",
            }}
          >
            The Enterprise Operating System for Modern Scholarship.
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "#62685E",
              lineHeight: 1.4,
              maxWidth: "880px",
            }}
          >
            Aggregating 250M+ open publications, global funding calls, and verified scholar collaboration into a single living canvas.
          </div>
        </div>

        {/* Bottom Feature Badges */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "2px solid #E4DCCB",
            paddingTop: "28px",
          }}
        >
          <div style={{ display: "flex", gap: "32px", fontSize: "16px", color: "#62685E" }}>
            <span>• OpenAlex & arXiv Mesh</span>
            <span>• 1536d Cosine Vector Retrieval</span>
            <span>• Sub-20ms LLM Autocomplete</span>
          </div>
          <div
            style={{
              fontSize: "15px",
              color: "#3E6248",
              fontWeight: 600,
            }}
          >
            cambium-research.vercel.app
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

