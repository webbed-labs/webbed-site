"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Bookmark,
  FlaskConical,
  Hexagon,
  Book,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Star,
  Loader2,
  X,
} from "lucide-react";
import {
  type Blog,
  type Publisher,
  getPublishedBlogs,
  PUBLISHER_META,
} from "@/lib/blogs";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import CinematicFooter from "@/components/CinematicFooter";

const POSTS_PER_PAGE = 6;
const ALL_TOPICS = [
  "All",
  "AI",
  "Web Development",
  "Design",
  "Productivity",
  "Startups",
  "Tech Insights",
  "Programming",
];

type SortBy = "latest" | "oldest";

export default function BlogsPageClient() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [publisher, setPublisher] = useState<Publisher | "all">("all");
  const [activeTopic, setActiveTopic] = useState("All");
  const [sortBy, setSortBy] = useState<SortBy>("latest");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [page, setPage] = useState(1);
  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  // Blog content only needs one read on page load; avoiding a persistent
  // listener also prevents WebChannel Listen transport retries.
  useEffect(() => {
    let active = true;
    getPublishedBlogs()
      .then((data) => {
        if (active) setBlogs(data);
      })
      .catch(() => {
        if (active) setBlogs([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, publisher, activeTopic, sortBy]);

  // Derived: filtered + sorted
  const filtered = useMemo(() => {
    let result = [...blogs];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.excerpt.toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q)) ||
          PUBLISHER_META[b.publisher].label.toLowerCase().includes(q)
      );
    }

    // Publisher filter
    if (publisher !== "all") {
      result = result.filter((b) => b.publisher === publisher);
    }

    // Topic filter
    if (activeTopic !== "All") {
      result = result.filter((b) =>
        b.tags.some((t) => t.toLowerCase() === activeTopic.toLowerCase())
      );
    }

    // Sort
    result.sort((a, b) => {
      const da = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const db_ = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return sortBy === "latest" ? db_ - da : da - db_;
    });

    return result;
  }, [blogs, searchQuery, publisher, activeTopic, sortBy]);

  // Featured (first blog with featured=true, or first blog)
  const featuredBlog = useMemo(
    () => filtered.find((b) => b.featured) ?? filtered[0] ?? null,
    [filtered]
  );

  // Grid posts (all except featured, paginated)
  const gridBlogs = useMemo(() => {
    const without = featuredBlog
      ? filtered.filter((b) => b.id !== featuredBlog.id)
      : filtered;
    const start = (page - 1) * POSTS_PER_PAGE;
    return without.slice(start, start + POSTS_PER_PAGE);
  }, [filtered, featuredBlog, page]);

  const totalPages = useMemo(() => {
    const count = featuredBlog ? filtered.length - 1 : filtered.length;
    return Math.max(1, Math.ceil(count / POSTS_PER_PAGE));
  }, [filtered, featuredBlog]);

  // Trending: top 4 by read time (as proxy for popularity when no view count)
  const trending = useMemo(
    () =>
      [...blogs]
        .sort((a, b) => b.readTimeMinutes - a.readTimeMinutes)
        .slice(0, 4),
    [blogs]
  );

  const handleSubscribe = useCallback(async () => {
    if (!subscriberEmail || subscribing) return;
    setSubscribing(true);
    try {
      await addDoc(collection(db, "blog_subscribers"), {
        email: subscriberEmail,
        timestamp: serverTimestamp(),
      });
      setSubscribed(true);
      setSubscriberEmail("");
    } catch {
      // Email validation handled by Firestore rules
    }
    setSubscribing(false);
  }, [subscriberEmail, subscribing]);

  const formatDate = (d: Date | null | undefined) => {
    if (!d) return "";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d instanceof Date ? d : new Date(d));
  };

  const getPublisherIcon = (pub: Publisher) => {
    if (pub === "webbed-team")
      return (
        <span className="text-indigo-400 font-serif font-bold text-[11px]">W</span>
      );
    if (pub === "webbed-labs")
      return <FlaskConical className="w-3.5 h-3.5 text-green-400" />;
    if (pub === "webbed-solutions")
      return <Hexagon className="w-3.5 h-3.5 text-purple-400" />;
    return <Book className="w-3.5 h-3.5 text-orange-400" />;
  };

  const getCardAccent = (pub: Publisher) => {
    if (pub === "webbed-team") return "hover:border-indigo-500/40";
    if (pub === "webbed-labs") return "hover:border-green-500/40";
    if (pub === "webbed-solutions") return "hover:border-purple-500/40";
    return "hover:border-orange-500/40";
  };

  const getThumbnailGradient = (pub: Publisher) => {
    if (pub === "webbed-team")
      return "from-indigo-900/50 via-indigo-800/30 to-black/80";
    if (pub === "webbed-labs")
      return "from-green-900/50 via-emerald-800/30 to-black/80";
    if (pub === "webbed-solutions")
      return "from-purple-900/50 via-violet-800/30 to-black/80";
    return "from-orange-900/50 via-amber-800/30 to-black/80";
  };

  const paginationPages = useMemo(() => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, 2, 3);
      if (page > 4) pages.push("...");
      if (page > 3 && page < totalPages - 2) pages.push(page);
      if (page < totalPages - 3) pages.push("...");
      pages.push(totalPages - 1, totalPages);
    }
    return [...new Set(pages)];
  }, [totalPages, page]);

  return (
    <div className="min-h-screen bg-[#030305] text-white selection:bg-indigo-500/30">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-[410px] overflow-hidden border-b border-white/10 bg-[#030305]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-full bg-[url('/blogs-hero-vortex.png')] bg-cover bg-[center_52%] opacity-45 [mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,.12)_20%,black_48%,black_94%,transparent_100%)] sm:opacity-60 lg:w-[78%] lg:opacity-100"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#030305_0%,rgba(3,3,5,.98)_25%,rgba(3,3,5,.56)_43%,transparent_68%)]"
        />

        <div className="relative z-10 mx-auto flex min-h-[410px] max-w-[1484px] flex-col gap-9 px-4 pb-14 pt-28 sm:px-8 lg:flex-row lg:items-start lg:justify-between lg:gap-6 lg:px-10 lg:pb-12 lg:pt-[96px] xl:px-12">
          <div className="max-w-[520px] lg:w-[45%] lg:pl-4 xl:pl-8">
            <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.04em] text-[#8b5cf6]">
              WEBBED BLOG
            </span>
            <h1 className="mb-3 text-[36px] font-bold leading-[1.05] tracking-[-0.025em] text-white sm:text-[44px] lg:text-[48px] xl:text-[52px]">
              Ideas that build <br />
              the{" "}
              <span className="bg-gradient-to-r from-[#9b5cff] to-[#ef8dde] bg-clip-text text-transparent">
                future.
              </span>
            </h1>
            <p className="max-w-md text-[14px] leading-[1.55] text-white/60">
              Insights, stories, and tutorials from across WEBBED. <br />
              Real ideas. Real people. Real impact.
            </p>
          </div>

          {/* Publisher cards in horizontal row */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 self-center sm:flex-nowrap sm:gap-3.5 lg:w-[50%] lg:self-start lg:justify-center xl:w-[48%]">
            {(
              [
                { key: "webbed-team", label: "Webbed Team", icon: <span className="text-white font-serif font-bold text-xl">W</span>, border: "border-white/20", surface: "rgba(5,9,17,.92)", glow: "rgba(255,255,255,0.08)" },
                { key: "webbed-labs", label: "Webbed Labs", icon: <FlaskConical className="w-5 h-5 text-green-400" />, border: "border-green-500/40", surface: "rgba(3,24,16,.92)", glow: "rgba(34,197,94,0.16)" },
                { key: "webbed-solutions", label: "Webbed\nSolutions", icon: <Hexagon className="w-5 h-5 text-purple-400" />, border: "border-purple-500/40", surface: "rgba(17,8,31,.92)", glow: "rgba(168,85,247,0.16)" },
                { key: "webbed-schools", label: "Webbed\nSchools", icon: <Book className="w-5 h-5 text-orange-400" />, border: "border-orange-500/40", surface: "rgba(31,13,5,.92)", glow: "rgba(249,115,22,0.16)" },
              ] as const
            ).map((card) => (
              <button
                key={card.key}
                onClick={() =>
                  setPublisher(publisher === card.key ? "all" : (card.key as Publisher))
                }
                className={`isolate flex h-[116px] w-[96px] cursor-pointer flex-col items-center justify-center gap-2.5 rounded-[11px] border transition-all hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${card.border} ${publisher === card.key ? "ring-2 ring-indigo-500/80" : ""}`}
                style={{ boxShadow: `0 0 20px ${card.glow}`, backgroundColor: card.surface }}
              >
                <div className="flex h-8 w-8 items-center justify-center">
                  {card.icon}
                </div>
                <span className="whitespace-pre-line text-center text-[10px] font-medium leading-[1.35] text-white/80">
                  {card.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── FILTER BAR ── */}
      <section className="border-b border-white/5 sticky top-0 bg-[#030305]/80 backdrop-blur-xl z-40">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Publisher pills */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] text-white/40 font-semibold uppercase tracking-wider">
              Browse by Publisher
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <FilterPill
                active={publisher === "all"}
                onClick={() => setPublisher("all")}
              >
                All Publishers
              </FilterPill>
              <FilterPill
                active={publisher === "webbed-team"}
                onClick={() => setPublisher(publisher === "webbed-team" ? "all" : "webbed-team")}
              >
                <span className="text-indigo-400 font-serif font-bold text-sm">W</span>{" "}
                Webbed Team
              </FilterPill>
              <FilterPill
                active={publisher === "webbed-labs"}
                onClick={() => setPublisher(publisher === "webbed-labs" ? "all" : "webbed-labs")}
              >
                <FlaskConical className="w-3.5 h-3.5 text-green-400" /> Webbed Labs
              </FilterPill>
              <FilterPill
                active={publisher === "webbed-solutions"}
                onClick={() => setPublisher(publisher === "webbed-solutions" ? "all" : "webbed-solutions")}
              >
                <Hexagon className="w-3.5 h-3.5 text-purple-400" /> Webbed Solutions
              </FilterPill>
              <FilterPill
                active={publisher === "webbed-schools"}
                onClick={() => setPublisher(publisher === "webbed-schools" ? "all" : "webbed-schools")}
              >
                <Book className="w-3.5 h-3.5 text-orange-400" /> Webbed Schools
              </FilterPill>
            </div>
          </div>

          {/* Search + Sort */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            {/* Search */}
            <div className="relative w-full lg:w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, topics, or keywords..."
                className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-2.5 pl-10 pr-8 text-sm text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filters dropdown */}
            <div className="relative">
              <button
                onClick={() => { setShowFilterMenu((v) => !v); setShowSortMenu(false); }}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm transition-colors shrink-0 ${showFilterMenu ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-300" : "border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.05]"}`}
              >
                <Filter className="w-4 h-4" /> Filters{" "}
                {activeTopic !== "All" && (
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                )}
                <ChevronDown className="w-3 h-3" />
              </button>
              {showFilterMenu && (
                <div className="absolute right-0 top-11 z-50 w-[220px] rounded-xl border border-white/12 bg-[#0e0e18] shadow-2xl p-3">
                  <p className="text-[10px] text-white/40 font-semibold uppercase tracking-wider mb-2 px-2">
                    Filter by topic
                  </p>
                  {ALL_TOPICS.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => {
                        setActiveTopic(topic);
                        setShowFilterMenu(false);
                      }}
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        activeTopic === topic
                          ? "bg-indigo-500/15 text-indigo-300"
                          : "text-white/60 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => { setShowSortMenu((v) => !v); setShowFilterMenu(false); }}
                className="hidden lg:flex items-center gap-2 text-sm shrink-0"
              >
                <span className="text-white/40">Sort by:</span>
                <span className="text-white font-medium hover:text-indigo-300 transition-colors flex items-center gap-1">
                  {sortBy === "latest" ? "Latest" : "Oldest"}
                  <ChevronDown className="w-3.5 h-3.5" />
                </span>
              </button>
              {showSortMenu && (
                <div className="absolute right-0 top-8 z-50 w-[130px] rounded-xl border border-white/12 bg-[#0e0e18] shadow-2xl p-1">
                  {(["latest", "oldest"] as SortBy[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => { setSortBy(s); setShowSortMenu(false); }}
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm capitalize transition-colors ${sortBy === s ? "bg-indigo-500/15 text-indigo-300" : "text-white/60 hover:bg-white/5 hover:text-white"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Active filters row */}
        {(searchQuery || publisher !== "all" || activeTopic !== "All") && (
          <div className="max-w-[1400px] mx-auto px-6 pb-3 flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-white/40">Active filters:</span>
            {searchQuery && (
              <ActiveFilterChip label={`"${searchQuery}"`} onRemove={() => setSearchQuery("")} />
            )}
            {publisher !== "all" && (
              <ActiveFilterChip label={PUBLISHER_META[publisher].label} onRemove={() => setPublisher("all")} />
            )}
            {activeTopic !== "All" && (
              <ActiveFilterChip label={activeTopic} onRemove={() => setActiveTopic("All")} />
            )}
            <button
              onClick={() => { setSearchQuery(""); setPublisher("all"); setActiveTopic("All"); }}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 ml-1"
            >
              Clear all
            </button>
            <span className="ml-auto text-[11px] text-white/40">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </section>

      {/* Click-away for dropdowns */}
      {(showSortMenu || showFilterMenu) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => { setShowSortMenu(false); setShowFilterMenu(false); }}
        />
      )}

      {/* ── MAIN CONTENT ── */}
      <section className="max-w-[1400px] mx-auto px-6 pt-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-400 mb-4" />
            <p className="text-white/50 text-sm">Loading posts…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">No posts found</h3>
            <p className="text-white/50 text-sm mb-6 max-w-sm">
              We couldn&apos;t find any published blog posts matching your filters.{" "}
              {blogs.length === 0 ? "Check back soon — content is coming!" : "Try adjusting your search or filters."}
            </p>
            {(searchQuery || publisher !== "all" || activeTopic !== "All") && (
              <button
                onClick={() => { setSearchQuery(""); setPublisher("all"); setActiveTopic("All"); }}
                className="rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-white hover:bg-white/5 transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col xl:flex-row gap-6">
            {/* ── Left Posts Area ── */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Featured Post */}
                {featuredBlog && page === 1 && (
                  <Link
                    href={`/blogs/post?slug=${featuredBlog.slug}`}
                    className="group relative bg-[#0a0a0f] rounded-2xl border border-white/5 overflow-hidden flex flex-col md:col-span-2 lg:col-span-1 lg:row-span-2 shadow-xl hover:border-indigo-500/40 transition-colors"
                  >
                    {/* Image */}
                    <div className="relative w-full h-[280px] lg:h-[380px] overflow-hidden bg-indigo-950/30">
                      {featuredBlog.coverImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={featuredBlog.coverImageUrl}
                          alt={featuredBlog.coverImageAlt || featuredBlog.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className={`absolute inset-0 bg-gradient-to-br ${getThumbnailGradient(featuredBlog.publisher)}`}>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-[100px] h-[160px] border-2 border-indigo-400 shadow-[0_0_50px_rgba(129,140,248,0.5)] relative opacity-60">
                              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-10 bg-black rounded-t-full" />
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-indigo-600 text-white text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-widest shadow-lg">
                          Featured
                        </span>
                        {featuredBlog.tags[0] && (
                          <span className="bg-black/60 text-white/70 text-[10px] font-semibold px-3 py-1.5 rounded uppercase tracking-wider backdrop-blur-sm">
                            {featuredBlog.tags[0]}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-6 lg:p-8 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-4">
                        {getPublisherIcon(featuredBlog.publisher)}
                        <span className="text-xs text-white/60 font-medium">
                          {PUBLISHER_META[featuredBlog.publisher].label}
                        </span>
                      </div>
                      <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3 leading-snug group-hover:text-indigo-300 transition-colors">
                        {featuredBlog.title}
                      </h2>
                      <p className="text-white/50 text-sm leading-relaxed mb-8 flex-1 line-clamp-3">
                        {featuredBlog.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-5 border-t border-white/5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-zinc-700 border-2 border-[#0a0a0f]" />
                          <div>
                            <p className="text-xs text-white/70 font-medium">{featuredBlog.authorName || "WEBBED"}</p>
                            <p className="text-[10px] text-white/40">
                              {formatDate(featuredBlog.publishedAt)} · {featuredBlog.readTimeMinutes} min read
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                )}

                {/* Grid Posts */}
                {gridBlogs.map((blog) => (
                  <BlogCard
                    key={blog.id}
                    blog={blog}
                    getPublisherIcon={getPublisherIcon}
                    getCardAccent={getCardAccent}
                    getThumbnailGradient={getThumbnailGradient}
                    formatDate={formatDate}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1.5 mt-14 border-t border-white/5 pt-8">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-10 h-10 rounded-lg hover:bg-white/5 text-white/50 flex items-center justify-center transition-colors disabled:opacity-30"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {paginationPages.map((p, i) =>
                    p === "..." ? (
                      <span key={`ellipsis-${i}`} className="px-2 text-white/40">
                        ...
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p as number)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                          page === p
                            ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                            : "hover:bg-white/5 text-white/60"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="h-10 px-4 rounded-lg hover:bg-white/5 text-white/80 flex items-center gap-1 text-sm transition-colors disabled:opacity-30"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* ── Sidebar ── */}
            <div className="w-full xl:w-[300px] flex flex-col gap-5 shrink-0">
              {/* Newsletter */}
              <div className="bg-[#0a0a0f] rounded-2xl border border-white/5 p-6 shadow-xl">
                <h3 className="text-base font-bold text-white mb-2">
                  Subscribe to our newsletter
                </h3>
                <p className="text-xs text-white/50 mb-5 leading-relaxed">
                  Get the latest articles and updates from WEBBED, straight to your inbox.
                </p>
                {subscribed ? (
                  <div className="rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400 text-center">
                    ✓ You&apos;re subscribed!
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <input
                      type="email"
                      value={subscriberEmail}
                      onChange={(e) => setSubscriberEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50"
                    />
                    <button
                      onClick={handleSubscribe}
                      disabled={subscribing || !subscriberEmail}
                      className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors shadow-[0_0_20px_rgba(79,70,229,0.3)] disabled:opacity-50"
                    >
                      {subscribing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Subscribe"
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Popular Topics */}
              <div className="bg-[#0a0a0f] rounded-2xl border border-white/5 p-6">
                <h3 className="text-sm font-bold text-white mb-4">Popular Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {ALL_TOPICS.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => setActiveTopic(topic)}
                      className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors ${
                        activeTopic === topic
                          ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
                          : "bg-white/[0.02] border border-white/5 text-white/50 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trending Now */}
              {trending.length > 0 && (
                <div className="bg-[#0a0a0f] rounded-2xl border border-white/5 p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <Star className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold text-white">Trending Now</h3>
                  </div>
                  <div className="flex flex-col gap-4">
                    {trending.map((post) => (
                      <Link
                        href={`/blogs/post?slug=${post.slug}`}
                        key={post.id}
                        className="flex gap-3 group"
                      >
                        <div className={`w-12 h-12 rounded-lg shrink-0 overflow-hidden relative bg-gradient-to-br ${getThumbnailGradient(post.publisher)}`}>
                          {post.coverImageUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={post.coverImageUrl}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex flex-col justify-center">
                          <h4 className="text-xs font-bold text-white/80 group-hover:text-indigo-300 transition-colors leading-snug line-clamp-2">
                            {post.title}
                          </h4>
                          <span className="text-[10px] text-white/40 mt-1">
                            {post.readTimeMinutes} min read
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      <CinematicFooter />
    </div>
  );
}

// ─── Blog Card ────────────────────────────────────────────────────────────────

function BlogCard({
  blog,
  getPublisherIcon,
  getCardAccent,
  getThumbnailGradient,
  formatDate,
}: {
  blog: Blog;
  getPublisherIcon: (p: Publisher) => React.ReactNode;
  getCardAccent: (p: Publisher) => string;
  getThumbnailGradient: (p: Publisher) => string;
  formatDate: (d: Date | null | undefined) => string;
}) {
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <Link
      href={`/blogs/post?slug=${blog.slug}`}
      className={`group bg-[#0a0a0f] rounded-2xl border border-white/5 overflow-hidden flex flex-col transition-all duration-200 ${getCardAccent(blog.publisher)} hover:shadow-lg`}
    >
      {/* Thumbnail */}
      <div
        className={`w-full h-[180px] relative overflow-hidden bg-gradient-to-br ${getThumbnailGradient(blog.publisher)}`}
      >
        {blog.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={blog.coverImageUrl}
            alt={blog.coverImageAlt || blog.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 opacity-40 flex items-center justify-center">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              {getPublisherIcon(blog.publisher)}
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
        {blog.featured && (
          <div className="absolute top-3 left-3">
            <span className="bg-amber-500/90 text-black text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wider">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          {getPublisherIcon(blog.publisher)}
          <span className="text-[11px] text-white/60 font-medium">
            {PUBLISHER_META[blog.publisher].label}
          </span>
        </div>
        <h3 className="text-base font-bold text-white mb-2 leading-snug group-hover:text-indigo-300 transition-colors line-clamp-2">
          {blog.title}
        </h3>
        <p className="text-white/50 text-xs leading-relaxed mb-5 flex-1 line-clamp-3">
          {blog.excerpt}
        </p>

        {/* Tags */}
        {blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {blog.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded bg-white/[0.04] px-2 py-0.5 text-[10px] text-white/40"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto">
          <span className="text-[11px] text-white/40">
            {formatDate(blog.publishedAt)} · {blog.readTimeMinutes} min read
          </span>
          <button
            onClick={(e) => {
              e.preventDefault();
              setBookmarked((v) => !v);
            }}
            className={`transition-colors ${bookmarked ? "text-indigo-400" : "text-white/30 hover:text-white"}`}
            title="Bookmark"
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-indigo-400" : ""}`} />
          </button>
        </div>
      </div>
    </Link>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function FilterPill({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium tracking-wide transition-all ${
        active
          ? "bg-indigo-500/10 border border-indigo-500/50 text-indigo-400"
          : "bg-white/[0.02] border border-white/5 text-white/70 hover:bg-white/[0.05] hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function ActiveFilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-[11px] text-indigo-300">
      {label}
      <button onClick={onRemove} className="hover:text-white">
        <X className="h-2.5 w-2.5" />
      </button>
    </span>
  );
}
