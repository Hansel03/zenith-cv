# AGENTS.md - Developer Guide for AI Coding Agents

This document provides essential information for AI coding agents working on the Zenith CV project.

## Project Overview

Zenith is an Astro-based template for creating professional web and PDF resumes. Content is managed through Astro Content Collections in `src/content/`, and the project generates both interactive web versions and printable PDFs from the same source.

## Build & Development Commands

### Core Commands

```bash
npm run dev              # Start dev server at http://localhost:4321
npm run build            # Build for production (runs CLI build command)
npm run preview          # Preview production build
npm run check            # Run all checks (ESLint, Astro, Prettier)
npm run format           # Format code with Prettier
```

### Generation Commands

```bash
npm run generate:pdf           # Generate PDF resume (requires dev server)
npm run generate:pdf:watch     # Auto-regenerate PDF on changes
npm run generate:og            # Generate Open Graph images
npm run generate:og:watch      # Auto-regenerate OG images
npm run generate:favicons      # Generate favicon variants
npm run update:colors          # Update color theme
```

### Testing

**Note**: This project does not currently have a test suite. No Jest, Vitest, or other test runners are configured.

### Linting & Type Checking

```bash
eslint .                 # Lint JavaScript/TypeScript files
astro check              # Type-check Astro components
prettier --check .       # Check formatting
```

## Code Style Guidelines

### General Formatting

- **Indentation**: 2 spaces (enforced by .editorconfig)
- **Line length**: 120 characters max
- **Quotes**: Single quotes for strings
- **Trailing commas**: Always use them
- **Line endings**: LF (Unix-style)
- **Final newline**: Required in all files

### Import Organization

Imports are automatically sorted by `eslint-plugin-simple-import-sort`:

1. Node built-in modules (e.g., `node:fs`, `node:path`)
2. External dependencies (e.g., `astro`, `react`)
3. Internal imports with `@/` alias
4. Relative imports

Example:

```typescript
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import chalk from 'chalk';
import { execa } from 'execa';

import type { IconProps } from '@/types/icon-props';
import { cn } from '@/utils/cn';

import { LocalComponent } from './local-component';
```

### TypeScript

- **Strictness**: Uses Astro's strictest tsconfig preset
- **Type imports**: Use `import type` for type-only imports
- **Path aliases**: Use `@/*` for `src/*` imports
- **No `any`**: Avoid using `any` type; prefer `unknown` or proper typing
- **Interface vs Type**: Prefer `type` for unions and intersections, `interface` for object shapes

### Naming Conventions

- **Files**: kebab-case (e.g., `date-range.astro`, `format-date.ts`)
- **Components**: PascalCase for component names in code
- **Variables/Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE for true constants (e.g., `SERVER_URL`)
- **Types/Interfaces**: PascalCase, suffix interfaces with `Props` for component props

### Astro Components

```astro
---
// Frontmatter: TypeScript logic
import type { IconProps } from '@/types/icon-props';
import { cn } from '@/utils/cn';

interface Props extends IconProps {
  name: string;
  loading?: 'lazy' | 'eager';
}

const { name, loading = 'lazy', ...props } = Astro.props;
---

<!-- Template: HTML-like markup -->
<div class={cn('base-class', props.class)}>
  <slot />
</div>
```

### Styling with Tailwind

- **Version**: Tailwind CSS v4.x via `@tailwindcss/vite` plugin
- **Configuration**: CSS-first entry point at `src/styles/tailwind.css` with legacy config loaded via `@config` directive
- **Utility-first**: Prefer Tailwind utilities over custom CSS
- **Class merging**: Use `cn()` utility from `@/utils/cn` for conditional classes
- **Custom colors**: Use semantic color tokens from `tailwind.config.ts`
  - `color-primary`, `color-text-title`, `color-bg-card`, etc.
  - CSS variables defined in `src/styles/colors/` components
