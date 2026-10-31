# Bushra Tabassum — Architecture Portfolio

An editorial, responsive portfolio built with **Next.js Pages Router**, TypeScript and Tailwind CSS. Includes a redesigned homepage, three selected projects, a sustainability concept, four earlier study pages and a custom 404. The visual system combines oversized serif typography, charcoal sections, copper accents and responsive layouts.

## Run locally

Requires Node.js 20.9 or newer.

```sh
npm install
npm run dev
```

Open http://localhost:3000. For a production static export, run `npm run build`; deploy the generated `out/` directory to a static host. Because this uses `output: 'export'`, serve `out/` with a static file server rather than `next start`.

## Search and social previews

SEO remains on the **Pages Router**, using `next/head` through `components/Seo.tsx`. `data/seo.json` contains the production origin, unique homepage/project titles and descriptions, and selected-project flags. The canonical origin is currently `https://bushra-tabassum-portfolio.vercel.app`; update `siteUrl` in that one file before switching domains. Page canonicals, Open Graph URLs, JSON-LD and sitemap URLs use trailing slashes to match `next.config.mjs`. Social-image file URLs retain their `.png` extension.

- Each of the nine content pages has a canonical, description, Open Graph metadata, Twitter large-image card and JSON-LD.
- Homepage schema includes Person, WebSite, WebPage and the four selected projects. Project pages include CreativeWork and BreadcrumbList, preserving credits from `data/featured.ts`. Archive reference photographs are excluded from original-work schema. Unresolved employment titles and degree dates are not added as structured claims.
- The custom 404 is `noindex, follow`, with no canonical or portfolio schema. All eight existing project pages remain indexable; the removed Kepong project is excluded.
- `scripts/generate-seo.mjs` generates `public/sitemap.xml`, `public/robots.txt` and nine 1200×630 PNG previews in `public/images/og/`. It runs before development and production builds; `npm run seo:generate` runs it manually. Rendering is offline using the installed Next.js image renderer and bundled font. No server image endpoint or new package is required.
- `npm run build` automatically validates the static export afterward. `npm run seo:check` checks an existing `out/` export: metadata values/duplicates, canonical URLs, JSON-LD syntax and required types, PNG dimensions, sitemap coverage, robots directives, 404 handling, and project-route drift. Missing or extra project routes fail the check. Add new project SEO data together with its content.
- After deployment, `npm run seo:check -- --base-url https://bushra-tabassum-portfolio.vercel.app` also checks served HTML/assets and removed-project status. It requires a current local export and does not deploy anything.

The automated checks are not a Google index-coverage or Rich Results Test. After deploying, verify the final canonical domain in Google Search Console, submit `/sitemap.xml`, and inspect the homepage and main project URLs. If a custom domain is introduced, redirect the old domain consistently. The supplied kit's App Router files were adapted; no `app/` router or duplicate metadata system was added. The existing design, project content and native looping video are retained.

## Update content

- `data/profile.ts`: earlier studies, experience, skills and contact details.
- `data/featured.ts`: selected projects, sustainability concept, attribution and gallery captions.
- `data/gallery-assets.json`: source artwork dimensions.
- `components/FeaturedCaseStudy.tsx`: case-study pages and available PDF downloads.
- `components/ProjectGallery.tsx`: category filters and a keyboard-accessible image viewer with zoom, previous/next and focus restoration.
- `styles/gallery.css`: gallery, image viewer, concept feature and contact layouts.
- `pages/index.tsx`: homepage introduction, education and contact text.
- `components/Photography.tsx`, `data/photography.ts` and `styles/photography.css`: the homepage "Through my lens" section with the user-supplied Qutub Minar (2021) and Blue Mosque (2024) photographs. Original PNGs are preserved under `public/images/photography/`; the gallery uses a responsive portrait layout and keyboard-accessible full-frame viewer.
- `styles/globals.css`: visual design and responsive styles; Tailwind utilities are also enabled.
- `styles/portrait.css`: responsive About-section portrait framing.
- `components/SmoothScroll.tsx`: Lenis scrolling, section links, route synchronisation and cleanup. Reduced-motion preferences are respected; touch scrolling stays native.
- `components/HeroVideo.tsx`, `styles/hero-video.css` and `public/videos/maharaja-walkthrough.mp4`: the user-supplied, already-cropped MP4 plays directly through the native video element, muted, inline and looping. The 19,621,216-byte, 1622×968 file is copied unchanged, without re-encoding or extra zoom. Its responsive frame keeps the source aspect ratio and uses `object-fit: contain` so no edges are cropped. On mobile, the project caption sits beneath the video. Playback has no visible controls; reduced-motion support, visibility-aware playback and the original image fallback are included. No YouTube player, scripts or overlays are used.
- `public/images/bushra-tabassum.png`: the original portrait supplied by the user.
- `public/images/projects/`: original Canva project artwork and crops rendered from Wix portfolio PDFs, with lightweight gallery thumbnails.
- `public/documents/`: compact, rasterised web editions of the two original presentation PDFs; all pages and visual team credits are retained.
- Other files in `public/images/`: editorial architecture references used only by the earlier study archive.

## Content notes

Selected work is ordered Maharaja Restaurant, The Esplanade, and Echoes of the Wind. Maharaja artwork and project facts come from the supplied Canva portfolio, page 12. Its images are labelled as design visualisations; no current construction status or completion date is claimed. The WAT-AIR Purifier study from Canva page 15 is labelled as a speculative academic concept without engineering performance claims. Esplanade and Echoes drawings come from the original supplied Wix PDFs. Group attribution is preserved. Earlier studies retain their illustrative-image labels.

Biography and responsibilities incorporate the supplied Canva CV. Contact details come from its page 16 and use functional email and telephone links; LinkedIn remains available. At the user's direction, Anondo Housing Society remains in the homepage introduction, biography, metadata and first Director experience entry. Anondo Cityscapers Ltd is a separate Director experience immediately below it, based in Dhaka, Bangladesh, from January 2024 to Present, supervising sales, marketing and development management and tracking and negotiating the firm's legal and financial growth. Two discrepancies remain pending confirmation: HMS Architects versus MH Architects, and BSc Architecture (July 2023) versus Bachelor of Architecture (January 2024). The previous architecture firm's name and the degree title and dates remain unchanged pending that confirmation.

The user also confirmed current Director roles at Anondo Bhubon, Anondo Rosemont Estate, Anondo Baari, Anondo Universal Services Ltd., Pranto ARDI and Bridge Pharmaceuticals Ltd. These appear after Anondo Cityscapers Ltd, with "Present" and no unprovided start dates, locations or responsibilities.

Development uses `.next-dev` to avoid collisions with production exports. For another simultaneous local preview, set `NEXT_DEV_DIRECTORY` to a separate cache path. The production export remains `out/`.

The site is a static portfolio: there is no CMS, email form or database to configure. All 21 supplied skills are included. Image source information is recorded in `IMAGE-CREDITS.md`.
