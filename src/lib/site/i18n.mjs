export const requiredUiKeys = [
  "nav.home",
  "nav.projects",
  "nav.experience",
  "nav.works",
  "nav.about",
  "nav.contact",
  "nav.skipToContent",
  "locale.selectorLabel",
  "locale.unavailable",
  "locale.readBase",
  "search.label",
  "search.empty",
  "search.results",
  "contact.copyEmail",
  "contact.emailCopied",
  "reading.example",
  "reading.index",
  "reading.nextChapter",
  "reading.previousChapter",
  "a11y.openMenu",
  "a11y.closeMenu"
];

const categories = new Set(['zero', 'one', 'two', 'few', 'many', 'other']);
const own = (object, key) => Object.hasOwn(object, key);
const fail = message => { throw new Error(`[i18n] ${message}`); };
const parameters = text => [...new Set([...text.matchAll(/\{([a-zA-Z][\w]*)\}/g)].map(m => m[1]))].sort().join(',');

function signature(value, key) {
  const strings = typeof value === 'string' ? [value] : value && typeof value === 'object' && !Array.isArray(value) ? Object.values(value) : [];
  if (!strings.length || strings.some(s => typeof s !== 'string' || !s.trim())) fail(`Mensaje inválido: ${key}`);
  if (typeof value !== 'string' && (!own(value, 'other') || Object.keys(value).some(k => !categories.has(k)))) fail(`Plural inválido: ${key}`);
  if (strings.some(s => /[{}]/.test(s.replace(/\{[a-zA-Z][\w]*\}/g, '')))) fail(`Marcador inválido: ${key}`);
  const signatures = strings.map(parameters);
  if (new Set(signatures).size !== 1) fail(`Parámetros distintos entre plurales: ${key}`);
  return `${typeof value === 'string' ? 'text' : 'plural'}:${signatures[0]}`;
}

export function validateCatalog(base, catalog, tag) {
  if (!base || !catalog || Array.isArray(base) || Array.isArray(catalog)) fail('Catálogo inválido');
  if (Object.keys(base).sort().join('|') !== Object.keys(catalog).sort().join('|')) fail('Claves faltantes o desconocidas');
  for (const [key, value] of Object.entries(base)) {
    if (!/^[a-z][a-zA-Z0-9]*(\.[a-z][a-zA-Z0-9]*)+$/.test(key)) fail(`Clave no semántica: ${key}`);
    if (signature(value, key) !== signature(catalog[key], key)) fail(`Parámetros incompatibles: ${key}`);
    if (typeof catalog[key] !== 'string') {
      const required = new Intl.PluralRules(tag).resolvedOptions().pluralCategories;
      if (required.some(c => !own(catalog[key], c))) fail(`Formas plurales incompletas: ${key}`);
    }
  }
}

/** Returns plain text only. Render via Astro text expressions/textContent, never set:html/innerHTML. */
export function createTranslator(locale, catalogs, settings, options = {}) {
  const config = settings.locales.find(l => l.code === locale);
  if (!config) fail(`Idioma desconocido: ${locale}`);
  const { fallback = 'error', onDiagnostic = () => {} } = options;
  if (!['error', 'base'].includes(fallback)) fail('Política de fallback inválida');
  const base = catalogs[settings.baseLocale];
  if (!base) fail('Falta el catálogo base');
  return {
    locale, dir: config.dir,
    t(key, values = {}) {
      if (!own(base, key)) fail(`Clave desconocida: ${key}`);
      let message = catalogs[locale]?.[key];
      let tag = config.pluralTag ?? config.tag;
      if (message === undefined) {
        if (fallback !== 'base') fail(`Traducción ausente: ${locale}/${key}`);
        onDiagnostic({ code: 'missing-translation', locale, key });
        message = base[key];
        const baseLocale = settings.locales.find(l => l.code === settings.baseLocale);
        tag = baseLocale.pluralTag ?? baseLocale.tag;
      }
      if (typeof message !== 'string') {
        if (typeof values.count !== 'number' || !Number.isFinite(values.count)) fail(`Se requiere count numérico: ${key}`);
        message = message[new Intl.PluralRules(tag).select(values.count)] ?? message.other;
      }
      return message.replace(/\{([a-zA-Z][\w]*)\}/g, (_, name) => {
        if (!own(values, name) || !['string', 'number'].includes(typeof values[name]) || (typeof values[name] === 'number' && !Number.isFinite(values[name]))) fail(`Parámetro ausente o inválido: ${key}/${name}`);
        return String(values[name]);
      });
    },
    number(value, format = {}) { return new Intl.NumberFormat(config.formatTag ?? config.tag, format).format(value); },
    date(value, format = {}) { return new Intl.DateTimeFormat(config.formatTag ?? config.tag, { timeZone: 'UTC', ...format }).format(value); },
  };
}
