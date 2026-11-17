import { describe, expect, it } from "vitest";
import { nextMission, progressFor, readMissionState, toggleMission } from "../src/lib/mission";

describe("mission progress", () => {
  it("tracks completion and finds the next mission", () => {
    const first = nextMission({});
    expect(first?.id).toBe("mission-brief");
    const state = toggleMission({}, first!.id);
    expect(progressFor(state)).toEqual({ complete: 1, total: 9, percent: 11 });
    expect(progressFor(state, "arrive")).toEqual({ complete: 1, total: 3, percent: 33 });
    expect(nextMission(state)?.id).toBe("dev-environment");
  });

  it("ignores malformed or outdated saved data", () => {
    expect(readMissionState({ getItem: () => "not-json" })).toEqual({});
    expect(readMissionState({ getItem: () => JSON.stringify({ "mission-brief": true, deleted: true, "small-pr": "yes" }) })).toEqual({ "mission-brief": true });
  });
});
