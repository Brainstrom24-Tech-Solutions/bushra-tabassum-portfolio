# Bushra Tabassum — Architecture Portfolio

An editorial, responsive portfolio built with **Next.js Pages Router**, TypeScript and Tailwind CSS. Includes a redesigned homepage, three original academic case studies, four earlier study pages and a custom 404. The visual system combines oversized serif typography, charcoal sections, copper accents and responsive layouts.

## Run locally

Requires Node.js 20.9 or newer.

```sh
npm install
npm run dev
```

Open http://localhost:3000. For a production static export, run `npm run build`; deploy the generated `out/` directory to a static host. Because this uses `output: 'export'`, serve `out/` with a static file server rather than `next start`.

## Update content

- `data/profile.ts`: projects, experience, skills and LinkedIn URL.
- `data/featured.ts`: the three featured projects, attribution, source links and presentation boards.
- `components/FeaturedCaseStudy.tsx`: original case-study pages and PDF downloads.
- `pages/index.tsx`: homepage introduction, education and contact text.
- `styles/globals.css`: visual design and responsive styles; Tailwind utilities are also enabled.
- `styles/portrait.css`: responsive About-section portrait framing.
- `components/SmoothScroll.tsx`: Lenis scrolling, section links, route synchronisation and cleanup. Reduced-motion preferences are respected; touch scrolling stays native.
- `public/images/bushra-tabassum.png`: the original portrait supplied by the user.
- `public/images/projects/`: cover excerpts and full boards rendered from the original Wix portfolio PDFs.
- `public/documents/`: compact, rasterised web editions of the three original presentation PDFs; all pages and visual team credits are retained.
- Other files in `public/images/`: editorial architecture references used only by the earlier study archive.

## Content notes

Career information comes from the supplied LinkedIn text. Featured academic projects are sourced from the supplied Wix portfolio: The Esplanade, Kepong Meditation Garden and Echoes of the Wind. Group attribution is preserved. Earlier studies retain their illustrative-image labels. No project completion dates, commissioned clients, awards or measured performance claims have been invented. LinkedIn is the functional contact channel.

Development uses `.next-dev` to avoid collisions with production exports. For another simultaneous local preview, set `NEXT_DEV_DIRECTORY` to a separate cache path. The production export remains `out/`.

The site is a static portfolio: there is no CMS, email form or database to configure. All 21 supplied skills are included. Image source information is recorded in `IMAGE-CREDITS.md`.
