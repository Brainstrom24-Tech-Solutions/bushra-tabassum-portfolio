import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "out");
const failures = [];
const pendingAssets = new Set();
let checks = 0;

function check(condition, label, message) {
  checks += 1;
  if (!condition) failures.push(`${label}: ${message}`);
}

function decode(value) {
  const named = { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " " };
  return value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi, (entity, key) => {
    if (!key.startsWith("#")) return named[key.toLowerCase()] ?? entity;
    const code = key[1].toLowerCase() === "x" ? parseInt(key.slice(2), 16) : parseInt(key.slice(1), 10);
    return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : entity;
  });
}

function attributes(source) {
  const result = {};
  const expression = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  for (const match of source.matchAll(expression)) {
    result[match[1].toLowerCase()] = decode(match[2] ?? match[3] ?? match[4] ?? "");
  }
  return result;
}

function elements(html, tag) {
  const safe = html.replace(/<!--[\s\S]*?-->/g, "");
  const opening = `\\b((?:\"[^\"]*\"|'[^']*'|[^'\">])*)>`;
  const expression = new RegExp(`<${tag}${opening}([\\s\\S]*?)<\\/${tag}\\s*>`, "gi");
  return [...safe.matchAll(expression)].map((match) => ({ attrs: attributes(match[1]), body: match[2] }));
}

function headTags(html, tag) {
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head\s*>/i)?.[1] ?? "";
  const safe = head.replace(/<!--[\s\S]*?-->|<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "");
  const expression = new RegExp(`<${tag}\\b((?:\"[^\"]*\"|'[^']*'|[^'\">])*)>`, "gi");
  return [...safe.matchAll(expression)].map((match) => attributes(match[1]));
}

function plainText(html) {
  return decode(html.replace(/<[^>]*>/g, "")).replace(/\s+/g, " ").trim();
}

function oneValue(values, expected, label, field) {
  check(values.length === 1, label, `${field} must occur exactly once (found ${values.length})`);
  if (values.length === 1) check(values[0] === expected, label, `${field} expected ${JSON.stringify(expected)}, got ${JSON.stringify(values[0])}`);
}

function metaValues(metas, key) {
  return metas.filter((meta) => (meta.property ?? meta.name ?? "").toLowerCase() === key).map((meta) => meta.content ?? "");
}

function hasNoindex(value) {
  return /(?:^|[\s,:;])(noindex|none)(?:$|[\s,;])/i.test(value);
}

function validatePage(html, route, config, siteUrl, headerRobots = "") {
  const label = route.pathname;
  check(/<head\b/i.test(html), label, "missing HTML head");
  const titles = elements(html, "title").map(({ body }) => plainText(body));
  const metas = headTags(html, "meta");
  const canonicals = headTags(html, "link").filter((link) => (link.rel ?? "").toLowerCase().split(/\s+/).includes("canonical"));
  const robots = metas.filter((meta) => /^(robots|googlebot(?:-\w+)?|bingbot)$/i.test(meta.name ?? ""));
  const canonical = new URL(route.pathname, siteUrl).href;

  oneValue(titles, route.title, label, "title");
  oneValue(metaValues(metas, "description"), route.description, label, "meta description");
  oneValue(canonicals.map((link) => link.href ?? ""), canonical, label, "canonical");
  check(!robots.some((meta) => hasNoindex(meta.content ?? "")) && !hasNoindex(headerRobots), label, "indexable page contains noindex/none robots directive");

  const imagePath = `/images/og/${route.slug ?? "home"}.png`;
  const imageUrl = new URL(imagePath, siteUrl).href;
  const expected = {
    "og:url": canonical,
    "og:title": route.title,
    "og:description": route.description,
    "og:type": "website",
    "og:site_name": config.siteName,
    "og:image": imageUrl,
    "og:image:type": "image/png",
    "og:image:width": "1200",
    "og:image:height": "630",
    "twitter:card": "summary_large_image",
    "twitter:title": route.title,
    "twitter:description": route.description,
    "twitter:image": imageUrl,
  };
  for (const [key, value] of Object.entries(expected)) oneValue(metaValues(metas, key), value, label, key);
  const imageAlt = metaValues(metas, "og:image:alt");
  check(imageAlt.length === 1 && imageAlt[0].trim().length > 0, label, "og:image:alt must occur once and be nonempty");
  pendingAssets.add(imagePath);

  const h1s = elements(html.replace(/<(script|style|template)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, ""), "h1");
  check(h1s.length === 1, label, `expected one h1 (found ${h1s.length})`);
  if (h1s.length === 1) {
    const heading = h1s[0];
    check(plainText(heading.body).length > 0, label, "h1 must not be empty");
    check(!Object.hasOwn(heading.attrs, "hidden") && heading.attrs["aria-hidden"] !== "true" &&
      !/(display\s*:\s*none|visibility\s*:\s*hidden)/i.test(heading.attrs.style ?? "") &&
      !/(?:^|\s)(hidden|sr-only)(?:\s|$)/.test(heading.attrs.class ?? ""), label, "h1 is explicitly hidden");
  }

  const graphs = [];
  const structured = elements(html, "script").filter(({ attrs }) => (attrs.type ?? "").toLowerCase() === "application/ld+json");
  check(structured.length > 0, label, "missing JSON-LD");
  for (const [index, { body }] of structured.entries()) {
    try {
      const document = JSON.parse(body);
      check(document["@context"] === "https://schema.org" || document["@context"] === "https://schema.org/", label, `JSON-LD ${index + 1} has no schema.org context`);
      check(Array.isArray(document["@graph"]) && document["@graph"].length > 0, label, `JSON-LD ${index + 1} must contain a nonempty @graph`);
      if (Array.isArray(document["@graph"])) graphs.push(...document["@graph"]);
    } catch (error) {
      check(false, label, `JSON-LD ${index + 1} is invalid JSON: ${error.message}`);
    }
  }
  const types = new Set(graphs.flatMap((node) => Array.isArray(node?.["@type"]) ? node["@type"] : [node?.["@type"]]));
  const required = ["Person", "WebSite", "WebPage", ...(route.slug ? ["CreativeWork", "BreadcrumbList"] : ["ItemList"])];
  for (const type of required) check(types.has(type), label, `JSON-LD @graph is missing ${type}`);
  check(!/kepong-meditation-garden/i.test(html), label, "removed Kepong project is still referenced");
}

