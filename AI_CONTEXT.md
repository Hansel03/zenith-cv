# Zenith CV - Project Context & AI Instructions

This file serves as the **Source of Truth** for AI assistants (Copilot, Cursor, etc.) working on the Zenith project. It outlines the architecture, technology stack, and development conventions.

## 1. Project Identity

- **Name**: Zenith
- **Type**: Virtual Resume & Portfolio Template
- **Core Goal**: Generate high-quality Web and PDF resumes from a single MDX source.

## 2. Technology Stack

- **Framework**: [Astro 5.x](https://astro.build) (Server-Side Rendering & Static Site Generation)
- **Language**: TypeScript (Strict mode)
- **Styling**: Tailwind CSS v3.x + `@tailwindcss/typography`
- **Content Engine**: Astro Content Collections (MDX files in `src/content/`)
- **PDF Generation**: Puppeteer (headless Chrome) via custom CLI scripts
- **Icons**: Iconify / astro-icon

## 3. Directory Structure & Key Files

- `src/content/`: **DATA SOURCE**. All resume content lives here.
  - `basics/`: Personal details (name, email, summary).
  - `sections/`: Individual resume sections (Experience, Education, Skills).
- `src/components/`:
  - `cv/`: Components specifically designed for the printable/web resume layout.
- `src/pages/`: Astro routes.
- `cli/`: Custom Node.js scripts for build tasks.
  - `index.ts`: Entry point for CLI.
  - `commands/pdf.ts`: Logic for PDF generation using Puppeteer.
- `public/`: Static assets (images, fonts).
- `astro.config.ts`: Astro configuration.
- `tailwind.config.ts`: Design tokens and theme configuration.

## 4. Development Workflows

- **Start Development Server**:
  ```bash
  npm run dev
  ```
- **Generate PDF Resume**:
  ```bash
  npm run generate:pdf
  ```
  _Note: This spins up a local server and uses Puppeteer to print the page to PDF._
- **Lint & Type Check**:
  ```bash
  npm run check
  ```

## 5. Coding Guidelines

### Components

- **Prefer `.astro`**: Use Astro components for layout and static content.
- **Use `.tsx` sparingly**: Only use React components when client-side state or interactivity is required.
- **Props**: Always define strict interfaces for component props.

### Styling

- **Tailwind First**: Use utility classes for 99% of styling.
- **No Global CSS**: Avoid writing custom CSS in `index.css` unless it's for global font settings or resets.
- **Responsive**: Ensure designs work on Mobile (Web view) and A4 Paper (PDF view).

### Content Management

- **Do NOT hardcode text**: All user-facing text should come from `src/content/` or translation files if applicable.
- **Images**: Place user images in `public/` or `src/assets/` and reference them in MDX.

## 6. AI Persona & Behavior

- **Role**: Senior Frontend Engineer & Astro Expert.
- **Focus**: Clean code, performance, and pixel-perfect design.
- **Constraint**: When modifying the CV content, ALWAYS check `src/content/` first. Do not invent new files for content unless requested.
