import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import type { AstroGlobal } from 'astro';
import { nanoid } from 'nanoid';

import type { ContextSlice } from '@/types/context';
import { getGlobalContext } from '@/utils/get-global-context';

const CACHE_DIR = join(process.cwd(), '.icon-cache');

/**
 * Store used for server icons. Allows to:
 * - avoid fetching the same icon multiple times,
 * - reuse same icon markup based on its key.
 */
export const iconsStore = createIconsStore();

function createIconsStore() {
  const id = nanoid(8);

  async function get(set: string, icon: string, astro: AstroGlobal) {
    const context = getGlobalContext<ContextSlice<'iconStore'>>(astro);
    const key = `${set}:${icon}-${id}`;

    if (context.iconStore.has(key)) {
      return { key, isFirst: false, element: await context.iconStore.get(key)! };
    }

    context.iconStore.set(key, fetchIcon(set, icon));

    return { key, isFirst: true, element: await context.iconStore.get(key)! };
  }

  return { get };
}

async function fetchIcon(set: string, icon: string) {
  const cached = await readCachedIcon(set, icon);
  if (cached) return cached;

  const path = `${set}/${icon}.svg`;

  const source1 = await safeFetch(`https://api.iconify.design/${path}`);
  if (source1.result) return cacheIcon(set, icon, source1.result);

  const source2 = await safeFetch(`https://api.simplesvg.com/${path}`);
  if (source2.result) return cacheIcon(set, icon, source2.result);

  const source3 = await safeFetch(`https://api.unisvg.com/${path}`);
  if (source3.result) return cacheIcon(set, icon, source3.result);

  throw new Error(`Cannot fetch icon: ${set}:${icon}. Error: ${source1.error}`);
}

function getCachePath(set: string, icon: string) {
  return join(CACHE_DIR, `${set}__${icon}.svg`);
}

async function readCachedIcon(set: string, icon: string) {
  try {
    return await readFile(getCachePath(set, icon), 'utf-8');
  } catch {
    return null;
  }
}

async function cacheIcon(set: string, icon: string, content: string) {
  try {
    await mkdir(CACHE_DIR, { recursive: true });
    await writeFile(getCachePath(set, icon), content);
  } catch {
    // Caching is best-effort; a write failure shouldn't break the build.
  }

  return content;
}

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 500;

async function safeFetch(url: string) {
  for (let attempt = 0; ; attempt++) {
    try {
      const response = await fetch(url);

      if (response.ok) {
        return { result: await response.text(), error: null };
      }

      if (response.status !== 429 || attempt === MAX_RETRIES) {
        return { result: null, error: response.statusText };
      }
    } catch (error) {
      if (!(error instanceof Error)) throw error;

      return { result: null, error: error.message };
    }

    const delayMs = BASE_DELAY_MS * 2 ** attempt + Math.random() * BASE_DELAY_MS;
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
}
