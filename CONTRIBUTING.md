# Contributing

1. Read the README and architecture guide.
2. Choose a small GitHub issue or describe the change you intend to make.
3. Create a branch from `main`.
4. Run `pnpm install --frozen-lockfile`, `pnpm test`, and `pnpm build`.
5. Open a pull request that says what changed, how you verified it, and includes a screenshot if the visual design changed.

For onboarding copy, edit `src/content.ts` and keep the README or relevant guide accurate. For 3D changes, check pointer interaction, a device without WebGL, reduced motion, and cleanup on unmount. For state changes, add a meaningful test to `tests/mission.test.ts`.

Avoid adding real people's data, credentials, or private project information to this public repository.
