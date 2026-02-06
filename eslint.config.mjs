import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import gitignore from 'eslint-config-flat-gitignore';
import prettierConfig from 'eslint-config-prettier';
import astro from 'eslint-plugin-astro';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
// Note: eslint-plugin-tailwindcss is temporarily disabled until v4.x stable release
// which fully supports Tailwind CSS v4. The plugin can be re-enabled when compatible.
// import tailwind from 'eslint-plugin-tailwindcss';
import tseslint from 'typescript-eslint';

export default defineConfig(
  { name: 'gitignore', ...gitignore() },
  { name: 'eslint/recommended', ...eslint.configs.recommended },
  ...simpleImportSortPlugin(),
  ...tseslint.configs.recommended.map(withAstroFiles),
  {
    name: 'typescript-eslint/custom',
    rules: {
      '@typescript-eslint/no-empty-object-type': ['error', { allowInterfaces: 'with-single-extends' }],
    },
  },
  ...astro.configs.recommended,
  // ...tailwindPlugin(), // Temporarily disabled - incompatible with Tailwind CSS v4
  { name: 'prettier', ...prettierConfig }, // Must be the last one.
);

function withAstroFiles(config) {
  if (config.files && !config.files.includes('**/*.astro')) {
    config.files?.push('**/*.astro');
  }
  return config;
}

function simpleImportSortPlugin() {
  return [
    {
      name: 'simple-import-sort',
      plugins: {
        'simple-import-sort': simpleImportSort,
      },
      rules: {
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',
      },
    },
  ];
}

// Tailwind ESLint plugin is temporarily disabled until a stable v4.x release
// that fully supports Tailwind CSS v4. Uncomment when compatible.
// function tailwindPlugin() {
//   return [
//     ...tailwind.configs['flat/recommended'],
//     {
//       name: 'tailwindcss:settings',
//       settings: {
//         tailwindcss: {
//           config: 'src/styles/tailwind.css',
//           callees: ['cn'],
//         },
//       },
//     },
//   ];
// }
