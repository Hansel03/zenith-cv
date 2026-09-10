// Persists .icon-cache/ (see src/components/icon/icons-store.ts) between Netlify
// builds so remote icon SVGs are only fetched once, not on every deploy.
const CACHE_DIR = '.icon-cache';

export const onPreBuild = async ({ utils }) => {
  await utils.cache.restore(CACHE_DIR);
};

export const onPostBuild = async ({ utils }) => {
  await utils.cache.save(CACHE_DIR);
};
