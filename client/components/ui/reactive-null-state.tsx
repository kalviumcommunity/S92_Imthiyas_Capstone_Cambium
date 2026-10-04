"use client";

import React, { useState, useRef } from "react";
import { Plus, ArrowRight, Layers, Sparkles, Compass } from "lucide-react";

export interface ReactiveNullStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function ReactiveNullState({
  title = "No active research artifacts indexed",
  description = "This collection or folder is awaiting its first manuscript, dataset, or empirical hypothesis.",
  actionLabel = "Create Research Artifact",
  onAction,
  className = "",
}: ReactiveNullStateProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Normalized coordinates (-1 to 1)
    const offsetX = (e.clientX - centerX) / (rect.width / 2);
    const offsetY = (e.clientY - centerY) / (rect.height / 2);

    // Dynamic rotation up to 18 degrees
    setRotate({
      x: -offsetY * 18,
      y: offsetX * 20,
    });

    // Specular light position (0% to 100%)
    const lightX = ((e.clientX - rect.left) / rect.width) * 100;
    const lightY = ((e.clientY - rect.top) / rect.height) * 100;
    setGlare({ x: lightX, y: lightY, opacity: 0.5 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  return (
    <div
      className={`w-full py-10 px-4 flex flex-col items-center justify-center font-sans select-none ${className}`}
      style={{ perspective: "1200px" }}
    >
      {/* 3D Reactive Tilting Container with Physics & Parallax */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(${isHovered ? 1.03 : 1})`,
          transition: "transform 100ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 150ms ease",
          transformStyle: "preserve-3d",
          boxShadow: isHovered
            ? `${-rotate.y * 1.5}px ${rotate.x * 1.5 + 24}px 48px rgba(32,41,32,0.12)`
            : "0 12px 32px rgba(32,41,32,0.06)",
        }}
        className="max-w-lg w-full p-8 sm:p-10 rounded-3xl bg-[#FAF7F0] border border-[#E4DCCB] flex flex-col items-center text-center cursor-pointer relative overflow-hidden group"
      >
        {/* Dynamic Specular Glass Glare Layer */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-30"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 65%)`,
            opacity: glare.opacity,
          }}
        />

        {/* Isometric Coordinate Blueprint Grid Ambient Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25 z-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, #3E6248 1px, transparent 1px), linear-gradient(to bottom, #3E6248 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Floating 3D Isometric Folio Graphic Layer */}
        <div
          className="relative w-24 h-24 mb-6 flex items-center justify-center z-10"
          style={{ transform: "translateZ(45px)" }}
        >
          {/* Shadow Disc */}
          <div
            className="absolute inset-x-3 -bottom-2 h-5 rounded-full bg-[#202920]/15 blur-md transition-transform"
            style={{
              transform: `translateX(${-rotate.y * 1.2}px)`,
            }}
          />

          {/* Layered Botanical Folio Card */}
          <div className="relative w-20 h-20 rounded-2xl bg-white border border-[#E4DCCB] shadow-md flex items-center justify-center rotate-3 transition-transform group-hover:rotate-6 group-hover:scale-105">
            <div className="absolute inset-2 rounded-xl border border-dashed border-[#66866A]/50 flex flex-col justify-between p-2 bg-[#FAF7F0]/60">
              <div className="flex gap-1.5 items-center">
                <span className="w-2 h-2 rounded-full bg-[#3E6248] animate-pulse" />
                <span className="w-6 h-1 rounded-full bg-[#E4DCCB]" />
              </div>
              <div className="space-y-1">
                <div className="w-full h-1 bg-[#E4DCCB] rounded" />
                <div className="w-3/4 h-1 bg-[#E4DCCB] rounded" />
              </div>
            </div>
            <Layers className="w-7 h-7 text-[#3E6248] z-10 filter drop-shadow-sm" />
          </div>
        </div>

        {/* Text Content in Elevated 3D Z-Space */}
        <div style={{ transform: "translateZ(30px)" }} className="space-y-2 z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#DCE6D7] border border-[#66866A]/30 text-[#3E6248] font-mono text-[10px] font-bold uppercase tracking-wider mb-1">
            <Sparkles size={11} />
            <span>Reactive 3D Spatial Null</span>
          </div>
          <h3 className="font-serif text-[22px] font-medium text-[#202920] tracking-tight m-0">
            {title}
          </h3>
          <p className="text-[13.5px] text-[#62685E] leading-relaxed max-w-sm m-0">
            {description}
          </p>
        </div>

        {/* Action Button Layer in Highest Z-Space */}
        {actionLabel && (
          <div style={{ transform: "translateZ(35px)" }} className="mt-6 z-20">
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#3E6248] hover:bg-[#293E30] text-white text-[13px] font-semibold tracking-wide uppercase font-mono shadow-md hover:shadow-lg transition-all duration-150 cursor-pointer border-0"
            >
              <Plus className="w-4 h-4" />
              <span>{actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-80" />
            </button>
          </div>
        )}

        {/* Live Coordinate Physics Readout Pill */}
        <div
          style={{ transform: "translateZ(15px)" }}
          className="mt-6 flex items-center gap-3 text-[10.5px] font-mono text-[#85877B] tracking-wider uppercase z-10"
        >
          <span className="flex items-center gap-1 text-[#3E6248]">
            <Compass size={12} className={isHovered ? "animate-spin" : ""} />
            {isHovered
              ? `X: ${rotate.x.toFixed(1)}° | Y: ${rotate.y.toFixed(1)}°`
              : "HOVER CURSOR TO ENGAGE 3D TILT"}
          </span>
        </div>
      </div>
    </div>
  );
}