- **Responsive**: Mobile-first approach, use `sm:`, `md:`, `lg:` prefixes
- **Dark mode**: Use `dark:` prefix (dark mode is selector-based, default in v4)
- **@apply in scoped styles**: Requires `@reference` directive pointing to the Tailwind CSS file

Example:

```typescript
import { cn } from '@/utils/cn';

const className = cn('base-class', 'text-color-text-primary', isActive && 'bg-color-primary', props.className);
```

### Error Handling

- **CLI scripts**: Use try-catch and log errors with `chalk`-colored messages
- **Functions**: Prefer explicit error returns or throws over silent failures
- **Async operations**: Always handle promise rejections

Example from CLI helpers:

```typescript
export const log = {
  info: (message: string) => console.log(chalk.blue(`[INFO] ${message}`)),
  success: (message: string) => console.log(chalk.green(`[SUCCESS] ${message}`)),
  error: (message: string) => console.error(chalk.red(`[ERROR] ${message}`)),
};
```

### Content Collections

- **Location**: All content lives in `src/content/`
- **Schema**: Defined in `src/content/config.ts` using Zod
- **Collections**: `achievements`, `basics`, `education`, `favorites`, `interests`, `jobs`, `metadata`, `skills`, `translations`
- **Never hardcode**: User-facing content must come from content collections

### Component Patterns

- **Prop destructuring**: Destructure props in frontmatter with defaults
- **Slot usage**: Use `<slot />` for children content
- **Type safety**: Always define `interface Props` for component props
- **Icon loading**: Use `loading="lazy"` for web, `loading="eager"` for PDF

### Utilities

- **cn()**: Merge Tailwind classes with conflict resolution
- **joinNonEmpty()**: Join non-empty strings with separator
- **getLoadingStrategy()**: Determine lazy/eager loading based on context

## Project Structure

```
zenith-cv/
├── cli/                    # CLI commands for PDF/OG generation
│   ├── commands/           # Individual command implementations
│   ├── helpers.ts          # Shared CLI utilities
│   └── index.ts            # CLI entry point
├── src/
│   ├── assets/             # Processed assets (images, etc.)
│   ├── components/         # Reusable Astro components
│   ├── content/            # Content collections (DATA SOURCE)
│   ├── icons/              # Local SVG icons
│   ├── pages/              # Astro routes
│   ├── pdf/                # PDF-specific components/utils
│   ├── styles/             # Global styles and color definitions
│   │   ├── tailwind.css    # Tailwind CSS v4 entry point
│   │   ├── colors/         # Color theme CSS variables
│   │   └── fonts/          # Font definitions
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── web/                # Web-specific components/utils
├── public/                 # Static assets (served as-is)
├── astro.config.ts         # Astro configuration (includes @tailwindcss/vite plugin)
├── tailwind.config.ts      # Tailwind theme configuration (legacy format)
├── eslint.config.mjs       # ESLint configuration
├── prettier.config.mjs     # Prettier configuration
└── tsconfig.json           # TypeScript configuration
```

## Important Notes

1. **No Tests**: This project doesn't have automated tests. Manual testing via dev server is required.
2. **PDF Generation**: Requires running dev server first (`npm run dev`), then run `npm run generate:pdf` in a separate terminal.
3. **Content First**: Always check `src/content/` before creating new content files.
4. **Type Safety**: Leverage Astro's type checking with `astro check` command.
5. **CLI Context**: The `cli/` directory contains Node.js scripts that use Puppeteer and other Node APIs.
6. **Responsive Design**: Web view must work on mobile; PDF view must fit A4 paper.

## AI Assistant Persona

When working on this codebase:

- Act as a Senior Frontend Engineer with Astro expertise
- Prioritize clean, maintainable code over clever solutions
- Always respect the existing code style and patterns
- Check content collections before suggesting hardcoded content
- Consider both web and PDF contexts when making changes
- Use TypeScript strictly without escape hatches