function validate404(html, headerRobots = "") {
  const label = "/404.html";
  const robots = headTags(html, "meta").filter((meta) => (meta.name ?? "").toLowerCase() === "robots");
  check(robots.some((meta) => hasNoindex(meta.content ?? "")) || hasNoindex(headerRobots), label, "404 must be noindex");
  const canonical = headTags(html, "link").filter((link) => (link.rel ?? "").toLowerCase().split(/\s+/).includes("canonical"));
  check(canonical.length === 0, label, "404 must not have a canonical URL");
}

function sameSet(actual, expected, label) {
  check(actual.length === new Set(actual).size, label, "contains duplicate entries");
  for (const item of expected) check(actual.includes(item), label, `missing ${item}`);
  for (const item of actual) check(expected.includes(item), label, `unexpected ${item}`);
}

function validateSitemap(xml, expectedUrls) {
  check(/<urlset\b[^>]*xmlns\s*=\s*["']http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9["']/i.test(xml), "sitemap.xml", "missing standard urlset namespace");
  const urls = elements(xml, "url");
  const locations = [];
  for (const [index, url] of urls.entries()) {
    const locs = elements(url.body, "loc");
    check(locs.length === 1, "sitemap.xml", `url ${index + 1} must contain exactly one loc`);
    locations.push(...locs.map(({ body }) => decode(body.trim())));
  }
  sameSet(locations, expectedUrls, "sitemap.xml URLs");
  check(!/kepong-meditation-garden/i.test(xml), "sitemap.xml", "removed Kepong project is still referenced");
}

function validateRobots(content, siteUrl) {
  const groups = [];
  const sitemaps = [];
  let group;
  for (const line of content.split(/\r?\n/)) {
    const cleaned = line.replace(/\s*#.*$/, "").trim();
    const colon = cleaned.indexOf(":");
    if (colon < 0) continue;
    const key = cleaned.slice(0, colon).toLowerCase().trim();
    const value = cleaned.slice(colon + 1).trim();
    if (key === "sitemap") { sitemaps.push(value); continue; }
    if (key === "user-agent") {
      if (!group || group.rules.length) { group = { agents: [], rules: [] }; groups.push(group); }
      group.agents.push(value.toLowerCase());
    } else if (group && (key === "allow" || key === "disallow")) {
      group.rules.push({ key, value });
    }
  }
  const wildcard = groups.filter(({ agents }) => agents.includes("*"));
  check(wildcard.length > 0, "robots.txt", "missing User-agent: * group");
  check(wildcard.some(({ rules }) => rules.some(({ key, value }) => key === "allow" && value === "/")), "robots.txt", "wildcard group must Allow: /");
  const disallows = groups.flatMap(({ rules }) => rules.filter(({ key, value }) => key === "disallow" && value));
  check(!disallows.some(({ value }) => value === "/" || value === "/*" || value.includes("_next")), "robots.txt", "must not block the site or /_next assets");
  oneValue(sitemaps, new URL("/sitemap.xml", siteUrl).href, "robots.txt", "Sitemap directive");
}

function validatePNG(buffer, label) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const valid = buffer.length >= 24 && buffer.subarray(0, 8).equals(signature) && buffer.toString("ascii", 12, 16) === "IHDR";
  check(valid, label, "asset is not a PNG with an IHDR header");
  if (valid) check(buffer.readUInt32BE(16) === 1200 && buffer.readUInt32BE(20) === 630, label,
    `expected 1200×630, got ${buffer.readUInt32BE(16)}×${buffer.readUInt32BE(20)}`);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes("--help")) {
    console.log("Usage: node scripts/verify-seo.mjs [--base-url http://localhost:3000]\nValidates out/ against data/seo.json; --base-url also verifies served pages and assets.");
    return;
  }
  let baseUrl;
  if (args.length) {
    if (args.length !== 2 || args[0] !== "--base-url") throw new Error("Expected --base-url URL or no arguments");
    baseUrl = new URL(args[1]);
    if (!/^https?:$/.test(baseUrl.protocol) || baseUrl.pathname !== "/" || baseUrl.username || baseUrl.password || baseUrl.search || baseUrl.hash) throw new Error("--base-url must be an HTTP(S) origin without a path, credentials, query or fragment");
  }

  const config = JSON.parse(await readFile(path.join(root, "data", "seo.json"), "utf8"));
  const siteUrl = new URL(config.siteUrl);
  if (!/^https?:$/.test(siteUrl.protocol) || siteUrl.pathname !== "/" || siteUrl.search || siteUrl.hash || siteUrl.username || siteUrl.password) throw new Error("seo.siteUrl must be the public HTTP(S) origin");
  if (!config.siteName || !config.home?.title || !config.home?.description || !config.projects) throw new Error("seo.json is missing siteName, home metadata or projects");
  const slugs = Object.keys(config.projects);
  check(slugs.length > 0, "seo.json", "project catalog must not be empty");
  for (const slug of slugs) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`Invalid project slug: ${slug}`);
    if (!config.projects[slug].title || !config.projects[slug].description) throw new Error(`Missing SEO title/description for ${slug}`);
  }
  const routes = [
    { pathname: "/", file: "index.html", ...config.home },
    ...slugs.map((slug) => ({ pathname: `/projects/${slug}/`, file: `projects/${slug}/index.html`, slug, ...config.projects[slug] })),
  ];
  const dirs = await readdir(path.join(output, "projects"), { withFileTypes: true });
  sameSet(dirs.filter((entry) => entry.isDirectory()).map((entry) => entry.name), slugs, "exported project directories");

  async function local(file, task) {
    try { await task(await readFile(path.join(output, file))); }
    catch (error) { check(false, file, error.message); }
  }
  for (const route of routes) await local(route.file, (buffer) => validatePage(buffer.toString("utf8"), route, config, siteUrl));
  await local("404.html", (buffer) => validate404(buffer.toString("utf8")));
  const expectedUrls = routes.map((route) => new URL(route.pathname, siteUrl).href);
  await local("sitemap.xml", (buffer) => validateSitemap(buffer.toString("utf8"), expectedUrls));
  await local("robots.txt", (buffer) => validateRobots(buffer.toString("utf8"), siteUrl));
  for (const asset of pendingAssets) await local(asset.slice(1), (buffer) => validatePNG(buffer, asset));

  if (baseUrl) {
    async function live(pathname, expectedStatuses, task) {
      const url = new URL(pathname, baseUrl);
      try {
        const response = await fetch(url, { signal: AbortSignal.timeout(15000), redirect: "manual" });
        check(expectedStatuses.includes(response.status), url.href, `HTTP ${response.status}; expected ${expectedStatuses.join(" or ")}`);
        if (!expectedStatuses.includes(response.status)) return;
        await task(response);
      } catch (error) { check(false, url.href, error.message); }
    }
    for (const route of routes) await live(route.pathname, [200], async (response) => {
      check((response.headers.get("content-type") ?? "").includes("text/html"), route.pathname, "live response is not text/html");
      validatePage(await response.text(), route, config, siteUrl, response.headers.get("x-robots-tag") ?? "");
    });
    await live("/404.html", [200, 404], async (response) => validate404(await response.text(), response.headers.get("x-robots-tag") ?? ""));
    await live("/sitemap.xml", [200], async (response) => validateSitemap(await response.text(), expectedUrls));
    await live("/robots.txt", [200], async (response) => validateRobots(await response.text(), siteUrl));
    for (const asset of pendingAssets) await live(asset, [200], async (response) => {
      check((response.headers.get("content-type") ?? "").includes("image/png"), asset, "live response is not image/png");
      validatePNG(Buffer.from(await response.arrayBuffer()), asset);
    });
    await live("/projects/kepong-meditation-garden/", [404, 410], async () => {});
  }

  if (failures.length) {
    console.error(`SEO validation failed: ${failures.length} issue(s) across ${checks} checks.\n${failures.map((message) => `- ${message}`).join("\n")}`);
    process.exitCode = 1;
  } else {
    console.log(`SEO validation passed: ${routes.length} pages, ${pendingAssets.size} social images, 404, sitemap and robots; ${checks} checks${baseUrl ? ` including ${baseUrl.origin}` : ""}.`);
  }
}

main().catch((error) => {
  console.error(`SEO validation could not complete: ${error.message}`);
  process.exitCode = 1;
});
