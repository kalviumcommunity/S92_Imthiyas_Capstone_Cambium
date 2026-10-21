"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyBookmarks, toggleBookmark, BookmarkItem } from "@/lib/api";
import { enqueueOutboxAction } from "@/lib/offline/offlineStorage";

// ====================================================================
// 1. Optimistic Bookmarks Hook
// ====================================================================

export function useOptimisticBookmarks() {
  const queryClient = useQueryClient();

  const { data: bookmarks = [], isLoading } = useQuery<BookmarkItem[]>({
    queryKey: ["bookmarks"],
    queryFn: getMyBookmarks,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  const bookmarkMutation = useMutation({
    mutationFn: async (opportunityId: string) => {
      if (!navigator.onLine) {
        // Enqueue offline action in IndexedDB
        await enqueueOutboxAction({
          action: "TOGGLE_BOOKMARK",
          payload: { opportunityId },
        });
        return { offline: true };
      }
      await toggleBookmark(opportunityId);
      return { offline: false };
    },
    onMutate: async (opportunityId: string) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["bookmarks"] });

      // Snapshot the previous value
      const previousBookmarks = queryClient.getQueryData<BookmarkItem[]>(["bookmarks"]) || [];

      // Check if already bookmarked
      const isExisting = previousBookmarks.some(
        (b) => b.opportunityId === opportunityId || b.opportunity?.id === opportunityId
      );

      let updatedBookmarks: BookmarkItem[];
      if (isExisting) {
        // Optimistically remove
        updatedBookmarks = previousBookmarks.filter(
          (b) => b.opportunityId !== opportunityId && b.opportunity?.id !== opportunityId
        );
      } else {
        // Optimistically add
        const optimisticItem: BookmarkItem = {
          id: `opt-bm-${Date.now()}`,
          userId: "current-user",
          opportunityId,
          createdAt: new Date().toISOString(),
          opportunity: {
            id: opportunityId,
            title: "Loading opportunity...",
            type: "Grant",
            organization: "Academic Sponsor",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        };
        updatedBookmarks = [optimisticItem, ...previousBookmarks];
      }

      // Optimistically update the cache
      queryClient.setQueryData(["bookmarks"], updatedBookmarks);

      return { previousBookmarks };
    },
    onError: (err, opportunityId, context) => {
      // Rollback to snapshot on error
      if (context?.previousBookmarks) {
        queryClient.setQueryData(["bookmarks"], context.previousBookmarks);
      }
      console.error("[useOptimisticBookmarks] Mutation error, rolled back:", err);
    },
    onSettled: () => {
      // Invalidate to re-sync with server truth if online
      if (navigator.onLine) {
        queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      }
    },
  });

  const isOpportunityBookmarked = (oppId: string) => {
    return bookmarks.some(
      (b) => b.opportunityId === oppId || b.opportunity?.id === oppId
    );
  };

  return {
    bookmarks,
    isLoading,
    toggleBookmark: bookmarkMutation.mutate,
    isOpportunityBookmarked,
    isPending: bookmarkMutation.isPending,
  };
}

// ====================================================================
// 2. Optimistic IRB Compliance Protocols Hook
// ====================================================================

export interface ProtocolEntity {
  id: string;
  protocolNumber: string;
  title: string;
  pi: string;
  board: string;
  riskCategory: "Exempt" | "Expedited" | "Full Board Review";
  status: "Approved" | "Under Amendment Review" | "Annual Renewal Due";
  expiration: string;
  multiSite: boolean;
  participatingSitesCount: number;
  lastUpdated?: string;
  optimisticBadge?: boolean;
}

export const INITIAL_COMPLIANCE_PROTOCOLS: ProtocolEntity[] = [
  {
    id: "prot-1",
    protocolNumber: "IRB-2026-0891",
    title: "Neuro-symbolic Clinical Synthesis & High-Throughput Tomography Validation",
    pi: "Imthiyas (PI) · MIT CSAIL & Broad Institute",
    board: "MIT COUHES (Panel 4 - Clinical Computing)",
    riskCategory: "Expedited",
    status: "Approved",
    expiration: "August 14, 2027",
    multiSite: true,
    participatingSitesCount: 4,
  },
  {
    id: "prot-2",
    protocolNumber: "IRB-2026-0412",
    title: "Patient De-Identification & Privacy Guarantees in Federated Foundation Models",
    pi: "Dr. Elena Rodriguez · Stanford Medicine",
    board: "Stanford IRB Panel 3",
    riskCategory: "Exempt",
    status: "Approved",
    expiration: "October 30, 2027",
    multiSite: true,
    participatingSitesCount: 6,
  },
  {
    id: "prot-3",
    protocolNumber: "IRB-2025-1108",
    title: "Multicenter Pediatric MRI Synthetic Augmentation Clinical Trial Protocol",
    pi: "Imthiyas & Dr. Arjun Rao",
    board: "Mass General Brigham Human Research Committee",
    riskCategory: "Full Board Review",
    status: "Under Amendment Review",
    expiration: "March 15, 2027",
    multiSite: true,
    participatingSitesCount: 8,
  },
];

