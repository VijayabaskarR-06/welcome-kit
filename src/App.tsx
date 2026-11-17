import { useEffect, useMemo, useRef, useState } from "react";
import OrbitalCanvas from "./scene/OrbitalCanvas";
import {
  missions,
  phases,
  resources,
  type PhaseId,
  type Resource,
} from "./content";
import {
  JOURNAL_KEY,
  nextMission,
  persistMissionState,
  progressFor,
  readMissionState,
  toggleMission,
  type MissionState,
} from "./lib/mission";

function storage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function OrbitMark({ small = false }: { small?: boolean }) {
  return (
    <span
      className={`orbit-mark${small ? " orbit-mark-small" : ""}`}
      aria-hidden="true"
    >
      <i />
      <i />
      <b />
    </span>
  );
}

const Arrow = ({ diagonal = false }: { diagonal?: boolean }) => (
  <span aria-hidden="true" className="arrow-icon">
    {diagonal ? "↗" : "→"}
  </span>
);

function ResourceDialog({
  resource,
  onClose,
}: {
  resource: Resource | null;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    if (resource && element && !element.open) element.showModal();
    if (!resource && element?.open) element.close();
  }, [resource]);
  return (
    <dialog
      ref={dialog}
      className="resource-dialog"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialog.current) dialog.current?.close();
      }}
    >
      {resource && (
        <div className={`dialog-inner accent-${resource.accent}`}>
          <div className="dialog-top">
            <span className="eyebrow">THE TOOLKIT / {resource.label}</span>
            <button
              className="icon-button"
              aria-label="Close resource"
              onClick={() => dialog.current?.close()}
            >
              ×
            </button>
          </div>
          <span className="dialog-symbol" aria-hidden="true">
            {resource.icon}
          </span>
          <p className="dialog-type">{resource.type}</p>
          <h2>{resource.title}</h2>
          <p className="dialog-description">{resource.description}</p>
          <div className="dialog-rule" />
          <p className="dialog-detail">{resource.detail}</p>
          <button
            className="button button-dark"
            onClick={() => dialog.current?.close()}
          >
            Back to the toolkit <Arrow />
          </button>
        </div>
      )}
    </dialog>
  );
}

