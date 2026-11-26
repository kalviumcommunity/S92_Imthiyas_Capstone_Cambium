import crypto from "node:crypto";

export interface SyntheticActor {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  organizationId: string | null;
  institution: string;
  tier?: "free" | "pro" | "institutional";
}

export const SYNTHETIC_ACTORS = {
  RESEARCHER_A: {
    id: "11111111-1111-4111-8111-111111111111",
    username: "qa_researcher_a",
    email: "researcher.a@synthetic-stanford.invalid",
    fullName: "Dr. Elena Rostova (Synthetic A)",
    role: "RESEARCHER",
    organizationId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    institution: "Stanford Synthetic Lab",
    tier: "pro",
  },
  RESEARCHER_B: {
    id: "22222222-2222-4222-8222-222222222222",
    username: "qa_researcher_b",
    email: "researcher.b@synthetic-mit.invalid",
    fullName: "Dr. Marcus Chen (Synthetic B)",
    role: "RESEARCHER",
    organizationId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
    institution: "MIT Synthetic Institute",
    tier: "free",
  },
  PI_STANFORD: {
    id: "33333333-3333-4333-8333-333333333333",
    username: "qa_pi_stanford",
    email: "pi@synthetic-stanford.invalid",
    fullName: "Prof. Aria Vance (Synthetic PI)",
    role: "PI",
    organizationId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    institution: "Stanford Synthetic Lab",
    tier: "institutional",
  },
  INSTITUTION_ADMIN: {
    id: "44444444-4444-4444-8444-444444444444",
    username: "qa_dean_admin",
    email: "admin@synthetic-stanford.invalid",
    fullName: "Dean Oliver Grant (Synthetic Admin)",
    role: "UNIVERSITY_LEADERSHIP",
    organizationId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    institution: "Stanford Synthetic Lab",
    tier: "institutional",
  },
  READ_ONLY_REVIEWER: {
    id: "55555555-5555-4555-8555-555555555555",
    username: "qa_readonly_reviewer",
    email: "reviewer@synthetic-oxford.invalid",
    fullName: "Dr. Nadia Khan (ReadOnly Reviewer)",
    role: "REVIEWER",
    organizationId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
    institution: "Oxford Synthetic College",
    tier: "free",
  },
  SUPER_ADMIN: {
    id: "99999999-9999-4999-8999-999999999999",
    username: "qa_super_admin",
    email: "secops@synthetic-cambium.invalid",
    fullName: "Cambium Test Admin",
    role: "SUPER_ADMIN",
    organizationId: null,
    institution: "Cambium QA Harness",
    tier: "institutional",
  },
} as const satisfies Record<string, SyntheticActor>;

/**
 * Mints a structurally valid unsigned/HS256 test access JWT shape for Edge middleware and HTTP mock tests.
 */
export function buildSyntheticTestJwt(
  actor: SyntheticActor,
  options: { expiresInSec?: number; secret?: string } = {},
): string {
  const exp = Math.floor(Date.now() / 1000) + (options.expiresInSec ?? 3600);
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({
      id: actor.id,
      sub: actor.id,
      email: actor.email,
      username: actor.username,
      role: actor.role,
      organizationId: actor.organizationId,
      type: "access",
      exp,
    }),
  ).toString("base64url");
  const signingSecret = options.secret || "qa_synthetic_ephemeral_test_signing_key";
  const sig = crypto
    .createHmac("sha256", signingSecret)
    .update(`${header}.${payload}`)
    .digest("base64url");
  return `${header}.${payload}.${sig}`;
}

export function createSyntheticGrant(overrides: Partial<Record<string, any>> = {}) {
  return {
    id: overrides.id || "77777777-7777-4777-8777-777777777771",
    title: overrides.title || "NSF Quantum Bio-Computation Grant (Synthetic QA)",
    type: overrides.type || "Grant",
    organization: overrides.organization || "National Science Foundation",
    deadline: overrides.deadline || new Date(Date.now() + 45 * 86400_000).toISOString(),
    description:
      overrides.description ||
      "Synthetic funding solicitation supporting postdoc and early-career computational research.",
    tags: overrides.tags || ["Quantum", "Computation"],
  };
}

export function createSyntheticWorkspace(
  owner: SyntheticActor,
  overrides: Partial<Record<string, any>> = {},
) {
  return {
    id: overrides.id || "88888888-8888-4888-8888-888888888881",
    title: overrides.title || `Synthetic Workspace - ${owner.username}`,
    description: overrides.description || "Isolated QA workspace fixture",
    ownerId: owner.id,
    organizationId: owner.organizationId,
    visibility: overrides.visibility || "PRIVATE",
  };
}

export function createSyntheticDocument(
  owner: SyntheticActor,
  overrides: Partial<Record<string, any>> = {},
) {
  return {
    id: overrides.id || "66666666-6666-4666-8666-666666666661",
    ownerId: owner.id,
    originalName: overrides.originalName || "synthetic-methodology-paper.pdf",
    mimeType: overrides.mimeType || "application/pdf",
    sizeBytes: overrides.sizeBytes ?? 1024,
    content: Buffer.from("%PDF-1.4\n%Synthetic Cambium QA Test PDF\n", "utf8"),
  };
}
