"use client";

import ErrorComponent from "../error";

export default function Page500() {
  const dummyError = new Error("Cambium Core Platform: Simulated 500 Network Signal Interruption");
  return (
    <ErrorComponent
      error={dummyError}
      reset={() => {
        if (typeof window !== "undefined") {
          window.location.reload();
        }
      }}
    />
  );
}
