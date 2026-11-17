# Knowledge transfer session: build the journey

This is a **session plan and recording script**, not a recording or a claim that a session happened. Use real team members and obtain consent before recording. Upload an actual recording in Welcome Wave to produce transcript-backed KT coverage.

## Goal and setup

In 25 minutes, a newcomer should understand the user path, the code path for mission completion, and how the procedural scene responds to the selected phase.

Open the live site and these files: `src/App.tsx`, `src/content.ts`, `src/lib/mission.ts`, `src/scene/OrbitalCanvas.tsx`. Have a recent `pnpm test` and `pnpm build` result ready.

## Run of show

| Time | Show | Explain or ask |
| --- | --- | --- |
| 0–3 min | Hero and drag interaction | The visual metaphor and the optional nature of WebGL. |
| 3–7 min | Three phase tabs and missions | Why content lives in one typed data file. |
| 7–12 min | Mark one mission complete and reload | Follow the event into `toggleMission`, progress counts, and localStorage. Ask what is lost when browser data is cleared. |
| 12–17 min | Change phase while watching the orbit | Follow the prop, ref, render loop, and color interpolation. Explain cleanup and reduced motion. |
| 17–20 min | Filter and open a resource; write a note | Show native dialog behavior and device-local notes. |
| 20–23 min | Welcome Wave Ask and Code Tour | Ask for the relevant functions and inspect the citations. Distinguish indexed code from a recorded explanation. |
| 23–25 min | First issue | Agree on one small change, how to test it, and who will review it. |

## Prompt the newcomer

1. If you wanted a fourth mission in a phase, which files would you inspect first?
2. If a user reports that their progress disappeared on another laptop, what is the current design telling you?
3. What should happen if their device cannot create a WebGL context?
4. What evidence would you want before saying a file was explained in a KT session?

## After the session

Upload the actual recording to the Welcome Wave project, review the generated notes and code links, correct any mistakes, then assign the agreed issue. If no recording is available, publish reviewed written notes as a project document and leave KT coverage unclaimed.
