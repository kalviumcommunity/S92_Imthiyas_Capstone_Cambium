"use client";

export default function RootLoading() {
  // Render matching dark background instantly so nothing appears between clicking the link and the intro page
  return <div className="fixed inset-0 z-[10000] bg-[#141A14]" />;
}
