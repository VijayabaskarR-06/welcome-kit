import { missions, type PhaseId } from "../content";

export const STORAGE_KEY = "orbit.welcome-kit.v1";
export const JOURNAL_KEY = "orbit.journal.v1";

export type MissionState = Record<string, boolean>;

export function readMissionState(
  storage: Pick<Storage, "getItem"> | null,
): MissionState {
  if (!storage) return {};
  try {
    const value: unknown = JSON.parse(storage.getItem(STORAGE_KEY) ?? "{}");
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    const allowed = new Set(missions.map((mission) => mission.id));
    return Object.fromEntries(
      Object.entries(value).filter(
        ([id, done]) => allowed.has(id) && typeof done === "boolean",
      ),
    ) as MissionState;
  } catch {
    return {};
  }
}

export function toggleMission(state: MissionState, id: string): MissionState {
  if (!missions.some((mission) => mission.id === id)) return state;
  return { ...state, [id]: !state[id] };
}

export function progressFor(state: MissionState, phase?: PhaseId) {
  const items = phase
    ? missions.filter((mission) => mission.phase === phase)
    : missions;
  const complete = items.filter((mission) => state[mission.id]).length;
  return {
    complete,
    total: items.length,
    percent: items.length ? Math.round((complete / items.length) * 100) : 0,
  };
}

export function nextMission(state: MissionState) {
  return missions.find((mission) => !state[mission.id]) ?? null;
}

export function persistMissionState(
  storage: Pick<Storage, "setItem"> | null,
  state: MissionState,
): boolean {
  if (!storage) return false;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}
