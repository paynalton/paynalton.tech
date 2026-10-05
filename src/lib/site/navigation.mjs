/** The manifest contains only generated pages. It is also the link/locale boundary. */
export const sections = [
  { key: 'home', segment: '', label: 'nav.home' },
  { key: 'projects', segment: 'proyectos', label: 'nav.projects' },
  { key: 'experience', segment: 'trayectoria', label: 'nav.experience' },
  { key: 'works', segment: 'obra', label: 'nav.works' },
  { key: 'about', segment: 'sobre-mi', label: 'nav.about' },
  { key: 'contact', segment: 'contacto', label: 'nav.contact' },
  { key: 'explore', segment: 'explorar', label: 'nav.explore' },
  { key: 'terms', segment: 'temas', label: 'nav.terms' },
];
export function sectionUrl(locale, key, prefix = '') {
  const section = sections.find(s => s.key === key);
  if (!section || !/^[a-z][a-z0-9-]*$/.test(locale)) throw new Error('Unknown route');
  return `${prefix}/${locale}/${section.segment ? section.segment + '/' : ''}`;
}
/** @returns {import('./types').SiteRoute[]} */
export function routeManifest(repository, prefix = '') {
  const routes = repository.getSettings().locales.filter(l => l.enabled).flatMap(l => [
    ...sections.map(s => ({ id: s.key, locale: l.code, url: sectionUrl(l.code, s.key, prefix), section: s.key, label: s.label })),
    ...repository.publicEntries(l.code).filter(e => ['project', 'term', 'work'].includes(e.type)).map(e => ({
      id: `entry:${e.entityId}`, entityId: e.entityId, locale: l.code, url: e.url,
      section: { project: 'projects', term: 'terms', work: 'works' }[e.type], title: e.title,
    })),
    ...repository.publicEntries(l.code).filter(e=>e.type==='work').flatMap(e=>e.chapters.map(c=>({id:`chapter:${e.entityId}:${c.id}`,entityId:e.entityId,chapterId:c.id,locale:l.code,url:c.url,section:'works',title:c.title,parentUrl:e.url,parentTitle:e.title}))),
  ]);
  // Existing translated book pages remain real destinations while their legacy templates are retained.
  if(!prefix && routes.some(r=>r.entityId==='cuando-la-tostadora-te-responde')) {
    for(const locale of ['en','nah']) if(!routes.some(r=>r.id==='entry:cuando-la-tostadora-te-responde' && r.locale===locale)) routes.push({id:'entry:cuando-la-tostadora-te-responde',entityId:'cuando-la-tostadora-te-responde',locale,url:`/${locale}/books/cuando-la-tostadora-te-responde/`,section:'works',title:undefined,legacy:true});
  }
  return routes;
}
/** @param {import('./types').SiteRoute[]} manifest */
export function pageAlternatives(manifest, page, settings) {
  return manifest.filter(r => r.id === page.id).map(r => ({
    ...r, label: settings.locales.find(l => l.code === r.locale).label,
  }));
}
/** @param {import('./types').SiteRoute[]} manifest */
export function navigation(manifest, locale) {
  return manifest.filter(r => r.locale === locale && ['projects','experience','works','about','contact'].includes(r.id));
}
export function breadcrumbs(page, t, prefix = '') {
  const trail = [{ title: t('nav.home'), url: sectionUrl(page.locale, 'home', prefix) }];
  if (page.id === 'home') return [];
  if (page.entityId) trail.push({ title: t(sections.find(s => s.key === page.section).label), url: sectionUrl(page.locale, page.section, prefix) });
  if(page.chapterId) trail.push({title:page.parentTitle,url:page.parentUrl});
  trail.push({ title: page.title ?? t(page.label), url: page.url });
  return trail;
}
