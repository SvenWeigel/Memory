# Memory Game

A browser-based memory game with two themes (Code/Food), configurable board size, and a two-player score system.

## Features

- Settings page with options for:
  - Theme (`Code vibes theme` or `Food theme`)
  - Starting player (`Blue` or `Orange`)
  - Board size (`16`, `24`, or `36` cards)
- Live preview on the settings page
- Persistent selections via `localStorage`
- Game page with:
  - Scoreboard for both players
  - Current player indicator
  - Exit overlay
  - Game-over overlay with final score
  - End overlay showing the winner
- Theme-specific visuals (including icons and styling for the Food theme)

## Tech Stack

- TypeScript
- SCSS (Sass)
- Vite

## Prerequisites

- Node.js (recommended: latest LTS version)
- npm

## Installation

```bash
npm install
```

## Start Development

```bash
npm run dev
```

Vite will then display a local URL (for example: `http://localhost:5173`).

## Build

```bash
npm run build
```

## Preview Build Locally

```bash
npm run preview
```

## Game Flow

1. Click `Play` on the start page.
2. In Settings, choose a theme, starting player, and card count.
3. `Start` becomes active once one option is selected in each group.
4. In the game, players take turns revealing cards.
5. A match gives one point, and the same player continues.
6. When all pairs are found, the game-over overlay appears first, followed by the end overlay with the winner.

## Project Structure (Excerpt)

```text
src/
  main.ts
  pages/
    game.html
    settings.html
  scripts/
    cards.ts
    game.ts
    gameHelpers.ts
    settings.ts
  styles/
    style.scss
    pages/
      _game.scss
      _settings.scss
public/
  assets/
```

## Relevant Files

- Start page entry: `src/main.ts`
- Settings logic: `src/scripts/settings.ts`
- Game logic: `src/scripts/game.ts`
- Extracted helpers: `src/scripts/gameHelpers.ts`
- Game markup: `src/pages/game.html`
- Settings markup: `src/pages/settings.html`
- Game styling: `src/styles/pages/_game.scss`

## Notes

- Theme, starting player, and card count are stored in `localStorage`.
- The game currently supports two players (`Blue` and `Orange`).