export function useOptimisticCompliance() {
  const queryClient = useQueryClient();

  const { data: protocols = INITIAL_COMPLIANCE_PROTOCOLS } = useQuery<ProtocolEntity[]>({
    queryKey: ["compliance-protocols"],
    queryFn: async () => {
      // In production fetches from /api/compliance/protocols; fallback to static data
      return INITIAL_COMPLIANCE_PROTOCOLS;
    },
    initialData: INITIAL_COMPLIANCE_PROTOCOLS,
    staleTime: 1000 * 60 * 10,
  });

  const updateProtocolMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: ProtocolEntity["status"];
    }) => {
      // Simulate network request or dispatch to backend
      await new Promise((resolve) => setTimeout(resolve, 400));
      return { id, status };
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["compliance-protocols"] });
      const previous = queryClient.getQueryData<ProtocolEntity[]>(["compliance-protocols"]) || [];

      // Optimistic update
      const updated = previous.map((prot) =>
        prot.id === id
          ? {
              ...prot,
              status,
              optimisticBadge: true,
              lastUpdated: new Date().toLocaleTimeString(),
            }
          : prot
      );

      queryClient.setQueryData(["compliance-protocols"], updated);
      return { previous };
    },
    onError: (err, vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["compliance-protocols"], context.previous);
      }
    },
    onSettled: () => {
      // Clear optimistic badge after settle
      setTimeout(() => {
        const current = queryClient.getQueryData<ProtocolEntity[]>(["compliance-protocols"]) || [];
        queryClient.setQueryData(
          ["compliance-protocols"],
          current.map((p) => ({ ...p, optimisticBadge: false }))
        );
      }, 2500);
    },
  });

  return {
    protocols,
    updateProtocolStatus: updateProtocolMutation.mutate,
    isUpdating: updateProtocolMutation.isPending,
  };
}

// ====================================================================
// 3. Optimistic Lab Projects Hook
// ====================================================================

export interface LabProjectEntity {
  id: string;
  title: string;
  lead: string;
  stage: "In Review" | "Under Amendment" | "Preprint Published" | "Experimental Assay";
  targetVenue: string;
  datasetSize: string;
  optimisticBadge?: boolean;
}

export const INITIAL_LAB_PROJECTS: LabProjectEntity[] = [
  {
    id: "proj-1",
    title: "Neuro-Symbolic Deductive Inference Over Large Chemical Spaces",
    lead: "Imthiyas (PI)",
    stage: "In Review",
    targetVenue: "Cell Systems",
    datasetSize: "42.8 GB",
  },
  {
    id: "proj-2",
    title: "Zero-Shot Protein Fold Topology Constrained by Horn Clauses",
    lead: "Dr. Elena Rodriguez",
    stage: "Experimental Assay",
    targetVenue: "Nature Methods",
    datasetSize: "18.2 GB",
  },
  {
    id: "proj-3",
    title: "Federated Privacy Guarantees in Clinical Biomarker Synthesis",
    lead: "Marcus Vance",
    stage: "Preprint Published",
    targetVenue: "bioRxiv",
    datasetSize: "94.0 GB",
  },
];

export function useOptimisticLab() {
  const queryClient = useQueryClient();

  const { data: projects = INITIAL_LAB_PROJECTS } = useQuery<LabProjectEntity[]>({
    queryKey: ["lab-projects"],
    queryFn: async () => INITIAL_LAB_PROJECTS,
    initialData: INITIAL_LAB_PROJECTS,
    staleTime: 1000 * 60 * 10,
  });

  const addProjectMutation = useMutation({
    mutationFn: async (newProject: Omit<LabProjectEntity, "id">) => {
      await new Promise((resolve) => setTimeout(resolve, 350));
      return { ...newProject, id: `proj-${Date.now()}` };
    },
    onMutate: async (newProject) => {
      await queryClient.cancelQueries({ queryKey: ["lab-projects"] });
      const previous = queryClient.getQueryData<LabProjectEntity[]>(["lab-projects"]) || [];

      const optimisticItem: LabProjectEntity = {
        ...newProject,
        id: `opt-proj-${Date.now()}`,
        optimisticBadge: true,
      };

      queryClient.setQueryData(["lab-projects"], [optimisticItem, ...previous]);
      return { previous };
    },
    onError: (err, vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["lab-projects"], context.previous);
      }
    },
    onSettled: () => {
      setTimeout(() => {
        const current = queryClient.getQueryData<LabProjectEntity[]>(["lab-projects"]) || [];
        queryClient.setQueryData(
          ["lab-projects"],
          current.map((p) => ({ ...p, optimisticBadge: false }))
        );
      }, 2500);
    },
  });

  const updateStageMutation = useMutation({
    mutationFn: async ({ id, stage }: { id: string; stage: LabProjectEntity["stage"] }) => {
      await new Promise((resolve) => setTimeout(resolve, 350));
      return { id, stage };
    },
    onMutate: async ({ id, stage }) => {
      await queryClient.cancelQueries({ queryKey: ["lab-projects"] });
      const previous = queryClient.getQueryData<LabProjectEntity[]>(["lab-projects"]) || [];

      const updated = previous.map((p) =>
        p.id === id ? { ...p, stage, optimisticBadge: true } : p
      );

      queryClient.setQueryData(["lab-projects"], updated);
      return { previous };
    },
    onError: (err, vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["lab-projects"], context.previous);
      }
    },
    onSettled: () => {
      setTimeout(() => {
        const current = queryClient.getQueryData<LabProjectEntity[]>(["lab-projects"]) || [];
        queryClient.setQueryData(
          ["lab-projects"],
          current.map((p) => ({ ...p, optimisticBadge: false }))
        );
      }, 2500);
    },
  });

  return {
    projects,
    addProject: addProjectMutation.mutate,
    updateProjectStage: updateStageMutation.mutate,
    isAdding: addProjectMutation.isPending,
  };
}
