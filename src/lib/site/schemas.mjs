import { z } from 'astro/zod';

const id = z.string().regex(/^[a-z][a-z0-9-]*$/);
const text = z.string().trim().min(1);
const date = z.string().refine(value => {
  if (!/^\d{4}(-\d{2}(-\d{2})?)?$/.test(value)) return false;
  const normalized = value.length === 4 ? `${value}-01-01` : value.length === 7 ? `${value}-01` : value;
  const parsed = new Date(`${normalized}T00:00:00Z`);
  return Number.isFinite(+parsed) && parsed.toISOString().startsWith(normalized);
}, 'Fecha inválida; usar YYYY, YYYY-MM o YYYY-MM-DD');
// Compare possible date ranges without inventing day/month precision in the data.
const periodIsValid = ({ start, end }) => {
  if (end === null) return true;
  const earliestStart = start.length === 4 ? `${start}-01-01` : start.length === 7 ? `${start}-01` : start;
  const latestEnd = end.length === 4 ? `${end}-12-31` : end.length === 7 ? `${end}-31` : end;
  return latestEnd >= earliestStart;
};
export const localeSchema = z.object({
  code: id, label: text, tag: text, formatTag: text.optional(), pluralTag: text.optional(), dir: z.enum(['ltr', 'rtl']), enabled: z.boolean(),
}).strict();
export const settingsSchema = z.object({
  baseLocale: id, locales: z.array(localeSchema).min(1),
  excludedIds: z.array(id),
}).strict();
const channelUrl = text.refine(value => {
  try {
    const url = new URL(value);
    return ['https:', 'mailto:'].includes(url.protocol) && !url.username && !url.password && !/[\s\u0000-\u001f]/.test(value);
  } catch { return false; }
}, 'URL de canal inválida');
export const shellChannelsSchema = z.object({
  email: z.email(),
  profiles: z.array(z.object({
    key: z.string().regex(/^profile\.[a-z][a-zA-Z0-9]*$/),
    url: z.string().refine(value => value === value.trim(), 'URL sin espacios externos').pipe(channelUrl).refine(value => value.startsWith('https://'), 'Perfil HTTPS requerido'),
  }).strict()),
}).strict();
export const editionSchema = z.object({
  locale: id, label: text, format: z.enum(['pdf','epub']),
  url: z.string().regex(/^\/books\/[a-z0-9-]+\/[a-z0-9-]+\.(pdf|epub)$/),
}).strict().refine(e=>e.url.endsWith('.'+e.format),'Formato de descarga incorrecto');
const workFacts = z.object({
  format: z.enum(['essay','fiction','book','series','poetry','technical','critique','personal','editorial','humor']), author: text.nullable(),
  fullText: z.boolean().optional(), partial: z.boolean().optional(), category: id.optional(), series: id.optional(),
  sourceUrl: channelUrl.refine(value=>value.startsWith('https://'),'Fuente HTTPS requerida').optional(),
  year: z.number().int().min(1).max(9999).optional(), license: text.optional(),
  licenseUrl: channelUrl.refine(value=>value.startsWith('https://'),'Licencia HTTPS requerida').optional(),
  artwork: z.string().regex(/^\/books\/[a-z0-9-]+\/[a-z0-9-]+\.(png|jpg|webp)$/).optional(),
  editions: z.array(editionSchema).default([]),
}).strict().refine(f=>new Set(f.editions.map(e=>e.locale+':'+e.format)).size===f.editions.length,'Edición duplicada');
export const chapterSchema = z.object({entityId:id,locale:id,chapterId:id,url:text,title:text,body:z.string()}).strict();
const common = {
  id, visibility: z.enum(['public', 'draft', 'deferred', 'example']),
  relations: z.array(z.object({ target: id, kind: z.enum(['demonstrates', 'during', 'related', 'parent', 'discusses', 'assistedBy']) }).strict()).default([]),
};
export const entitySchema = z.discriminatedUnion('type', [
  z.object({ ...common, type: z.literal('profile'), facts: z.object({ name: text, alias: text }).strict() }).strict(),
  z.object({ ...common, type: z.literal('channel'), facts: z.object({ href: channelUrl }).strict() }).strict(),
  z.object({ ...common, type: z.literal('project'), facts: z.object({ start: date.optional(), technologies: z.array(text), presentation: z.enum(['case', 'brief']).default('case') }).strict() }).strict(),
  z.object({ ...common, type: z.literal('experience'), facts: z.object({ organization: text, start: date, end: date.nullable() }).strict().refine(periodIsValid, 'Periodo invertido') }).strict(),
  z.object({ ...common, type: z.literal('work'), facts: workFacts }).strict(),
  z.object({ ...common, type: z.literal('term'), facts: z.object({ family: z.enum(['topic', 'technology', 'capability', 'sector', 'genre']) }).strict() }).strict(),
]);
const bodyRef = z.string().regex(/^[a-z0-9][a-z0-9/-]*\.md$/).refine(s => !s.includes('//'), 'Referencia inválida');
export const editorialSchema = z.object({
  status: z.enum(['draft', 'published']), slug: id, title: text, summary: text,
  role: text.optional(), operationalStatus: text.optional(), startLabel: text.optional(),
  seo: z.object({ title: text, description: text }).strict(), bodyRef,
  chapters: z.array(z.object({ id, slug: id, title: text, bodyRef }).strict()).default([]),
}).strict();
export const selectionSchema = z.object({
  profiles: z.array(id).default([]), channels: z.array(id).default([]),
  projects: z.array(id), experience: z.array(id), works: z.array(id), terms: z.array(id),
  featuredProjects: z.array(id), featuredWorks: z.array(id),
}).strict();
export const publicEntrySchema = z.object({
  id: text, entityId: id, locale: id, type: z.enum(['project', 'experience', 'work', 'term', 'profile', 'channel']),
  url: text, title: text, summary: text, body: z.string(),
  facts: z.union([
    z.object({ name: text, alias: text }).strict(),
    z.object({ href: channelUrl }).strict(),
    z.object({ start: date.optional(), technologies: z.array(text), presentation: z.enum(['case', 'brief']).default('case') }).strict(),
    z.object({ organization: text, start: date, end: date.nullable() }).strict(),
    workFacts,
    z.object({ family: z.enum(['topic', 'technology', 'capability', 'sector', 'genre']) }).strict(),
  ]),
  role: text.optional(), operationalStatus: text.optional(), startLabel: text.optional(),
  seo: z.object({ title: text, description: text }).strict(),
  relations: z.array(z.object({ target: id, kind: text, url: text }).strict()),
  chapters: z.array(z.object({ id, title: text, url: text, body: z.string() }).strict()),
  example: z.boolean(),
}).strict();
