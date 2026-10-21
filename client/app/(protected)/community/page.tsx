"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRealtimeEvents } from "@/lib/realtime/useRealtimeEvents";
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
} from "lucide-react";

interface Post {
  id: string;
  author: {
    name: string;
    role: string;
    institution: string;
    initials: string;
    avatarColor: string;
  };
  timeAgo: string;
  type: "announcement" | "collaboration" | "question";
  content: string;
  tags: string[];
  metrics: {
    comments: number;
    saves: number;
    shares: number;
    likes: number;
  };
  collaborationDetails?: {
    lookingFor: string;
    preferredSkills: string[];
  };
}

const INITIAL_POSTS: Post[] = [
  {
    id: "post-1",
    author: {
      name: "Dr. Arjun Rao",
      role: "Machine Learning Researcher",
      institution: "IISc & Cambium ML Affiliate",
      initials: "AR",
      avatarColor: "#4A6B8A",
    },
    timeAgo: "2 hours ago",
    type: "announcement",
    content:
      "We just released our benchmark for low-resource scientific language models. The gap between domain-general and domain-specific models is larger than we expected at small scales. Evaluation code and synthetic test splits are now public.",
    tags: ["Scientific NLP", "Low-Resource ML", "Benchmarks", "Evaluation"],
    metrics: {
      comments: 24,
      saves: 142,
      shares: 38,
      likes: 89,
    },
  },
  {
    id: "post-2",
    author: {
      name: "Dr. Elena Park",
      role: "Associate Professor of Computational Biology",
      institution: "Stanford Bio-X & Medicine",
      initials: "EP",
      avatarColor: "#6B5A7A",
    },
    timeAgo: "4 hours ago",
    type: "collaboration",
    content:
      "Working on multimodal medical imaging foundation models and looking for researchers with expertise in clinical validation. Experience with multi-center radiology datasets (DICOM, NIfTI) preferred for upcoming Nature MI submission.",
    tags: ["Medical Imaging", "Computer Vision", "Collaboration", "Clinical AI"],
    metrics: {
      comments: 17,
      saves: 95,
      shares: 21,
      likes: 64,
    },
    collaborationDetails: {
      lookingFor: "Clinical Validation Lead & Radiologist Co-Author",
      preferredSkills: ["Clinical Protocols", "3D Volumetric MRI", "Statistical Significance"],
    },
  },
  {
    id: "post-3",
    author: {
      name: "Prof. Jonas Keller",
      role: "Chair of Climate Informatics",
      institution: "ETH Zürich",
      initials: "JK",
      avatarColor: "#3E6248",
    },
    timeAgo: "7 hours ago",
    type: "question",
    content:
      "Has anyone compared continuous-time diffusion kriging against physics-informed neural operators on ERA5 atmospheric reanalysis grids under extreme temperature shifts? Our recent ablation runs show divergence at higher latitudes.",
    tags: ["Climate Informatics", "PINNs", "Spatiotemporal ML", "Diffusion Models"],
    metrics: {
      comments: 31,
      saves: 83,
      shares: 19,
      likes: 72,
    },
  },
];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<string>("All Discussions");
  const { isSocketConnected, sendMessage, messages: realtimeMessages } = useRealtimeEvents("community");
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({
    "Dr. Arjun Rao": true,
  });
  const [interestedMap, setInterestedMap] = useState<Record<string, boolean>>({});
  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [showToast, setShowToast] = useState<string | null>(null);

  // Synchronize incoming distributed WebSocket dispatches into the feed
  useEffect(() => {
    if (realtimeMessages.length > 0) {
      const latest = realtimeMessages[realtimeMessages.length - 1];
      if (latest && !posts.some((p) => p.id === latest.id)) {
        const livePost: Post = {
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
          type: "announcement",
          content: latest.content,
          tags: ["Live Dispatch", "Network Broadcast"],
          metrics: { comments: 0, saves: 0, shares: 0, likes: 1 },
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
      triggerToast(next ? `Following ${authorName}` : `Unfollowed ${authorName}`);
      return { ...prev, [authorName]: next };
    });
  };

  const toggleInterest = (postId: string) => {
    setInterestedMap((prev) => {
      const next = !prev[postId];
      triggerToast(next ? "Interest submitted to project lead ✓" : "Interest withdrawn");
      return { ...prev, [postId]: next };
    });
  };

  const toggleSave = (postId: string) => {
    setSavedPosts((prev) => {
      const next = !prev[postId];
      triggerToast(next ? "Saved to your Research Desk ✓" : "Removed from saved");
      return { ...prev, [postId]: next };
    });
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    const content = newPostContent.trim();
    if (!content) return;

    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: {
        name: "Imthiyas",
        role: "PhD Researcher · Computer Vision",
        institution: "MIT CSAIL & Cambium Fellow",
        initials: "IM",
        avatarColor: "#202920",
      },
      timeAgo: "Just now",
      type: "announcement",
      content,
      tags: ["Research Update", "MIT CSAIL"],
      metrics: {
        comments: 0,
        saves: 0,
        shares: 0,
        likes: 1,
      },
    };

    setPosts([newPost, ...posts]);
    setNewPostContent("");
    // Broadcast over distributed Socket.io channel to peers
    sendMessage(content, "community");
    triggerToast("Your research dispatch has been broadcast to the global mesh!");
  };

  return (
    <div className="flex-1 min-w-0 h-screen overflow-y-auto bg-[#FAF7F0] text-[#202920] font-sans">
      {/* Top Breadcrumb Header */}
      <div className="px-8 py-5 border-b border-[#E4DCCB] bg-[#FAF7F0]/90 sticky top-0 z-20 backdrop-blur-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#DCE6D7] border border-[#66866A]/30 text-[#3E6248]">
            <Users size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-normal text-[#202920] tracking-tight m-0">
                Scholarly Community & Discourse Network
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium border flex items-center gap-1.5 ${
                isSocketConnected
                  ? "bg-[#DCE6D7] text-[#3E6248] border-[#66866A]/30"
                  : "bg-[#F2EBDD] text-[#85877B] border-[#E4DCCB]"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isSocketConnected ? "bg-[#3E6248] animate-pulse" : "bg-[#85877B]"}`} />
                {isSocketConnected ? "Mesh Active (WebSockets)" : "Offline Mesh Cache"}
              </span>
            </div>
            <p className="text-xs text-[#62685E] font-sans mt-0.5">
              Peer review debates, cross-disciplinary collaboration calls, and open benchmark releases across 48 institutions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#62685E]" size={14} />
            <input
              type="text"
              placeholder="Search researchers, topics, benchmarks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 rounded-lg border border-[#E4DCCB] bg-white text-xs font-sans text-[#202920] focus:outline-none focus:border-[#3E6248] w-64 shadow-xs"
            />
          </div>
          <Link
            href="/lab"
            className="px-3.5 py-1.5 rounded-lg bg-[#202920] hover:bg-[#3E6248] text-white text-xs font-mono font-medium flex items-center gap-1.5 transition-colors no-underline"
          >
            <Building2 size={13} />
            Lab Workspace ↗
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* Main Feed Column */}
        <div className="space-y-6">
          {/* Quick Dispatch Composer */}
          <div className="bg-white border border-[#E4DCCB] rounded-2xl p-5 shadow-xs">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#DCE6D7] border border-[#66866A]/40 flex items-center justify-center font-bold text-xs text-[#202920]">
                IM
              </div>
              <span className="text-xs font-semibold text-[#202920]">
                Share a finding, benchmark release, or collaboration request...
              </span>
            </div>
            <form onSubmit={handleCreatePost}>
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="What is your latest research breakthrough or question?"
                className="w-full p-3 rounded-xl border border-[#E4DCCB] bg-[#FAF7F0] text-xs font-sans text-[#202920] placeholder:text-[#85877B] resize-none h-20 focus:outline-none focus:border-[#3E6248]"
              />
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#E4DCCB]/60">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-[#62685E] bg-[#F2EBDD] px-2 py-0.5 rounded border border-[#E4DCCB]">
                    Markdown supported
                  </span>
                </div>
                <button
                  type="submit"
                  disabled={!newPostContent.trim()}
                  className="px-4 py-1.5 rounded-lg bg-[#3E6248] hover:bg-[#202920] disabled:opacity-40 text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Send size={12} />
                  Post Dispatch
                </button>
              </div>
            </form>
          </div>

          {/* Feed Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              "All Discussions",
              "Collaboration Calls",
              "Benchmark Releases",
              "Peer Questions",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
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
          <div className="space-y-5">
            {posts.map((post) => {
              const isFollowing = followingMap[post.author.name];
              const isInterested = interestedMap[post.id];
              const isSaved = savedPosts[post.id];

              return (
                <div
                  key={post.id}
                  className={`bg-white border rounded-2xl p-6 transition-all shadow-xs ${
                    post.type === "collaboration"
                      ? "border-[#3E6248]/50 border-t-4 border-t-[#3E6248]"
                      : "border-[#E4DCCB]"
                  }`}
                >
                  {/* Author Header */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        style={{ backgroundColor: post.author.avatarColor }}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs"
                      >
                        {post.author.initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-[#202920]">
                            {post.author.name}
                          </span>
                          <span className="text-[11px] text-[#85877B]">
                            · {post.timeAgo}
                          </span>
                        </div>
                        <div className="text-xs text-[#62685E]">
                          {post.author.role} · {post.author.institution}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {post.type === "collaboration" && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#DCE6D7] text-[#202920]">
                          Looking for collaborators
                        </span>
                      )}
                      <button
                        onClick={() => toggleFollow(post.author.name)}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors cursor-pointer ${
                          isFollowing
                            ? "bg-[#DCE6D7] text-[#202920] border-[#66866A]/30"
                            : "bg-white text-[#62685E] border-[#E4DCCB] hover:text-[#202920]"
                        }`}
                      >
                        {isFollowing ? "Following ✓" : "+ Follow"}
                      </button>
                    </div>
                  </div>

                  {/* Body Content */}
                  <p className="text-sm text-[#202920] leading-relaxed mb-4">
                    {post.content}
                  </p>

                  {/* Collaboration specifics box */}
                  {post.collaborationDetails && (
                    <div className="p-3.5 rounded-xl bg-[#F2EBDD] border border-[#E4DCCB] mb-4">
                      <div className="text-xs font-semibold text-[#3E6248] mb-1">
                        Role: {post.collaborationDetails.lookingFor}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] text-[#62685E]">Skills needed:</span>
                        {post.collaborationDetails.preferredSkills.map((s) => (
                          <span
                            key={s}
                            className="text-[10px] font-mono px-2 py-0.5 bg-white rounded border border-[#E4DCCB] text-[#202920]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex items-center gap-2 flex-wrap mb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-[#FAF7F0] border border-[#E4DCCB] text-[#62685E]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#E4DCCB]/60 text-xs text-[#62685E]">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1.5 hover:text-[#202920] transition-colors cursor-pointer bg-transparent border-none">
                        <MessageSquare size={13} />
                        <span>{post.metrics.comments} Comments</span>
                      </button>
                      <button
                        onClick={() => triggerToast("Direct link copied to clipboard")}
                        className="flex items-center gap-1.5 hover:text-[#202920] transition-colors cursor-pointer bg-transparent border-none"
                      >
                        <Share2 size={13} />
                        <span>Share</span>
                      </button>
                      <button
                        onClick={() => toggleSave(post.id)}
                        className={`flex items-center gap-1.5 transition-colors cursor-pointer bg-transparent border-none ${
                          isSaved ? "text-[#3E6248] font-semibold" : "hover:text-[#202920]"
                        }`}
                      >
                        <Bookmark size={13} className={isSaved ? "fill-[#3E6248]" : ""} />
                        <span>{isSaved ? "Saved ✓" : "Save"}</span>
                      </button>
                    </div>

                    {post.type === "collaboration" && (
                      <button
                        onClick={() => toggleInterest(post.id)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          isInterested
                            ? "bg-[#DCE6D7] text-[#202920] border border-[#66866A]"
                            : "bg-[#202920] hover:bg-[#3E6248] text-white"
                        }`}
                      >
                        {isInterested ? "Interest Expressed ✓" : "Express interest"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Rail: Active Researchers & Discussion Groups */}
        <div className="space-y-6">
          {/* Active Discourse Hubs */}
          <div className="bg-white border border-[#E4DCCB] rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif text-base font-normal text-[#202920] m-0">
                Trending Discourse Hubs
              </h3>
              <Sparkles size={14} className="text-[#3E6248]" />
            </div>
            <div className="space-y-3">
              {[
                {
                  title: "Clinical Tomography PEFT Hub",
                  members: "148 researchers",
                  activity: "32 messages today",
                },
                {
                  title: "Neuro-Symbolic Drug Discovery",
                  members: "94 researchers",
                  activity: "18 messages today",
                },
                {
                  title: "DNA Foundation Models (Evo/Hyena)",
                  members: "210 researchers",
                  activity: "45 messages today",
                },
              ].map((hub) => (
                <div
                  key={hub.title}
                  className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E4DCCB] hover:border-[#3E6248] transition-colors"
                >
                  <div className="text-xs font-semibold text-[#202920]">{hub.title}</div>
                  <div className="text-[11px] text-[#62685E] mt-0.5">
                    {hub.members} · <span className="text-[#3E6248] font-medium">{hub.activity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Collaborators */}
          <div className="bg-white border border-[#E4DCCB] rounded-2xl p-5 shadow-xs">
            <h3 className="font-serif text-base font-normal text-[#202920] mb-3 m-0">
              High-Synergy Peers
            </h3>
            <div className="space-y-3">
              {[
                {
                  name: "Dr. Aisha Rahman",
                  field: "Computational Linguistics · Oxford",
                  overlap: "94% vector overlap",
                },
                {
                  name: "Dr. Lena Kovacs",
                  field: "Neural Decoding · ETH Zurich",
                  overlap: "89% vector overlap",
                },
              ].map((peer) => (
                <div
                  key={peer.name}
                  className="flex items-center justify-between gap-3 pb-2 border-b border-[#E4DCCB]/60 last:border-none"
                >
                  <div>
                    <div className="text-xs font-semibold text-[#202920]">{peer.name}</div>
                    <div className="text-[11px] text-[#62685E]">{peer.field}</div>
                    <div className="text-[10px] font-mono text-[#3E6248]">{peer.overlap}</div>
                  </div>
                  <button
                    onClick={() => triggerToast(`Connection request dispatched to ${peer.name}`)}
                    className="p-1.5 rounded-lg border border-[#E4DCCB] hover:bg-[#DCE6D7] text-[#202920] text-xs transition-colors cursor-pointer"
                    title="Send Connection Request"
                  >
                    <UserPlus size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#202920] text-[#FAF7F0] px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 shadow-lg z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check size={14} className="text-[#4ADE80]" />
          {showToast}
        </div>
      )}
    </div>
  );
}
