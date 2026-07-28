const { writeFileSync } = require("node:fs");
const path = require("node:path");

const rootDir = path.resolve(__dirname, "..");

const SITE_URL = (process.env.SITE_URL || "https://www.expressearth.com").replace(/\/+$/, "");

const API_BY_ENV = {
  local: "http://localhost:8000",
  qa: "https://express-earth-backend-service-929452209573.asia-south2.run.app",
  stage: "https://express-earth-backend-service-929452209573.asia-south2.run.app",
  prod: "https://api.expressearth.com",
};

const API_URL = (
  process.env.REACT_APP_API_URL?.trim() ||
  API_BY_ENV[process.env.REACT_APP_ENV || "prod"] ||
  API_BY_ENV.prod
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
    console.warn(`[sitemap] Could not fetch ${endpoint}: ${err.message}. Skipping those URLs.`);
    return [];
  }
}

function toDateOnly(value) {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime())
    ? date.toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10);
}

function xmlEscape(value) {
  return String(value).replace(/&/g, "&amp;");
}

function urlEntry({ loc, lastmod, changefreq, priority }) {
  return [
    "  <url>",
    `    <loc>${xmlEscape(loc)}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    "  </url>",
  ].join("\n");
}

async function main() {
  const today = new Date().toISOString().slice(0, 10);

  const entries = STATIC_ROUTES.map((route) =>
    urlEntry({
      loc: `${SITE_URL}${route.path}`,
      lastmod: today,
      changefreq: route.changefreq,
      priority: route.priority,
    }),
  );

  const [oldPosts, newBlogs, oldCaseStudies, newCaseStudies] = await Promise.all([
    fetchList("/api/posts/"),
    fetchList("/api/express-earth/blog/"),
    fetchList("/api/case-studies/"),
    fetchList("/api/express-earth/case-study/"),
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

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>
`;

  const outPath = path.join(rootDir, "public", "sitemap.xml");
  writeFileSync(outPath, xml, "utf-8");
  console.log(
    `[sitemap] Wrote ${entries.length} URLs (${seenBlogSlugs.size} blogs, ${seenCaseStudySlugs.size} case studies) to public/sitemap.xml`,
  );
}

main().catch((err) => {
  // Never let a sitemap hiccup break the production build.
  console.warn(`[sitemap] Skipped due to unexpected error: ${err.message}`);
});
