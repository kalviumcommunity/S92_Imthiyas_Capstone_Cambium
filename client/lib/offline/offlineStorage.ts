// ====================================================================
// Cambium Offline Storage (IndexedDB)
// Local Persistence for Field Researchers & Low-Bandwidth Environments
// ====================================================================

const DB_NAME = "cambium_offline_store";
const DB_VERSION = 1;

export interface OfflineOpportunity {
  id: string;
  title: string;
  type: string;
  organization: string;
  deadline?: string;
  description?: string;
  link?: string;
  cachedAt: number;
}

export interface OfflineDraft {
  id: string;
  type: "grant_application" | "protocol_amendment" | "research_note";
  title: string;
  content: string;
  targetId?: string;
  updatedAt: number;
}

export interface OutboxAction {
  id: string;
  action: "TOGGLE_BOOKMARK" | "UPDATE_PROTOCOL" | "SUBMIT_DRAFT";
  payload: any;
  timestamp: number;
  attempts: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB is not supported in this environment"));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains("opportunities")) {
        db.createObjectStore("opportunities", { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains("drafts")) {
        db.createObjectStore("drafts", { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains("outbox")) {
        db.createObjectStore("outbox", { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// ── Opportunities Store ──────────────────────────────────────────────

export async function saveCachedOpportunities(opps: OfflineOpportunity[]): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction("opportunities", "readwrite");
    const store = tx.objectStore("opportunities");
    for (const opp of opps) {
      store.put({ ...opp, cachedAt: Date.now() });
    }
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn("[OfflineStorage] Failed to save cached opportunities:", err);
  }
}

export async function getCachedOpportunities(): Promise<OfflineOpportunity[]> {
  try {
    const db = await openDB();
    const tx = db.transaction("opportunities", "readonly");
    const store = tx.objectStore("opportunities");
    const req = store.getAll();
    return new Promise((resolve, reject) => {
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}

// ── Drafts Store ─────────────────────────────────────────────────────

export async function saveOfflineDraft(draft: OfflineDraft): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction("drafts", "readwrite");
    tx.objectStore("drafts").put(draft);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn("[OfflineStorage] Failed to save draft:", err);
  }
}

export async function getOfflineDrafts(): Promise<OfflineDraft[]> {
  try {
    const db = await openDB();
    const tx = db.transaction("drafts", "readonly");
    const req = tx.objectStore("drafts").getAll();
    return new Promise((resolve, reject) => {
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}

// ── Outbox Store (Pending Sync Queue) ────────────────────────────────

export async function enqueueOutboxAction(action: Omit<OutboxAction, "id" | "timestamp" | "attempts">): Promise<string> {
  const id = `outbox_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const item: OutboxAction = {
    ...action,
    id,
    timestamp: Date.now(),
    attempts: 0,
  };

  try {
    const db = await openDB();
    const tx = db.transaction("outbox", "readwrite");
    tx.objectStore("outbox").put(item);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(id);
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn("[OfflineStorage] Failed to enqueue outbox action:", err);
    return id;
  }
}

export async function getOutboxQueue(): Promise<OutboxAction[]> {
  try {
    const db = await openDB();
    const tx = db.transaction("outbox", "readonly");
    const req = tx.objectStore("outbox").getAll();
    return new Promise((resolve, reject) => {
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}

export async function removeOutboxAction(id: string): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction("outbox", "readwrite");
    tx.objectStore("outbox").delete(id);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn("[OfflineStorage] Failed to remove outbox action:", err);
  }
}

export async function clearOutbox(): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction("outbox", "readwrite");
    tx.objectStore("outbox").clear();
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn("[OfflineStorage] Failed to clear outbox:", err);
  }
}
