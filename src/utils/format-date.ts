import type { AstroGlobal } from 'astro';
import { format } from 'date-fns';

import type { ContextSlice } from '@/types/context';

import { getGlobalContext } from './get-global-context';

function isMidnightUtc(date: Date) {
  return (
    date.getUTCHours() === 0 &&
    date.getUTCMinutes() === 0 &&
    date.getUTCSeconds() === 0 &&
    date.getUTCMilliseconds() === 0
  );
}

function normalizeDateOnlyToLocal(date: Date) {
  if (!isMidnightUtc(date)) return date;

  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

/** Parses given date to a string based on configuration stored in the global context. */
export function formatDate(date: Date, astro: AstroGlobal) {
  const context = getGlobalContext<ContextSlice<'locale' | 'dateFormat'>>(astro);

  return format(normalizeDateOnlyToLocal(date), context.dateFormat, { locale: context.locale });
}
