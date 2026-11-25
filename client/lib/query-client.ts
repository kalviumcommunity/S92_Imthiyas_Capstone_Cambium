import { QueryClient } from "@tanstack/react-query";

export function createCambiumQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes fresh data window
        gcTime: 1000 * 60 * 30, // 30 minutes in-memory garbage collection
        refetchOnWindowFocus: false, // Prevent redundant background network bursts
        refetchOnReconnect: true, // Auto-resync when recovering from offline
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getBrowserQueryClient(): QueryClient {
  if (typeof window === "undefined") {
    return createCambiumQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = createCambiumQueryClient();
  }
  return browserQueryClient;
}

export function clearFrontendQueryCache(): void {
  if (browserQueryClient) {
    browserQueryClient.clear();
  }
}
