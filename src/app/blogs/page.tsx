import type { Metadata } from "next";
import BlogsPageClient from "@/components/BlogsPageClient";

export const metadata: Metadata = {
  title: "WEBBED BLOG | Ideas that build the future",
  description:
    "Insights, stories, and tutorials from across WEBBED. Real ideas. Real people. Real impact.",
  openGraph: {
    title: "WEBBED BLOG | Ideas that build the future",
    description:
      "Insights, stories, and tutorials from across WEBBED. Real ideas. Real people. Real impact.",
    url: "https://webbed.in/blogs",
    siteName: "WEBBED",
    type: "website",
  },
};

export default function BlogsPage() {
  return <BlogsPageClient />;
}
