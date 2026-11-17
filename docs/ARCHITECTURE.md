# Architecture and interaction flow

## What this application does

ORBIT is a static client application. Vite builds React and TypeScript into files that can be served by GitHub Pages. There is no API request in the user journey. Its only durable state is in the browser's localStorage.

```text
content.ts (phases, missions, resources)
       │
       ▼
App.tsx (React view + selected phase + journal)
       ├── mission.ts (validate, toggle, count, save progress)
       ├── OrbitalCanvas.tsx (3D scene responds to phase)
       └── styles.css (layout, color, motion fallback)
```

## Follow a mission click

1. `App` renders the missions whose `phase` matches the selected tab.
2. The mission button calls `complete(mission.id)`.
3. `toggleMission` creates a new `MissionState`. React updates the button's pressed state and the phase and overall progress counts.
4. An effect calls `persistMissionState` with the updated state. A return visit calls `readMissionState`, which validates known mission IDs and ignores malformed or old data.
5. The **next mission** text is computed from the first unfinished mission in content order.

This progress is a personal browser convenience, not a server-side onboarding record. Clearing site data resets it.

## Follow a phase change into the 3D scene

1. A phase tab sets React's `phase` state.
2. The active mission list and the visual accent change.
3. `OrbitalCanvas` copies the phase into a ref so its animation loop can read the newest value without rebuilding the WebGL scene.
4. Each frame, Three.js interpolates the core, emissive glow, and key light toward the color of the selected phase.

The scene is procedural: an icosahedral shell and core, three torus rings, three satellites, and a fixed-seed star field. `EffectComposer` adds bloom and an output pass. Pointer drag adjusts its target rotation. The code caps device pixel ratio, pauses useful rendering while off-screen or the document is hidden, honors `prefers-reduced-motion`, and disposes GPU objects on unmount. If WebGL creation fails, CSS draws a static orbit fallback.

## Toolkit and notes

The toolkit cards are filtered in memory by type. Opening a card uses a native HTML dialog so Escape, focus behavior, and modal semantics come from the browser. Field notes are debounced and stored under a separate localStorage key; nothing is sent to a server.

## Boundaries and honest limitations

- The 3D scene is decorative; the mission path remains available through semantic HTML.
- Progress and notes are device-local. There is no sign-in, multi-user assignment, manager dashboard, or cross-device sync in this kit.
- Content is sample material until a team edits `src/content.ts` and its companion docs.
- Welcome Wave can index this repository and its GitHub issues. It does not receive this site's localStorage values.
- A genuine KT recording, citations, team ownership, and live onboarding need to be created inside Welcome Wave with real people and source material.

## Test strategy

`tests/mission.test.ts` covers state transitions, counts, next-mission selection, and malformed stored data. `pnpm build` includes TypeScript checking. The GitHub workflow runs both on pushes and pull requests.
