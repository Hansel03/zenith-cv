import type { AstroGlobal } from 'astro';
import type { CollectionEntry } from 'astro:content';
import { getEntry } from 'astro:content';

import type { ContextSlice } from '@/types/context';
import { getGlobalContext } from '@/utils/get-global-context';

/**
 * Collection names that support internationalization (i18n).
 * These collections can have entries with locale suffixes (e.g., 'entry-id-es').
 */
type LocalizableCollection = 'skills' | 'jobs' | 'achievements' | 'education' | 'favorites' | 'interests';

/**
 * Generic helper function to retrieve a localized content entry.
 * Attempts to fetch the Spanish version if locale is 'es', otherwise falls back to English.
 *
 * @param astro - The Astro global object
 * @param collection - The content collection name
 * @param id - The entry ID without locale suffix
 * @returns The localized content entry
 * @throws Error if no entry is found for the given ID
 */
async function getLocalizedEntry<T extends LocalizableCollection>(
  astro: AstroGlobal,
  collection: T,
  id: string,
): Promise<CollectionEntry<T>> {
  const context = getGlobalContext<ContextSlice<'locale'>>(astro);

  // Attempt to fetch Spanish version if locale is Spanish
  if (context.locale.code === 'es') {
    const localizedSlug = `${id}-es` as CollectionEntry<T>['slug'];
    const esEntry = await getEntry(collection, localizedSlug);

    if (esEntry) {
      return esEntry;
    }
  }

  // Fallback to English (base) version
  const baseSlug = id as CollectionEntry<T>['slug'];
  const baseEntry = await getEntry(collection, baseSlug);

  // Throw error if no entry exists
  if (!baseEntry) {
    throw new Error(`Content entry not found: collection="${collection}", id="${id}", locale="${context.locale.code}"`);
  }

  return baseEntry;
}

/**
 * Gets the translation function from the global context.
 *
 * @param astro - The Astro global object
 * @returns The i18next translation function
 *
 * @example
 * ```astro
 * ---
 * const t = getTranslation(Astro);
 * ---
 * <h1>{t('welcome')}</h1>
 * ```
 */
export function getTranslation(astro: AstroGlobal) {
  const context = getGlobalContext<ContextSlice<'i18n'>>(astro);
  return context.i18n.t;
}

/**
 * Gets a localized skill entry based on the current locale.
 * Falls back to English if Spanish version doesn't exist.
 *
 * @param astro - The Astro global object
 * @param id - The skill ID (without locale suffix)
 * @returns Promise resolving to the localized skill entry
 * @throws Error if the entry doesn't exist
 *
 * @example
 * ```astro
 * <Skill entry={getLocalizedSkill(Astro, 'typescript')} />
 * ```
 */
export async function getLocalizedSkill(astro: AstroGlobal, id: string) {
  return getLocalizedEntry(astro, 'skills', id);
}

/**
 * Gets a localized job entry based on the current locale.
 * Falls back to English if Spanish version doesn't exist.
 *
 * @param astro - The Astro global object
 * @param id - The job ID (without locale suffix)
 * @returns Promise resolving to the localized job entry
 * @throws Error if the entry doesn't exist
 *
 * @example
 * ```astro
 * <Job entry={getLocalizedJob(Astro, 'senior-developer')} />
 * ```
 */
export async function getLocalizedJob(astro: AstroGlobal, id: string) {
  return getLocalizedEntry(astro, 'jobs', id);
}

/**
 * Gets a localized achievement entry based on the current locale.
 * Falls back to English if Spanish version doesn't exist.
 *
 * @param astro - The Astro global object
 * @param id - The achievement ID (without locale suffix)
 * @returns Promise resolving to the localized achievement entry
 * @throws Error if the entry doesn't exist
 *
 * @example
 * ```astro
 * <Achievement entry={getLocalizedAchievement(Astro, 'award-2024')} />
 * ```
 */
export async function getLocalizedAchievement(astro: AstroGlobal, id: string) {
  return getLocalizedEntry(astro, 'achievements', id);
}

/**
 * Gets a localized education entry based on the current locale.
 * Falls back to English if Spanish version doesn't exist.
 *
 * @param astro - The Astro global object
 * @param id - The education ID (without locale suffix)
 * @returns Promise resolving to the localized education entry
 * @throws Error if the entry doesn't exist
 *
 * @example
 * ```astro
 * <Education entry={getLocalizedEducation(Astro, 'bachelor-degree')} />
 * ```
 */
export async function getLocalizedEducation(astro: AstroGlobal, id: string) {
  return getLocalizedEntry(astro, 'education', id);
}

/**
 * Gets a localized favorite entry based on the current locale.
 * Falls back to English if Spanish version doesn't exist.
 *
 * @param astro - The Astro global object
 * @param id - The favorite ID (without locale suffix)
 * @returns Promise resolving to the localized favorite entry
 * @throws Error if the entry doesn't exist
 *
 * @example
 * ```astro
 * <Favorite entry={getLocalizedFavorite(Astro, 'favorite-tool')} />
 * ```
 */
export async function getLocalizedFavorite(astro: AstroGlobal, id: string) {
  return getLocalizedEntry(astro, 'favorites', id);
}

/**
 * Gets a localized interest entry based on the current locale.
 * Falls back to English if Spanish version doesn't exist.
 *
 * @param astro - The Astro global object
 * @param id - The interest ID (without locale suffix)
 * @returns Promise resolving to the localized interest entry
 * @throws Error if the entry doesn't exist
 *
 * @example
 * ```astro
 * <Interest entry={getLocalizedInterest(Astro, 'photography')} />
 * ```
 */
export async function getLocalizedInterest(astro: AstroGlobal, id: string) {
  return getLocalizedEntry(astro, 'interests', id);
}
