"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  LogOut,
  Pencil,
  Trash2,
  Globe,
  EyeOff,
  Search,
  Star,
  Loader2,
  MoreVertical,
  AlertTriangle,
  ChevronDown,
  Menu,
  X,
  Users,
} from "lucide-react";
import {
  type Blog,
  type Publisher,
  subscribeToAllBlogs,
  updateBlog,
  deleteBlog,
  PUBLISHER_META,
} from "@/lib/blogs";
import BlogEditor from "./BlogEditor";
import DashboardHome from "./DashboardHome";
import SubscribersView from "./SubscribersView";

type View = "dashboard" | "posts" | "editor" | "subscribers";

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [view, setView] = useState<View>("dashboard");
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [publisherFilter, setPublisherFilter] = useState<Publisher | "all">("all");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const unsub = subscribeToAllBlogs((data) => {
      setBlogs(data);
      setBlogsLoading(false);
    });
    return unsub;
  }, []);

  const handleNewPost = useCallback(() => {
    setEditingBlog(null);
    setView("editor");
  }, []);

  const handleEdit = useCallback((blog: Blog) => {
    setEditingBlog(blog);
    setView("editor");
  }, []);

  const handleEditorBack = useCallback(() => {
    setView("posts");
    setEditingBlog(null);
  }, []);

  const handleEditorSaved = useCallback(() => {
    setView("posts");
    setEditingBlog(null);
  }, []);

  const handleToggleStatus = async (blog: Blog) => {
    if (!blog.id) return;
    const newStatus = blog.status === "published" ? "draft" : "published";
    await updateBlog(blog.id, {
      status: newStatus,
      publishedAt:
        newStatus === "published" && !blog.publishedAt ? new Date() : blog.publishedAt,
    });
    setOpenMenuId(null);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteBlog(id);
    } catch (e) {
      console.error(e);
    }
    setDeletingId(null);
    setConfirmDeleteId(null);
  };

  const filteredBlogs = blogs.filter((b) => {
    const matchesSearch =
      !searchQuery ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPublisher =
      publisherFilter === "all" || b.publisher === publisherFilter;
    return matchesSearch && matchesPublisher;
  });

  const formatDate = (d: Date | null | undefined) => {
    if (!d) return "—";
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(d instanceof Date ? d : new Date(d));
  };

  const handleNavClick = (v: View) => {
    setView(v);
    setEditingBlog(null);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#08080f] text-white">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] shrink-0 flex-col border-r border-white/8 bg-[#0a0a14] transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 border-b border-white/8 px-5 py-5">
          <img src="/logo.png" alt="WEBBED" className="h-7 w-auto" />
          <div>
            <div className="text-xs font-bold text-white">WEBBED</div>
            <div className="text-[10px] text-white/40">Admin Panel</div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto rounded-lg p-1.5 text-white/40 hover:bg-white/5 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          <NavItem icon={<LayoutDashboard className="h-4 w-4" />} label="Dashboard" active={view === "dashboard"} onClick={() => handleNavClick("dashboard")} />
          <NavItem icon={<FileText className="h-4 w-4" />} label="Blog Posts" active={view === "posts" && !editingBlog} badge={blogs.length} onClick={() => handleNavClick("posts")} />
          <NavItem icon={<PlusCircle className="h-4 w-4" />} label="New Post" active={view === "editor" && !editingBlog} onClick={() => { setEditingBlog(null); setView("editor"); setSidebarOpen(false); }} />
          <div className="my-2 border-t border-white/8" />
          <NavItem icon={<Users className="h-4 w-4" />} label="Subscribers" active={view === "subscribers"} onClick={() => handleNavClick("subscribers")} />
        </nav>
        <div className="border-t border-white/8 p-3">
          <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/40 transition-colors hover:bg-red-500/10 hover:text-red-400">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {view !== "editor" && (
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/8 px-4 py-4 sm:px-7 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-1.5 text-white/40 hover:bg-white/5 hover:text-white lg:hidden shrink-0">
                <Menu className="h-5 w-5" />
              </button>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-bold text-white truncate">
                  {view === "dashboard" ? "Dashboard" : view === "subscribers" ? "Subscribers" : "Blog Posts"}
                </h1>
                <p className="text-xs text-white/40 mt-0.5 truncate">
                  {view === "dashboard" ? "Site analytics & content overview" : view === "subscribers" ? "Manage and export newsletter and update subscribers" : `${blogs.length} total post${blogs.length === 1 ? "" : "s"}`}
                </p>
              </div>
            </div>
            {view === "posts" && (
              <button onClick={handleNewPost} className="flex shrink-0 items-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold text-white transition-all hover:bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                <PlusCircle className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">New Post</span>
                <span className="sm:hidden">New</span>
              </button>
            )}
          </div>
        )}
        {view === "dashboard" && <DashboardHome onNewPost={handleNewPost} />}
        {view === "posts" && (
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 border-b border-white/8 px-4 py-3 sm:px-7 shrink-0">
              <div className="relative w-full sm:w-[260px]">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30" />
                <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search posts..." className="w-full rounded-lg border border-white/10 bg-white/[0.03] py-2 pl-9 pr-3 text-sm text-white placeholder-white/25 focus:border-indigo-500/40 focus:outline-none" />
              </div>
              <div className="relative w-full sm:w-auto">
                <button onClick={() => setFilterOpen(!filterOpen)} className="flex items-center justify-between w-full sm:w-[180px] rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white transition-all hover:bg-white/5">
                  <span className="truncate">{publisherFilter === "all" ? "All Publishers" : PUBLISHER_META[publisherFilter as Publisher].label}</span>
                  <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
                </button>
                {filterOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setFilterOpen(false)} />
                    <div className="absolute left-0 top-full z-50 mt-2 w-full sm:w-[180px] rounded-xl border border-white/12 bg-[#141420] shadow-2xl overflow-hidden">
                      <button onClick={() => { setPublisherFilter("all"); setFilterOpen(false); }} className={`flex w-full items-center px-4 py-2.5 text-sm transition-colors hover:bg-white/5 ${publisherFilter === "all" ? "text-indigo-400 bg-white/5 font-semibold" : "text-white/70 hover:text-white"}`}>All Publishers</button>
                      {(["webbed-team", "webbed-labs", "webbed-solutions", "webbed-schools"] as Publisher[]).map((pub) => (
                        <button key={pub} onClick={() => { setPublisherFilter(pub); setFilterOpen(false); }} className={`flex w-full items-center px-4 py-2.5 text-sm transition-colors hover:bg-white/5 ${publisherFilter === pub ? "text-indigo-400 bg-white/5 font-semibold" : "text-white/70 hover:text-white"}`}>{PUBLISHER_META[pub].label}</button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <span className="text-xs text-white/40 sm:ml-auto">{filteredBlogs.length} result{filteredBlogs.length !== 1 ? "s" : ""}</span>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-7">
              {blogsLoading ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-indigo-400" /></div>
              ) : filteredBlogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <FileText className="h-10 w-10 text-white/10 mb-4" />
                  <h3 className="text-base font-semibold text-white mb-2">No posts found</h3>
                  <button onClick={handleNewPost} className="mt-4 flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"><PlusCircle className="h-4 w-4" /> Create First Post</button>
                </div>
              ) : (
                <div className="overflow-hidden rounded-xl border border-white/8">
                  <div className="hidden lg:grid grid-cols-[1fr_140px_120px_130px_100px] border-b border-white/8 bg-white/[0.02] px-5 py-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40">Title</span>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40">Publisher</span>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40">Status</span>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40">Published</span>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40 text-right">Actions</span>
                  </div>
                  {filteredBlogs.map((blog) => {
                    const meta = PUBLISHER_META[blog.publisher];
                    return (
                      <div key={blog.id} className="group border-b border-white/5 px-5 py-4 transition-colors hover:bg-white/[0.02] last:border-0">
                        <div className="lg:hidden space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-white line-clamp-2">{blog.title}</span>
                                {blog.featured && <Star className="h-3 w-3 shrink-0 text-amber-400" />}
                              </div>
                              <span className="mt-0.5 text-[11px] text-white/40 line-clamp-2">{blog.excerpt}</span>
                            </div>
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold shrink-0 ${blog.status === "published" ? "bg-green-500/10 text-green-400" : "bg-white/5 text-white/50"}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${blog.status === "published" ? "bg-green-400" : "bg-white/30"}`} />
                              {blog.status === "published" ? "Published" : "Draft"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className={`text-[11px] font-medium ${meta.color}`}>{meta.label}</span>
                              <span className="text-[11px] text-white/40">{formatDate(blog.publishedAt)}</span>
                            </div>
                            <div className="relative flex items-center gap-1">
                              <button onClick={() => handleEdit(blog)} className="rounded-lg border border-white/8 bg-white/[0.03] p-1.5 text-white/50 transition-colors hover:border-indigo-500/30 hover:bg-indigo-500/10 hover:text-indigo-400" title="Edit"><Pencil className="h-3.5 w-3.5" /></button>
                              <button onClick={() => setOpenMenuId(openMenuId === blog.id ? null : blog.id!)} className="rounded-lg border border-white/8 bg-white/[0.03] p-1.5 text-white/50 transition-colors hover:border-white/20 hover:text-white" title="More"><MoreVertical className="h-3.5 w-3.5" /></button>
                              {openMenuId === blog.id && (
                                <div className="absolute right-0 top-10 z-50 w-[180px] rounded-xl border border-white/12 bg-[#141420] shadow-2xl">
                                  <button onClick={() => handleToggleStatus(blog)} className="flex w-full items-center gap-2 px-4 py-3 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white">
                                    {blog.status === "published" ? <><EyeOff className="h-4 w-4" /> Move to Draft</> : <><Globe className="h-4 w-4" /> Publish Now</>}
                                  </button>
                                  <div className="border-t border-white/8" />
                                  {confirmDeleteId === blog.id ? (
                                    <div className="p-3">
                                      <div className="mb-2 flex items-center gap-2 text-xs text-red-400"><AlertTriangle className="h-3.5 w-3.5" /> Delete permanently?</div>
                                      <div className="flex gap-2">
                                        <button onClick={() => deletingId !== blog.id && handleDelete(blog.id!)} className="flex-1 rounded-lg bg-red-500/20 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/30 transition-colors">{deletingId === blog.id ? "Deleting..." : "Yes, delete"}</button>
                                        <button onClick={() => setConfirmDeleteId(null)} className="flex-1 rounded-lg bg-white/5 py-1.5 text-xs font-semibold text-white/60 hover:bg-white/10 transition-colors">Cancel</button>
                                      </div>
                                    </div>
                                  ) : (
                                    <button onClick={() => setConfirmDeleteId(blog.id!)} className="flex w-full items-center gap-2 px-4 py-3 text-sm text-red-400/80 transition-colors hover:bg-red-500/10 hover:text-red-400"><Trash2 className="h-4 w-4" /> Delete Post</button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="hidden lg:grid grid-cols-[1fr_140px_120px_130px_100px]">
                          <div className="flex flex-col justify-center pr-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-white line-clamp-1">{blog.title}</span>
                              {blog.featured && <Star className="h-3 w-3 shrink-0 text-amber-400" />}
                            </div>
                            <span className="mt-0.5 text-[11px] text-white/40 line-clamp-1">{blog.excerpt}</span>
                          </div>
                          <div className="flex items-center"><span className={`text-xs font-medium ${meta.color}`}>{meta.label}</span></div>
                          <div className="flex items-center">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${blog.status === "published" ? "bg-green-500/10 text-green-400" : "bg-white/5 text-white/50"}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${blog.status === "published" ? "bg-green-400" : "bg-white/30"}`} />
                              {blog.status === "published" ? "Published" : "Draft"}
                            </span>
                          </div>
                          <div className="flex items-center text-xs text-white/40">{formatDate(blog.publishedAt)}</div>
                          <div className="relative flex items-center justify-end gap-1">
                            <button onClick={() => handleEdit(blog)} className="rounded-lg border border-white/8 bg-white/[0.03] p-2 text-white/50 transition-colors hover:border-indigo-500/30 hover:bg-indigo-500/10 hover:text-indigo-400" title="Edit"><Pencil className="h-3.5 w-3.5" /></button>
                            <button onClick={() => setOpenMenuId(openMenuId === blog.id ? null : blog.id!)} className="rounded-lg border border-white/8 bg-white/[0.03] p-2 text-white/50 transition-colors hover:border-white/20 hover:text-white" title="More"><MoreVertical className="h-3.5 w-3.5" /></button>
                            {openMenuId === blog.id && (
                              <div className="absolute right-0 top-10 z-50 w-[180px] rounded-xl border border-white/12 bg-[#141420] shadow-2xl">
                                <button onClick={() => handleToggleStatus(blog)} className="flex w-full items-center gap-2 px-4 py-3 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white">
                                  {blog.status === "published" ? <><EyeOff className="h-4 w-4" /> Move to Draft</> : <><Globe className="h-4 w-4" /> Publish Now</>}
                                </button>
                                <div className="border-t border-white/8" />
                                {confirmDeleteId === blog.id ? (
                                  <div className="p-3">
                                    <div className="mb-2 flex items-center gap-2 text-xs text-red-400"><AlertTriangle className="h-3.5 w-3.5" /> Delete permanently?</div>
                                    <div className="flex gap-2">
                                      <button onClick={() => deletingId !== blog.id && handleDelete(blog.id!)} className="flex-1 rounded-lg bg-red-500/20 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/30 transition-colors">{deletingId === blog.id ? "Deleting..." : "Yes, delete"}</button>
                                      <button onClick={() => setConfirmDeleteId(null)} className="flex-1 rounded-lg bg-white/5 py-1.5 text-xs font-semibold text-white/60 hover:bg-white/10 transition-colors">Cancel</button>
                                    </div>
                                  </div>
                                ) : (
                                  <button onClick={() => setConfirmDeleteId(blog.id!)} className="flex w-full items-center gap-2 px-4 py-3 text-sm text-red-400/80 transition-colors hover:bg-red-500/10 hover:text-red-400"><Trash2 className="h-4 w-4" /> Delete Post</button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
        {view === "editor" && (
          <BlogEditor
            existingBlog={editingBlog}
            onBack={handleEditorBack}
            onSaved={handleEditorSaved}
          />
        )}
        {view === "subscribers" && <SubscribersView />}
      </main>
      {openMenuId && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setOpenMenuId(null);
            setConfirmDeleteId(null);
          }}
        />
      )}
    </div>
  );
}

function NavItem({
  icon,
  label,
  active,
  badge,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  badge?: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
        active
          ? "bg-indigo-500/15 text-indigo-300"
          : "text-white/50 hover:bg-white/5 hover:text-white"
      }`}
    >
      {icon}
      <span className="flex-1 text-left">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/60">
          {badge}
        </span>
      )}
    </button>
  );
}
