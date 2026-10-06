import { readFile, realpath } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { settingsSchema, entitySchema, editorialSchema, selectionSchema, publicEntrySchema } from './schemas.mjs';
import { validateCatalog, requiredUiKeys } from './i18n.mjs';
import { sectionUrl } from './navigation.mjs';

export const defaultRoot = path.resolve(fileURLToPath(new URL('../../data/site/', import.meta.url)));
const fail = message => { throw new Error(`[contenido] ${message}`); };
const unique = (list, label) => { if (new Set(list).size !== list.length) fail(`Duplicado: ${label}`); };
const groups = { profiles: 'profile', channels: 'channel', projects: 'project', experience: 'experience', works: 'work', terms: 'term', featuredProjects: 'project', featuredWorks: 'work' };
const sections = { project: 'projects', work: 'works', term: 'terms' };
const route = (entity, locale, variant) => {
  // Preserve the published book landing; other works use the configurable library.
  if (entity.type === 'work' && entity.id === 'cuando-la-tostadora-te-responde') return `/${locale}/books/${variant.slug}/`;
  if (entity.type === 'profile') return sectionUrl(locale,'about');
  if (entity.type === 'channel') return `${sectionUrl(locale,'contact')}#${variant.slug}`;
  if (entity.type === 'experience') return `${sectionUrl(locale,'experience')}#${variant.slug}`;
  return `${sectionUrl(locale,sections[entity.type])}${variant.slug}/`;
};

export async function readSource(root = defaultRoot) {
  const json = async file => JSON.parse(await readFile(path.join(root, file), 'utf8'));
  const settings = settingsSchema.parse(await json('locales.json'));
  const source = { settings, entities: await json('entities.json'), selection: await json('selection.json'), ui: {}, editorial: {}, bodies: {} };
  const bodiesRoot = await realpath(path.join(root, 'bodies'));
  for (const locale of settings.locales) {
    for (const section of ['ui', 'editorial']) {
      try { source[section][locale.code] = await json(`${section}/${locale.code}.json`); }
      catch (error) { if (error.code !== 'ENOENT' || locale.enabled) throw error; }
    }
    for (const raw of Object.values(source.editorial[locale.code] ?? {})) {
      const entry = editorialSchema.parse(raw);
      for (const ref of [entry.bodyRef, ...entry.chapters.map(c => c.bodyRef)]) {
        if (!ref.startsWith(`${locale.code}/`)) fail('Cuerpo asociado al idioma incorrecto');
        const resolved = await realpath(path.join(bodiesRoot, ref));
        if (!resolved.startsWith(bodiesRoot + path.sep)) fail('Cuerpo fuera del directorio autorizado');
        source.bodies[ref] = await readFile(resolved, 'utf8');
      }
    }
  }
  return source;
}

