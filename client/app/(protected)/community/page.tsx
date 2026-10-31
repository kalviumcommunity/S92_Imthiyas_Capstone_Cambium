"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRealtimeEvents } from "@/lib/realtime/useRealtimeEvents";
import {
  StructuredReviewModal,
  StructuredPeerReviewSubmission,
} from "@/components/community/StructuredReviewModal";
import {
  Users,
  MessageSquare,
  Share2,
  Bookmark,
  Plus,
  Search,
  Sparkles,
  ArrowUpRight,
  Filter,
  Check,
  Heart,
  TrendingUp,
  UserPlus,
  Send,
  Building2,
  BookOpen,
  DollarSign,
  HelpCircle,
  ExternalLink,
  Bot,
  X,
  Layers,
  Award,
  Globe,
  SlidersHorizontal,
} from "lucide-react";

export type AcademicPostType =
  | "collaboration_call"
  | "paper_release"
  | "grant_consortium"
  | "scientific_inquiry";

export interface PostComment {
  id: string;
  author: {
    name: string;
    role: string;
    institution: string;
    initials: string;
    avatarColor: string;
  };
  timeAgo: string;
  content: string;
  endorsements: number;
}

export interface AcademicPost {
  id: string;
  author: {
    id?: string;
    name: string;
    role: string;
    institution: string;
    initials: string;
    avatarColor: string;
    orcid?: string;
  };
  timeAgo: string;
  type: AcademicPostType;
  title: string;
  content: string;
  tags: string[];
  metrics: {
    comments: number;
    saves: number;
    shares: number;
    likes: number;
  };
  doiReference?: string;
  paperMetadata?: {
    venue: string;
    year: number;
    citations: number;
    abstractPreview: string;
  };
  collaborationDetails?: {
    lookingFor: string;
    preferredSkills: string[];
    targetDeadline?: string;
  };
  grantConsortiumDetails?: {
    funder: string;
    budget: string;
    deadlineDays: number;
    requiredInstitutions: string[];
  };
  comments?: PostComment[];
}

