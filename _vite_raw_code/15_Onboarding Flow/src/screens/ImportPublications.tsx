import { useState } from "react";
import SetupShell, { BottomNav, PageTitle } from "../components/SetupShell";
import { SetupData, Publication } from "../App";

interface Props {
  isMobile: boolean;
  setupData: SetupData;
  updateSetup: (patch: Partial<SetupData>) => void;
  onBack: () => void;
  onContinue: () => void;
  onSkip: () => void;
}

type ImportState = "idle" | "loading" | "done" | "error" | "empty";

export default function ImportPublications({ isMobile, setupData, updateSetup, onBack, onContinue, onSkip }: Props) {
  const [importState, setImportState] = useState<ImportState>(
    setupData.orcidConnected && setupData.publications.length > 0
      ? "idle"
      : setupData.orcidConnected
      ? "empty"
      : "idle"
  );
  const [pubs, setPubs] = useState<Publication[]>(setupData.publications);

  const togglePub = (id: string) => {
    const next = pubs.map((p) => p.id === id ? { ...p, selected: !p.selected } : p);
    setPubs(next);
    updateSetup({ publications: next });
  };

  const toggleAll = () => {
    const allSelected = pubs.every((p) => p.selected);
    const next = pubs.map((p) => ({ ...p, selected: !allSelected }));
    setPubs(next);
    updateSetup({ publications: next });
  };

  const handleImport = () => {
    setImportState("loading");
    setTimeout(() => {
      const next = pubs.map((p) => p.selected ? { ...p, imported: true } : p);
      setPubs(next);
      updateSetup({ publications: next });
      setImportState("done");
    }, 1800);
  };

  const simulateError = () => {
    setImportState("error");
  };

  const selectedCount = pubs.filter((p) => p.selected).length;
  const importedCount = pubs.filter((p) => p.imported).length;

  return (
    <>
      <SetupShell isMobile={isMobile}>
        <PageTitle subtitle="Bring your published research into Cambium. Select publications to import, or skip and add them later.">
          Bring your research with you.
        </PageTitle>

        {!setupData.orcidConnected && (
          <NoOrcidState isMobile={isMobile} onSkip={onSkip} />
        )}

        {setupData.orcidConnected && importState === "empty" && (
          <EmptyState />
        )}

        {setupData.orcidConnected && importState === "error" && (
          <ErrorState onRetry={() => setImportState("idle")} />
        )}

        {setupData.orcidConnected && importState === "loading" && (
          <LoadingState count={selectedCount} />
        )}

        {setupData.orcidConnected && pubs.length > 0 && (importState === "idle" || importState === "done") && (
          <div>
            {/* Source badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    backgroundColor: "#DCEBE4",
                    borderRadius: "100px",
                    padding: "4px 10px",
                    fontFamily: "Manrope",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#285C4D",
                  }}
                >
                  From ORCID
                </div>
                <span style={{ fontFamily: "Manrope", fontSize: "12px", color: "#66716C" }}>
                  {pubs.length} publications found
                </span>
              </div>
              <button
                onClick={toggleAll}
                style={{
                  fontFamily: "Manrope",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#173F35",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textDecoration: "underline",
                  textUnderlineOffset: "2px",
                  padding: 0,
                }}
              >
                {pubs.every((p) => p.selected) ? "Deselect all" : "Select all"}
              </button>
            </div>

            {/* Publication rows */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #DDE2DE",
                borderRadius: "10px",
                overflow: "hidden",
                marginBottom: "20px",
              }}
            >
              {pubs.map((pub, i) => (
                <PublicationRow
                  key={pub.id}
                  pub={pub}
                  onToggle={() => togglePub(pub.id)}
                  isLast={i === pubs.length - 1}
                  isMobile={isMobile}
                />
              ))}
            </div>

            {importState === "done" ? (
              <div
                style={{
                  backgroundColor: "#DCEBE4",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8l4 4 8-8" stroke="#173F35" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{ fontFamily: "Manrope", fontSize: "13px", color: "#173F35", fontWeight: 500 }}>
                  {importedCount} publication{importedCount !== 1 ? "s" : ""} imported successfully
                </span>
              </div>
            ) : (
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  onClick={handleImport}
                  disabled={selectedCount === 0}
                  style={{
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: selectedCount === 0 ? "#66716C" : "white",
                    backgroundColor: selectedCount === 0 ? "#DDE2DE" : "#173F35",
                    border: "none",
                    borderRadius: "8px",
                    padding: "11px 24px",
                    cursor: selectedCount === 0 ? "not-allowed" : "pointer",
                    minHeight: "44px",
                  }}
                >
                  Import {selectedCount > 0 ? `${selectedCount} selected` : "selected"}
                </button>
                <button
                  onClick={simulateError}
                  style={{
                    fontFamily: "Manrope",
                    fontSize: "12px",
                    fontWeight: 400,
                    color: "#66716C",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "11px 0",
                    textDecoration: "underline",
                    textUnderlineOffset: "2px",
                  }}
                >
                  Simulate error state
                </button>
              </div>
            )}
          </div>
        )}
      </SetupShell>

      <BottomNav
        isMobile={isMobile}
        onBack={onBack}
        onContinue={onContinue}
        onSkip={onSkip}
        showSkip
        skipLabel="Skip imports"
        continueLabel={importState === "done" ? "Continue" : "Continue without importing"}
      />
    </>
  );
}

function PublicationRow({ pub, onToggle, isLast, isMobile }: { pub: Publication; onToggle: () => void; isLast: boolean; isMobile: boolean }) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "14px",
        padding: isMobile ? "14px 16px" : "16px 20px",
        borderBottom: isLast ? "none" : "1px solid #DDE2DE",
        cursor: "pointer",
        backgroundColor: pub.selected ? "#F7FCF9" : "transparent",
        transition: "background-color 0.1s ease",
      }}
    >
      <div
        style={{
          width: "18px",
          height: "18px",
          borderRadius: "4px",
          border: `1.5px solid ${pub.selected ? "#173F35" : "#DDE2DE"}`,
          backgroundColor: pub.selected ? "#173F35" : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginTop: "2px",
          transition: "all 0.12s ease",
        }}
      >
        {pub.selected && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "Manrope",
            fontSize: "13px",
            fontWeight: 600,
            color: "#17201D",
            lineHeight: "1.4",
            marginBottom: "4px",
          }}
        >
          {pub.title}
        </div>
        <div
          style={{
            fontFamily: "Manrope",
            fontSize: "12px",
            color: "#66716C",
            lineHeight: "1.4",
            marginBottom: "4px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {pub.authors}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              fontFamily: "Manrope",
              fontSize: "11px",
              fontWeight: 500,
              color: "#173F35",
              backgroundColor: "#DCEBE4",
              borderRadius: "4px",
              padding: "2px 6px",
            }}
          >
            {pub.year}
          </span>
          <span style={{ fontFamily: "Manrope", fontSize: "11px", color: "#66716C" }}>
            {pub.venue}
          </span>
          {pub.imported && (
            <span
              style={{
                fontFamily: "Manrope",
                fontSize: "11px",
                fontWeight: 600,
                color: "#285C4D",
                backgroundColor: "#DCEBE4",
                borderRadius: "4px",
                padding: "2px 6px",
              }}
            >
              ✓ Imported
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function NoOrcidState({ isMobile, onSkip }: { isMobile: boolean; onSkip: () => void }) {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #DDE2DE",
        borderRadius: "12px",
        padding: "40px 32px",
        textAlign: "center",
        marginBottom: "24px",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "12px",
          backgroundColor: "#F7F6F1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <rect x="3" y="2" width="16" height="18" rx="2" stroke="#66716C" strokeWidth="1.5" />
          <path d="M7 7h8M7 10h8M7 13h5" stroke="#66716C" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <div style={{ fontFamily: "Manrope", fontSize: "15px", fontWeight: 600, color: "#17201D", marginBottom: "8px" }}>
        No ORCID connected
      </div>
      <div style={{ fontFamily: "Manrope", fontSize: "13px", color: "#66716C", lineHeight: "1.6", marginBottom: "20px" }}>
        Connect your ORCID in the previous step to import publications automatically, or skip and add them manually later.
      </div>
      <button
        onClick={onSkip}
        style={{
          fontFamily: "Manrope",
          fontSize: "13px",
          fontWeight: 500,
          color: "#173F35",
          background: "none",
          border: "1.5px solid #173F35",
          borderRadius: "8px",
          padding: "10px 20px",
          cursor: "pointer",
          minHeight: "40px",
        }}
      >
        Skip this step
      </button>
    </div>
  );
}

function LoadingState({ count }: { count: number }) {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #DDE2DE",
        borderRadius: "12px",
        padding: "48px 32px",
        textAlign: "center",
        marginBottom: "24px",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "2.5px solid #DDE2DE",
          borderTopColor: "#173F35",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
          margin: "0 auto 20px",
        }}
      >
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
      <div style={{ fontFamily: "Manrope", fontSize: "15px", fontWeight: 600, color: "#17201D", marginBottom: "6px" }}>
        Importing {count} publication{count !== 1 ? "s" : ""}…
      </div>
      <div style={{ fontFamily: "Manrope", fontSize: "13px", color: "#66716C" }}>
        This usually takes a few seconds
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #DDE2DE",
        borderRadius: "12px",
        padding: "48px 32px",
        textAlign: "center",
        marginBottom: "24px",
      }}
    >
      <div style={{ fontFamily: "Manrope", fontSize: "15px", fontWeight: 600, color: "#17201D", marginBottom: "8px" }}>
        No publications found
      </div>
      <div style={{ fontFamily: "Manrope", fontSize: "13px", color: "#66716C", lineHeight: "1.6" }}>
        Your ORCID profile doesn't have any publications linked yet. You can add them manually later from your research workspace.
      </div>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #FECACA",
        borderRadius: "12px",
        padding: "40px 32px",
        textAlign: "center",
        marginBottom: "24px",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "12px",
          backgroundColor: "#FEF2F2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M11 8v5M11 15.5v.5" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
          <circle cx="11" cy="11" r="9" stroke="#DC2626" strokeWidth="1.5" />
        </svg>
      </div>
      <div style={{ fontFamily: "Manrope", fontSize: "15px", fontWeight: 600, color: "#17201D", marginBottom: "8px" }}>
        Import failed
      </div>
      <div style={{ fontFamily: "Manrope", fontSize: "13px", color: "#66716C", lineHeight: "1.6", marginBottom: "20px" }}>
        We couldn't reach your ORCID profile. Please check your connection and try again.
      </div>
      <button
        onClick={onRetry}
        style={{
          fontFamily: "Manrope",
          fontSize: "14px",
          fontWeight: 600,
          color: "white",
          backgroundColor: "#173F35",
          border: "none",
          borderRadius: "8px",
          padding: "11px 24px",
          cursor: "pointer",
          minHeight: "44px",
        }}
      >
        Try again
      </button>
    </div>
  );
}
