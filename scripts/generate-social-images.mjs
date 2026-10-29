import { readFile, mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createElement as h } from "react";
import { ImageResponse } from "next/og.js";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = path.join(root, "public", "images", "og");
const size = { width: 1200, height: 630 };
const colours = { cream: "#f5f3ee", ink: "#242621", copper: "#ad755b" };

const text = (content, style = {}) => h("div", { style: { display: "flex", ...style } }, content);

function artwork({ name, category, siteName, home }) {
  const background = home ? colours.cream : colours.ink;
  const foreground = home ? colours.ink : colours.cream;
  const muted = home ? "#65665f" : "#bbbcb2";
  const rule = home ? "#d7d7cb" : "#55574e";
  const titleSize = home ? 100 : name.length > 30 ? 72 : name.length > 22 ? 80 : 92;

  return h("div", {
    style: {
      ...size, display: "flex", flexDirection: "column", position: "relative",
      backgroundColor: background, color: foreground, fontFamily: "Portfolio Sans",
      padding: "48px 64px 42px", overflow: "hidden",
    },
  },
  h("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" } },
    text("bt.", { fontSize: 51, letterSpacing: -5, lineHeight: 1, color: colours.copper }),
    text(home ? "ARCHITECTURE / DESIGN / LEADERSHIP" : "SELECTED WORK / PORTFOLIO", {
      fontSize: 15, letterSpacing: 3, color: muted,
    }),
  ),
  h("div", {
    style: { display: "flex", position: "absolute", right: 64, top: 168, width: 175, height: 292,
      border: `1px solid ${rule}`, borderRadius: "96px 96px 0 0", opacity: 0.65 },
  },
    h("div", { style: { display: "flex", position: "absolute", top: 29, bottom: 0, left: 28, right: 28,
      border: `1px solid ${rule}`, borderRadius: "70px 70px 0 0" } }),
    h("div", { style: { display: "flex", position: "absolute", top: 58, bottom: 0, left: 57, right: 57,
      border: `1px solid ${colours.copper}`, borderRadius: "40px 40px 0 0" } }),
  ),
  h("div", { style: { display: "flex", flexDirection: "column", justifyContent: "center", flex: 1, width: 850, paddingTop: 12 } },
    text(home ? "THE ARCHITECTURE PORTFOLIO" : category.toUpperCase(), {
      fontSize: 16, color: colours.copper, letterSpacing: 2.5, marginBottom: 24,
    }),
    text(name, { fontSize: titleSize, letterSpacing: -4, lineHeight: 1.12, maxWidth: 850 }),
    home ? text("Spaces for life. Design with feeling.", {
      fontSize: 25, color: muted, marginTop: 24, letterSpacing: -0.2,
    }) : null,
  ),
  h("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${rule}`, paddingTop: 24 } },
    text(home ? "DHAKA / KUALA LUMPUR" : siteName.toUpperCase(), { fontSize: 15, letterSpacing: 2, color: muted }),
    text(home ? "PEOPLE. PLACE. POSSIBILITY." : "ARCHITECTURE / DESIGN", { fontSize: 13, letterSpacing: 2, color: muted }),
  ));
}

/** Generate static social previews without network requests or machine-specific fonts. */
export async function generateSocialImages(config) {
  if (!config?.siteName || typeof config.siteName !== "string" || !config.projects || typeof config.projects !== "object") {
    throw new Error("Social images require siteName and a projects object in data/seo.json.");
  }
  const entries = Object.entries(config.projects);
  for (const [slug, project] of entries) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug === "home" || typeof project?.name !== "string" || !project.name || typeof project?.category !== "string") {
      throw new Error(`Invalid social-image project configuration: ${slug}`);
    }
  }

  // The installed Next.js package includes this font; rendering stays fully offline.
  const font = await readFile(require.resolve("next/dist/compiled/@vercel/og/noto-sans-v27-latin-regular.ttf"));
  await mkdir(outputDirectory, { recursive: true });
  const images = [
    { slug: "home", name: config.siteName, category: "Architecture portfolio", home: true },
    ...entries.map(([slug, project]) => ({ slug, name: project.name, category: project.category, home: false })),
  ];
  const generated = [];
  for (const entry of images) {
    const response = new ImageResponse(artwork({ ...entry, siteName: config.siteName }), {
      ...size,
      fonts: [{ name: "Portfolio Sans", data: font, weight: 400, style: "normal" }],
    });
    const png = Buffer.from(await response.arrayBuffer());
    const file = path.join(outputDirectory, `${entry.slug}.png`);
    await writeFile(file, png);
    generated.push({ slug: entry.slug, file, bytes: png.length, ...size });
  }
  return generated;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const config = JSON.parse(await readFile(path.join(root, "data", "seo.json"), "utf8"));
  const generated = await generateSocialImages(config);
  for (const image of generated) {
    console.log(`${image.slug}.png: ${image.width}x${image.height}, ${(image.bytes / 1024).toFixed(1)} KiB`);
  }
}
