import { readFile, mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { generateSocialImages } from "./generate-social-images.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const config = JSON.parse(await readFile(join(root, "data/seo.json"), "utf8"));
const site = new URL(config.siteUrl);
if (site.protocol !== "https:" || site.origin !== config.siteUrl || site.username || site.password) {
  throw new Error("data/seo.json siteUrl must be a public HTTPS origin without a path or trailing slash.");
}
const slugs = Object.keys(config.projects);
const titles = new Set([config.home.title]);
const descriptions = new Set([config.home.description]);
for (const slug of slugs) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`Invalid project slug: ${slug}`);
  const project = config.projects[slug];
  for (const field of ["name", "title", "description", "category"]) {
    if (typeof project[field] !== "string" || !project[field].trim()) throw new Error(`Missing ${field} for ${slug}`);
  }
  if (titles.has(project.title) || descriptions.has(project.description)) throw new Error(`Duplicate SEO copy for ${slug}`);
  titles.add(project.title);
  descriptions.add(project.description);
}

const urls = [`${site.origin}/`, ...slugs.map((slug) => `${site.origin}/projects/${slug}/`)];
const xml = (value) => value.replace(/[<>&"']/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[char]);
const publicDir = join(root, "public");
await mkdir(publicDir, { recursive: true });
// No synthetic lastmod dates: builds are not evidence of content changes.
await writeFile(join(publicDir, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${xml(url)}</loc></url>`).join("\n")}\n</urlset>\n`);
await writeFile(join(publicDir, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${site.origin}/sitemap.xml\n`);
await generateSocialImages(config);
console.log(`Generated sitemap (${urls.length} URLs), robots.txt and ${urls.length} social previews.`);
