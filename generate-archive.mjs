// Run with Node.js after editing these event records. No dependencies required.
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));
const records = [
  {
    slug: 'budapest-2024', city: 'Budapest', year: '2024',
    title: 'Wind of change',
    strap: 'Art universities as active contributors or neutral ground?',
    source: 'https://cumulusassociation.org/calls-for-participation/aadt-art-and-design-teacher-education-and-pedagogy-cwg-at-cumulus-budapest-2024/',
    description: 'An AADTE discussion on academic freedom, social responsibility and the role of art universities in society at Cumulus Budapest 2024.',
    meta: [['Date', '16 May 2024'], ['Time', '16:00–17:30 CEST'], ['Location', 'Moholy-Nagy University of Art and Design<br>Zugligeti út 9, 1121 Budapest, Hungary'], ['Format', 'Onsite discussion & workshop'], ['Conference', 'P/References of Design<br>Cumulus Budapest 2024']],
    body: `<h2>The university and society</h2><p>This session considered how art and design universities participate in society through education, advocacy, research and public engagement. It asked how academic freedom, ethical practice and social responsibility shape a sustainable environment for students and academics — and what these commitments mean for higher education pedagogy.</p><p>The discussion took place in person, without an online broadcast.</p><h2>Session contributors</h2><p>Andreas Kohli, a lecturer at Zurich University of the Arts, brought interests in arts education, ecology, interculturality and teaching resources. Minna Suoniemi, an artist, curator and Aalto University Lecturer, brought a practice informed by embodied experience and feminist knowledge production.</p>`
  },
  {
    slug: 'antwerp-2023', city: 'Antwerp', year: '2023',
    title: 'Competencies & connections',
    strap: 'Two sessions on creative learning and collaboration across distance.',
    source: 'https://cumulusassociation.org/news/aadte-cwg-meetings-at-cumulus-antwerp-2023/',
    description: 'Two AADTE sessions at Cumulus Antwerp 2023: a competency resource workshop and a conversation about sustainable international artistic collaboration.',
    meta: [['Dates', '13–14 April 2023'], ['Location', 'University of Antwerp, Rector Dhanis<br>Kleine Kauwenberg 14, 2000 Antwerp, Belgium'], ['13 April', '13:30–15:00 CEST · Room SR.006<br>Onsite & online'], ['14 April', '15:30–17:00 CEST · Room s.K.101<br>Onsite only']],
    body: `<h2>13 April · A resource for creative competencies</h2><p>A hands-on workshop explored the Design Competency Resource, developed through earlier Cumulus gatherings. Participants co-created case studies and considered adding art competencies to develop a broader Creative Competency Resource. Contributors included Job Rutgers (OCAD University) and John Fass (London College of Communication).</p><h2>14 April · Intimacy over (Long) Distance</h2><p>This session explored sustaining international artistic projects during the ecological crisis, building on methods developed during the pandemic.</p><p>Minna Suoniemi shared approaches from contemporary art, lens-based practice, ecology and ethics courses. Andreas Kohli presented a summer school connecting local investigations of extractivism in Athens, Melbourne and Taipei. Merav Salomon (Bezalel Academy of Art & Design) presented international collaborative courses developed in response to Covid-19.</p>`
  },
  {
    slug: 'detroit-2022', city: 'Detroit', year: '2022',
    title: 'What makes learning inspiring?',
    strap: 'Sharing the everyday teaching experiences that help design students grow.',
    source: 'https://cumulusassociation.org/calls-for-participation/aadte-cumulus-wg-workshop-share-the-most-inspiring-learning-experiences/',
    description: 'The AADTE workshop at Cumulus Detroit 2022 invited educators to share learning experiences and explore the competencies developed through everyday teaching.',
    meta: [['Date', '2 November 2022'], ['Time', '13:30–15:00 local time'], ['Location', 'A. Alfred Taubman Center for Design Education, Room 1141<br>460 W Baltimore Ave, Detroit, MI 48202, United States'], ['Format', 'Onsite & online · Cumulus members'], ['Hosts', 'College for Creative Studies<br>OCAD University<br>University of the Arts London']],
    body: `<h2>Looking closely at everyday teaching</h2><p>The workshop introduced the developing Cumulus Design Competency Resource. Educators shared classroom and studio experiences, then worked in small groups to identify the competencies students developed. Tagging these experiences would help other teachers discover and share them.</p><p>The initiative grew from a partnership begun at Cumulus Hong Kong in 2016 and developed through subsequent conferences. AADTE, Cumulus and Design Competency Futures collaborated on the resource with Cumulus grant support.</p><h2>Workshop facilitators</h2><p>Job Rutgers (OCAD University) and John Fass (London College of Communication), founders of Design Competency Futures, facilitated the session. The aim was to collect credited teaching experiences for the resource and continue the conversation at Cumulus Antwerp.</p>`
  }
];
const symbol = `<svg class="brand-symbol" viewBox="0 0 32 36" aria-hidden="true"><path fill="#69607d" d="M0 0h14v36H0z"/><path fill="#71b084" d="M14 0a18 18 0 0 1 0 36V0Z"/><path fill="#c28b90" d="M0 18h14v18H0z"/></svg>`;
for (const [index, record] of records.entries()) {
  const next = records[(index + 1) % records.length];
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${record.title} · ${record.city} ${record.year} — AADTE</title><meta name="description" content="${record.description}"><meta name="theme-color" content="#e8e2df"><link rel="icon" type="image/svg+xml" href="../../assets/favicon.svg"><link rel="stylesheet" href="../../bauhaus.css?v=magazine-1"><script src="../../main.js?v=motion-2" defer></script></head><body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header"><div class="wrap header-inner"><a class="brand" href="../../" aria-label="AADTE home"><span class="wordmark">aadte</span>${symbol}<span class="brand-tag">A Cumulus<br>working group</span></a><button class="menu-toggle" aria-expanded="false" aria-controls="navigation">Menu +</button><nav id="navigation" class="desktop-nav" aria-label="Main navigation"><a href="../../#about">About</a><a href="../../#people">People</a><a href="../../#gatherings">Gatherings</a><a href="../../#resources">Resources</a><a class="nav-contact" href="../../#contact">Let’s connect <span aria-hidden="true">↗</span></a></nav></div></header>
<main id="main" class="article-main wrap"><a class="back-link" href="../../#gatherings"><span aria-hidden="true">←</span> All gatherings</a><div class="article-head"><span class="article-archive-label">From the archive · ${record.city} ${record.year}</span><h1>${record.title}</h1><p class="article-strap">${record.strap}</p></div><div class="article-grid"><aside aria-label="Event information"><dl class="article-meta">${record.meta.map(([key,value])=>`<div><dt>${key}</dt><dd>${value}</dd></div>`).join('')}</dl></aside><article class="article-body">${record.body}<div class="article-source"><a class="text-link" href="${record.source}" target="_blank" rel="noopener noreferrer">Read the original announcement <span class="arrow" aria-hidden="true">↗</span></a><p>Archived event. The complete announcement, contributor information and original links are preserved on the Cumulus website.</p></div></article></div><div class="article-next"><a href="../../#gatherings">← Back to the gathering archive</a><a href="../../gatherings/${next.slug}/">${next.city} ${next.year} · ${next.title} →</a></div></main>
<footer class="site-footer wrap"><div class="footer-inner"><div class="footer-left"><a class="footer-wordmark" href="../../" aria-label="AADTE home">aadte</a><span>Art, design & the possibilities of learning.</span></div><div class="footer-links"><a href="https://cumulusassociation.org/" target="_blank" rel="noopener noreferrer">Cumulus Association ↗</a><a href="../../#contact">Contact the working group</a></div></div></footer></body></html>`;
  await mkdir(path.join(root,'dist','gatherings',record.slug),{recursive:true});
  await writeFile(path.join(root,'dist','gatherings',record.slug,'index.html'),html);
}
console.log(`Generated ${records.length} archive pages.`);
