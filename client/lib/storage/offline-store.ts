/**
 * Cambium Enterprise Research Operating System
 * Client-Side Offline Storage & IndexedDB Synchronization Engine
 * 
 * Provides zero-latency local caching for field scholars working offline
 * in remote research stations, maritime vessels, or air transit.
 */

export interface CachedOpportunity {
  id: string;
  title: string;
  description: string;
  funder: string;
  amount: number | string;
  deadline: string;
  category?: string;
  tags?: string[];
  cachedAt: number;
}

export interface ProposalDraft {
  id: string;
  opportunityId?: string;
  title: string;
  content: string;
  methodology?: string;
  budgetSummary?: string;
  lastModified: number;
  synced: boolean;
}

export interface QueuedSyncMutation {
  id: string;
  type: "CREATE_BOOKMARK" | "DELETE_BOOKMARK" | "SAVE_DRAFT" | "SUBMIT_PROPOSAL";
  payload: any;
  timestamp: number;
  retryCount: number;
}

const DB_NAME = "CambiumOfflineDB";
const DB_VERSION = 1;

const STORES = {
  OPPORTUNITIES: "opportunities_cache",
  DRAFTS: "proposal_drafts",
  SYNC_QUEUE: "offline_sync_queue",
} as const;

/**
 * Initializes and upgrades the IndexedDB instance
 */
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      return reject(new Error("IndexedDB is not available in current environment"));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // 1. Opportunities store
      if (!db.objectStoreNames.contains(STORES.OPPORTUNITIES)) {
        const oppStore = db.createObjectStore(STORES.OPPORTUNITIES, { keyPath: "id" });
        oppStore.createIndex("category", "category", { unique: false });
        oppStore.createIndex("funder", "funder", { unique: false });
        oppStore.createIndex("deadline", "deadline", { unique: false });
      }

      // 2. Proposal drafts store
      if (!db.objectStoreNames.contains(STORES.DRAFTS)) {
        const draftStore = db.createObjectStore(STORES.DRAFTS, { keyPath: "id" });
        draftStore.createIndex("lastModified", "lastModified", { unique: false });
        draftStore.createIndex("synced", "synced", { unique: false });
      }

      // 3. Offline mutation sync queue
      if (!db.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
        const syncStore = db.createObjectStore(STORES.SYNC_QUEUE, { keyPath: "id" });
        syncStore.createIndex("timestamp", "timestamp", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Executes an IndexedDB transaction safely
 */
async function performTx<T>(
  storeName: string,
  mode: IDBTransactionMode,
  callback: (store: IDBObjectStore) => IDBRequest<T> | void
): Promise<T> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    let req: IDBRequest<T> | void;

    try {
      req = callback(store);
    } catch (err) {
      return reject(err);
    }

    tx.oncomplete = () => {
      resolve(req ? (req as IDBRequest<T>).result : (undefined as any));
    };

    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(new Error(`IndexedDB transaction aborted on store ${storeName}`));
  });
}

// ============================================================================
// OPPORTUNITIES CACHE API
// ============================================================================

export async function saveOfflineOpportunities(opportunities: CachedOpportunity[]): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.OPPORTUNITIES, "readwrite");
    const store = tx.objectStore(STORES.OPPORTUNITIES);

    for (const opp of opportunities) {
      store.put({ ...opp, cachedAt: Date.now() });
    }

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getOfflineOpportunities(): Promise<CachedOpportunity[]> {
  try {
    return await performTx<CachedOpportunity[]>(STORES.OPPORTUNITIES, "readonly", (store) =>
      store.getAll()
    );
  } catch (err) {
    console.warn("[OfflineStore] Failed to read cached opportunities:", err);
    return [];
  }
}

// ============================================================================
// PROPOSAL DRAFTS API (Field Writing)
// ============================================================================

export async function saveProposalDraft(draft: Omit<ProposalDraft, "lastModified">): Promise<ProposalDraft> {
  const record: ProposalDraft = {
    ...draft,
    lastModified: Date.now(),
  };

  await performTx(STORES.DRAFTS, "readwrite", (store) => store.put(record));
  return record;
}

export async function getProposalDrafts(): Promise<ProposalDraft[]> {
  try {
    return await performTx<ProposalDraft[]>(STORES.DRAFTS, "readonly", (store) => store.getAll());
  } catch (err) {
    console.warn("[OfflineStore] Failed to read proposal drafts:", err);
    return [];
  }
}

export async function deleteProposalDraft(id: string): Promise<void> {
  await performTx(STORES.DRAFTS, "readwrite", (store) => store.delete(id));
}

// ============================================================================
// OFFLINE MUTATION QUEUE & REPLAY
// ============================================================================

export async function enqueueSyncMutation(
  type: QueuedSyncMutation["type"],
  payload: any
): Promise<QueuedSyncMutation> {
  const mutation: QueuedSyncMutation = {
    id: `mut-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    type,
    payload,
    timestamp: Date.now(),
    retryCount: 0,
  };

  await performTx(STORES.SYNC_QUEUE, "readwrite", (store) => store.put(mutation));
  return mutation;
}

export async function getPendingSyncMutations(): Promise<QueuedSyncMutation[]> {
  try {
    return await performTx<QueuedSyncMutation[]>(STORES.SYNC_QUEUE, "readonly", (store) =>
      store.getAll()
    );
  } catch {
    return [];
  }
}

export async function removeSyncMutation(id: string): Promise<void> {
  await performTx(STORES.SYNC_QUEUE, "readwrite", (store) => store.delete(id));
}
