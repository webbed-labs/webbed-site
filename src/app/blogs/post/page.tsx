"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  FlaskConical,
  Hexagon,
  Book,
  Clock,
  Calendar,
  Share2,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { getBlogBySlug, type Blog, PUBLISHER_META } from "@/lib/blogs";
import Navbar from "@/components/Navbar";
import CinematicFooter from "@/components/CinematicFooter";

function BlogPostContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    getBlogBySlug(slug).then((data) => {
      if (!data || data.status !== "published") {
        setNotFound(true);
      } else {
        setBlog(data);
        document.title = `${data.metaTitle || data.title} | WEBBED BLOG`;
      }
      setLoading(false);
    });
  }, [slug]);

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const formatDate = (d: Date | null | undefined) => {
    if (!d) return "";
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(d instanceof Date ? d : new Date(d));
  };

  const getPublisherIcon = (pub: Blog["publisher"]) => {
    if (pub === "webbed-team")
      return (
        <span className="text-indigo-400 font-serif font-bold text-sm">W</span>
      );
    if (pub === "webbed-labs")
      return <FlaskConical className="w-4 h-4 text-green-400" />;
    if (pub === "webbed-solutions")
      return <Hexagon className="w-4 h-4 text-purple-400" />;
    return <Book className="w-4 h-4 text-orange-400" />;
  };

  // Render content: supports HTML, falls back to splitting by paragraphs
  const renderContent = (content: string) => {
    const isHTML = /<[a-z][\s\S]*>/i.test(content);
    if (isHTML) {
      return (
        <div
          className="prose-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }
    // Plain text: convert double newlines to paragraphs
    return (
      <div className="prose-content">
        {content.split(/\n\n+/).map((para, i) => (
          <p key={i}>{para.split(/\n/).map((line, j) => (
            <React.Fragment key={j}>
              {line}{j < para.split(/\n/).length - 1 && <br />}
            </React.Fragment>
          ))}</p>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030305]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  if (notFound || !blog) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#030305] px-6 text-center">
        <AlertTriangle className="h-12 w-12 text-indigo-400/50 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Post Not Found</h1>
        <p className="text-white/50 text-sm mb-8 max-w-sm">
          This blog post doesn&apos;t exist, has been removed, or is not yet
          published.
        </p>
        <Link
          href="/blogs"
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>
      </div>
    );
  }

  const meta = PUBLISHER_META[blog.publisher];

  return (
    <div className="min-h-screen bg-[#030305] text-white pt-20">
      <Navbar />
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-60 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-indigo-900/10 blur-[150px]" />
      </div>

      {/* Sticky top bar */}
      <div className="sticky top-0 z-40 border-b border-white/5 bg-[#030305]/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/blogs"
            className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <Share2 className="h-3.5 w-3.5" />
            {copied ? "Link Copied!" : "Share"}
          </button>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-6 py-14">
        {/* Publisher & Meta Row */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold ${meta.color} ${meta.bg} ${meta.border}`}
          >
            {getPublisherIcon(blog.publisher)}
            {meta.label}
          </span>
          {blog.tags.map((tag) => (
            <Link
              key={tag}
              href={`/blogs?tag=${encodeURIComponent(tag)}`}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-white/50 hover:border-indigo-500/30 hover:text-indigo-300 transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6 tracking-tight">
          {blog.title}
        </h1>

        {/* Excerpt */}
        <p className="text-xl text-white/60 leading-relaxed mb-8">
          {blog.excerpt}
        </p>

        {/* Author row */}
        <div className="flex items-center justify-between border-t border-b border-white/8 py-5 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/40 to-purple-600/40 border border-white/10 flex items-center justify-center text-sm font-bold text-white">
              {(blog.authorName || "W").charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                {blog.authorName || "WEBBED"}
              </p>
              <p className="text-[11px] text-white/40">{meta.label}</p>
            </div>
          </div>
          <div className="flex items-center gap-5 text-xs text-white/40">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(blog.publishedAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {blog.readTimeMinutes} min read
            </span>
          </div>
        </div>

        {/* Cover Image */}
        {blog.coverImageUrl && (
          <div className="mb-12 overflow-hidden rounded-2xl border border-white/8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={blog.coverImageUrl}
              alt={blog.coverImageAlt || blog.title}
              className="w-full max-h-[480px] object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="article-body">
          {renderContent(blog.content)}
        </div>

        {/* Bottom share bar */}
        <div className="mt-16 pt-8 border-t border-white/8 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Enjoyed this post?</p>
            <p className="text-xs text-white/50 mt-0.5">Share it with someone who&apos;d find it useful.</p>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-5 py-2.5 text-sm font-semibold text-indigo-300 hover:bg-indigo-500/20 hover:text-white transition-colors"
          >
            <Share2 className="h-4 w-4" />
            {copied ? "Copied!" : "Share Link"}
          </button>
        </div>

        {/* Back to blog */}
        <div className="mt-8 text-center">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-indigo-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all posts
          </Link>
        </div>
      </article>

      <CinematicFooter />

      {/* Article body styles */}
      <style>{`
        .prose-content {
          color: rgba(255,255,255,0.75);
          font-size: 1.0625rem;
          line-height: 1.8;
        }
        .prose-content p { margin-bottom: 1.5rem; }
        .prose-content h2 { font-size: 1.5rem; font-weight: 700; color: #fff; margin: 2.5rem 0 1rem; }
        .prose-content h3 { font-size: 1.25rem; font-weight: 700; color: #fff; margin: 2rem 0 0.75rem; }
        .prose-content h4 { font-size: 1.1rem; font-weight: 600; color: rgba(255,255,255,0.9); margin: 1.5rem 0 0.5rem; }
        .prose-content strong { color: #fff; font-weight: 600; }
        .prose-content em { font-style: italic; }
        .prose-content a { color: #818cf8; text-decoration: underline; }
        .prose-content a:hover { color: #a5b4fc; }
        .prose-content ul, .prose-content ol { padding-left: 1.5rem; margin-bottom: 1.5rem; }
        .prose-content li { margin-bottom: 0.5rem; }
        .prose-content ul > li { list-style: disc; }
        .prose-content ol > li { list-style: decimal; }
        .prose-content blockquote {
          border-left: 3px solid rgba(99,102,241,0.6);
          padding: 0.75rem 1.25rem;
          margin: 1.5rem 0;
          background: rgba(99,102,241,0.05);
          border-radius: 0 0.75rem 0.75rem 0;
          color: rgba(255,255,255,0.6);
          font-style: italic;
        }
        .prose-content code {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 4px;
          padding: 0.15em 0.4em;
          font-size: 0.875em;
          font-family: ui-monospace, monospace;
          color: #a5b4fc;
        }
        .prose-content pre {
          background: rgba(0,0,0,0.4);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 0.75rem;
          padding: 1.25rem 1.5rem;
          overflow-x: auto;
          margin-bottom: 1.5rem;
        }
        .prose-content pre code {
          background: none;
          border: none;
          padding: 0;
          color: rgba(255,255,255,0.8);
        }
        .prose-content hr {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.08);
          margin: 2.5rem 0;
        }
        .prose-content img {
          border-radius: 0.75rem;
          margin: 1.5rem 0;
          max-width: 100%;
        }
      `}</style>
    </div>
  );
}

export default function BlogPostPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#030305]">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
        </div>
      }
    >
      <BlogPostContent />
    </Suspense>
  );
}
