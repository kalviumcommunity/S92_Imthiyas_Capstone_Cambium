import fs from "fs";
import path from "path";
import { queryRagEngine } from "../../client/lib/ai/rag-engine";

describe("Client AI Backend Integration & Secret Boundary", () => {
  const originalWindow = (globalThis as any).window;
  const originalLocalStorage = (globalThis as any).localStorage;
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    (globalThis as any).window = originalWindow;
    (globalThis as any).localStorage = originalLocalStorage;
    globalThis.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  test("client AI modules contain zero NEXT_PUBLIC_GEMINI_API_KEY or direct Gemini vendor URLs", () => {
    const ragSource = fs.readFileSync(
      path.resolve(__dirname, "../../client/lib/ai/rag-engine.ts"),
      "utf8",
    );
    const autoSource = fs.readFileSync(
      path.resolve(__dirname, "../../client/lib/ai/useAiAutocomplete.ts"),
      "utf8",
    );

    expect(ragSource).not.toContain("NEXT_PUBLIC_GEMINI_API_KEY");
    expect(ragSource).not.toContain("generativelanguage.googleapis.com");
    expect(autoSource).toContain("apiFetch");
    expect(autoSource).not.toContain("NEXT_PUBLIC_GEMINI_API_KEY");
  });

  test("authenticated queryRagEngine routes through /assistant/chat and maps verified backend citations", async () => {
    const store = new Map<string, string>([["cambium_token", "jwt-test-token-123"]]);
    (globalThis as any).window = { location: { hostname: "localhost" } };
    (globalThis as any).localStorage = {
      getItem: (k: string) => store.get(k) || null,
      setItem: (k: string, v: string) => store.set(k, v),
      removeItem: (k: string) => store.delete(k),
    };

    const fetchMock = jest.fn(async (_url: any, _init: any) => ({
      ok: true,
      status: 200,
      json: async () => ({
        reply: "NSF Quantum Biology Call supports early-career faculty [src:opp-1].",
        conversationId: "conv-123",
        modelUsed: "gemini-2.0-flash",
        promptVersion: "grounded_rag_qa@1.1.0",
        abstained: false,
        evidenceCitations: [
          {
            sourceId: "opp-1",
            title: "NSF Quantum Biology Call",
            funder: "NSF",
            sourceType: "opportunity",
            relevance: "RRF Score: 0.0320",
            verified: true,
          },
        ],
      }),
    }));
    globalThis.fetch = fetchMock as any;

    const result = await queryRagEngine({
      query: "quantum biology grant eligibility",
      persona: "General Assistant",
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [calledUrl, calledInit] = fetchMock.mock.calls[0];
    expect(String(calledUrl)).toContain("/assistant/chat");
    expect(String(calledUrl)).not.toContain("generativelanguage.googleapis.com");
    expect((calledInit.headers as Headers).get("Authorization")).toBe("Bearer jwt-test-token-123");
    expect(result.source).toBe("backend-assistant");
    expect(result.abstained).toBe(false);
    expect(result.conversationId).toBe("conv-123");
    expect(result.promptVersion).toBe("grounded_rag_qa@1.1.0");
    expect(result.citations).toHaveLength(1);
    expect(result.citations[0].chunkId).toBe("opp-1");
  });

  test("unauthenticated local query with zero matches abstains cleanly", async () => {
    (globalThis as any).window = undefined;
    const result = await queryRagEngine({
      query: "xyzzy_nonexistent_private_grant_token_9999",
    });

    expect(result.abstained).toBe(true);
    expect(result.source).toBe("abstained");
    expect(result.citations).toHaveLength(0);
    expect(result.uncertaintyNote).toContain("Insufficient evidence");
  });
});
