"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Users,
  Search,
  Download,
  FileText,
  FileSpreadsheet,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface Subscriber {
  id: string;
  email: string;
  source: string;
  name?: string;
  course?: string;
  timestamp: Date | null;
}

export default function SubscribersView() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [exportOpen, setExportOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newslettersSnap, productSnap, courseSnap, blogSnap] = await Promise.all([
          getDocs(collection(db, "newsletters")).catch(() => ({ docs: [] })),
          getDocs(collection(db, "product_updates")).catch(() => ({ docs: [] })),
          getDocs(collection(db, "course_updates")).catch(() => ({ docs: [] })),
          getDocs(collection(db, "blog_subscribers")).catch(() => ({ docs: [] })),
        ]);

        const data: Subscriber[] = [];

        newslettersSnap.docs.forEach((doc) => {
          data.push({
            id: doc.id,
            email: doc.data().email || "",
            source: "Newsletter",
            timestamp: doc.data().timestamp?.toDate?.() || null,
          });
        });

        productSnap.docs.forEach((doc) => {
          data.push({
            id: doc.id,
            email: doc.data().email || "",
            source: "Product Updates",
            timestamp: doc.data().timestamp?.toDate?.() || null,
          });
        });

        courseSnap.docs.forEach((doc) => {
          data.push({
            id: doc.id,
            email: doc.data().email || "",
            name: doc.data().name || "",
            course: doc.data().course || "",
            source: "Course Updates",
            timestamp: doc.data().timestamp?.toDate?.() || null,
          });
        });

        blogSnap.docs.forEach((doc) => {
          data.push({
            id: doc.id,
            email: doc.data().email || "",
            source: "Blog Subscribers",
            timestamp: doc.data().timestamp?.toDate?.() || null,
          });
        });

        // Sort by timestamp descending
        data.sort((a, b) => {
          if (!a.timestamp) return 1;
          if (!b.timestamp) return -1;
          return b.timestamp.getTime() - a.timestamp.getTime();
        });

        setSubscribers(data);
      } catch (error) {
        console.error("Error fetching subscribers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((sub) => {
      const matchesSearch =
        sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sub.name && sub.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (sub.course && sub.course.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesSource = filterSource === "all" || sub.source === filterSource;
      return matchesSearch && matchesSource;
    });
  }, [subscribers, searchQuery, filterSource]);

  const formatDate = (date: Date | null) => {
    if (!date) return "—";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 150);
  };

  const exportToExcel = () => {
    const exportData = filteredSubscribers.map((sub) => ({
      Date: formatDate(sub.timestamp),
      Email: sub.email,
      Source: sub.source,
      Name: sub.name || "—",
      Course: sub.course || "—",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Subscribers");
    
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
    
    downloadBlob(blob, "webbed_subscribers.xlsx");
    setExportOpen(false);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text("WEBBED Subscribers Export", 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
    
    const tableColumn = ["Date", "Email", "Source", "Name", "Course"];
    const tableRows = filteredSubscribers.map(sub => [
      formatDate(sub.timestamp),
      sub.email,
      sub.source,
      sub.name || "-",
      sub.course || "-"
    ]);

    // @ts-ignore
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [79, 70, 229] } // Indigo 600
    });

    const blob = doc.output("blob");
    downloadBlob(blob, "webbed_subscribers.pdf");
    setExportOpen(false);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Filters & Export Header */}
      <div className="flex items-center gap-3 border-b border-white/8 px-7 py-3 shrink-0">
        <div className="relative w-[260px]">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search email, name..."
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] py-2 pl-9 pr-3 text-sm text-white placeholder-white/25 focus:border-indigo-500/40 focus:outline-none"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center justify-between w-[180px] rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white transition-all hover:bg-white/5"
          >
            <span className="truncate">
              {filterSource === "all" ? "All Sources" : filterSource}
            </span>
            <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
          </button>

          {filterOpen && (
            <>
              <div 
                className="fixed inset-0 z-40"
                onClick={() => setFilterOpen(false)}
              />
              <div className="absolute left-0 top-full z-50 mt-2 w-[180px] rounded-xl border border-white/12 bg-[#141420] shadow-2xl overflow-hidden">
                <button
                  onClick={() => { setFilterSource("all"); setFilterOpen(false); }}
                  className={`flex w-full items-center px-4 py-2.5 text-sm transition-colors hover:bg-white/5 ${filterSource === "all" ? "text-indigo-400 bg-white/5 font-semibold" : "text-white/70 hover:text-white"}`}
                >
                  All Sources
                </button>
                {["Newsletter", "Product Updates", "Course Updates", "Blog Subscribers"].map((source) => (
                  <button
                    key={source}
                    onClick={() => { setFilterSource(source); setFilterOpen(false); }}
                    className={`flex w-full items-center px-4 py-2.5 text-sm transition-colors hover:bg-white/5 ${filterSource === source ? "text-indigo-400 bg-white/5 font-semibold" : "text-white/70 hover:text-white"}`}
                  >
                    {source}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-4 ml-auto">
          <span className="text-xs text-white/40">
            {filteredSubscribers.length} result{filteredSubscribers.length !== 1 ? "s" : ""}
          </span>
          
          {/* Export Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setExportOpen(!exportOpen)}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-white/5"
            >
              <Download className="h-4 w-4" />
              Export
              <ChevronDown className="h-4 w-4 opacity-50" />
            </button>

            {exportOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setExportOpen(false)}
                />
                <div className="absolute right-0 top-full z-50 mt-2 w-40 rounded-xl border border-white/12 bg-[#141420] shadow-2xl overflow-hidden">
                  <button
                    type="button"
                    onClick={exportToExcel}
                    className="flex w-full items-center gap-2 px-4 py-3 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
                    Excel (.xlsx)
                  </button>
                  <div className="border-t border-white/8" />
                  <button
                    type="button"
                    onClick={exportToPDF}
                    className="flex w-full items-center gap-2 px-4 py-3 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <FileText className="h-4 w-4 text-red-400" />
                    PDF (.pdf)
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto px-7 py-5">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
          </div>
        ) : filteredSubscribers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Users className="h-10 w-10 text-white/10 mb-4" />
            <h3 className="text-base font-semibold text-white mb-2">No subscribers found</h3>
            <p className="text-sm text-white/40 max-w-sm">
              We couldn't find any subscribers matching your criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-white/8 bg-white/[0.01]">
            <div className="hidden md:grid grid-cols-[1.5fr_1fr_1.5fr_1fr] border-b border-white/8 bg-white/[0.02] px-5 py-3 gap-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40">Email</span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40">Source</span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40">Details (Name/Course)</span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40 text-right">Date</span>
            </div>

            {filteredSubscribers.map((sub) => (
              <div
                key={sub.id}
                className="group border-b border-white/5 px-5 py-4 transition-colors hover:bg-white/[0.03] last:border-0"
              >
                <div className="md:hidden space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-sm font-medium text-white line-clamp-1">{sub.email}</span>
                    <span
                      className={`shrink-0 inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                        sub.source === "Newsletter"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : sub.source === "Product Updates"
                          ? "bg-violet-500/10 text-violet-400"
                          : sub.source === "Course Updates"
                          ? "bg-cyan-500/10 text-cyan-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {sub.source}
                    </span>
                  </div>
                  {sub.name || sub.course ? (
                    <div className="text-[11px] text-white/50">
                      {sub.name && <span className="mr-2">{sub.name}</span>}
                      {sub.course && <span className="text-white/30">{sub.course}</span>}
                    </div>
                  ) : null}
                  <div className="text-[10px] text-white/30">{formatDate(sub.timestamp)}</div>
                </div>
                <div className="hidden md:grid grid-cols-[1.5fr_1fr_1.5fr_1fr] gap-4">
                  <div className="flex items-center pr-4">
                    <span className="text-sm font-medium text-white line-clamp-1">{sub.email}</span>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        sub.source === "Newsletter"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : sub.source === "Product Updates"
                          ? "bg-violet-500/10 text-violet-400"
                          : sub.source === "Course Updates"
                          ? "bg-cyan-500/10 text-cyan-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {sub.source}
                    </span>
                  </div>
                  <div className="flex items-center">
                    {sub.name || sub.course ? (
                      <div className="flex flex-col justify-center">
                        {sub.name && <span className="text-xs text-white/70 line-clamp-1">{sub.name}</span>}
                        {sub.course && <span className="text-[10px] text-white/40 line-clamp-1">{sub.course}</span>}
                      </div>
                    ) : (
                      <span className="text-xs text-white/20">—</span>
                    )}
                  </div>
                  <div className="flex items-center justify-end text-xs text-white/40">
                    {formatDate(sub.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
