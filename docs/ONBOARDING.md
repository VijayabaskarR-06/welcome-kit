# Run a real onboarding with ORBIT and Welcome Wave

This is a guide for a manager or mentor. Replace sample roles, links, and milestones with your team's actual information before assigning it to a person.

## Before day one

- Create a Welcome Wave project and connect this repository in **Settings → Repository**.
- Add the actual team members in **Settings → People**. Assign a mentor and a manager.
- Make a short project brief: who uses this experience, what success means, and who owns design, accessibility, and deployment. Add it as a project document if your Welcome Wave setup supports document upload.
- Keep at least one GitHub issue labeled `good first issue` with a clear acceptance test.

## Day one: arrive

Have the newcomer open the live ORBIT site, explore the hero, and complete the first three missions. Then clone the repository and run `pnpm install --frozen-lockfile`, `pnpm dev`, `pnpm test`, and `pnpm build`. In Welcome Wave, confirm their onboarding and access. Ask them to write down one question in their own notes and bring it to the mentor.

**Proof of progress:** the app runs locally, checks pass, and the newcomer can point to `src/content.ts` and `src/App.tsx`.

## Week one: connect

Use Welcome Wave **Ask** to locate code with citations. Trace a phase change and a mission click in **Code and KT**. Run the KT session in `docs/KT_SESSION.md`, record it with real consent and an approved tool, and upload it to Welcome Wave. Follow up on questions the indexed sources cannot answer.

**Proof of progress:** the newcomer can explain where browser data lives, where the 3D scene is created, and why a recorded KT session provides different evidence from source code alone.

## Month one: create

Select a focused `good first issue`. Create a branch, make a small change, run checks, and open a pull request. Use Welcome Wave's first-task, review, and feedback areas to support the contribution. Update a document or add a note after review so the next newcomer benefits.

**Proof of progress:** a reviewed pull request with a test or clear manual check, and one useful knowledge contribution.

## Questions worth asking in Welcome Wave

- Where is progress persisted and what happens with invalid stored data?
- Which file contains the onboarding copy?
- How does the scene respond to a tab change without a full renderer rebuild?
- How does the site behave with reduced motion or no WebGL?
- What should a first pull request include?

Use citations to verify the answer. If Welcome Wave cannot cite the source, ask a person or add the missing documentation.
