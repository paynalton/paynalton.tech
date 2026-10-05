/** Explicit public projection; never serialize repository internals or a preview entry. */
export function canonicalUrl(relative, origin) {
  const base = new URL(origin);
  if (base.protocol !== 'https:' || base.username || base.password || base.pathname !== '/' || base.search || base.hash) throw new Error('Invalid canonical origin');
  if (!/^\/[a-z0-9/-]+\/(#[a-z0-9-]+)?$/.test(relative) || relative.includes('//')) throw new Error('Invalid public URL');
  return new URL(relative, base).href;
}
export function projectDocument(repository, entityId, locale, origin) {
  const entries = repository.publicEntries(locale);
  const entry = entries.find(e => e.entityId === entityId && e.type === 'project' && !e.example);
  if (!entry) throw new Error('Public project unavailable');
  return {
    schemaVersion: 1,
    id: entry.entityId,
    language: entry.locale,
    canonical: canonicalUrl(entry.url, origin),
    title: entry.title,
    summary: entry.summary,
    ...(entry.role ? {role: entry.role} : {}),
    ...(entry.operationalStatus ? {operationalStatus: entry.operationalStatus} : {}),
    ...(entry.startLabel ? {startLabel: entry.startLabel} : {}),
    technologies: [...entry.facts.technologies],
    body: entry.body,
    relations: entry.relations.flatMap(relation => {
      const target = entries.find(e => e.entityId === relation.target && !e.example);
      return target ? [{kind: relation.kind, id: target.entityId, title: target.title, url: canonicalUrl(target.url, origin)}] : [];
    }),
  };
}
export const exportPaths = url => ({ json: `${url}index.json`, markdown: `${url}index.md` });
const escape = value => String(value).replace(/([\\`*_[\]<>#])/g, '\\$1').replace(/[\r\n]+/g, ' ');
export function projectMarkdown(document, t) {
  const lines = [
    `# ${escape(document.title)}`, '',
    `${t('export.canonical')}: <${document.canonical}>`,
    `${t('export.language')}: ${escape(document.language)}`, '',
    escape(document.summary), '',
  ];
  for (const [key, label] of [['role','project.role'],['operationalStatus','project.status'],['startLabel','project.start']]) {
    if (document[key]) lines.push(`**${t(label)}:** ${escape(document[key])}`, '');
  }
  lines.push(`**${t('project.technologies')}:** ${document.technologies.map(escape).join(', ')}`, '', document.body.trim(), '');
  if (document.relations.length) {
    lines.push(`## ${t('nav.related')}`, '');
    for (const relation of document.relations) lines.push(`- ${t(`relation.${relation.kind}`)}: [${escape(relation.title)}](${relation.url})`);
    lines.push('');
  }
  return lines.join('\n');
}

/** Downloadable reading material, using only the already published body and credits. */
export function workDocument(repository, entityId, locale, origin) {
  const entries=repository.publicEntries(locale);
  const entry = entries.find(e => e.entityId === entityId && e.type === 'work' && e.facts.fullText && !e.example);
  if (!entry) throw new Error('Public full text unavailable');
  return {
    schemaVersion: 1, id: entry.entityId, language: entry.locale,
    canonical: canonicalUrl(entry.url, origin), title: entry.title, summary: entry.summary,
    author: entry.facts.author, format: entry.facts.format,
    ...(entry.facts.year ? {year: entry.facts.year} : {}),
    ...(entry.facts.sourceUrl ? {source: entry.facts.sourceUrl} : {}),
    partial: entry.facts.partial === true,
    topics: entry.relations.filter(r => r.kind === 'discusses').map(r => ({title:entries.find(e=>e.entityId===r.target).title,url:canonicalUrl(r.url,origin)})),
    body: entry.body,
  };
}
export function workMarkdown(document, t) {
  return [`# ${escape(document.title)}`, '',
    `${t('work.author')}: ${escape(document.author)}`,
    `${t('export.canonical')}: <${document.canonical}>`,
    `${t('export.language')}: ${escape(document.language)}`,
    ...(document.source ? [`${t('work.source')}: <${document.source}>`] : []),
    ...(document.partial ? ['', t('work.partialHelp')] : []),
    '', document.body.trim(), ''].join('\n');
}
