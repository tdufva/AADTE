# AADTE

Website: https://tdufva.github.io/AADTE/

Repository: https://github.com/tdufva/AADTE

An English-language, responsive static website for the Cumulus Art and Design Teacher Education and Pedagogy working group. Abstract Bauhaus geometry, a moody risograph palette, paper texture and bold minimal typography. No application dependencies or data collection. Google Fonts supplies Archivo and IBM Plex Mono, with local system fallbacks.

## Editing and preview

The homepage is `dist/index.html`. Shared appearance and navigation are in `dist/bauhaus.css` and `dist/main.js`. Edit event records in `generate-archive.mjs` and run `node generate-archive.mjs` to update their HTML. Serve `dist` with any static HTTP server. All local links and assets use relative URLs, so the same files work both under `/AADTE/` on GitHub Pages and at the root of another web host. The site does not require an application server or package installation.

## Content migration, 29 October 2026

Primary source: https://cumulusassociation.org/events/working-groups/art-and-design-teacher-education-and-pedagogy-aadte/

- Group purpose and activities: About section, rewritten for the new site.
- Coordinators: all three names, roles and Aalto affiliations supplied by the user replace the outdated coordinator list. All three appear on the homepage.
- Members: all four directory entries retained in the expandable network section. This is attributed to the original directory, without claiming a current total membership.
- News/calls: all three distinct linked announcements retained as archive entries with event summaries, practical information and direct links to the full original records. Duplicate category listings are consolidated; historic events are explicitly identified as archived.
- Publications/portal: the original aadte.org link is retained under Resources. Both aadte.org and aadte.wordpress.com were inaccessible during research. Their independent contents could not be audited or migrated.
- Broader Cumulus navigation, unrelated categories, member login and association subscription forms are represented by links to Cumulus rather than imitated locally.

Archive sources:

1. https://cumulusassociation.org/calls-for-participation/aadt-art-and-design-teacher-education-and-pedagogy-cwg-at-cumulus-budapest-2024/
2. https://cumulusassociation.org/news/aadte-cwg-meetings-at-cumulus-antwerp-2023/
3. https://cumulusassociation.org/calls-for-participation/aadte-cumulus-wg-workshop-share-the-most-inspiring-learning-experiences/

Public email sources:

- Tomi: https://www.aalto.fi/en/programmes/masters-programme-in-art-and-media/contact
- Minna: the Antwerp announcement above.
- Heikki: https://www.aalto.fi/en/people/heikki-heinonen

Historical timezone inconsistencies in the Detroit source are avoided by showing local time; no expired meeting credentials or live registration forms are presented. This site has no current event announcement because none was supplied or shown on the source working group page.

## Hosting

The website is hosted on GitHub Pages. The workflow in `.github/workflows/pages.yml` deploys the checked-in `dist/` directory whenever changes are pushed to `main`; it can also be run manually from the Actions tab.

To update the site, edit the HTML/CSS directly or regenerate the archive with `node generate-archive.mjs`, then commit and push to `main`. The deployed website is public and requires no sign-in. The site has no dependency on ChatGPT hosting. No existing Cumulus website or aadte.org domain is modified.

## Bauhaus / risograph revision

The seven palette colours are #71b084, #9c9b9a, #e8e2df, #c49886, #69607d, #48a363 and #d3c4f5, with a neutral dark printing ink for legibility. Abstract SVGs replace the previous pictorial illustrations and favicon. The three focus blocks and coordinator numbering are removed. Original portrait JPEGs are preserved; cropping, ink tinting and halftone treatment happen in CSS.

Portrait sources:

- Tomi Slotte Dufva: https://www.aalto.fi/en/people/tomi-slotte-dufva — https://acris.aalto.fi/ws/portalfiles/portal/7108415/IMG_3135.jpg
- Minna Suoniemi: https://www.aalto.fi/en/people/minna-suoniemi — https://acris.aalto.fi/ws/portalfiles/portal/163002426/minna_suoniemi_pieni.jpg
- Heikki Heinonen: https://research.aalto.fi/fi/persons/heikki-heinonen/ (linked from his Aalto staff profile) — https://research.aalto.fi/files-asset/120247640/Heikki_pieni.jpg/

## Stronger risograph finish

A second print pass adds static paper-fibre and ink-density SVG textures, porous headline stencils, coarser rotated halftone screens, roughened illustration edges and small ink-registration offsets. Body copy is untreated. Portrait files remain unmodified; the print finish is applied in CSS. No new pictorial motifs or content were added.
