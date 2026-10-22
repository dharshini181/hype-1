# HITS Arcade — touchscreen arcade (10 games)
React + TypeScript + Vite + Tailwind + Framer Motion. No login, no sign-up, no backend. Name and scores are stored in the browser (localStorage).

Games: Pattern Memory, Jigsaw Puzzle, Quiz Time, Spin Wheel, Connecting Dots, Crossword, Matching Pairs, Number Guess, Tic-Tac-Toe, Bubble Burst.

## How it works
- The app opens on the lobby with all 10 games on a CRT screen and an arcade control deck (joystick, round buttons, coin slot).
- **Every time a game is opened it asks for a player name** (the last name is pre-filled). The score is saved with that name.
- **Each game has its own ranked leaderboard**, shown on the game's start screen and the results screen (best score per player, ties go to whoever got there first). The lobby only shows current champions.
- Results screen buttons: Play again (same player), **Next player** (asks for a new name), All games.
- Deck buttons: Games / Scores / More tabs (the joystick cycles them), plus lit **SFX**, **MUSIC** and **FULL** screen buttons. Music is a looping chiptune made with the Web Audio API (off by default, no audio files).
- Touch-first: large tap targets, no pinch-zoom, safe-area aware, installable full screen.

## Colour palette (strict)
`#FF69B4` hot pink · `#FF1493` deep pink · `#FF00FF` magenta · `#FF4500` orange-red · `#FFD700` gold.
Only dark magenta-black surfaces (`night`, `panel`) and near-white text (`snow`) are used besides these. Tokens live in `tailwind.config.js`.

## Graphics
All artwork is SVG vector: game icons, UI icons, Matching Pairs symbols, jigsaw pictures, spin wheel, marquee, backdrop shapes. No emoji or bitmap images.

## Run
    npm install
    npm run dev       # http://localhost:5173
    npm test          # unit tests for every game's rules
    npm run build     # typecheck + production build to dist/

## Deploy on Vercel
Import the folder (or run `vercel`). Preset: Vite, build `npm run build`, output `dist`. `vercel.json` adds the SPA fallback.
