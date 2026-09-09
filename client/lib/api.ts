const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function getAuthHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("cambium_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return headers;
}

export interface ResearchOpportunity {
  id: string;
  title: string;
  type: "Grant" | "CFP" | "Journal" | "Paper";
  organization: string;
  deadline?: string;
  description?: string;
  link?: string;
  tags?: Array<{ id: string; name: string }>;
  createdBy?: { id: string; username: string; fullName: string };
  createdAt: string;
  updatedAt: string;
}

export interface OpportunityStats {
  total: number;
  grants: number;
  cfps: number;
  journals: number;
  papers: number;
}

export interface BookmarkItem {
  id: string;
  userId: string;
  opportunityId: string;
  createdAt: string;
  opportunity?: ResearchOpportunity;
}

// 1. Opportunities API
export async function getOpportunities(params?: {
  type?: string;
  tag?: string;
  search?: string;
}): Promise<ResearchOpportunity[]> {
  const query = new URLSearchParams();
  if (params?.type && params.type !== "All") query.append("type", params.type);
  if (params?.tag) query.append("tag", params.tag);
  if (params?.search) query.append("search", params.search);

  const res = await fetch(`${API_BASE}/research-opportunities?${query.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch opportunities");
  const json = await res.json();
  return json.data || [];
}

export async function getOpportunityStats(): Promise<OpportunityStats> {
  const res = await fetch(`${API_BASE}/research-opportunities/stats`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  const json = await res.json();
  return json.stats || { total: 0, grants: 0, cfps: 0, journals: 0, papers: 0 };
}

export async function createOpportunity(data: {
  title: string;
  type: "Grant" | "CFP" | "Journal" | "Paper";
  organization: string;
  deadline?: string;
  description?: string;
  link?: string;
  tags?: string[];
}): Promise<ResearchOpportunity> {
  const res = await fetch(`${API_BASE}/research-opportunities`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to create opportunity");
  return json.data;
}

export async function deleteOpportunity(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/research-opportunities/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete opportunity");
}

// 2. Bookmarks API
export async function getMyBookmarks(): Promise<BookmarkItem[]> {
  const res = await fetch(`${API_BASE}/bookmarks/my/list`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data || [];
}

export async function toggleBookmark(opportunityId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/bookmarks`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ opportunity: opportunityId }),
  });
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.message || "Failed to bookmark");
  }
}

export async function removeBookmark(bookmarkId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/bookmarks/${bookmarkId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to remove bookmark");
}

// 3. Auth API
export async function loginUser(credentials: {
  usernameOrEmail: string;
  password: string;
}) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: credentials.usernameOrEmail,
      password: credentials.password,
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Login failed");
  return json;
}

export async function registerUser(data: {
  username: string;
  email: string;
  password: string;
  fullName: string;
  institution?: string;
  researchInterests?: string[];
}) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Registration failed");
  return json;
}
