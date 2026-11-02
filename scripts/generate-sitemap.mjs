import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const SITE_URL = "https://webbed.in";
const FIRESTORE_PROJECT_ID = "webbed-team";
const FIREBASE_API_KEY =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY ??
  "AIzaSyCO00NHpuLkF1RtzSpUNnOfcnSFXMk-mWI";
const OUTPUT_PATH = fileURLToPath(
  new URL("../public/sitemap.xml", import.meta.url),
);

const staticPages = [
  ["/", "weekly", "1.0"],
  ["/about", "monthly", "0.9"],
  ["/solutions", "weekly", "0.95"],
  ["/products", "monthly", "0.8"],
  ["/labs", "weekly", "0.8"],
  ["/schools", "monthly", "0.7"],
  ["/blogs", "weekly", "0.85"],
  ["/faq", "monthly", "0.85"],
  ["/contact", "yearly", "0.6"],
  ["/privacy-policy", "yearly", "0.3"],
  ["/terms-of-service", "yearly", "0.3"],
];

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function firestoreValue(field) {
  if (!field || typeof field !== "object") return undefined;
  return (
    field.stringValue ??
    field.timestampValue ??
    field.integerValue ??
    field.booleanValue
  );
}

async function fetchPublishedPosts() {
  const posts = [];
  let pageToken;

  do {
    const endpoint = new URL(
      `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT_ID}/databases/(default)/documents/blogs`,
    );
    endpoint.searchParams.set("key", FIREBASE_API_KEY);
    endpoint.searchParams.set("pageSize", "1000");
    if (pageToken) endpoint.searchParams.set("pageToken", pageToken);

    const response = await fetch(endpoint, {
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) {
      throw new Error(`Firestore returned HTTP ${response.status}`);
    }

    const payload = await response.json();
    for (const document of payload.documents ?? []) {
      const fields = document.fields ?? {};
      const status = firestoreValue(fields.status);
      const slug = firestoreValue(fields.slug);
      if (status !== "published" || typeof slug !== "string" || !slug) continue;

      const lastModified =
        firestoreValue(fields.updatedAt) ??
        firestoreValue(fields.publishedAt) ??
        document.updateTime;
      posts.push({
        slug,
        lastModified:
          typeof lastModified === "string"
            ? new Date(lastModified).toISOString().slice(0, 10)
            : undefined,
      });
    }

    pageToken = payload.nextPageToken;
  } while (pageToken);

  return posts;
}

function staticUrl([path, changeFrequency, priority]) {
  return `  <url>
    <loc>${escapeXml(`${SITE_URL}${path}`)}</loc>
    <changefreq>${changeFrequency}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function blogUrl(post) {
  const location = `${SITE_URL}/blogs/post?slug=${encodeURIComponent(post.slug)}`;
  return `  <url>
    <loc>${escapeXml(location)}</loc>${
      post.lastModified ? `\n    <lastmod>${post.lastModified}</lastmod>` : ""
    }
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
}

let posts = [];
try {
  posts = await fetchPublishedPosts();
} catch (error) {
  console.warn(
    `[sitemap] Could not load blog posts; generated static URLs only: ${error.message}`,
  );
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticPages.map(staticUrl), ...posts.map(blogUrl)].join("\n")}
</urlset>
`;

await writeFile(OUTPUT_PATH, sitemap, "utf8");
console.log(
  `[sitemap] Generated ${staticPages.length} static and ${posts.length} blog URLs.`,
);
