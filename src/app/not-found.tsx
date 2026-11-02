import type { Metadata } from "next";
import NotFoundClient from "@/components/NotFoundClient";

export const metadata: Metadata = {
  title: "404 — Page Not Found | WEBBED",
  description:
    "The page you're looking for doesn't exist or has been moved. Return to WEBBED home to explore our solutions, products, and technology.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <NotFoundClient />;
}
