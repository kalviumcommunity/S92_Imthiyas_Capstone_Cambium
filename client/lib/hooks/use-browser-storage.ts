import { useCallback, useSyncExternalStore } from "react";

export type BrowserStorageArea = "local" | "session";

const STORAGE_CHANGE_EVENT = "cambium-browser-storage-change";

interface StorageChangeDetail {
  area: BrowserStorageArea;
  key: string;
}

function subscribeToStorage(
  area: BrowserStorageArea,
  key: string,
  listener: () => void
) {
  if (typeof window === "undefined") return () => {};

  const handleStorage = (event: StorageEvent) => {
    const storage = area === "local" ? window.localStorage : window.sessionStorage;
    if (event.storageArea === storage && (event.key === key || event.key === null)) {
      listener();
    }
  };
  const handleStorageChange = (event: Event) => {
    const detail = (event as CustomEvent<StorageChangeDetail>).detail;
    if (detail?.area === area && detail.key === key) listener();
  };
  const handleArtifactUploaded = () => listener();

  window.addEventListener("storage", handleStorage);
  window.addEventListener(STORAGE_CHANGE_EVENT, handleStorageChange);
  if (area === "local" && key === "cambium_workspace_artifacts") {
    window.addEventListener("cambium-artifact-uploaded", handleArtifactUploaded);
  }
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(STORAGE_CHANGE_EVENT, handleStorageChange);
    window.removeEventListener("cambium-artifact-uploaded", handleArtifactUploaded);
  };
}

function readStorage(area: BrowserStorageArea, key: string) {
  try {
    const storage = area === "local" ? window.localStorage : window.sessionStorage;
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function getServerSnapshot() {
  return null;
}

export function useBrowserStorageValue(area: BrowserStorageArea, key: string) {
  const subscribe = useCallback(
    (listener: () => void) => subscribeToStorage(area, key, listener),
    [area, key]
  );
  const getSnapshot = useCallback(() => readStorage(area, key), [area, key]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function writeBrowserStorageValue(
  area: BrowserStorageArea,
  key: string,
  value: string | null
) {
  const storage = area === "local" ? window.localStorage : window.sessionStorage;
  if (value === null) {
    storage.removeItem(key);
  } else {
    storage.setItem(key, value);
  }
  window.dispatchEvent(
    new CustomEvent<StorageChangeDetail>(STORAGE_CHANGE_EVENT, {
      detail: { area, key },
    })
  );
}
