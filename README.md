# AADTE website

An English-language, responsive static website for the Cumulus Art and Design Teacher Education and Pedagogy working group. Custom SVG illustrations, a two-ink risograph palette, paper texture and restrained editorial typography. No application dependencies or data collection. Google Fonts supplies DM Sans and Space Grotesk, with local system fallbacks.

## Editing and preview

The homepage is `dist/index.html`. Shared appearance and navigation are in `dist/styles.css` and `dist/main.js`. Edit event records in `generate-archive.mjs` and run `node generate-archive.mjs` to update their HTML. Serve `dist` with any static HTTP server. Deploy the contents of `dist`; the site does not require a server runtime or build step.

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

Site identity and static output directory are recorded in `.openai/hosting.json`. Publication defaults to owner-private for review. No existing Cumulus website or aadte.org domain is modified.
