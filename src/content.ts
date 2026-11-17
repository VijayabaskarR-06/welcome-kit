export type PhaseId = "arrive" | "connect" | "create";
export type Accent = "mint" | "violet" | "coral";

export type Mission = {
  id: string;
  phase: PhaseId;
  index: string;
  title: string;
  description: string;
  duration: string;
  category: string;
};

export type Phase = {
  id: PhaseId;
  number: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  accent: Accent;
  timeframe: string;
};

export const phases: Phase[] = [
  { id: "arrive", number: "01", eyebrow: "DAY 01", title: "Find your orbit.", subtitle: "Get oriented. Meet the people and principles behind the work.", accent: "mint", timeframe: "Your first day" },
  { id: "connect", number: "02", eyebrow: "WEEK 01", title: "Make connections.", subtitle: "Trace the system, ask good questions, and learn together.", accent: "violet", timeframe: "Your first week" },
  { id: "create", number: "03", eyebrow: "MONTH 01", title: "Leave a mark.", subtitle: "Ship a small change and turn curiosity into momentum.", accent: "coral", timeframe: "Your first month" },
];

export const missions: Mission[] = [
  { id: "mission-brief", phase: "arrive", index: "01", title: "Read the mission brief", description: "See what we build, who we build for, and how your role fits the bigger picture.", duration: "8 min", category: "Orientation" },
  { id: "dev-environment", phase: "arrive", index: "02", title: "Set up your workspace", description: "Clone the project, install dependencies, and run your first local build.", duration: "25 min", category: "Hands-on" },
  { id: "crew-intros", phase: "arrive", index: "03", title: "Meet your crew", description: "Find your mentor, team channel, and the people who can unblock you.", duration: "15 min", category: "People" },
  { id: "architecture-map", phase: "connect", index: "04", title: "Explore the system map", description: "Follow a user action from the interface through state and into the 3D scene.", duration: "18 min", category: "Architecture" },
  { id: "first-kt", phase: "connect", index: "05", title: "Join a knowledge session", description: "Watch a teammate explain a design decision and capture one question.", duration: "30 min", category: "Learning" },
  { id: "curiosity-note", phase: "connect", index: "06", title: "Share a discovery", description: "Write one thing you learned and one thing you would improve.", duration: "7 min", category: "Reflection" },
  { id: "good-first-issue", phase: "create", index: "07", title: "Choose your first issue", description: "Pick a focused improvement with a clear test and review path.", duration: "12 min", category: "Contribution" },
  { id: "small-pr", phase: "create", index: "08", title: "Open a small pull request", description: "Make the change, run the checks, and describe the experience for your reviewer.", duration: "45 min", category: "Build" },
  { id: "share-back", phase: "create", index: "09", title: "Share what you learned", description: "Add a note to the team knowledge base so the next person starts further ahead.", duration: "10 min", category: "Community" },
];

export type Resource = {
  id: string;
  label: string;
  type: "Guide" | "Practice" | "People";
  title: string;
  description: string;
  detail: string;
  icon: string;
  accent: Accent;
};

export const resources: Resource[] = [
  { id: "system", label: "01 / EXPLORE", type: "Guide", title: "The system, decoded", description: "A human-sized map of what lives where.", detail: "Start at src/App.tsx for the narrative and interactions. src/content.ts holds the onboarding material. src/lib/mission.ts owns progress rules and browser persistence. src/scene/OrbitalCanvas.tsx renders the 3D artwork. Each module has a clear boundary so a new teammate can make one focused change.", icon: "◎", accent: "mint" },
  { id: "terminal", label: "02 / BUILD", type: "Practice", title: "Make it yours", description: "Run the project and change one small thing.", detail: "Run pnpm install, then pnpm dev and open the printed URL. Change a mission title in src/content.ts, save, and see Vite refresh the page. Run pnpm test and pnpm build before opening a pull request.", icon: "⌘", accent: "violet" },
  { id: "people", label: "03 / CONNECT", type: "People", title: "Who to ask", description: "A question is a good place to begin.", detail: "Ask your mentor about architecture, accessibility, or the next good first issue. Use the project README and docs/KT_SESSION.md to guide a knowledge transfer session. In Welcome Wave, route a question to a person when the indexed evidence is not enough.", icon: "✳", accent: "coral" },
  { id: "principles", label: "04 / READ", type: "Guide", title: "The way we work", description: "Small steps, honest evidence, useful craft.", detail: "We build for clarity before spectacle. Give every interactive element a keyboard path. Keep 3D rendering optional when motion is reduced or WebGL is unavailable. Prefer a small, tested pull request over a large unreviewed rewrite.", icon: "◇", accent: "violet" },
  { id: "accessibility", label: "05 / PRACTICE", type: "Practice", title: "Design for everyone", description: "Make the experience work without a mouse or GPU.", detail: "Tab through the page, use Enter and Space to complete missions, and test the Escape key on the resource dialog. In your operating system, enable reduced motion and check that the scene becomes still. The CSS fallback should still communicate the orbit idea.", icon: "◈", accent: "mint" },
  { id: "contribute", label: "06 / SHIP", type: "Practice", title: "Your first signal", description: "A tiny improvement is still a real contribution.", detail: "Choose an issue labelled good first issue on GitHub. Create a branch, make the change, run the checks, and open a pull request. Add a short description of what changed, how you tested it, and one screenshot if the UI changed.", icon: "↗", accent: "coral" },
];
