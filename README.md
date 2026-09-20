# Bushra Tabassum — Architecture Portfolio

An editorial, responsive portfolio built with **Next.js Pages Router**, TypeScript and Tailwind CSS. Includes a redesigned homepage, three selected projects, a sustainability concept, four earlier study pages and a custom 404. The visual system combines oversized serif typography, charcoal sections, copper accents and responsive layouts.

## Run locally

Requires Node.js 20.9 or newer.

```sh
npm install
npm run dev
```

Open http://localhost:3000. For a production static export, run `npm run build`; deploy the generated `out/` directory to a static host. Because this uses `output: 'export'`, serve `out/` with a static file server rather than `next start`.

## Update content

- `data/profile.ts`: earlier studies, experience, skills and contact details.
- `data/featured.ts`: selected projects, sustainability concept, attribution and gallery captions.
- `data/gallery-assets.json`: source artwork dimensions.
- `components/FeaturedCaseStudy.tsx`: case-study pages and available PDF downloads.
- `components/ProjectGallery.tsx`: category filters and a keyboard-accessible image viewer with zoom, previous/next and focus restoration.
- `styles/gallery.css`: gallery, image viewer, concept feature and contact layouts.
- `pages/index.tsx`: homepage introduction, education and contact text.
- `styles/globals.css`: visual design and responsive styles; Tailwind utilities are also enabled.
- `styles/portrait.css`: responsive About-section portrait framing.
- `components/SmoothScroll.tsx`: Lenis scrolling, section links, route synchronisation and cleanup. Reduced-motion preferences are respected; touch scrolling stays native.
- `public/images/bushra-tabassum.png`: the original portrait supplied by the user.
- `public/images/projects/`: original Canva project artwork and crops rendered from Wix portfolio PDFs, with lightweight gallery thumbnails.
- `public/documents/`: compact, rasterised web editions of the two original presentation PDFs; all pages and visual team credits are retained.
- Other files in `public/images/`: editorial architecture references used only by the earlier study archive.

## Content notes

Selected work is ordered Maharaja Restaurant, The Esplanade, and Echoes of the Wind. Maharaja artwork and project facts come from the supplied Canva portfolio, page 12. Its images are labelled as design visualisations; no current construction status or completion date is claimed. The WAT-AIR Purifier study from Canva page 15 is labelled as a speculative academic concept without engineering performance claims. Esplanade and Echoes drawings come from the original supplied Wix PDFs. Group attribution is preserved. Earlier studies retain their illustrative-image labels.

Biography and responsibilities incorporate the supplied Canva CV. Contact details come from its page 16 and use functional email and telephone links; LinkedIn remains available. At the user's direction, Anondo Housing Society remains in the homepage introduction, biography, metadata and first Director experience entry. Anondo Cityscapers Ltd is a separate Director experience immediately below it, based in Dhaka, Bangladesh, from January 2024 to Present, supervising sales, marketing and development management and tracking and negotiating the firm's legal and financial growth. Two discrepancies remain pending confirmation: HMS Architects versus MH Architects, and BSc Architecture (July 2023) versus Bachelor of Architecture (January 2024). The previous architecture firm's name and the degree title and dates remain unchanged pending that confirmation.

Development uses `.next-dev` to avoid collisions with production exports. For another simultaneous local preview, set `NEXT_DEV_DIRECTORY` to a separate cache path. The production export remains `out/`.

The site is a static portfolio: there is no CMS, email form or database to configure. All 21 supplied skills are included. Image source information is recorded in `IMAGE-CREDITS.md`.
