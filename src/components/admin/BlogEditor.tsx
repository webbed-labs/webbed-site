"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  Save,
  Globe,
  FileText,
  User,
  Loader2,
  Check,
  AlertTriangle,
  Tag,
  Clock,
  Star,
} from "lucide-react";
import {
  type Blog,
  type Publisher,
  generateSlug,
  calculateReadTime,
  createBlog,
  updateBlog,
  PUBLISHER_META,
} from "@/lib/blogs";
import CloudinaryUpload from "./CloudinaryUpload";

const EMPTY_BLOG: Omit<Blog, "id" | "createdAt" | "updatedAt"> = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImageUrl: "",
  coverImageAlt: "",
  publisher: "webbed-team",
  tags: [],
  featured: false,
  status: "draft",
  readTimeMinutes: 1,
  metaTitle: "",
  metaDescription: "",
  ogImageUrl: "",
  canonicalUrl: "",
  authorName: "",
  publishedAt: null,
};

type Tab = "content" | "seo" | "author";

interface BlogEditorProps {
  existingBlog?: Blog | null;
  onBack: () => void;
  onSaved: () => void;
}

export default function BlogEditor({
  existingBlog,
  onBack,
  onSaved,
}: BlogEditorProps) {
  const isEditing = !!existingBlog?.id;
  const [form, setForm] = useState<Omit<Blog, "id" | "createdAt" | "updatedAt">>(
    existingBlog
      ? {
          title: existingBlog.title,
          slug: existingBlog.slug,
          excerpt: existingBlog.excerpt,
          content: existingBlog.content,
          coverImageUrl: existingBlog.coverImageUrl,
          coverImageAlt: existingBlog.coverImageAlt,
          publisher: existingBlog.publisher,
          tags: existingBlog.tags,
          featured: existingBlog.featured,
          status: existingBlog.status,
          readTimeMinutes: existingBlog.readTimeMinutes,
          metaTitle: existingBlog.metaTitle,
          metaDescription: existingBlog.metaDescription,
          ogImageUrl: existingBlog.ogImageUrl,
          canonicalUrl: existingBlog.canonicalUrl,
          authorName: existingBlog.authorName,
          publishedAt: existingBlog.publishedAt,
        }
      : { ...EMPTY_BLOG }
  );
  const [tab, setTab] = useState<Tab>("content");
  const [tagInput, setTagInput] = useState(existingBlog?.tags.join(", ") ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugManuallyEdited && form.title) {
      setForm((f) => ({ ...f, slug: generateSlug(f.title) }));
    }
  }, [form.title, slugManuallyEdited]);

  // Auto-calculate read time
  useEffect(() => {
    if (form.content) {
      setForm((f) => ({
        ...f,
        readTimeMinutes: calculateReadTime(f.content),
      }));
    }
  }, [form.content]);

  const set = useCallback(
    <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
      setForm((f) => ({ ...f, [key]: value }));
    },
    []
  );

  const handleTagInputChange = (val: string) => {
    setTagInput(val);
    const tags = val
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    set("tags", tags);
  };

  const validate = (): string => {
    if (!form.title.trim()) return "Title is required.";
    if (!form.slug.trim()) return "Slug is required.";
    if (!form.excerpt.trim()) return "Excerpt is required.";
    if (!form.authorName.trim()) return "Author name is required.";
    if (!form.content.trim()) return "Content is required.";
    return "";
  };

  const handleSave = async (publishNow?: boolean) => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setSaving(true);

    const payload = {
      ...form,
      status: publishNow ? ("published" as const) : form.status,
      metaTitle: form.metaTitle || form.title,
      metaDescription: form.metaDescription || form.excerpt,
      ogImageUrl: form.ogImageUrl || form.coverImageUrl,
      canonicalUrl:
        form.canonicalUrl || `https://webbed.in/blogs/post?slug=${form.slug}`,
      publishedAt:
        publishNow || form.status === "published" ? form.publishedAt : null,
    };

    try {
      if (isEditing && existingBlog!.id) {
        await updateBlog(existingBlog!.id, payload);
      } else {
        await createBlog(payload);
      }
      setSaved(true);
      setTimeout(() => {
        onSaved();
      }, 800);
    } catch (err) {
      setError("Failed to save. Check your connection and try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const tabClass = (t: Tab) =>
    `flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
      tab === t
        ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
        : "text-white/50 hover:text-white hover:bg-white/5"
    }`;

  const labelClass = "block text-[11px] font-semibold uppercase tracking-wider text-white/50 mb-1.5";
  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/25 transition-colors focus:border-indigo-500/50 focus:bg-white/[0.06] focus:outline-none";
  const textareaClass =
    "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/25 transition-colors focus:border-indigo-500/50 focus:bg-white/[0.06] focus:outline-none resize-y";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-white/8 px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div className="h-4 w-px bg-white/10" />
          <h2 className="text-sm font-semibold text-white">
            {isEditing ? "Edit Post" : "New Blog Post"}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Status toggle */}
          <button
            onClick={() =>
              set("status", form.status === "draft" ? "published" : "draft")
            }
            className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-semibold transition-all ${
              form.status === "published"
                ? "border-green-500/40 bg-green-500/10 text-green-400"
                : "border-white/15 bg-white/[0.03] text-white/60"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                form.status === "published"
                  ? "bg-green-400 shadow-[0_0_6px_rgba(74,222,128,1)]"
                  : "bg-white/30"
              }`}
            />
            {form.status === "published" ? "Published" : "Draft"}
          </button>

          {/* Save Draft */}
          <button
            onClick={() => handleSave()}
            disabled={saving || saved}
            className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-white/80 transition-all hover:bg-white/[0.08] hover:text-white disabled:opacity-50"
          >
            {saved ? (
              <Check className="h-4 w-4 text-green-400" />
            ) : saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saved ? "Saved!" : "Save Draft"}
          </button>

          {/* Publish */}
          {form.status !== "published" && (
            <button
              onClick={() => handleSave(true)}
              disabled={saving || saved}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-500 disabled:opacity-50 shadow-[0_0_20px_rgba(79,70,229,0.4)]"
            >
              <Globe className="h-4 w-4" />
              Publish
            </button>
          )}
          {form.status === "published" && (
            <button
              onClick={() => handleSave()}
              disabled={saving || saved}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-500 disabled:opacity-50 shadow-[0_0_20px_rgba(79,70,229,0.4)]"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Update Post
            </button>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mx-6 mt-4 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/8 px-6 py-3 overflow-x-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <button className={tabClass("content")} onClick={() => setTab("content")}>
          <FileText className="h-3.5 w-3.5" /> Content
        </button>
        <button className={tabClass("seo")} onClick={() => setTab("seo")}>
          <Globe className="h-3.5 w-3.5" /> SEO & Metadata
        </button>
        <button className={tabClass("author")} onClick={() => setTab("author")}>
          <User className="h-3.5 w-3.5" /> Author
        </button>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* ── CONTENT TAB ── */}
        {tab === "content" && (
          <div className="mx-auto max-w-4xl space-y-6">
            {/* Title */}
            <div>
              <label className={labelClass}>Post Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Enter a compelling post title…"
                className={inputClass}
              />
            </div>

            {/* Slug */}
            <div>
              <label className={labelClass}>URL Slug *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-white/30 select-none">
                  /blogs/post?slug=
                </span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => {
                    setSlugManuallyEdited(true);
                    set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"));
                  }}
                  placeholder="auto-generated-from-title"
                  className={`${inputClass} pl-[160px] font-mono text-indigo-300`}
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className={labelClass}>Excerpt / Summary *</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => set("excerpt", e.target.value)}
                placeholder="A brief summary of the post shown on listing cards…"
                rows={3}
                className={textareaClass}
              />
              <p className="mt-1 text-right text-[11px] text-white/30">
                {form.excerpt.length}/200 chars recommended
              </p>
            </div>

            {/* Cover Image */}
            <CloudinaryUpload
              value={form.coverImageUrl}
              onChange={(url) => set("coverImageUrl", url)}
              label="Cover Image"
              hint="Uploads are stored in Cloudinary and auto-optimized. You can also switch to URL mode to paste an external link."
            />

            {/* Cover Image Alt Text */}
            <div>
              <label className={labelClass}>Cover Image Alt Text (for SEO & Accessibility)</label>
              <input
                type="text"
                value={form.coverImageAlt}
                onChange={(e) => set("coverImageAlt", e.target.value)}
                placeholder="Descriptive alt text for the cover image…"
                className={inputClass}
              />
            </div>

            {/* Publisher + Read Time + Featured in a row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Publisher */}
              <div>
                <label className={labelClass}>Publisher *</label>
                <select
                  value={form.publisher}
                  onChange={(e) => set("publisher", e.target.value as Publisher)}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="webbed-team">Webbed Team</option>
                  <option value="webbed-labs">Webbed Labs</option>
                  <option value="webbed-solutions">Webbed Solutions</option>
                  <option value="webbed-schools">Webbed Schools</option>
                </select>
              </div>

              {/* Read Time */}
              <div>
                <label className={labelClass}>
                  <Clock className="inline h-3 w-3 mr-1" />
                  Read Time (mins)
                </label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={form.readTimeMinutes}
                  onChange={(e) => set("readTimeMinutes", parseInt(e.target.value) || 1)}
                  className={inputClass}
                />
                <p className="mt-1 text-[11px] text-white/30">
                  Auto-calc: ~{calculateReadTime(form.content)} mins
                </p>
              </div>

              {/* Featured */}
              <div>
                <label className={labelClass}>
                  <Star className="inline h-3 w-3 mr-1" />
                  Featured Post
                </label>
                <button
                  type="button"
                  onClick={() => set("featured", !form.featured)}
                  className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                    form.featured
                      ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                      : "border-white/10 bg-white/[0.03] text-white/50 hover:text-white"
                  }`}
                >
                  <span>{form.featured ? "Featured ✦" : "Not featured"}</span>
                  <div
                    className={`h-5 w-9 rounded-full transition-colors ${
                      form.featured ? "bg-amber-500" : "bg-white/10"
                    } relative`}
                  >
                    <span
                      className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                        form.featured ? "translate-x-4" : "translate-x-0.5"
                      }`}
                    />
                  </div>
                </button>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className={labelClass}>
                <Tag className="inline h-3 w-3 mr-1" />
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => handleTagInputChange(e.target.value)}
                placeholder="AI, Web Development, Design, Startups…"
                className={inputClass}
              />
              {form.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {form.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-[11px] font-medium text-indigo-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Content */}
            <div>
              <label className={labelClass}>Content (HTML supported) *</label>
              <textarea
                value={form.content}
                onChange={(e) => set("content", e.target.value)}
                placeholder={`Write your blog content here...\n\nYou can use basic HTML tags:\n<h2>Heading</h2>\n<p>Paragraph text</p>\n<strong>Bold</strong>\n<em>Italic</em>\n<ul><li>List item</li></ul>\n<blockquote>Quote</blockquote>\n<code>inline code</code>\n<pre><code>code block</code></pre>`}
                rows={24}
                className={`${textareaClass} font-mono text-sm leading-relaxed`}
              />
              <p className="mt-1 text-right text-[11px] text-white/30">
                {form.content.trim().split(/\s+/).filter(Boolean).length} words ·{" "}
                ~{form.readTimeMinutes} min read
              </p>
            </div>
          </div>
        )}

        {/* ── SEO TAB ── */}
        {tab === "seo" && (
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="rounded-xl border border-indigo-500/15 bg-indigo-500/5 p-5 text-sm text-indigo-300/80">
              <strong className="text-indigo-300">Tip:</strong> All SEO fields
              auto-fill from your content fields if left blank. Only override if
              you need custom values.
            </div>

            <div>
              <label className={labelClass}>SEO Title Tag</label>
              <input
                type="text"
                value={form.metaTitle}
                onChange={(e) => set("metaTitle", e.target.value)}
                placeholder={form.title || "Defaults to post title…"}
                className={inputClass}
              />
              <p className="mt-1 text-[11px] text-white/30">
                {(form.metaTitle || form.title).length}/60 chars · recommended 50–60
              </p>
            </div>

            <div>
              <label className={labelClass}>Meta Description</label>
              <textarea
                value={form.metaDescription}
                onChange={(e) => set("metaDescription", e.target.value)}
                placeholder={form.excerpt || "Defaults to post excerpt…"}
                rows={3}
                className={textareaClass}
              />
              <p className="mt-1 text-[11px] text-white/30">
                {(form.metaDescription || form.excerpt).length}/160 chars · recommended 150–160
              </p>
            </div>

            <CloudinaryUpload
              value={form.ogImageUrl}
              onChange={(url) => set("ogImageUrl", url)}
              label="Open Graph / Social Image"
              hint="Recommended size: 1200×630px. Shown when the post is shared on Twitter, WhatsApp, LinkedIn, etc. Defaults to the cover image if left empty."
            />

            <div>
              <label className={labelClass}>Canonical URL</label>
              <input
                type="url"
                value={form.canonicalUrl}
                onChange={(e) => set("canonicalUrl", e.target.value)}
                placeholder={`https://webbed.in/blogs/post?slug=${form.slug || "your-slug"}`}
                className={inputClass}
              />
              <p className="mt-1.5 text-[11px] text-white/30">
                Leave blank to auto-generate from the slug.
              </p>
            </div>

            {/* Preview card */}
            {(form.title || form.metaTitle) && (
              <div>
                <label className={labelClass}>Google Search Preview</label>
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                  <p className="text-xs text-green-500 mb-1 font-mono">
                    webbed.in › blogs › post
                  </p>
                  <p className="text-base font-medium text-blue-400 hover:underline cursor-pointer">
                    {form.metaTitle || form.title || "Post Title"}
                  </p>
                  <p className="mt-1 text-sm text-white/60 leading-relaxed line-clamp-2">
                    {form.metaDescription || form.excerpt || "Post description will appear here…"}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── AUTHOR TAB ── */}
        {tab === "author" && (
          <div className="mx-auto max-w-2xl space-y-6">
            <div>
              <label className={labelClass}>Author Name *</label>
              <input
                type="text"
                value={form.authorName}
                onChange={(e) => set("authorName", e.target.value)}
                placeholder="e.g. The WEBBED Team, Krish J, …"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Publisher</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(Object.entries(PUBLISHER_META) as [Publisher, typeof PUBLISHER_META[Publisher]][]).map(
                  ([key, meta]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => set("publisher", key)}
                      className={`rounded-xl border p-4 text-left transition-all ${
                        form.publisher === key
                          ? `${meta.border} ${meta.bg} ${meta.color}`
                          : "border-white/8 bg-white/[0.02] text-white/50 hover:border-white/15 hover:text-white"
                      }`}
                    >
                      <div className="text-sm font-semibold">{meta.label}</div>
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