export function createRepository(raw) {
  const settings = settingsSchema.parse(raw.settings);
  unique(settings.locales.map(l => l.code), 'idioma');
  unique(settings.excludedIds, 'exclusión');
  if (!settings.locales.some(l => l.code === settings.baseLocale && l.enabled)) fail('Idioma base no habilitado');
  for (const l of settings.locales) {
    Intl.getCanonicalLocales(l.tag);
    if (l.formatTag) Intl.getCanonicalLocales(l.formatTag);
    if (l.pluralTag) Intl.getCanonicalLocales(l.pluralTag);
    if (l.enabled && !Intl.DateTimeFormat.supportedLocalesOf([l.formatTag ?? l.tag]).length) fail(`Formato regional desconocido: ${l.code}`);
    if (l.enabled && !Intl.PluralRules.supportedLocalesOf([l.pluralTag ?? l.tag]).length) fail(`Reglas plurales no disponibles: ${l.code}; configurar pluralTag solo tras revisión lingüística`);
  }
  const entities = raw.entities.map(e => entitySchema.parse(e));
  unique(entities.map(e => e.id), 'entidad');
  const byId = new Map(entities.map(e => [e.id, e]));
  const selection = selectionSchema.parse(raw.selection);
  for (const [group, ids] of Object.entries(selection)) {
    unique(ids, group);
    for (const id of ids) if (byId.get(id)?.type !== groups[group]) fail(`Referencia inválida: ${group}/${id}`);
  }
  for (const [featured, collection] of [['featuredProjects', 'projects'], ['featuredWorks', 'works']]) {
    if (selection[featured].some(id => !selection[collection].includes(id))) fail(`Destacado fuera del catálogo: ${featured}`);
  }
  for (const entity of entities) {
    if (settings.excludedIds.includes(entity.id) && entity.visibility === 'public') fail(`Entidad aplazada: ${entity.id}`);
    unique(entity.relations.map(r => `${r.kind}:${r.target}`), `relaciones/${entity.id}`);
    for (const r of entity.relations) {
      if (!byId.has(r.target) || r.target === entity.id) fail(`Relación inválida: ${entity.id}/${r.target}`);
      if (r.kind === 'during' && (entity.type !== 'project' || byId.get(r.target).type !== 'experience')) fail('Relación during inválida');
      if (['demonstrates','discusses','assistedBy'].includes(r.kind) && byId.get(r.target).type !== 'term') fail('Relación demonstrates inválida');
      if (r.kind === 'parent' && (entity.type !== 'term' || byId.get(r.target).type !== 'term')) fail('Jerarquía inválida');
    }
  }
  const visited = new Set(), active = new Set();
  function visit(id) {
    if (active.has(id)) fail(`Ciclo jerárquico: ${id}`);
    if (visited.has(id)) return;
    active.add(id);
    for (const r of byId.get(id).relations.filter(r => r.kind === 'parent')) visit(r.target);
    active.delete(id); visited.add(id);
  }
  entities.forEach(e => visit(e.id));
  const editorial = {}, ui = structuredClone(raw.ui);
  const codes = new Set(settings.locales.map(l => l.code));
  for (const code of [...Object.keys(raw.editorial), ...Object.keys(ui)]) if (!codes.has(code)) fail(`Catálogo sin registro: ${code}`);
  if (!ui[settings.baseLocale]) fail('Diccionario base ausente');
  if (requiredUiKeys.some(key => !Object.hasOwn(ui[settings.baseLocale], key))) fail('Claves base obligatorias ausentes');
  for (const locale of settings.locales) {
    const code = locale.code;
    // Inactive catalogs may be incomplete while translators prepare them.
    if (locale.enabled) validateCatalog(ui[settings.baseLocale], ui[code], locale.pluralTag ?? locale.tag);
    const dict = raw.editorial[code];
    if (locale.enabled && !dict) fail(`Diccionario editorial ausente: ${code}`);
    editorial[code] = {};
    const routes = [];
    for (const [id, value] of Object.entries(dict ?? {})) {
      const entity = byId.get(id);
      if (!entity) fail(`Traducción sin entidad: ${id}`);
      const variant = editorialSchema.parse(value);
      if (entity.type !== 'work' && variant.chapters.length) fail('Capítulos fuera de una obra');
      unique(variant.chapters.map(c => c.id), `capítulos/${id}`);
      unique(variant.chapters.map(c => c.slug), `slugs de capítulos/${id}`);
      if (entity.type === 'work' && ['categorias'].includes(variant.slug)) fail('Slug reservado');
      for (const ref of [variant.bodyRef, ...variant.chapters.map(c => c.bodyRef)]) {
        if (!ref.startsWith(`${code}/`) || typeof raw.bodies[ref] !== 'string' || !raw.bodies[ref].trim()) fail(`Cuerpo ausente o idioma incorrecto: ${id}`);
      }
      editorial[code][id] = variant;
      const url = route(entity, code, variant);
      routes.push(url, ...variant.chapters.map(c => `${url}${c.slug}/`));
      const base = raw.editorial[settings.baseLocale]?.[id];
      if (code !== settings.baseLocale && base && variant.chapters.some(c => !base.chapters?.some(b => b.id === c.id))) fail(`Capítulo sin equivalencia base: ${id}`);
    }
    unique(routes, `rutas/${code}`);
  }
  for (const entity of entities) {
    if (!editorial[settings.baseLocale][entity.id]) fail(`Falta variante base: ${entity.id}`);
  }
  const bodies = structuredClone(raw.bodies);
  const eligible = (entity, locale, examples = false) => settings.locales.some(l => l.code === locale && l.enabled)
    && !settings.excludedIds.includes(entity.id)
    && (entity.visibility === 'public' || (examples && entity.visibility === 'example'))
    && editorial[locale]?.[entity.id]?.status === 'published';
  function entries(locale = settings.baseLocale, { includeExamples = false } = {}) {
    const accepted = entities.filter(e => eligible(e, locale, includeExamples));
    const acceptedIds = new Set(accepted.map(e => e.id));
    return accepted.map(e => {
      const v = editorial[locale][e.id], url = route(e, locale, v);
      return publicEntrySchema.parse({
        id: `${locale}:${e.id}`, entityId: e.id, locale, type: e.type, url,
        title: v.title, summary: v.summary, body: bodies[v.bodyRef], facts: e.facts,
        ...Object.fromEntries(['role', 'operationalStatus', 'startLabel'].filter(k => v[k] !== undefined).map(k => [k, v[k]])),
        seo: v.seo, example: e.visibility === 'example',
        relations: e.relations.filter(r => acceptedIds.has(r.target)).map(r => ({ ...r, url: route(byId.get(r.target), locale, editorial[locale][r.target]) })),
        chapters: v.chapters.map(c => ({ id: c.id, title: c.title, url: `${url}${c.slug}/`, body: bodies[c.bodyRef] })),
      });
    });
  }
  return {
    getSettings: () => structuredClone(settings),
    getCatalogs: () => structuredClone(ui),
    publicEntries: locale => entries(locale),
    // Explicit preview API. Never use this source for routes, search or exports.
    previewEntries: locale => entries(locale, { includeExamples: true }),
    select(group, locale = settings.baseLocale, { preview = false } = {}) {
      if (!Object.hasOwn(groups, group)) fail(`Selección desconocida: ${group}`);
      const items = new Map(entries(locale, { includeExamples: preview }).map(e => [e.entityId, e]));
      return selection[group].filter(id => items.has(id)).map(id => items.get(id));
    },
    resolve(entityId, locale) { return entries(locale).find(e => e.entityId === entityId)?.url ?? null; },
    alternatives(entityId) { return settings.locales.flatMap(l => { const url = this.resolve(entityId, l.code); return url ? [{ locale: l.code, label: l.label, url }] : []; }); },
  };
}

export async function loadRepository(root = defaultRoot) { return createRepository(await readSource(root)); }
