# Vidya — AI Educator (frontend prototype)

Human-like AI teacher UI for the AI Innovation Hackathon challenge: upload material or a topic, review a lesson plan, sit in a video classroom, answer check-ins, take an assessment, and read a learning report.

This repository is **frontend only**. Lesson plans, avatar/voice, RAG, scores, and auth are **mocked**. No backend, payments, or live APIs.

## Requirements from the brief (mapped to screens)

| Requirement | Where in the UI |
| --- | --- |
| Upload books / PDF / notes / PPT | `/app/learn`, `/app/library` |
| Topic-based teaching | `/app/learn` (topic mode) |
| AI lesson structure | `/app/plan/:id` |
| Personalisation (level, time, language, style) | Onboarding, learn wizard, settings |
| Human-like loop (explain → question → adapt) | `/app/classroom/:id` |
| Video + avatar + voice (simulated) | Classroom stage |
| Subject-aware visuals | Whiteboard (circuit, formula, graph, code, timeline, biology) |
| Multilingual (incl. Hindi ↔ English) | Language switch in classroom |
| Assessment + report | `/app/assess/:id`, `/app/report/:id` |
| Learning profile & path | `/app/progress`, `/app/path` |
| Advanced extras | Teachers, flashcards, notes, 7-day revision planner |

## Run locally

You need **Node.js 18+** (Node 20.16 is fine) and npm.

```bash
cd "C:\Users\Pragna Sree\Desktop\ai educator"
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

Other scripts:

```bash
npm run build    # production build into dist/
npm run preview  # preview the production build
```

## Project structure

```
ai educator/
  ai educator.pdf          # original problem statement
  index.html
  package.json
  src/
    main.tsx              # entry
    App.tsx               # routes
    index.css             # design tokens via Tailwind
    types.ts
    context/SessionContext.tsx   # mock learner session
    data/mock.ts          # sample lessons, quiz, path, materials
    components/
      ui/                 # Button, Card, Field, Badge, alerts, empty states
      layout/             # marketing nav + app shell
      classroom/          # avatar stage + subject whiteboard
    pages/                # one file per screen
```

Swap `src/data/mock.ts` for API calls later without rewriting the screens.

## Demo path (for a video)

1. Landing → Sign in (any password) → Dashboard  
2. Start lesson → upload a PDF (or pick a topic) → generate plan  
3. Classroom: play/pause, Hindi/English, answer the Ohm’s law question **wrong** to see misconception + new analogy  
4. Assessment → learning report (80%, weak: Resistance / Ohm’s Law)  
5. Learning path, flashcards, revision week

## Known limitations

- Avatar/voice/video are UI simulations, not generated media.
- File “parsing” is a timeout plus sample NCERT concepts.
- Auth is in-memory; refresh loses login state.
