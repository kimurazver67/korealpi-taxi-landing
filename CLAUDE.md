# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

KoreaLPI Taxi Landing is a React-based landing page for a taxi business car import service. The site is in Russian and targets taxi operators looking to import LPI (Liquefied Petroleum Injection) vehicles from South Korea.

## Commands

- `npm install` - Install dependencies
- `npm run dev` - Start development server (runs on http://localhost:3000)
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Architecture

This is a single-page React application with all components in one file ([App.tsx](App.tsx)).

**Tech Stack:**
- React 19 with TypeScript
- Vite for bundling
- Tailwind CSS (loaded via CDN in index.html)
- Recharts for data visualization
- Lucide React for icons

**Key Patterns:**
- All components are functional React components using hooks (useState, useEffect, useRef)
- Styling uses Tailwind utility classes with custom CSS variables defined in index.html (--accent, --bg-deep)
- Custom `.glass` and `.text-gradient` CSS classes are defined in index.html for glassmorphism effects
- Path alias `@/*` maps to project root

**Components in App.tsx:**
- Navbar - Fixed navigation with scroll behavior
- Hero - Countdown timer to March 1st deadline
- ProblemBento - Problem/solution bento grid layout
- BenefitsScroll - LPI benefits with fuel cost comparison chart
- CatalogSection - Car model cards (MODELS constant)
- StepsTimeline - 4-step process timeline
- ModernLeadForm - Contact form with submission state
- FloatingIsland - Fixed bottom-right chat widget
- Footer

**Data Constants:**
- `MODELS` - Array of car model objects with specs and pricing
- `FUEL_DATA` - Fuel cost comparison data for the bar chart

## Environment

Set `GEMINI_API_KEY` in `.env.local` (required if using Gemini API features).
