import { referenceSource } from './reference-fixture.mjs';
import { readSource, createRepository, defaultRoot } from './repository.mjs';
export const journeyPrefix = '/design-review/journey';
export const syntheticMarker = 'PT06-SYNTHETIC';
/** Build-only fixtures. Do not call without the isolated review flag. */
export async function loadJourney(root = defaultRoot) {
  if (process.env.DESIGN_REVIEW !== '1') throw new Error('Journey fixtures require review build');
  const raw = referenceSource(await readSource(root));
  raw.settings.locales.find(l => l.code === 'en').enabled = true;
  raw.settings.locales.find(l => l.code === 'en').dir = 'rtl';
  const expanded = value => `${syntheticMarker} ⟦${value} — ${value}⟧`;
  raw.ui.en = Object.fromEntries(Object.entries(raw.ui.es).map(([key,value]) => [key,
    typeof value === 'string' ? expanded(value) : Object.fromEntries(Object.entries(value).map(([form,text]) => [form,expanded(text)])),
  ]));
  // Only the project is available in the second locale. No false term equivalent.
  const variant = structuredClone(raw.editorial.es.pipila);
  variant.bodyRef = 'en/pipila.md'; variant.slug = 'translated-project';
  for (const key of ['title','summary','role','operationalStatus','startLabel']) variant[key] = expanded(variant[key]);
  variant.seo = {title:variant.title,description:variant.summary};
  raw.editorial.en = {pipila:variant};
  raw.bodies[variant.bodyRef] = `${syntheticMarker}\n\n${raw.bodies[raw.editorial.es.pipila.bodyRef]}`;
  const repository = createRepository(raw);
  const relocate = entry => ({...entry, url:journeyPrefix + entry.url,
    relations:entry.relations.map(r=>({...r,url:journeyPrefix+r.url})),
    chapters:entry.chapters.map(c=>({...c,url:journeyPrefix+c.url})),
  });
  return {...repository,
    publicEntries:locale=>repository.publicEntries(locale).map(relocate),
    select:(group,locale)=>repository.select(group,locale).map(relocate),
  };
}
