import SetupShell, { BottomNav, PageTitle } from "../components/SetupShell";
import { SetupData } from "../App";

interface Props {
  isMobile: boolean;
  setupData: SetupData;
  updateSetup: (patch: Partial<SetupData>) => void;
  onBack: () => void;
  onContinue: () => void;
  onEdit: (step: string) => void;
}

export default function ReviewContext({ isMobile, setupData, onBack, onContinue, onEdit }: Props) {
  const importedPubs = setupData.publications.filter((p) => p.imported);

  return (
    <>
      <SetupShell isMobile={isMobile}>
        <PageTitle subtitle="Everything looks good? You can edit any section before saving your research context.">
          Review your research context.
        </PageTitle>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Academic Identity */}
          <ContextSection
            title="Academic Identity"
            onEdit={() => onEdit("orcid")}
            sourceLabel={setupData.orcidConnected ? "ORCID" : undefined}
          >
            {setupData.orcidConnected ? (
              <div>
                <div style={{ fontFamily: "Manrope", fontSize: "14px", fontWeight: 600, color: "#17201D", marginBottom: "2px" }}>
                  {setupData.orcidName}
                </div>
                <div style={{ fontFamily: "Manrope", fontSize: "12px", color: "#66716C", fontVariantNumeric: "tabular-nums" }}>
                  ORCID {setupData.orcidId}
                </div>
              </div>
            ) : (
              <EmptySection label="No ORCID connected" action="Connect ORCID" onAction={() => onEdit("orcid")} />
            )}
          </ContextSection>

          {/* Research Interests */}
          <ContextSection
            title="Research Interests"
            onEdit={() => onEdit("interests")}
            sourceLabel="User-selected"
          >
            {setupData.interests.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {setupData.interests.map((interest) => (
                  <span
                    key={interest}
                    style={{
                      fontFamily: "Manrope",
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "#173F35",
                      backgroundColor: "#DCEBE4",
                      borderRadius: "100px",
                      padding: "4px 10px",
                    }}
                  >
                    {interest}
                  </span>
                ))}
              </div>
            ) : (
              <EmptySection label="No interests selected" action="Add interests" onAction={() => onEdit("interests")} />
            )}
          </ContextSection>

          {/* Research Topics */}
          <ContextSection
            title="Research Topics"
            onEdit={() => onEdit("topics")}
            sourceLabel="User-selected"
          >
            {setupData.topics.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {setupData.topics.map((topic) => (
                  <span
                    key={topic}
                    style={{
                      fontFamily: "Manrope",
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "#17201D",
                      backgroundColor: "#F7F6F1",
                      border: "1px solid #DDE2DE",
                      borderRadius: "100px",
                      padding: "4px 10px",
                    }}
                  >
                    {topic}
                  </span>
                ))}
              </div>
            ) : (
              <EmptySection label="No topics selected" action="Add topics" onAction={() => onEdit("topics")} />
            )}
          </ContextSection>

          {/* Publications */}
          <ContextSection
            title="Publications"
            onEdit={() => onEdit("publications")}
            sourceLabel={setupData.orcidConnected ? "ORCID" : undefined}
          >
            {importedPubs.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {importedPubs.slice(0, 3).map((pub) => (
                  <div key={pub.id}>
                    <div style={{ fontFamily: "Manrope", fontSize: "13px", fontWeight: 600, color: "#17201D", lineHeight: "1.4", marginBottom: "2px" }}>
                      {pub.title}
                    </div>
                    <div style={{ fontFamily: "Manrope", fontSize: "11px", color: "#66716C" }}>
                      {pub.authors} · {pub.year} · {pub.venue}
                    </div>
                  </div>
                ))}
                {importedPubs.length > 3 && (
                  <div style={{ fontFamily: "Manrope", fontSize: "12px", color: "#66716C" }}>
                    +{importedPubs.length - 3} more publication{importedPubs.length - 3 !== 1 ? "s" : ""}
                  </div>
                )}
              </div>
            ) : (
              <EmptySection
                label="No publications imported"
                action="Import publications"
                onAction={() => onEdit("publications")}
              />
            )}
          </ContextSection>
        </div>

        {/* Legend */}
        <div
          style={{
            marginTop: "24px",
            padding: "14px 16px",
            backgroundColor: "#F7F6F1",
            borderRadius: "8px",
            border: "1px solid #DDE2DE",
          }}
        >
          <div style={{ fontFamily: "Manrope", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#66716C", marginBottom: "8px" }}>
            Source key
          </div>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontFamily: "Manrope", fontSize: "11px", color: "#285C4D", backgroundColor: "#DCEBE4", borderRadius: "4px", padding: "2px 6px", fontWeight: 600 }}>
                ORCID
              </span>
              <span style={{ fontFamily: "Manrope", fontSize: "12px", color: "#66716C" }}>Imported from your ORCID profile</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontFamily: "Manrope", fontSize: "11px", color: "#66716C", backgroundColor: "#F7F6F1", borderRadius: "4px", padding: "2px 6px", fontWeight: 600, border: "1px solid #DDE2DE" }}>
                User-selected
              </span>
              <span style={{ fontFamily: "Manrope", fontSize: "12px", color: "#66716C" }}>Chosen by you during setup</span>
            </div>
          </div>
        </div>
      </SetupShell>

      <BottomNav
        isMobile={isMobile}
        onBack={onBack}
        onContinue={onContinue}
        continueLabel="Save and continue"
      />
    </>
  );
}

function ContextSection({
  title,
  onEdit,
  sourceLabel,
  children,
}: {
  title: string;
  onEdit: () => void;
  sourceLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #DDE2DE",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 18px",
          borderBottom: "1px solid #DDE2DE",
          backgroundColor: "#F7F6F1",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontFamily: "Manrope", fontSize: "13px", fontWeight: 700, color: "#17201D" }}>
            {title}
          </span>
          {sourceLabel && (
            <span
              style={{
                fontFamily: "Manrope",
                fontSize: "10px",
                fontWeight: 600,
                color: sourceLabel === "ORCID" ? "#285C4D" : "#66716C",
                backgroundColor: sourceLabel === "ORCID" ? "#DCEBE4" : "transparent",
                border: sourceLabel !== "ORCID" ? "1px solid #DDE2DE" : "none",
                borderRadius: "4px",
                padding: "2px 6px",
                letterSpacing: "0.05em",
              }}
            >
              {sourceLabel}
            </span>
          )}
        </div>
        <button
          onClick={onEdit}
          style={{
            fontFamily: "Manrope",
            fontSize: "12px",
            fontWeight: 500,
            color: "#173F35",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px 8px",
            borderRadius: "4px",
          }}
        >
          Edit
        </button>
      </div>
      <div style={{ padding: "16px 18px" }}>{children}</div>
    </div>
  );
}

function EmptySection({ label, action, onAction }: { label: string; action: string; onAction: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontFamily: "Manrope", fontSize: "13px", color: "#66716C", fontStyle: "italic" }}>{label}</span>
      <button
        onClick={onAction}
        style={{
          fontFamily: "Manrope",
          fontSize: "12px",
          fontWeight: 500,
          color: "#173F35",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          textDecoration: "underline",
          textUnderlineOffset: "2px",
        }}
      >
        {action}
      </button>
    </div>
  );
}
