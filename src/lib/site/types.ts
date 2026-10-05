import type { CollectionEntry } from 'astro:content';
export type PublicEntry = CollectionEntry<'siteContent'>['data'];
export interface SiteRoute {
  id: string;
  locale: string;
  url: string;
  section: string;
  label?: string;
  title?: string;
  entityId?: string;
  legacy?: boolean;
  chapterId?: string;
  parentUrl?: string;
  parentTitle?: string;
}
