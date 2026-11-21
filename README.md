# ORBIT / Welcome Kit

An interactive welcome kit for a software team. It is a complete, standalone React application and a small, realistic repository for learning Welcome Wave. New teammates can explore a three-stage onboarding path, interact with a procedural 3D scene, read focused guides, and keep private field notes.

**Live site:** https://vijayabaskarr-06.github.io/welcome-kit/

## Start here

Requires Node.js 22+ and pnpm 10.12.1.

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Open the URL Vite prints. To check a change:

```bash
pnpm test
pnpm build
pnpm format:check
pnpm preview
```

## Use the kit

1. **Start your journey** opens Mission Control. Select **Arrive**, **Connect**, or **Create** to see the three missions in each phase. Select a mission to mark it complete. The progress ring and next mission update immediately.
2. **Drag the orbit** in the hero to rotate the 3D sculpture. Changing phases changes its core color. The page remains usable if WebGL is unavailable or reduced motion is enabled.
3. **The map** explains the intended learning arc: understand the system, connect with people, contribute a small improvement.
4. **Toolkit** filters six guides and practice prompts. Open any resource to read its full instructions.
5. **Field notes** save your own questions in this browser. Mission completion and notes use localStorage; they do not sync to Welcome Wave or other devices.

The kit has no account system, backend, analytics, or remote storage. Its content is a sample onboarding narrative. To use it for an actual team, replace the missions and resources in `src/content.ts`, then connect the repository and invite people in Welcome Wave.

## Use it with Welcome Wave

1. In Welcome Wave, create or open a project named **Welcome Kit**.
2. As a manager, open **Settings → Repository**, add `https://github.com/VijayabaskarR-06/welcome-kit`, and wait for indexing to finish. The project can then use the code and Markdown documents as evidence for Ask, Code Tour, and first-task suggestions.
3. In **Ask the project**, try: “Where is mission progress stored?”, “How does the orbit react to a phase change?”, or “What happens when WebGL is unavailable?” Check the cited code before relying on an answer.
4. In **Code and KT** or **Code Tour**, trace a mission click from `src/App.tsx` through `src/lib/mission.ts`, or inspect the 3D scene lifecycle in `src/scene/OrbitalCanvas.tsx`.
5. Use [the KT guide](docs/KT_SESSION.md) to run a real knowledge session. Upload a real recording to Welcome Wave if you want transcript and code-linked KT coverage. No recorded session is included in this repository.
6. Create a real onboarding in Welcome Wave for a team member. Use [the onboarding plan](docs/ONBOARDING.md) as the human-readable brief and select a GitHub issue labeled `good first issue` for their first contribution.

Welcome Wave's repository connection is read-only. The kit's local mission ticks do **not** become Welcome Wave onboarding records; the two experiences have different purposes.

## Repository map

| Path                          | Role                                                      |
| ----------------------------- | --------------------------------------------------------- |
| `src/App.tsx`                 | Page narrative, phase selection, missions, toolkit, notes |
| `src/content.ts`              | The three phases, nine missions, six resources            |
| `src/lib/mission.ts`          | Progress rules and localStorage boundary                  |
| `src/scene/OrbitalCanvas.tsx` | Three.js scene, interaction, motion, cleanup              |
| `src/styles.css`              | Visual system, responsive layout, reduced motion          |
| `tests/mission.test.ts`       | State and storage behavior checks                         |
| `docs/`                       | Architecture, onboarding, and KT session guides           |

Read [Architecture](docs/ARCHITECTURE.md) for the data flow and [Contributing](CONTRIBUTING.md) for a first change.
For a recorded judge walkthrough of the kit with Welcome Wave, use the [four-minute video plan](docs/VIDEO_DEMO.md).

## Deployment

Every push to `main` runs the test and build checks. The Pages workflow publishes the built `dist/` directory. No credentials are used by the client application. The repository has no license file; contact the owner before reusing it outside this project.
