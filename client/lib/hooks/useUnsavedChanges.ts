"use client";

import { useEffect } from "react";

/**
 * Custom hook to warn users of unsaved changes when navigating away or closing the tab.
 * @param isDirty boolean indicating whether the form or document has unsaved edits
 * @param message custom confirmation message (fallback for browsers that support it)
 */
export function useUnsavedChanges(
  isDirty: boolean,
  message = "You have unsaved research edits. Leaving now will discard your changes."
) {
  useEffect(() => {
    if (!isDirty) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = message;
      return message;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty, message]);
}

