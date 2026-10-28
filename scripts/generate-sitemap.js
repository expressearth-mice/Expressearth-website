const { existsSync, writeFileSync } = require("node:fs");
const path = require("node:path");

const rootDir = path.resolve(__dirname, "..");
let apiFetchFailed = false;

const SITE_URL = (process.env.SITE_URL || "https://www.expressearth.com").replace(/\/+$/, "");

const API_URL = (
  process.env.REACT_APP_API_URL?.trim() || "https://api.expressearth.com"
).replace(/\/+$/, "");

const STATIC_ROUTES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.8" },
  { path: "/mice-services", changefreq: "monthly", priority: "0.8" },
  { path: "/meetings-and-conferences", changefreq: "monthly", priority: "0.7" },
  { path: "/incentive-travel", changefreq: "monthly", priority: "0.7" },
  { path: "/corporate-events", changefreq: "monthly", priority: "0.7" },
  { path: "/exhibitions-and-trade-shows", changefreq: "monthly", priority: "0.7" },
  { path: "/destination-management", changefreq: "monthly", priority: "0.7" },
  { path: "/international-destinations", changefreq: "monthly", priority: "0.7" },
  { path: "/domestic-destinations", changefreq: "monthly", priority: "0.7" },
  { path: "/destinations", changefreq: "weekly", priority: "0.7" },
  { path: "/case-studies", changefreq: "weekly", priority: "0.8" },
  { path: "/case-category", changefreq: "monthly", priority: "0.6" },
  { path: "/categories", changefreq: "monthly", priority: "0.6" },
  { path: "/blogs", changefreq: "daily", priority: "0.8" },
  { path: "/achievements", changefreq: "monthly", priority: "0.6" },
  { path: "/gallery", changefreq: "monthly", priority: "0.6" },
  { path: "/Gifting", changefreq: "monthly", priority: "0.7" },
  { path: "/dealermeet", changefreq: "monthly", priority: "0.6" },
  { path: "/corporateoffsites", changefreq: "monthly", priority: "0.6" },
  { path: "/internationalgrouptravel", changefreq: "monthly", priority: "0.6" },
  { path: "/r&rplanning", changefreq: "monthly", priority: "0.6" },
  { path: "/conferencemanagement", changefreq: "monthly", priority: "0.6" },
  { path: "/incentivetravel", changefreq: "monthly", priority: "0.6" },
  { path: "/careers", changefreq: "monthly", priority: "0.6" },
  { path: "/contact", changefreq: "yearly", priority: "0.6" },
  { path: "/privacy-policy", changefreq: "yearly", priority: "0.5" },
  { path: "/terms-and-conditions", changefreq: "yearly", priority: "0.5" },
];

async function fetchList(endpoint) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : (data?.results ?? []);
  } catch (err) {
    apiFetchFailed = true;
    console.warn(`[sitemap] Could not fetch ${endpoint}: ${err.message}. Skipping those URLs.`);
    return [];
  }
}

function toDateOnly(value) {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime())
    ? date.toISOString().slice(0, 10)
    : null;
}

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlEntry({ loc, lastmod, changefreq, priority }) {
  return [
    "  <url>",
    `    <loc>${xmlEscape(loc)}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    "  </url>",
  ].filter(Boolean).join("\n");
}

async function main() {
  const entries = STATIC_ROUTES.map((route) =>
    urlEntry({
      loc: `${SITE_URL}${route.path}`,
      changefreq: route.changefreq,
      priority: route.priority,
    }),
  );

  const [oldPosts, newBlogs, oldCaseStudies, newCaseStudies, categories] = await Promise.all([
    fetchList("/api/posts/"),
    fetchList("/api/express-earth/blog/"),
    fetchList("/api/case-studies/"),
    fetchList("/api/express-earth/case-study/"),
    fetchList("/api/categories/"),
  ]);

  const seenBlogSlugs = new Set();
  for (const post of [...newBlogs, ...oldPosts]) {
    const slug = post?.slug || (post?.title ? encodeURIComponent(post.title) : "");
    if (!slug || seenBlogSlugs.has(slug)) continue;
    seenBlogSlugs.add(slug);
    entries.push(
      urlEntry({
        loc: `${SITE_URL}/blogs/${slug}`,
        lastmod: toDateOnly(post.updated_at ?? post.created_at),
        changefreq: "monthly",
        priority: "0.6",
      }),
    );
  }

  const seenCaseStudySlugs = new Set();
  for (const caseStudy of [...newCaseStudies, ...oldCaseStudies]) {
    const slug = caseStudy?.slug || caseStudy?.id;
    if (!slug || seenCaseStudySlugs.has(String(slug))) continue;
    seenCaseStudySlugs.add(String(slug));
    entries.push(
      urlEntry({
        loc: `${SITE_URL}/case-studies/${slug}`,
        lastmod: toDateOnly(caseStudy.updated_at ?? caseStudy.created_at),
        changefreq: "monthly",
        priority: "0.6",
      }),
    );
  }

  const seenCategorySlugs = new Set();
  for (const category of categories) {
    const categoryName = String(category?.name || "").trim();
    const slug = category?.slug || categoryName.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    if (!slug || seenCategorySlugs.has(slug)) continue;
    seenCategorySlugs.add(slug);
    entries.push(
      urlEntry({
        loc: `${SITE_URL}/categories/${encodeURIComponent(slug)}`,
        lastmod: toDateOnly(category.updated_at ?? category.created_at),
        changefreq: "monthly",
        priority: "0.5",
      }),
    );
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>
`;

  const outPath = path.join(rootDir, "public", "sitemap.xml");
  if (apiFetchFailed && existsSync(outPath)) {
    console.warn("[sitemap] One or more API lists failed; leaving the existing sitemap unchanged to preserve previously generated dynamic URLs.");
    return;
  }
  writeFileSync(outPath, xml, "utf-8");
  console.log(
    `[sitemap] Wrote ${entries.length} URLs (${seenBlogSlugs.size} blogs, ${seenCaseStudySlugs.size} case studies, ${seenCategorySlugs.size} categories) to public/sitemap.xml`,
  );
}

main().catch((err) => {
  // Never let a sitemap hiccup break the production build.
  console.warn(`[sitemap] Skipped due to unexpected error: ${err.message}`);
});
