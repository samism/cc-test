# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `bun dev` - Start development server (http://localhost:5173)
- `bun run build` - Type-check and build for production
- `bun run lint` - Run ESLint
- `bun run preview` - Preview production build

## Tech Stack

- React 19 with TypeScript
- Vite 7 for bundling and dev server
- Bun as package manager and runtime
- ESLint with TypeScript and React hooks plugins

## Architecture

This is a minimal React SPA template. Entry point is `src/main.tsx` which renders `App.tsx` into the root element. Global styles are in `src/index.css`, component styles in `src/App.css`.
