# Flowbite React + Vite Template

A starter template for building modern React applications with [Flowbite React](https://flowbite-react.com/) UI components, Tailwind CSS 4, and Vite.

## Tech Stack

- **React 19** with React Compiler for optimized rendering
- **TypeScript 6**
- **Vite 8** with HMR
- **Tailwind CSS 4** (Vite plugin)
- **Flowbite React** — pre-built accessible UI components
- **ESLint 10** + **Prettier** with Tailwind class sorting

## Prerequisites

- Node.js 24.14+
- npm 11+

## Getting Started

```bash
npm i
npm run dev
```

## Scripts

| Command                | Description                          |
| ---------------------- | ------------------------------------ |
| `npm run dev`          | Start development server             |
| `npm run build`        | Type-check and build for production  |
| `npm run preview`      | Preview the production build locally |
| `npm run lint`         | Run ESLint                           |
| `npm run format`       | Format code with Prettier            |
| `npm run format:check` | Check formatting without writing     |

## Project Structure

```
src/
├── App.tsx        — Main app component (landing page with dark mode toggle)
├── main.tsx       — Entry point
└── index.css      — Tailwind & Flowbite imports
```

## License

[MIT](LICENSE)
