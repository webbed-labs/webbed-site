import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  getDocs,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";

export type Publisher =
  | "webbed-team"
  | "webbed-labs"
  | "webbed-solutions"
  | "webbed-schools";

export type BlogStatus = "draft" | "published";

export interface Blog {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  coverImageAlt: string;
  publisher: Publisher;
  tags: string[];
  featured: boolean;
  status: BlogStatus;
  readTimeMinutes: number;
  // SEO
  metaTitle: string;
  metaDescription: string;
  ogImageUrl: string;
  canonicalUrl: string;
  // Author
  authorName: string;
  // Timestamps
  publishedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 100);
}

export function calculateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function docToBlog(id: string, data: DocumentData): Blog {
  const toDate = (v: unknown): Date | null => {
    if (!v) return null;
    if (v instanceof Timestamp) return v.toDate();
    if (v instanceof Date) return v;
    return null;
  };
  return {
    ...(data as Omit<Blog, "id" | "publishedAt" | "createdAt" | "updatedAt">),
    id,
    publishedAt: toDate(data.publishedAt),
    createdAt: toDate(data.createdAt) ?? new Date(),
    updatedAt: toDate(data.updatedAt) ?? new Date(),
  };
}

// ─── CRUD ────────────────────────────────────────────────────────────────────

export async function createBlog(
  blog: Omit<Blog, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const ref = await addDoc(collection(db, "blogs"), {
    ...blog,
    publishedAt:
      blog.status === "published" && !blog.publishedAt
        ? serverTimestamp()
        : blog.publishedAt ?? null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateBlog(
  id: string,
  data: Partial<Blog>
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: Record<string, any> = { ...data, updatedAt: serverTimestamp() };
  // Set publishedAt when first publishing
  if (data.status === "published" && data.publishedAt === null) {
    payload.publishedAt = serverTimestamp();
  }
  await updateDoc(doc(db, "blogs", id), payload);
}

export async function deleteBlog(id: string): Promise<void> {
  await deleteDoc(doc(db, "blogs", id));
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const q = query(collection(db, "blogs"), where("slug", "==", slug));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return docToBlog(snap.docs[0].id, snap.docs[0].data());
}

/** Published blogs for public pages that do not need a persistent live stream. */
export async function getPublishedBlogs(): Promise<Blog[]> {
  const publishedQuery = query(
    collection(db, "blogs"),
    where("status", "==", "published"),
    orderBy("publishedAt", "desc")
  );

  try {
    const snap = await getDocs(publishedQuery);
    return snap.docs.map((d) => docToBlog(d.id, d.data()));
  } catch {
    // Fallback while the composite index is being created.
    const fallbackQuery = query(
      collection(db, "blogs"),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(fallbackQuery);
    return snap.docs
      .map((d) => docToBlog(d.id, d.data()))
      .filter((blog) => blog.status === "published");
  }
}

// ─── Real-time subscriptions ─────────────────────────────────────────────────

/** All blogs (admin panel) */
export function subscribeToAllBlogs(
  callback: (blogs: Blog[]) => void
): () => void {
  const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => docToBlog(d.id, d.data())));
  });
}

/** Published blogs only (public site) */
export function subscribeToPublishedBlogs(
  callback: (blogs: Blog[]) => void
): () => void {
  const q = query(
    collection(db, "blogs"),
    where("status", "==", "published"),
    orderBy("publishedAt", "desc")
  );
  return onSnapshot(
    q,
    (snap) => {
      callback(snap.docs.map((d) => docToBlog(d.id, d.data())));
    },
    () => {
      // Fallback: fetch all and filter if composite index not ready
      const fallbackQ = query(
        collection(db, "blogs"),
        orderBy("createdAt", "desc")
      );
      onSnapshot(fallbackQ, (snap) => {
        const all = snap.docs.map((d) => docToBlog(d.id, d.data()));
        callback(all.filter((b) => b.status === "published"));
      });
    }
  );
}

// ─── Publisher metadata ───────────────────────────────────────────────────────

export const PUBLISHER_META: Record<
  Publisher,
  { label: string; color: string; bg: string; border: string }
> = {
  "webbed-team": {
    label: "Webbed Team",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/30",
  },
  "webbed-labs": {
    label: "Webbed Labs",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
  },
  "webbed-solutions": {
    label: "Webbed Solutions",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
  },
  "webbed-schools": {
    label: "Webbed Schools",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
  },
};
