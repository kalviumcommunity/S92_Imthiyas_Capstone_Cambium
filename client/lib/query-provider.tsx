"use client";

import React, { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { getBrowserQueryClient } from "./query-client";

export { getBrowserQueryClient, clearFrontendQueryCache } from "./query-client";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => getBrowserQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