const INITIAL_ACADEMIC_POSTS: AcademicPost[] = [
  {
    id: "post-1",
    author: {
      id: "u-arjun",
      name: "Dr. Arjun Rao",
      role: "Machine Learning Researcher",
      institution: "IISc Bangalore & Cambium Fellow",
      initials: "AR",
      avatarColor: "#4A6B8A",
      orcid: "0000-0003-4418-9102",
    },
    timeAgo: "2 hours ago",
    type: "paper_release",
    title: "Neuro-Symbolic Deductive Inference Over Large Chemical Spaces",
    content:
      "We just released our benchmark for low-resource scientific language models. The gap between domain-general and domain-specific models is larger than we expected at small scales. Formal Horn-clause verification eliminates valency violations.",
    tags: ["Neuro-Symbolic", "Low-Resource ML", "Proof Verification", "Nature MI"],
    doiReference: "10.1016/j.cels.2025.04.002",
    paperMetadata: {
      venue: "Nature Machine Intelligence · Cell Systems",
      year: 2025,
      citations: 142,
      abstractPreview:
        "We introduce a dual neuro-symbolic projection operator parameterizing generative chemical diffusion manifolds with Horn-clause treewidth bounds, guaranteeing polynomial time convergence.",
    },
    metrics: { comments: 24, saves: 142, shares: 38, likes: 89 },
    comments: [
      {
        id: "c-1",
        author: {
          name: "Prof. Jonas Keller",
          role: "Chair of Climate Informatics",
          institution: "ETH Zürich",
          initials: "JK",
          avatarColor: "#3E6248",
        },
        timeAgo: "1 hour ago",
        content:
          "Very intriguing result on the Horn-clause bounds. Have you observed any numerical degradation when scaled to 50k+ nodes?",
        endorsements: 12,
      },
    ],
  },
  {
    id: "post-2",
    author: {
      id: "u-elena",
      name: "Dr. Elena Vance",
      role: "Associate Professor of Computational Bio-AI",
      institution: "Stanford University · Bio-X",
      initials: "EV",
      avatarColor: "#3E6248",
      orcid: "0000-0002-1825-0097",
    },
    timeAgo: "4 hours ago",
    type: "collaboration_call",
    title: "Call for Co-Authors: Multimodal Medical Imaging Foundation Models",
    content:
      "Working on multimodal medical imaging foundation models and looking for researchers with expertise in clinical validation. Experience with multi-center radiology datasets (DICOM, NIfTI) preferred for upcoming Nature MI submission.",
    tags: ["Medical Imaging", "Computer Vision", "Collaboration", "Clinical AI"],
    collaborationDetails: {
      lookingFor: "Clinical Validation Lead & Radiologist Co-Author",
      preferredSkills: ["Clinical Protocols", "3D Volumetric MRI", "Statistical Power Testing"],
      targetDeadline: "December 15, 2026",
    },
    metrics: { comments: 17, saves: 95, shares: 21, likes: 64 },
    comments: [],
  },
  {
    id: "post-3",
    author: {
      id: "u-thorne",
      name: "Prof. Marcus Thorne",
      role: "Chair of Genomic Systems",
      institution: "Harvard Medical School",
      initials: "MT",
      avatarColor: "#173F35",
      orcid: "0000-0001-9043-4412",
    },
    timeAgo: "6 hours ago",
    type: "grant_consortium",
    title: "Forming Multi-Institutional Consortium: NIH R01 Targeted Nanoparticles",
    content:
      "Our laboratory is assembling a 3-institution team for the upcoming NIH R01 targeted delivery program. We need a partner with high-throughput microfluidic screening facilities and computational molecular dynamics pipelines.",
    tags: ["NIH R01", "Nanomedicine", "Grant Consortium", "Epigenetics"],
    grantConsortiumDetails: {
      funder: "National Institutes of Health (NIH)",
      budget: "$2,500,000",
      deadlineDays: 28,
      requiredInstitutions: ["High-Throughput Wet Lab", "Microfluidics Screening Partner"],
    },
    metrics: { comments: 19, saves: 110, shares: 45, likes: 92 },
    comments: [],
  },
  {
    id: "post-4",
    author: {
      id: "u-keller",
      name: "Prof. Jonas Keller",
      role: "Chair of Climate Informatics",
      institution: "ETH Zürich",
      initials: "JK",
      avatarColor: "#6B5A7A",
      orcid: "0000-0002-9912-4011",
    },
    timeAgo: "8 hours ago",
    type: "scientific_inquiry",
    title: "Continuous-Time Diffusion Kriging vs PINNs on ERA5 Atmospheric Reanalysis Grids",
    content:
      "Has anyone compared continuous-time diffusion kriging against physics-informed neural operators on ERA5 atmospheric reanalysis grids under extreme temperature shifts? Our recent ablation runs show divergence at higher latitudes.",
    tags: ["Climate Informatics", "PINNs", "Spatiotemporal ML", "Diffusion Models"],
    metrics: { comments: 31, saves: 83, shares: 19, likes: 72 },
    comments: [],
  },
];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<string>("All Discussions");
  const { isSocketConnected, sendMessage, messages: realtimeMessages } =
    useRealtimeEvents("community");
  const [posts, setPosts] = useState<AcademicPost[]>(INITIAL_ACADEMIC_POSTS);
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({
    "Dr. Arjun Rao": true,
  });
  const [connectionsMap, setConnectionsMap] = useState<Record<string, boolean>>({});
  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>({});
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showToast, setShowToast] = useState<string | null>(null);

  // Modal States
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [composerType, setComposerType] = useState<AcademicPostType>("collaboration_call");
  const [composerTitle, setComposerTitle] = useState("");
  const [composerContent, setComposerContent] = useState("");
  const [composerTags, setComposerTags] = useState("");
  const [composerDoi, setComposerDoi] = useState("");
  const [composerLookingFor, setComposerLookingFor] = useState("");
  const [composerSkills, setComposerSkills] = useState("");
  const [composerFunder, setComposerFunder] = useState("");
  const [composerBudget, setComposerBudget] = useState("");

  // Connect & Interest Modals
  const [connectModalAuthor, setConnectModalAuthor] = useState<AcademicPost["author"] | null>(null);
  const [connectContext, setConnectContext] = useState("");
  const [interestModalPost, setInterestModalPost] = useState<AcademicPost | null>(null);
  const [interestMessage, setInterestMessage] = useState("");

  // Active Comments Drawer
  const [activeCommentPost, setActiveCommentPost] = useState<AcademicPost | null>(null);
  const [newCommentText, setNewCommentText] = useState("");

  // Structured Review State
  const [reviewModalPost, setReviewModalPost] = useState<AcademicPost | null>(null);
  const [reviewsMap, setReviewsMap] = useState<Record<string, StructuredPeerReviewSubmission[]>>({
    "post-2": [
      {
        postId: "post-2",
        postTitle: "Preprint Release: Neuro-Symbolic Deductive Inference for Biological Cell Atlas Segmentation",
        reviewerName: "Dr. Elena Vance",
        reviewerInstitution: "Harvard Medical School",
        methodologyScore: 5,
        statisticalScore: 4,
        reproducibilityScore: 5,
        noveltyScore: 5,
        averageScore: 4.8,
        recommendation: "ACCEPT",
        writtenCritique: "Rigorous experimental verification on the HuBMAP lung cell benchmark with zero citation leakage.",
        noConflictOfInterest: true,
        submittedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
    ],
  });

  const handleReviewSubmit = (review: StructuredPeerReviewSubmission) => {
    setReviewsMap((prev) => ({
      ...prev,
      [review.postId]: [review, ...(prev[review.postId] || [])],
    }));
    triggerToast(`Structured review published for "${review.postTitle}" (Score: ${review.averageScore}/5.0) ★`);
  };

  // Synchronize incoming distributed WebSocket dispatches into the feed
  useEffect(() => {
    if (realtimeMessages.length > 0) {
      const latest = realtimeMessages[realtimeMessages.length - 1];
      if (latest && !posts.some((p) => p.id === latest.id)) {
        const livePost: AcademicPost = {
          id: latest.id,
          author: {
            name: latest.sender.name || "Visiting Scholar",
            role: latest.sender.role || "Research Fellow",
            institution: "Cambium Research Mesh",
            initials: (latest.sender.name || "VS")
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase(),
            avatarColor: "#3E6248",
          },
          timeAgo: "Just now",
          type: "scientific_inquiry",
          title: "Live Scholarly Mesh Dispatch",
          content: latest.content,
          tags: ["Live Dispatch", "Network Broadcast"],
          metrics: { comments: 0, saves: 0, shares: 0, likes: 1 },
          comments: [],
        };
        setPosts((prev) => [livePost, ...prev]);
      }
    }
  }, [realtimeMessages]);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 2500);
  };

  const toggleFollow = (authorName: string) => {
    setFollowingMap((prev) => {
      const next = !prev[authorName];
      triggerToast(next ? `Following ${authorName}'s public output ✓` : `Unfollowed ${authorName}`);
      return { ...prev, [authorName]: next };
    });
  };

  const handleSendConnectionRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectModalAuthor) return;
    setConnectionsMap((prev) => ({ ...prev, [connectModalAuthor.name]: true }));
    triggerToast(`2-way connection request sent to ${connectModalAuthor.name} ✓`);
    setConnectModalAuthor(null);
    setConnectContext("");
  };

  const handleExpressInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interestModalPost) return;
    triggerToast(
      `Collaboration interest and CV dossier transmitted to ${interestModalPost.author.name} ✓`
    );
    setInterestModalPost(null);
    setInterestMessage("");
  };

  const toggleSave = (postId: string) => {
    setSavedPosts((prev) => {
      const next = !prev[postId];
      triggerToast(next ? "Saved to your Research Desk ✓" : "Removed from saved");
      return { ...prev, [postId]: next };
    });
  };

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const next = !prev[postId];
      setPosts((current) =>
        current.map((p) =>
          p.id === postId
            ? { ...p, metrics: { ...p.metrics, likes: p.metrics.likes + (next ? 1 : -1) } }
            : p
        )
      );
      return { ...prev, [postId]: next };
    });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCommentPost || !newCommentText.trim()) return;

    const newComment: PostComment = {
      id: `comm-${Date.now()}`,
      author: {
        name: "Imthiyas",
        role: "Principal Systems Architect",
        institution: "Cambium Research Mesh",
        initials: "IM",
        avatarColor: "#202920",
      },
      timeAgo: "Just now",
      content: newCommentText.trim(),
      endorsements: 1,
    };

    setPosts((prev) =>
      prev.map((p) =>
        p.id === activeCommentPost.id
          ? {
              ...p,
              comments: [...(p.comments || []), newComment],
              metrics: { ...p.metrics, comments: p.metrics.comments + 1 },
            }
          : p
      )
    );

    setActiveCommentPost((prev) =>
      prev ? { ...prev, comments: [...(prev.comments || []), newComment] } : null
    );

    setNewCommentText("");
    triggerToast("Comment added to scholarly discourse ✓");
  };

  const handleCreateAcademicPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composerTitle.trim() || !composerContent.trim()) return;

    const newPost: AcademicPost = {
      id: `post-${Date.now()}`,
      author: {
        name: "Imthiyas",
        role: "Principal Systems Architect · AI",
        institution: "MIT CSAIL & Cambium Labs",
        initials: "IM",
        avatarColor: "#202920",
        orcid: "0000-0002-1825-0097",
      },
      timeAgo: "Just now",
      type: composerType,
      title: composerTitle.trim(),
      content: composerContent.trim(),
      tags: composerTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      doiReference: composerDoi.trim() || undefined,
      collaborationDetails:
        composerType === "collaboration_call"
          ? {
              lookingFor: composerLookingFor.trim() || "Co-Author / Co-PI",
              preferredSkills: composerSkills
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            }
          : undefined,
      grantConsortiumDetails:
        composerType === "grant_consortium"
          ? {
              funder: composerFunder.trim() || "National Science Foundation",
              budget: composerBudget.trim() || "$1,200,000",
              deadlineDays: 45,
              requiredInstitutions: ["High-Performance Compute", "Clinical Partner"],
            }
          : undefined,
      paperMetadata:
        composerType === "paper_release" && composerDoi.trim()
          ? {
              venue: "OpenAlex Live Indexed Publication",
              year: 2026,
              citations: 18,
              abstractPreview: composerContent.slice(0, 160) + "...",
            }
          : undefined,
      metrics: { comments: 0, saves: 0, shares: 0, likes: 1 },
      comments: [],
    };

    setPosts([newPost, ...posts]);
    setIsComposerOpen(false);
    setComposerTitle("");
    setComposerContent("");
    setComposerTags("");
    setComposerDoi("");
    setComposerLookingFor("");
    setComposerSkills("");
    setComposerFunder("");
    setComposerBudget("");

    sendMessage(newPost.content, "community");
    triggerToast("Your academic post has been published to the global scholar mesh ✓");
  };

  // Filter posts based on activeTab and searchQuery
  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeTab === "Collaboration Calls") return p.type === "collaboration_call";
    if (activeTab === "Paper Releases") return p.type === "paper_release";
    if (activeTab === "Grant Consortiums") return p.type === "grant_consortium";
    if (activeTab === "Scientific Inquiries") return p.type === "scientific_inquiry";
    if (activeTab === "Following Feed") return followingMap[p.author.name];
    return true;
  });

  return (
    <div className="flex-1 min-w-0 h-screen overflow-y-auto bg-[#FAF7F0] text-[#202920] font-sans">
      {/* Top Header */}
      <div className="px-8 py-5 border-b border-[#E4DCCB] bg-[#FAF7F0]/90 sticky top-0 z-20 backdrop-blur-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#DCE6D7] border border-[#66866A]/30 text-[#3E6248]">
            <Users size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-normal text-[#202920] tracking-tight m-0">
                Academic Community & Discourse Network
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium border flex items-center gap-1.5 ${
                  isSocketConnected
                    ? "bg-[#DCE6D7] text-[#3E6248] border-[#66866A]/30"
                    : "bg-[#F2EBDD] text-[#85877B] border-[#E4DCCB]"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isSocketConnected ? "bg-[#3E6248] animate-pulse" : "bg-[#85877B]"
                  }`}
                />
                {isSocketConnected ? "Scholarly Mesh Active" : "In-Memory Session"}
              </span>
            </div>
            <p className="text-xs text-[#62685E] font-sans mt-0.5">
              4 structured academic primitives: collaboration calls, preprint releases, grant consortia, and technical inquiries.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#62685E]" size={14} />
            <input
              type="text"
              placeholder="Search concepts, DOIs, authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 rounded-lg border border-[#E4DCCB] bg-white text-xs font-sans text-[#202920] focus:outline-none focus:border-[#3E6248] w-64 shadow-xs"
            />
          </div>

          <Link
            href="/messages"
            className="px-3.5 py-1.5 rounded-lg border border-[#E4DCCB] bg-white hover:bg-[#FAF7F0] text-xs font-mono font-medium text-[#202920] flex items-center gap-1.5 transition-colors no-underline shadow-xs"
          >
            <MessageSquare size={13} className="text-[#3E6248]" />
            Direct Messages ↗
          </Link>

          <button
            onClick={() => setIsComposerOpen(true)}
            className="px-4 py-1.5 rounded-lg bg-[#3E6248] hover:bg-[#173F35] text-white text-xs font-mono font-medium flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Plus size={14} />
            Publish Post
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_330px] gap-8">
        {/* Main Feed Column */}
        <div className="space-y-6">
          {/* Feed Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#E4DCCB] pb-3">
            {[
              "All Discussions",
              "Collaboration Calls",
              "Paper Releases",
              "Grant Consortiums",
              "Scientific Inquiries",
              "Following Feed",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-[#202920] text-white font-semibold shadow-xs"
                    : "bg-white text-[#62685E] border border-[#E4DCCB] hover:text-[#202920]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Posts Feed */}
          <div className="space-y-6">
            {filteredPosts.map((post) => {
              const isFollowing = followingMap[post.author.name];
              const isConnected = connectionsMap[post.author.name];
              const isSaved = savedPosts[post.id];
              const isLiked = likedPosts[post.id];

              return (
                <div
                  key={post.id}
                  className={`bg-white border rounded-2xl p-6 transition-all shadow-xs hover:shadow-md ${
                    post.type === "collaboration_call"
                      ? "border-[#3E6248]/50 border-t-4 border-t-[#3E6248]"
                      : post.type === "grant_consortium"
                      ? "border-[#D97706]/50 border-t-4 border-t-[#D97706]"
                      : post.type === "paper_release"
                      ? "border-[#2563EB]/50 border-t-4 border-t-[#2563EB]"
                      : "border-[#E4DCCB]"
                  }`}
                >
                  {/* Author Header */}
                  <div className="flex items-start justify-between gap-4 mb-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-xs"
                        style={{ backgroundColor: post.author.avatarColor }}
                      >
                        {post.author.initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#202920]">
                            {post.author.name}
                          </span>
                          {post.author.orcid && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#FAF7F0] border border-[#E4DCCB] text-[#62685E]">
                              ORCID: {post.author.orcid}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#62685E] mt-0.5">
                          {post.author.role} · {post.author.institution}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-[#85877B]">{post.timeAgo}</span>
                      <button
                        onClick={() => toggleFollow(post.author.name)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-medium border transition-colors cursor-pointer ${
                          isFollowing
                            ? "bg-[#DCE6D7] text-[#3E6248] border-[#66866A]/30"
                            : "bg-white text-[#62685E] border-[#E4DCCB] hover:text-[#202920]"
                        }`}
                      >
                        {isFollowing ? "Following" : "+ Follow"}
                      </button>
                      <button
                        onClick={() => setConnectModalAuthor(post.author)}
                        disabled={isConnected}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-medium border transition-colors cursor-pointer ${
                          isConnected
                            ? "bg-[#FAF7F0] text-[#85877B] border-[#E4DCCB]"
                            : "bg-[#3E6248]/10 text-[#3E6248] border-[#3E6248]/30 hover:bg-[#3E6248] hover:text-white"
                        }`}
                      >
                        {isConnected ? "Pending" : "Connect"}
                      </button>
                    </div>
                  </div>

                  {/* Post Badge & Title */}
                  <div className="mb-2.5 flex items-center gap-2">
                    {post.type === "collaboration_call" && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#DCE6D7] text-[#3E6248] border border-[#66866A]/20">
                        Collaboration Call
                      </span>
                    )}
                    {post.type === "paper_release" && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#EFF6FF] text-[#1D4ED8] border border-[#93C5FD]/30">
                        Preprint / Paper Release
                      </span>
                    )}
                    {post.type === "grant_consortium" && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#FEF3C7] text-[#B45309] border border-[#FCD34D]/40">
                        Grant Consortium Formation
                      </span>
                    )}
                    {post.type === "scientific_inquiry" && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#F3E8FF] text-[#7E22CE] border border-[#D8B4FE]/30">
                        Scientific Inquiry
                      </span>
                    )}
                    <h3 className="font-serif text-lg font-bold text-[#202920] tracking-tight m-0">
                      {post.title}
                    </h3>
                  </div>

                  {/* Main Content Body */}
                  <p className="text-xs text-[#202920] font-sans leading-relaxed mb-4">
                    {post.content}
                  </p>

                  {/* Primitive Specific Callouts */}
                  {post.type === "collaboration_call" && post.collaborationDetails && (
                    <div className="bg-[#FAF7F0] border border-[#E4DCCB] rounded-xl p-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-mono text-[#62685E] font-semibold">
                          Looking For:{" "}
                          <strong className="text-[#3E6248]">
                            {post.collaborationDetails.lookingFor}
                          </strong>
                        </span>
                        {post.collaborationDetails.targetDeadline && (
                          <span className="text-[10px] font-mono text-[#B33D35] bg-[#FDF1EE] px-2 py-0.5 rounded">
                            Target Deadline: {post.collaborationDetails.targetDeadline}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5 items-center mb-3">
                        <span className="text-[11px] font-mono text-[#62685E]">Skills:</span>
                        {post.collaborationDetails.preferredSkills.map((s) => (
                          <span
                            key={s}
                            className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-[#E4DCCB] text-[#202920]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => setInterestModalPost(post)}
                        className="px-3.5 py-1.5 rounded-lg bg-[#3E6248] hover:bg-[#173F35] text-white text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                      >
                        <UserPlus size={13} />
                        Express Interest to Co-Author
                      </button>
                    </div>
                  )}

                  {post.type === "paper_release" && post.paperMetadata && (
                    <div className="bg-[#FAF7F0] border border-[#E4DCCB] rounded-xl p-4 mb-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-[#1D4ED8]">
                          {post.paperMetadata.venue} ({post.paperMetadata.year})
                        </span>
                        <span className="text-[10.5px] font-mono text-[#62685E]">
                          {post.paperMetadata.citations} Citations
                        </span>
                      </div>
                      <p className="text-xs text-[#62685E] line-clamp-2 mb-3">
                        {post.paperMetadata.abstractPreview}
                      </p>
                      {/* COPE Structured Review Badge if reviews present */}
                      {reviewsMap[post.id]?.length > 0 && (
                        <div className="mb-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EAB308]/15 border border-[#EAB308]/40 text-[#854D0E] text-[10.5px] font-mono font-bold">
                          <Award size={12} className="text-[#854D0E]" />
                          <span>
                            {(
                              reviewsMap[post.id].reduce((acc, r) => acc + r.averageScore, 0) /
                              reviewsMap[post.id].length
                            ).toFixed(1)} / 5.0 COPE Verified ({reviewsMap[post.id].length} Review{reviewsMap[post.id].length > 1 ? "s" : ""})
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          href={`/agent-reader?doi=${post.doiReference || ""}`}
                          className="px-3 py-1.5 rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-mono font-semibold flex items-center gap-1.5 no-underline shadow-xs"
                        >
                          <Bot size={13} />
                          Audit in Agentic Reader ↗
                        </Link>
                        <button
                          type="button"
                          onClick={() => setReviewModalPost(post)}
                          className="px-3 py-1.5 rounded-lg border border-[#3E6248] text-[#3E6248] hover:bg-[#DCE6D7] text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                        >
                          <Award size={13} />
                          <span>Submit COPE Review</span>
                        </button>
                        {post.doiReference && (
                          <a
                            href={`https://doi.org/${post.doiReference}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 rounded-lg border border-[#E4DCCB] bg-white text-xs font-mono text-[#62685E] hover:text-[#202920] flex items-center gap-1 no-underline"
                          >
                            <ExternalLink size={12} />
                            DOI: {post.doiReference}
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {post.type === "grant_consortium" && post.grantConsortiumDetails && (
                    <div className="bg-[#FAF7F0] border border-[#E4DCCB] rounded-xl p-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-[#B45309]">
                          {post.grantConsortiumDetails.funder}
                        </span>
                        <span className="text-xs font-mono font-bold text-[#3E6248]">
                          Award: {post.grantConsortiumDetails.budget}
                        </span>
                      </div>
                      <p className="text-xs text-[#62685E] mb-3">
                        Seeking partner facilities:{" "}
                        {post.grantConsortiumDetails.requiredInstitutions.join(", ")}
                      </p>
                      <div className="flex items-center gap-2">
                        <Link
                          href="/workspace"
                          className="px-3 py-1.5 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-mono font-semibold flex items-center gap-1.5 no-underline shadow-xs"
                        >
                          <Layers size={13} />
                          Join Consortium Workspace ↗
                        </Link>
                        <Link
                          href="/opportunities"
                          className="px-2.5 py-1.5 rounded-lg border border-[#E4DCCB] bg-white text-xs font-mono text-[#62685E] hover:text-[#202920] flex items-center gap-1 no-underline"
                        >
                          <DollarSign size={12} />
                          View Grant Metadata
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Scientific Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-mono bg-[#FAF7F0] border border-[#E4DCCB] text-[#62685E] px-2 py-0.5 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#E4DCCB]/60 text-xs font-mono text-[#62685E]">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center gap-1.5 cursor-pointer transition-colors ${
                          isLiked ? "text-[#B33D35]" : "hover:text-[#202920]"
                        }`}
                      >
                        <Heart size={14} className={isLiked ? "fill-[#B33D35]" : ""} />
                        <span>{post.metrics.likes} Endorsements</span>
                      </button>

                      <button
                        onClick={() => setActiveCommentPost(post)}
                        className="flex items-center gap-1.5 hover:text-[#202920] cursor-pointer"
                      >
                        <MessageSquare size={14} />
                        <span>{post.metrics.comments} Peer Comments</span>
                      </button>

                      <button
                        onClick={() => {
                          triggerToast("Citation payload copied to clipboard in BibTeX format ✓");
                        }}
                        className="flex items-center gap-1.5 hover:text-[#202920] cursor-pointer hidden sm:flex"
                      >
                        <Share2 size={14} />
                        <span>Cite</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleSave(post.id)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isSaved
                            ? "bg-[#DCE6D7] text-[#3E6248] border-[#66866A]/30"
                            : "border-[#E4DCCB] hover:bg-[#FAF7F0] text-[#62685E]"
                        }`}
                        title="Save to Research Desk"
                      >
                        <Bookmark size={14} className={isSaved ? "fill-[#3E6248]" : ""} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar: Active Communities & Scholar Radar */}
        <div className="space-y-6">
          {/* Active Scholar Radar */}
          <div className="bg-white border border-[#E4DCCB] rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-[#202920]">
                Co-Author Radar
              </h3>
              <span className="text-[10px] font-mono text-[#3E6248] font-semibold">
                High Vector Match
              </span>
            </div>

            <div className="space-y-3.5">
              {[
                {
                  name: "Dr. Elena Vance",
                  role: "Stanford Bio-AI",
                  match: "96% Vector Fit",
                  field: "Multimodal MRI",
                  color: "#3E6248",
                  initials: "EV",
                },
                {
                  name: "Prof. Marcus Thorne",
                  role: "Harvard Genomics",
                  match: "92% Vector Fit",
                  field: "Structural Biology",
                  color: "#173F35",
                  initials: "MT",
                },
                {
                  name: "Dr. Elena Rostova",
                  role: "Cambridge ML",
                  match: "89% Vector Fit",
                  field: "Geometric ML",
                  color: "#6B5A7A",
                  initials: "ER",
                },
              ].map((scholar) => (
                <div key={scholar.name} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0"
                      style={{ backgroundColor: scholar.color }}
                    >
                      {scholar.initials}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#202920] truncate">
                        {scholar.name}
                      </div>
                      <div className="text-[11px] text-[#62685E] truncate">{scholar.role}</div>
                    </div>
                  </div>
                  <Link
                    href="/messages"
                    className="px-2.5 py-1 rounded text-[11px] font-mono bg-[#FAF7F0] border border-[#E4DCCB] hover:border-[#3E6248] text-[#202920] no-underline shrink-0"
                  >
                    Message
                  </Link>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#E4DCCB]">
              <Link
                href="/graph"
                className="text-xs font-mono text-[#3E6248] hover:underline flex items-center gap-1"
              >
                Inspect Co-Author Graph Topology ↗
              </Link>
            </div>
          </div>

          {/* Academic Governance Box */}
          <div className="bg-[#FAF7F0] border border-[#E4DCCB] rounded-2xl p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-[#202920] flex items-center gap-1.5">
              <Award size={14} className="text-[#3E6248]" />
              Scholarly Verification Guarantee
            </h4>
            <p className="text-xs text-[#62685E] leading-relaxed">
              Every post in Cambium is tethered to verified ORCID records, active institutional email domains, and reproducible DOI proofs.
            </p>
            <div className="text-[11px] font-mono text-[#3E6248] bg-[#DCE6D7]/60 p-2 rounded-lg border border-[#66866A]/20">
              PRD Scope: Non-Generic Academic Discourse Protocol Enforced.
            </div>
          </div>
        </div>
      </div>

      {/* ─── Modal 1: Publish Academic Post Composer ─── */}
      {isComposerOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E4DCCB] max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4DCCB]">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#3E6248]" />
                <h3 className="font-serif text-lg font-bold text-[#202920] m-0">
                  Publish Academic Dispatch
                </h3>
              </div>
              <button
                onClick={() => setIsComposerOpen(false)}
                className="text-[#85877B] hover:text-[#202920] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Primitive Selector */}
            <div>
              <label className="block text-xs font-mono text-[#62685E] mb-1.5 uppercase tracking-wider">
                Select Academic Primitive
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "collaboration_call", label: "Collaboration Call", icon: Users },
                  { id: "paper_release", label: "Preprint / Paper", icon: BookOpen },
                  { id: "grant_consortium", label: "Grant Consortium", icon: DollarSign },
                  { id: "scientific_inquiry", label: "Scientific Inquiry", icon: HelpCircle },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setComposerType(item.id as AcademicPostType)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-mono flex items-center gap-2 transition-all cursor-pointer ${
                      composerType === item.id
                        ? "bg-[#3E6248] text-white border-[#3E6248] shadow-xs"
                        : "bg-[#FAF7F0] text-[#202920] border-[#E4DCCB] hover:bg-white"
                    }`}
                  >
                    <item.icon size={15} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCreateAcademicPost} className="space-y-3.5">
              <div>
                <label className="block text-xs font-mono text-[#62685E] mb-1">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Call for Co-Authors: Multimodal Medical Imaging..."
                  value={composerTitle}
                  onChange={(e) => setComposerTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E4DCCB] text-xs font-sans text-[#202920] focus:outline-none focus:border-[#3E6248]"
                  required
                />
              </div>

              {composerType === "paper_release" && (
                <div>
                  <label className="block text-xs font-mono text-[#62685E] mb-1">
                    DOI Reference (OpenAlex / PubMed)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 10.1016/j.cels.2025.04.002"
                    value={composerDoi}
                    onChange={(e) => setComposerDoi(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#E4DCCB] text-xs font-mono text-[#202920] focus:outline-none focus:border-[#3E6248]"
                  />
                </div>
              )}

              {composerType === "collaboration_call" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-[#62685E] mb-1">
                      Looking For Role
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Radiologist Co-Author"
                      value={composerLookingFor}
                      onChange={(e) => setComposerLookingFor(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#E4DCCB] text-xs text-[#202920] focus:outline-none focus:border-[#3E6248]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#62685E] mb-1">
                      Skills (Comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. DICOM, MRI, Clinical Protocols"
                      value={composerSkills}
                      onChange={(e) => setComposerSkills(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#E4DCCB] text-xs text-[#202920] focus:outline-none focus:border-[#3E6248]"
                    />
                  </div>
                </div>
              )}

              {composerType === "grant_consortium" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-[#62685E] mb-1">
                      Target Funder
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. NIH / NSF / EU Horizon"
                      value={composerFunder}
                      onChange={(e) => setComposerFunder(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#E4DCCB] text-xs text-[#202920] focus:outline-none focus:border-[#3E6248]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#62685E] mb-1">
                      Estimated Budget
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. $1,500,000"
                      value={composerBudget}
                      onChange={(e) => setComposerBudget(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#E4DCCB] text-xs text-[#202920] focus:outline-none focus:border-[#3E6248]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono text-[#62685E] mb-1">
                  Post Content & Formal Hypothesis
                </label>
                <textarea
                  placeholder="Outline the scientific context, methodologies, or collaborative goals..."
                  value={composerContent}
                  onChange={(e) => setComposerContent(e.target.value)}
                  className="w-full p-3 rounded-lg border border-[#E4DCCB] text-xs font-sans text-[#202920] h-24 resize-none focus:outline-none focus:border-[#3E6248]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#62685E] mb-1">
                  Taxonomy Tags (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. AI, Genomics, Structural Biology, Benchmarks"
                  value={composerTags}
                  onChange={(e) => setComposerTags(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E4DCCB] text-xs font-sans text-[#202920] focus:outline-none focus:border-[#3E6248]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E4DCCB]">
                <button
                  type="button"
                  onClick={() => setIsComposerOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#E4DCCB] text-xs font-mono text-[#62685E] hover:bg-[#FAF7F0] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#3E6248] hover:bg-[#173F35] text-white text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send size={13} />
                  Broadcast Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Modal 2: 2-Way Connection Request Modal ─── */}
      {connectModalAuthor && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E4DCCB] max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E4DCCB]">
              <h3 className="font-serif text-base font-bold text-[#202920] m-0">
                Connect with {connectModalAuthor.name}
              </h3>
              <button
                onClick={() => setConnectModalAuthor(null)}
                className="text-[#85877B] hover:text-[#202920] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-[#62685E]">
              Cambium requires academic context for 2-way verified connections to prevent generic spam.
            </p>

            <form onSubmit={handleSendConnectionRequest} className="space-y-3.5">
              <div>
                <label className="block text-xs font-mono text-[#62685E] mb-1">
                  How do you know this scholar or what is your shared interest?
                </label>
                <textarea
                  placeholder="e.g. Read your Nature MI paper; currently designing a complementary benchmark at MIT..."
                  value={connectContext}
                  onChange={(e) => setConnectContext(e.target.value)}
                  className="w-full p-3 rounded-lg border border-[#E4DCCB] text-xs text-[#202920] h-20 resize-none focus:outline-none focus:border-[#3E6248]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setConnectModalAuthor(null)}
                  className="px-4 py-1.5 rounded-lg border border-[#E4DCCB] text-xs font-mono text-[#62685E] hover:bg-[#FAF7F0] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#3E6248] text-white text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send size={12} />
                  Send Connection Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Modal 3: Express Interest to Co-Author Modal ─── */}
      {interestModalPost && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E4DCCB] max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E4DCCB]">
              <h3 className="font-serif text-base font-bold text-[#202920] m-0">
                Apply for Co-Authorship Role
              </h3>
              <button
                onClick={() => setInterestModalPost(null)}
                className="text-[#85877B] hover:text-[#202920] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-[#FAF7F0] p-3 rounded-xl border border-[#E4DCCB] text-xs">
              <span className="text-[#62685E]">Project Lead:</span>{" "}
              <strong>{interestModalPost.author.name}</strong> ({interestModalPost.author.institution})
              <div className="mt-1 font-semibold text-[#3E6248]">
                {interestModalPost.title}
              </div>
            </div>

            <form onSubmit={handleExpressInterest} className="space-y-3.5">
              <div>
                <label className="block text-xs font-mono text-[#62685E] mb-1">
                  Motivation & Relevant Facility / Dataset Experience
                </label>
                <textarea
                  placeholder="Outline your background with the requested skills and laboratory capacity..."
                  value={interestMessage}
                  onChange={(e) => setInterestMessage(e.target.value)}
                  className="w-full p-3 rounded-lg border border-[#E4DCCB] text-xs text-[#202920] h-24 resize-none focus:outline-none focus:border-[#3E6248]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setInterestModalPost(null)}
                  className="px-4 py-1.5 rounded-lg border border-[#E4DCCB] text-xs font-mono text-[#62685E] hover:bg-[#FAF7F0] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#3E6248] text-white text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send size={12} />
                  Transmit Interest Dossier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Drawer: Peer Discussion & Comments ─── */}
      {activeCommentPost && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[#E4DCCB]">
            <div className="p-4 border-b border-[#E4DCCB] flex items-center justify-between">
              <div>
                <h3 className="font-serif text-base font-bold text-[#202920] m-0">
                  Peer Review Discussion
                </h3>
                <span className="text-xs text-[#62685E] truncate block max-w-xs">
                  {activeCommentPost.title}
                </span>
              </div>
              <button
                onClick={() => setActiveCommentPost(null)}
                className="text-[#85877B] hover:text-[#202920] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Comment List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {(!activeCommentPost.comments || activeCommentPost.comments.length === 0) && (
                <div className="text-center py-12 text-xs text-[#85877B] font-mono">
                  No comments yet. Start the scholarly debate!
                </div>
              )}
              {activeCommentPost.comments?.map((c) => (
                <div key={c.id} className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E4DCCB] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#202920]">{c.author.name}</span>
                    <span className="text-[10px] font-mono text-[#85877B]">{c.timeAgo}</span>
                  </div>
                  <p className="text-[#202920]">{c.content}</p>
                  <div className="text-[10.5px] font-mono text-[#3E6248] flex items-center gap-1 pt-1">
                    <Heart size={11} className="fill-[#3E6248]" />
                    <span>{c.endorsements} endorsements</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Comment Input */}
            <form onSubmit={handleAddComment} className="p-4 border-t border-[#E4DCCB] bg-[#FAF7F0] flex gap-2">
              <input
                type="text"
                placeholder="Write a peer inquiry or critique..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-[#E4DCCB] bg-white text-xs text-[#202920] focus:outline-none focus:border-[#3E6248]"
              />
              <button
                type="submit"
                disabled={!newCommentText.trim()}
                className="px-3 py-2 rounded-lg bg-[#3E6248] hover:bg-[#173F35] text-white text-xs font-mono font-medium disabled:opacity-40 cursor-pointer"
              >
                Reply
              </button>
            </form>
          </div>
        </div>
      )}

      {/* COPE Structured Open Peer Review Modal */}
      {reviewModalPost && (
        <StructuredReviewModal
          isOpen={!!reviewModalPost}
          onClose={() => setReviewModalPost(null)}
          postId={reviewModalPost.id}
          postTitle={reviewModalPost.title}
          authorName={reviewModalPost.author.name}
          doi={reviewModalPost.doiReference}
          onSubmitReview={handleReviewSubmit}
        />
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#202920] text-[#FAF7F0] px-4 py-2.5 rounded-xl text-xs font-mono shadow-xl border border-white/10 flex items-center gap-2">
          <Sparkles size={14} className="text-[#4ADE80]" />
          <span>{showToast}</span>
        </div>
      )}
    </div>
  );
}