export default function App() {
  const [phase, setPhase] = useState<PhaseId>("arrive");
  const [state, setState] = useState<MissionState>(() =>
    readMissionState(storage()),
  );
  const [resourceType, setResourceType] = useState<"All" | Resource["type"]>(
    "All",
  );
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null,
  );
  const [journal, setJournal] = useState(() => {
    try {
      return storage()?.getItem(JOURNAL_KEY) ?? "";
    } catch {
      return "";
    }
  });
  const [saved, setSaved] = useState(false);
  const total = progressFor(state);
  const current = progressFor(state, phase);
  const next = nextMission(state);
  const selectedPhase = phases.find((item) => item.id === phase)!;
  const currentMissions = missions.filter((mission) => mission.phase === phase);
  const shownResources = useMemo(
    () =>
      resourceType === "All"
        ? resources
        : resources.filter((resource) => resource.type === resourceType),
    [resourceType],
  );

  useEffect(() => {
    persistMissionState(storage(), state);
  }, [state]);
  useEffect(() => {
    setSaved(false);
    const timer = window.setTimeout(() => {
      try {
        storage()?.setItem(JOURNAL_KEY, journal);
        setSaved(true);
      } catch {
        setSaved(false);
      }
    }, 450);
    return () => window.clearTimeout(timer);
  }, [journal]);

  function complete(id: string) {
    setState((before) => toggleMission(before, id));
  }
  function jumpToMission() {
    if (next) setPhase(next.phase);
    document
      .getElementById("mission-control")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className={`site phase-${phase}`}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <a
          className="brand"
          href="#top"
          aria-label="Orbit welcome kit, back to top"
        >
          <OrbitMark />
          <span>
            ORBIT<span className="brand-slash">/</span>
            <span className="brand-light">WELCOME KIT</span>
          </span>
        </a>
        <nav className="header-nav" aria-label="Main navigation">
          <a href="#mission-control">The journey</a>
          <a href="#system-map">The map</a>
          <a href="#toolkit">Toolkit</a>
        </nav>
        <button className="header-action" onClick={jumpToMission}>
          Enter mission control <Arrow diagonal />
        </button>
      </header>

      <main id="main">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-noise" aria-hidden="true" />
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-copy">
            <div className="hero-kicker">
              <span className="kicker-line" /> A FIELD GUIDE FOR YOUR NEXT
              CHAPTER <span className="kicker-index">001 — 009</span>
            </div>
            <h1 id="hero-title">
              Every great
              <br />
              journey begins
              <br />
              <em>somewhere.</em>
            </h1>
            <p className="hero-lede">
              This one begins with you. Explore your world, meet your people,
              and turn your first steps into a lasting impact.
            </p>
            <div className="hero-actions">
              <button className="button button-light" onClick={jumpToMission}>
                Start your journey <Arrow />
              </button>
              <a className="text-link" href="#system-map">
                Discover the experience <span aria-hidden="true">↘</span>
              </a>
            </div>
            <div className="hero-footer">
              <span className="tiny-orbit" aria-hidden="true" /> MADE FOR
              CURIOUS MINDS{" "}
              <span className="hero-footer-right">SCROLL TO EXPLORE ↓</span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="visual-halo" aria-hidden="true" />
            <OrbitalCanvas phase={phase} />
            <div className="visual-label visual-label-a">
              <span>01</span>
              <b>ARRIVE</b>
              <i />
            </div>
            <div className="visual-label visual-label-b">
              <span>02</span>
              <b>CONNECT</b>
              <i />
            </div>
            <div className="visual-label visual-label-c">
              <span>03</span>
              <b>CREATE</b>
              <i />
            </div>
            <div className="visual-card">
              <span className="eyebrow">YOUR CURRENT ORBIT</span>
              <strong>{selectedPhase.title}</strong>
              <span>
                {selectedPhase.timeframe} <Arrow diagonal />
              </span>
            </div>
          </div>
        </section>

        <div className="marquee" aria-hidden="true">
          <div>
            MAKE SPACE FOR NEW IDEAS <span>✳</span> MOVE WITH INTENTION{" "}
            <span>✳</span> YOUR NEXT CHAPTER STARTS HERE <span>✳</span> MAKE
            SPACE FOR NEW IDEAS <span>✳</span>
          </div>
        </div>

        <section
          className="section journey-section"
          id="mission-control"
          aria-labelledby="journey-title"
        >
          <div className="section-head">
            <div>
              <span className="section-index">01 / MISSION CONTROL</span>
              <h2 id="journey-title">
                A journey you can <em>shape.</em>
              </h2>
              <p>
                Nine small missions. One remarkable beginning. Start anywhere
                and move at your own pace.
              </p>
            </div>
            <div
              className="progress-orbit"
              style={
                { "--progress": `${total.percent}%` } as React.CSSProperties
              }
            >
              <div>
                <strong>
                  {total.percent}
                  <sup>%</sup>
                </strong>
                <span>
                  OVERALL
                  <br />
                  PROGRESS
                </span>
              </div>
            </div>
          </div>
          <div className="journey-shell">
            <div
              className="phase-rail"
              role="tablist"
              aria-label="Journey phase"
            >
              {phases.map((item) => {
                const progress = progressFor(state, item.id);
                return (
                  <button
                    key={item.id}
                    id={`tab-${item.id}`}
                    type="button"
                    role="tab"
                    aria-selected={phase === item.id}
                    aria-controls="phase-panel"
                    className={`phase-tab${phase === item.id ? " is-active" : ""}`}
                    onClick={() => setPhase(item.id)}
                  >
                    <span className="phase-number">{item.number}</span>
                    <span className="phase-tab-main">
                      <strong>{item.title}</strong>
                      <small>
                        {item.eyebrow} · {progress.complete}/{progress.total}{" "}
                        complete
                      </small>
                    </span>
                    <Arrow diagonal />
                  </button>
                );
              })}
              <div className="rail-bottom">
                <OrbitMark small />
                <span>
                  YOUR PATH IS
                  <br />
                  YOUR OWN.
                </span>
              </div>
            </div>
            <div
              className={`mission-panel accent-${selectedPhase.accent}`}
              id="phase-panel"
              role="tabpanel"
              aria-labelledby={`tab-${phase}`}
            >
              <div className="mission-panel-head">
                <div>
                  <span className="eyebrow">
                    {selectedPhase.eyebrow} /{" "}
                    {selectedPhase.timeframe.toUpperCase()}
                  </span>
                  <h3>{selectedPhase.title}</h3>
                  <p>{selectedPhase.subtitle}</p>
                </div>
                <div className="phase-progress">
                  <strong>
                    {String(current.complete).padStart(2, "0")}
                    <span>/03</span>
                  </strong>
                  <small>MISSIONS DONE</small>
                </div>
              </div>
              <div className="mission-list">
                {currentMissions.map((mission) => (
                  <button
                    type="button"
                    key={mission.id}
                    className={`mission-row${state[mission.id] ? " is-done" : ""}`}
                    aria-pressed={!!state[mission.id]}
                    onClick={() => complete(mission.id)}
                  >
                    <span className="mission-check" aria-hidden="true">
                      {state[mission.id] ? "✓" : mission.index}
                    </span>
                    <span className="mission-main">
                      <strong>{mission.title}</strong>
                      <small>{mission.description}</small>
                    </span>
                    <span className="mission-meta">
                      <span>{mission.category}</span>
                      <small>{mission.duration}</small>
                    </span>
                    <span className="mission-arrow" aria-hidden="true">
                      {state[mission.id] ? "DONE" : "↗"}
                    </span>
                  </button>
                ))}
              </div>
              <div className="mission-panel-foot">
                <span>
                  <span className="pulse-dot" /> Progress is saved on this
                  device
                </span>
                <span>
                  {next
                    ? `UP NEXT: ${next.title.toUpperCase()}`
                    : "ALL MISSIONS COMPLETE · WELL DONE"}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section
          className="section map-section"
          id="system-map"
          aria-labelledby="map-title"
        >
          <div className="map-intro">
            <span className="section-index">02 / THE BIG PICTURE</span>
            <h2 id="map-title">
              It’s more than a checklist.
              <br />
              <em>It’s a launchpad.</em>
            </h2>
            <p>
              A welcome kit should help you understand the work, find your
              people, and build confidence through doing.
            </p>
          </div>
          <div className="map-track">
            <div className="track-line" aria-hidden="true" />
            <article className="map-card">
              <span className="map-card-index">01 — UNDERSTAND</span>
              <div className="map-glyph map-glyph-one" aria-hidden="true">
                ◎
              </div>
              <h3>See the whole system.</h3>
              <p>
                From the interface to the orbit engine, the code is divided into
                clear, learnable parts.
              </p>
              <span className="map-card-bottom">
                CODE → CONTEXT <Arrow diagonal />
              </span>
            </article>
            <article className="map-card map-card-shift">
              <span className="map-card-index">02 — CONNECT</span>
              <div className="map-glyph map-glyph-two" aria-hidden="true">
                ✳
              </div>
              <h3>Find your people.</h3>
              <p>
                Learning moves faster when a question has somewhere thoughtful
                to land.
              </p>
              <span className="map-card-bottom">
                QUESTION → CONVERSATION <Arrow diagonal />
              </span>
            </article>
            <article className="map-card">
              <span className="map-card-index">03 — CONTRIBUTE</span>
              <div className="map-glyph map-glyph-three" aria-hidden="true">
                ↗
              </div>
              <h3>Make something real.</h3>
              <p>
                Build one small improvement, test it, and leave the path clearer
                for the next person.
              </p>
              <span className="map-card-bottom">
                CURIOSITY → IMPACT <Arrow diagonal />
              </span>
            </article>
          </div>
          <div className="map-footer">
            <span>BUILT TO BE EXPLORED.</span>
            <span>DESIGNED TO BE EXTENDED.</span>
            <span>MADE TO GET YOU MOVING.</span>
          </div>
        </section>

        <section
          className="section toolkit-section"
          id="toolkit"
          aria-labelledby="toolkit-title"
        >
          <div className="section-head toolkit-head">
            <div>
              <span className="section-index">03 / YOUR TOOLKIT</span>
              <h2 id="toolkit-title">
                Everything you need.
                <br />
                <em>Nothing you don’t.</em>
              </h2>
              <p>
                Open a card for a focused guide, practice prompt, or
                person-first reminder.
              </p>
            </div>
            <div className="toolkit-count">
              0{shownResources.length}
              <span>RESOURCES IN VIEW</span>
            </div>
          </div>
          <div
            className="filter-row"
            role="group"
            aria-label="Filter resources"
          >
            {(["All", "Guide", "Practice", "People"] as const).map((type) => (
              <button
                key={type}
                type="button"
                className={resourceType === type ? "is-active" : ""}
                aria-pressed={resourceType === type}
                onClick={() => setResourceType(type)}
              >
                {type}
                <span>
                  {type === "All"
                    ? resources.length
                    : resources.filter((resource) => resource.type === type)
                        .length}
                </span>
              </button>
            ))}
          </div>
          <div className="resource-grid">
            {shownResources.map((resource) => (
              <button
                type="button"
                key={resource.id}
                className={`resource-card accent-${resource.accent}`}
                onClick={() => setSelectedResource(resource)}
              >
                <div className="resource-card-top">
                  <span>{resource.label}</span>
                  <span className="resource-open" aria-hidden="true">
                    ↗
                  </span>
                </div>
                <div className="resource-glyph" aria-hidden="true">
                  {resource.icon}
                </div>
                <div>
                  <span className="resource-type">{resource.type}</span>
                  <h3>{resource.title}</h3>
                  <p>{resource.description}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section
          className="section signal-section"
          id="signal"
          aria-labelledby="signal-title"
        >
          <div className="signal-copy">
            <span className="section-index">04 / LEAVE A SIGNAL</span>
            <h2 id="signal-title">
              The best first step?
              <br />
              <em>Write it down.</em>
            </h2>
            <p>
              Capture a question, an idea, or something you learned today. Your
              notes stay in this browser, ready for your next visit.
            </p>
            <div className="signal-quote">
              “Curiosity is how a new place starts to feel like yours.”
            </div>
          </div>
          <div className="journal-card">
            <div className="journal-head">
              <span>
                <span className="pulse-dot" /> PERSONAL FIELD NOTES
              </span>
              <span>001</span>
            </div>
            <label htmlFor="journal">What are you curious about?</label>
            <textarea
              id="journal"
              placeholder="I noticed...\nI wonder...\nI want to try..."
              value={journal}
              maxLength={2400}
              onChange={(event) => setJournal(event.target.value)}
            />
            <div className="journal-foot">
              <span>{saved ? "Saved in this browser" : "Saving…"}</span>
              <span>{journal.length} / 2400</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-top">
          <OrbitMark />
          <p>
            Your journey starts here.
            <br />
            <em>Make it yours.</em>
          </p>
          <a href="#top" aria-label="Back to top">
            ↑
          </a>
        </div>
        <div className="footer-bottom">
          <span>ORBIT / WELCOME KIT</span>
          <span>AN INTERACTIVE ONBOARDING EXPERIENCE</span>
          <span>© {new Date().getFullYear()} · BUILT FOR THE FIRST STEP</span>
        </div>
      </footer>
      <ResourceDialog
        resource={selectedResource}
        onClose={() => setSelectedResource(null)}
      />
    </div>
  );
}
