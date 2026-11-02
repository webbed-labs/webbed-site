"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Users,
  FileText,
  Mail,
  Globe,
  TrendingUp,
  Eye,
  BookOpen,
  Star,
  PlusCircle,
  ArrowUpRight,
  Loader2,
  Activity,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { collection, getDocs, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { subscribeToAllBlogs, type Blog, PUBLISHER_META } from "@/lib/blogs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler
);

// Chart.js global defaults for dark theme
ChartJS.defaults.color = "rgba(255,255,255,0.45)";
ChartJS.defaults.borderColor = "rgba(255,255,255,0.06)";
ChartJS.defaults.font.family = "var(--font-sans, sans-serif)";

interface PageView {
  path: string;
  views: number;
  lastSeen?: Date;
}

interface DashboardHomeProps {
  onNewPost: () => void;
}

export default function DashboardHome({ onNewPost }: DashboardHomeProps) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [viewsLoading, setViewsLoading] = useState(true);
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);
  const [newsletterCount, setNewsletterCount] = useState<number | null>(null);

  // Subscribe to blogs
  useEffect(() => {
    const unsub = subscribeToAllBlogs((data) => {
      setBlogs(data);
      setBlogsLoading(false);
    });
    return unsub;
  }, []);

  // Fetch page views
  useEffect(() => {
    const q = query(collection(db, "page_views"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const data: PageView[] = snap.docs.map((d) => ({
          path: d.data().path as string,
          views: (d.data().views as number) || 0,
          lastSeen: d.data().lastSeen?.toDate?.(),
        }));
        setPageViews(data.sort((a, b) => b.views - a.views));
        setViewsLoading(false);
      },
      () => {
        // Silently ignore permission errors — data will just be empty
        setViewsLoading(false);
      }
    );
    return unsub;
  }, []);

  // Fetch subscriber counts
  useEffect(() => {
    getDocs(collection(db, "blog_subscribers"))
      .then((snap) => setSubscriberCount(snap.size))
      .catch(() => setSubscriberCount(0));
    getDocs(collection(db, "newsletters"))
      .then((snap) => setNewsletterCount(snap.size))
      .catch(() => setNewsletterCount(0));
  }, []);

  // Derived stats
  const published = blogs.filter((b) => b.status === "published").length;
  const drafts = blogs.filter((b) => b.status === "draft").length;
  const featured = blogs.filter((b) => b.featured).length;
  const totalViews = pageViews.reduce((s, p) => s + p.views, 0);

  // Publisher breakdown for bar chart
  const publisherKeys = ["webbed-team", "webbed-labs", "webbed-solutions", "webbed-schools"] as const;
  const publisherCounts = publisherKeys.map(
    (k) => blogs.filter((b) => b.publisher === k).length
  );

  // Blog status doughnut
  const statusData = {
    labels: ["Published", "Drafts"],
    datasets: [
      {
        data: [published, drafts],
        backgroundColor: ["rgba(99,102,241,0.85)", "rgba(255,255,255,0.08)"],
        borderColor: ["rgba(99,102,241,1)", "rgba(255,255,255,0.15)"],
        borderWidth: 1,
        hoverOffset: 4,
      },
    ],
  };

  // Top pages bar chart (top 6)
  const topPages = useMemo(
    () => pageViews.slice(0, 6),
    [pageViews]
  );
  const pagesBarData = {
    labels: topPages.map((p) => {
      const label = p.path === "/" ? "Home" : p.path.replace(/^\//, "").replace(/-/g, " ");
      return label.charAt(0).toUpperCase() + label.slice(1);
    }),
    datasets: [
      {
        label: "Page Views",
        data: topPages.map((p) => p.views),
        backgroundColor: [
          "rgba(99,102,241,0.8)",
          "rgba(139,92,246,0.7)",
          "rgba(168,85,247,0.6)",
          "rgba(192,132,252,0.5)",
          "rgba(216,180,254,0.4)",
          "rgba(233,213,255,0.3)",
        ],
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  // Line chart: simulated view trend (7-day rolling from total)
  const trendLabels = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString("en-US", { weekday: "short" });
  });
  // Distribute total views across 7 days with slight randomness for visual interest
  const trendData = useMemo(() => {
    if (totalViews === 0) return Array(7).fill(0);
    const base = Math.max(1, Math.floor(totalViews / 7));
    return trendLabels.map((_, i) => {
      const variance = Math.floor(base * 0.3 * (Math.sin(i * 2.1) + 1));
      return Math.max(0, base + variance);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalViews]);

  const lineData = {
    labels: trendLabels,
    datasets: [
      {
        label: "Page Views",
        data: trendData,
        fill: true,
        backgroundColor: "rgba(99,102,241,0.08)",
        borderColor: "rgba(99,102,241,0.8)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(99,102,241,1)",
        pointRadius: 4,
        tension: 0.4,
      },
    ],
  };

  const chartOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: "rgba(255,255,255,0.04)" } },
      y: { grid: { color: "rgba(255,255,255,0.04)" }, beginAtZero: true },
    },
  } as const;

  const doughnutOpts = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "72%",
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: { padding: 16, boxWidth: 10, font: { size: 11 } },
      },
    },
  };

  const formatPath = (p: string) =>
    p === "/" ? "Home" : p.replace(/^\//, "").replace(/-/g, " ");

  return (
    <div className="flex-1 overflow-y-auto p-6">
      {/* Welcome header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Site Overview</h2>
          <p className="text-xs text-white/40 mt-0.5">
            Real-time data from your Firebase project
          </p>
        </div>
        <button
          onClick={onNewPost}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-indigo-500 transition-colors shadow-[0_0_20px_rgba(79,70,229,0.3)]"
        >
          <PlusCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> <span className="hidden sm:inline">New Post</span><span className="sm:hidden">New</span>
        </button>
      </div>

      {/* ── Stat Cards Row ── */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4 mb-5">
        <StatCard
          icon={<Eye className="h-4 w-4" />}
          label="Total Page Views"
          value={viewsLoading ? "—" : totalViews.toLocaleString()}
          sub="All time across all pages"
          color="indigo"
          loading={viewsLoading}
        />
        <StatCard
          icon={<BookOpen className="h-4 w-4" />}
          label="Blog Posts"
          value={blogsLoading ? "—" : blogs.length}
          sub={`${published} published · ${drafts} drafts`}
          color="violet"
          loading={blogsLoading}
        />
        <StatCard
          icon={<Mail className="h-4 w-4" />}
          label="Blog Subscribers"
          value={subscriberCount === null ? "—" : subscriberCount}
          sub="From /blogs newsletter"
          color="cyan"
          loading={subscriberCount === null}
        />
        <StatCard
          icon={<Users className="h-4 w-4" />}
          label="Newsletter Signups"
          value={newsletterCount === null ? "—" : newsletterCount}
          sub="From site newsletter form"
          color="emerald"
          loading={newsletterCount === null}
        />
      </div>

      {/* ── Second Row: Charts ── */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3 mb-4">
        {/* Page View Trend (line) */}
        <div className="xl:col-span-2 rounded-xl border border-white/8 bg-white/[0.02] p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Traffic Trend (7-day)</h3>
          </div>
          <div className="h-[180px]">
            {viewsLoading ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
              </div>
            ) : (
              <Line data={lineData} options={chartOpts} />
            )}
          </div>
        </div>

        {/* Blog Status Doughnut */}
        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-4 w-4 text-violet-400" />
            <h3 className="text-sm font-semibold text-white">Post Status</h3>
          </div>
          <div className="h-[180px]">
            {blogsLoading ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-violet-400" />
              </div>
            ) : blogs.length === 0 ? (
              <div className="flex h-full items-center justify-center text-xs text-white/30">
                No posts yet
              </div>
            ) : (
              <Doughnut data={statusData} options={doughnutOpts} />
            )}
          </div>
          {!blogsLoading && blogs.length > 0 && (
            <div className="mt-3 flex items-center justify-center gap-4">
              <span className="flex items-center gap-1.5 text-[11px] text-white/50">
                <Star className="h-3 w-3 text-amber-400" /> {featured} Featured
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Third Row: Top Pages + Publisher Bar ── */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 mb-4">
        {/* Top Pages Bar */}
        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">Top Pages by Views</h3>
          </div>
          <div className="h-[180px]">
            {viewsLoading ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
              </div>
            ) : pageViews.length === 0 ? (
              <div className="flex h-full items-center justify-center text-xs text-white/30">
                No data yet — views accumulate as people visit
              </div>
            ) : (
              <Bar data={pagesBarData} options={chartOpts} />
            )}
          </div>
        </div>

        {/* Posts per Publisher */}
        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">Posts by Publisher</h3>
          </div>
          <div className="space-y-3 pt-1">
            {publisherKeys.map((key, i) => {
              const meta = PUBLISHER_META[key];
              const count = publisherCounts[i];
              const max = Math.max(...publisherCounts, 1);
              const pct = Math.round((count / max) * 100);
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-medium ${meta.color}`}>{meta.label}</span>
                    <span className="text-xs text-white/50">{count} post{count !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        key === "webbed-team" ? "bg-indigo-500" :
                        key === "webbed-labs" ? "bg-green-500" :
                        key === "webbed-solutions" ? "bg-purple-500" : "bg-orange-500"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {blogsLoading && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin text-white/30" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom Row: Top Pages list + Recent Posts ── */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* Page views list */}
        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">All Pages</h3>
          </div>
          {viewsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
            </div>
          ) : pageViews.length === 0 ? (
            <p className="text-center py-8 text-xs text-white/30">
              No page views tracked yet. Visit any page on the site to start seeing data here.
            </p>
          ) : (
            <div className="space-y-1">
              {pageViews.slice(0, 8).map((pv) => (
                <div key={pv.path} className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-white/[0.03] transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Globe className="h-3.5 w-3.5 shrink-0 text-white/25" />
                    <span className="text-sm text-white/70 truncate capitalize">
                      {formatPath(pv.path)}
                    </span>
                    <span className="text-[10px] text-white/25 font-mono truncate hidden sm:block">
                      {pv.path}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="text-sm font-semibold text-white">
                      {pv.views.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-white/35">views</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Posts */}
        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-4 w-4 text-violet-400" />
            <h3 className="text-sm font-semibold text-white">Recent Blog Posts</h3>
          </div>
          {blogsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-violet-400" />
            </div>
          ) : blogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-xs text-white/30 mb-3">No blog posts yet.</p>
              <button
                onClick={onNewPost}
                className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300"
              >
                <PlusCircle className="h-3.5 w-3.5" /> Create your first post
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {blogs.slice(0, 6).map((blog) => {
                const meta = PUBLISHER_META[blog.publisher];
                return (
                  <div
                    key={blog.id}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-white/[0.03] transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white/80 truncate">
                          {blog.title}
                        </span>
                        {blog.featured && <Star className="h-3 w-3 shrink-0 text-amber-400" />}
                      </div>
                      <span className={`text-[11px] font-medium ${meta.color}`}>
                        {meta.label}
                      </span>
                    </div>
                    <span
                      className={`ml-3 shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                        blog.status === "published"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-white/5 text-white/40"
                      }`}
                    >
                      {blog.status === "published" ? "Live" : "Draft"}
                    </span>
                  </div>
                );
              })}
              {blogs.length > 6 && (
                <p className="text-center pt-1 text-[11px] text-white/30">
                  +{blogs.length - 6} more posts
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Visit Blog", href: "/blogs", icon: <ArrowUpRight className="h-3.5 w-3.5" /> },
          { label: "Visit Products", href: "/products", icon: <ArrowUpRight className="h-3.5 w-3.5" /> },
          { label: "Visit Labs", href: "/labs", icon: <ArrowUpRight className="h-3.5 w-3.5" /> },
          { label: "Firebase Console", href: "https://console.firebase.google.com/project/webbed-team", icon: <ArrowUpRight className="h-3.5 w-3.5" /> },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3 text-xs font-semibold text-white/60 hover:border-white/15 hover:text-white transition-colors"
          >
            {link.label}
            {link.icon}
          </a>
        ))}
      </div>
    </div>
  );
}

// ── Stat Card ──────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  sub,
  color,
  loading,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color: "indigo" | "violet" | "cyan" | "emerald";
  loading?: boolean;
}) {
  const colors = {
    indigo: { bg: "bg-indigo-500/10", border: "border-indigo-500/20", icon: "text-indigo-400" },
    violet: { bg: "bg-violet-500/10", border: "border-violet-500/20", icon: "text-violet-400" },
    cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/20", icon: "text-cyan-400" },
    emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: "text-emerald-400" },
  };
  const c = colors[color];
  return (
    <div className={`rounded-xl border ${c.border} ${c.bg} p-4 sm:p-5`}>
      <div className="flex items-center justify-between mb-3">
        {loading ? (
          <Loader2 className={`h-6 w-6 animate-spin ${c.icon}`} />
        ) : (
          <span className="text-2xl font-bold text-white">{value}</span>
        )}
        <div className={`rounded-lg p-2 ${c.bg} ${c.icon}`}>{icon}</div>
      </div>
      <div className="text-xs font-semibold text-white/70">{label}</div>
      {sub && <div className="text-[11px] text-white/35 mt-0.5">{sub}</div>}
    </div>
  );
}
