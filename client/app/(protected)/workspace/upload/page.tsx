"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function UploadPage() {
  const router = useRouter();
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files) {
      setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (files.length === 0) return;
    setUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      setUploading(false);
      router.push("/workspace");
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] bg-surface-base p-6">
      <div className="max-w-2xl w-full">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-serif font-bold text-ink-primary mb-2">
            Upload Research
          </h1>
          <p className="text-ink-secondary">
            Upload PDFs, datasets, or literature to your workspace.
          </p>
        </div>

        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors duration-200 ${
            dragging
              ? "border-moss-600 bg-moss-50/50"
              : "border-edge-default hover:border-moss-400 bg-surface-raised"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.csv,.xlsx"
            className="hidden"
            onChange={handleFileInput}
          />
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-moss-100 flex items-center justify-center text-moss-700">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <p className="text-lg font-medium text-ink-primary mb-1">
            Click to upload or drag and drop
          </p>
          <p className="text-sm text-ink-secondary">
            PDF, DOCX, CSV, or XLSX (max 50MB)
          </p>
        </div>

        {files.length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-ink-primary mb-3">
              Selected Files ({files.length})
            </h3>
            <ul className="space-y-2 mb-6">
              {files.map((file, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-surface-raised border border-edge-default"
                >
                  <div className="flex items-center space-x-3">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-moss-600"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                    <span className="text-sm font-medium text-ink-primary">
                      {file.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="text-ink-tertiary hover:text-red-500 transition-colors"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => router.back()}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="bg-moss-600 hover:bg-moss-700 text-white"
              >
                {uploading ? "Uploading..." : "Upload Files"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
