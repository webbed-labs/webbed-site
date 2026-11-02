"use client";

import React, { useRef, useState, useCallback } from "react";
import { Upload, X, ImageIcon, Check, Loader2, Link } from "lucide-react";

const CLOUD_NAME = "qy2m6sdr";
const UPLOAD_PRESET = "webbed_blog_unsigned";

interface CloudinaryUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
}

export default function CloudinaryUpload({
  value,
  onChange,
  label = "Cover Image",
  hint,
}: CloudinaryUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState(value);

  const uploadFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file (JPG, PNG, WebP, GIF).");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("Image must be under 10 MB.");
        return;
      }

      setError("");
      setUploading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);
        formData.append("folder", "webbed_blog");

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          { method: "POST", body: formData }
        );

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error?.message || "Upload failed");
        }

        const data = await res.json();
        onChange(data.secure_url);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Upload failed";
        setError(msg);
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setError("");
    }
  };

  const clear = () => {
    onChange("");
    setUrlInput("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/50">
          {label}
        </label>
        <div className="flex items-center gap-1 rounded-lg border border-white/8 bg-white/[0.02] p-0.5">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-semibold transition-colors ${
              mode === "upload"
                ? "bg-indigo-500/20 text-indigo-300"
                : "text-white/40 hover:text-white"
            }`}
          >
            <Upload className="h-3 w-3" /> Upload
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-semibold transition-colors ${
              mode === "url"
                ? "bg-indigo-500/20 text-indigo-300"
                : "text-white/40 hover:text-white"
            }`}
          >
            <Link className="h-3 w-3" /> URL
          </button>
        </div>
      </div>

      {mode === "upload" ? (
        <>
          {/* Drop Zone */}
          {!value ? (
            <div
              onDragEnter={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => !uploading && fileInputRef.current?.click()}
              className={`relative flex h-[160px] w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-all ${
                dragOver
                  ? "border-indigo-400 bg-indigo-500/10"
                  : "border-white/10 bg-white/[0.02] hover:border-indigo-500/30 hover:bg-white/[0.04]"
              }`}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-7 w-7 animate-spin text-indigo-400" />
                  <p className="text-sm text-white/50">Uploading to Cloudinary…</p>
                </>
              ) : (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                    <ImageIcon className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-white/70">
                      {dragOver ? "Drop it here!" : "Drop image here or click to browse"}
                    </p>
                    <p className="text-[11px] text-white/35 mt-1">
                      JPG, PNG, WebP, GIF · Max 10 MB · Auto-optimized by Cloudinary
                    </p>
                  </div>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFile}
              />
            </div>
          ) : (
            /* Preview */
            <div className="relative overflow-hidden rounded-xl border border-white/10 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt="Cover preview"
                className="max-h-[220px] w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur hover:bg-white/20 transition-colors"
                >
                  <Upload className="h-3.5 w-3.5" /> Replace
                </button>
                <button
                  type="button"
                  onClick={clear}
                  className="flex items-center gap-2 rounded-lg bg-red-500/20 px-4 py-2 text-xs font-semibold text-red-400 backdrop-blur hover:bg-red-500/30 transition-colors"
                >
                  <X className="h-3.5 w-3.5" /> Remove
                </button>
              </div>
              {/* Cloudinary badge */}
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-green-500/20 bg-black/70 px-3 py-1 text-[10px] font-semibold text-green-400 backdrop-blur-sm">
                <Check className="h-3 w-3" /> Uploaded to Cloudinary
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFile}
              />
            </div>
          )}
        </>
      ) : (
        /* URL mode */
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
              placeholder="https://… paste any public image URL"
              className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/25 focus:border-indigo-500/50 focus:outline-none transition-colors"
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-3 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20 transition-colors shrink-0"
            >
              Use URL
            </button>
          </div>
          {value && (
            <div className="relative overflow-hidden rounded-xl border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt="Preview"
                className="max-h-[180px] w-full object-cover"
              />
              <button
                type="button"
                onClick={clear}
                className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white/70 hover:text-white transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-[11px] text-red-400">
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-[11px] text-white/30">{hint}</p>
      )}
    </div>
  );
}
