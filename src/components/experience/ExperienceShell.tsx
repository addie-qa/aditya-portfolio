"use client";

import {
  corridorTravel,
  galleryClients,
  lab,
  profile,
  record,
  roomFromSlug,
  rooms,
  slugForRoom,
  toolkit,
  type RoomId,
} from "@/content/experience";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const CorridorCanvas = dynamic(() => import("./CorridorCanvas"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center font-mono text-xs uppercase tracking-[0.18em] text-lilac">
      Opening the corridor
    </div>
  ),
});

function clampStroll(value: number) {
  return Math.min(corridorTravel.start, Math.max(corridorTravel.end, value));
}

export function ExperienceShell() {
  const pathname = usePathname();
  const router = useRouter();
  const slug = pathname.startsWith("/creative/") ? pathname.slice("/creative/".length) : undefined;
  const room = roomFromSlug(slug);
  const [project, setProject] = useState(0);
  const [step, setStep] = useState(0);
  const [reduce, setReduce] = useState(false);
  const [quality, setQuality] = useState<"high" | "medium" | "low">("high");
  const [near, setNear] = useState<RoomId | null>(null);
  const [textOpen, setTextOpen] = useState(false);
  const strollRef = useRef(-2);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduce(media.matches);
    apply();
    media.addEventListener("change", apply);
    const compact = window.matchMedia("(max-width: 800px)");
    const laptop = window.matchMedia("(max-width: 1280px)");
    const applyQuality = () => {
      if (compact.matches) setQuality("low");
      else if (laptop.matches) setQuality("medium");
      else setQuality("high");
    };
    applyQuality();
    compact.addEventListener("change", applyQuality);
    laptop.addEventListener("change", applyQuality);
    return () => {
      media.removeEventListener("change", apply);
      compact.removeEventListener("change", applyQuality);
      laptop.removeEventListener("change", applyQuality);
    };
  }, []);

  const go = useCallback(
    (next: RoomId) => {
      const leaf = slugForRoom(next);
      const nextPath = leaf ? `/creative/${leaf}` : "/creative";
      if (pathname !== nextPath) router.push(nextPath, { scroll: false });
    },
    [pathname, router],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A"].includes(target.tagName)) return;
      if (event.key === "ArrowDown" || event.key === "s" || event.key === "S") {
        strollRef.current = clampStroll(strollRef.current - 0.42);
      }
      if (event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
        strollRef.current = clampStroll(strollRef.current + 0.42);
      }
      if (event.key === "Escape") {
        setTextOpen(false);
        go("hub");
      }
      if ((event.key === "e" || event.key === "E") && near && room === "hub") go(near);
      const index = Number(event.key) - 1;
      if (index >= 0 && index < rooms.length) go(rooms[index].id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, near, room]);

  const selected = galleryClients[project] ?? galleryClients[0];

  return (
    <div className="relative h-svh overflow-hidden bg-void text-ink">
      <div className="absolute inset-0" aria-hidden="true">
        <CorridorCanvas
          room={room}
          project={project}
          reduce={reduce}
          quality={quality}
          strollRef={strollRef}
          onNear={setNear}
          onEnter={go}
          onInspect={(index) => {
            setProject(index);
            go("gallery");
          }}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-3 md:p-6">
        <header className="pointer-events-auto flex flex-wrap items-start justify-between gap-3">
          <a href="/classic" className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-lilac">
            Classic page
          </a>
          <nav aria-label="Rooms" className="flex flex-wrap gap-2">
            {rooms.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-current={room === item.id ? "page" : undefined}
                onClick={() => go(item.id)}
                className={`border px-3 py-2 font-mono text-[0.65rem] uppercase tracking-[0.14em] ${
                  room === item.id ? "border-violet bg-violet text-void" : "border-lilac/40 bg-void/80 text-lilac"
                }`}
              >
                {item.index} {item.label}
              </button>
            ))}
          </nav>
        </header>

        <div className="flex w-full items-end justify-between gap-3">
          {/* 
            Strictly controlled by textOpen state.
            When false, applies 'sr-only' so 2D text cards won't render over 3D panels in WebGL.
          */}
          <section
            aria-label={rooms.find((item) => item.id === room)?.hint}
            data-room-copy={textOpen ? "open" : undefined}
            className={
              textOpen
                ? "pointer-events-auto max-h-[42svh] overflow-y-auto border border-lilac/25 bg-void/90 p-4 md:p-6"
                : "sr-only"
            }
          >
            {room === "hub" ? (
              <>
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-lilac">{profile.place}</p>
                <h1 className="display mt-2 text-4xl leading-none md:text-6xl">{profile.name}</h1>
                <p className="mt-3 font-mono text-xs uppercase tracking-[0.16em] text-lilac">{profile.role}</p>
                <p className="display mt-4 text-2xl leading-tight md:text-4xl">{profile.headline}</p>
                <p className="mt-3 max-w-xl text-mute">{profile.support}</p>
                <p className="mt-4 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-lilac">{toolkit.title}</p>
                <p className="mt-2 text-mute">{toolkit.subtitle}</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {toolkit.tools.map((tool) => (
                    <li key={tool.name} className="border border-lilac/30 px-2 py-1 font-mono text-[0.65rem] text-lilac">
                      {tool.name}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            {room === "lab" ? (
              <>
                <h2 className="display text-4xl">{lab.title}</h2>
                <p className="mt-3 text-mute">{lab.lede}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {lab.skills.map((skill) => (
                    <li key={skill} className="border border-lilac/30 px-2 py-1 font-mono text-[0.65rem] text-lilac">
                      {skill}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-lilac">Simulated execution</p>
                <ol className="mt-3 space-y-2">
                  {lab.steps.map((item, index) => (
                    <li key={item.id} className={index === step ? "text-ink" : "text-dim"}>
                      <button type="button" className="text-left" onClick={() => setStep(index)}>
                        <span className="font-mono text-xs text-lilac">{String(index + 1).padStart(2, "0")} </span>
                        {item.title}
                      </button>
                    </li>
                  ))}
                </ol>
                <pre className="mt-4 overflow-x-auto border border-lilac/20 bg-night p-3 font-mono text-xs leading-6 text-ink">
                  {lab.steps[step].log}
                </pre>
                <button
                  type="button"
                  className="mt-4 bg-violet px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-void"
                  onClick={() => setStep((value) => (value + 1) % lab.steps.length)}
                >
                  Advance simulated run
                </button>
              </>
            ) : null}

            {room === "gallery" ? (
              <>
                <h2 className="display text-4xl">Project gallery</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {galleryClients.map((item, index) => (
                    <button
                      key={item.name}
                      type="button"
                      aria-pressed={project === index}
                      onClick={() => setProject(index)}
                      className={`border px-3 py-1 text-left text-sm ${
                        project === index ? "border-violet text-lilac" : "border-lilac/20 text-dim"
                      }`}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
                <h3 className="mt-4 font-serif text-3xl">{selected.name}</h3>
                <dl className="mt-3 space-y-3 text-sm leading-relaxed">
                  <div>
                    <dt className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-lilac">Testing scope</dt>
                    <dd>{selected.scope}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-lilac">Automation stack</dt>
                    <dd>{selected.stack}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-lilac">Testing type</dt>
                    <dd>{selected.type}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-lilac">Key responsibilities</dt>
                    <dd>{selected.responsibilities}</dd>
                  </div>
                </dl>
              </>
            ) : null}

            {room === "experience" ? (
              <>
                <h2 className="display text-4xl">Experience and skills</h2>
                <p className="mt-3 font-mono text-xs uppercase tracking-[0.14em] text-lilac">{record.positioning}</p>
                <p className="mt-3 text-mute">{record.note}</p>
                <ul className="mt-4 space-y-4">
                  {record.roles.map((role) => (
                    <li key={role.title}>
                      <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-lilac">{role.when}</p>
                      <p className="font-serif text-2xl">{role.title}</p>
                      <p className="text-mute">{role.org}</p>
                      <ul className="mt-1 list-disc pl-4 text-sm">
                        {role.points.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {record.groups.map((group) => (
                    <div key={group.label}>
                      <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-lilac">{group.label}</p>
                      <p className="text-sm">{group.items.join(" · ")}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : null}

            {room === "contact" ? (
              <>
                <h2 className="display text-4xl leading-none">SDET conversations</h2>
                <p className="mt-3 text-mute">
                  Open to SDET and senior QA automation interviews. Links below are the ones on the public site.
                </p>
                <ul className="mt-5 space-y-3">
                  <li>
                    <a className="text-lilac underline" href={`mailto:${profile.email}`}>
                      {profile.email}
                    </a>
                  </li>
                  <li>
                    <a className="text-lilac underline" href={profile.linkedin} target="_blank" rel="noreferrer">
                      LinkedIn
                    </a>
                  </li>
                  <li>
                    <a className="text-lilac underline" href={profile.github} target="_blank" rel="noreferrer">
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a className="text-lilac underline" href={profile.resume}>
                      Download resume
                    </a>
                  </li>
                </ul>
              </>
            ) : null}
          </section>

          <div className="pointer-events-auto flex flex-wrap items-center justify-end gap-2">
            {room === "hub" && near ? (
              <button
                type="button"
                className="bg-violet px-4 py-3 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-void"
                onClick={() => go(near)}
              >
                {rooms.find((item) => item.id === near)?.enter}
              </button>
            ) : null}
            {room !== "hub" ? (
              <button
                type="button"
                className="bg-void/80 px-4 py-3 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-lilac"
                onClick={() => go("hub")}
              >
                Back to corridor
              </button>
            ) : null}
            <button
              type="button"
              className="bg-void/80 px-4 py-3 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-lilac"
              onClick={() => setTextOpen((value) => !value)}
            >
              {textOpen ? "Hide text" : "Text version"}
            </button>
            <p className="sr-only">Scroll down to walk forward. Scroll up to return. WASD also moves. Click a gate or press E. Esc returns.</p>
            <button
              type="button"
              className="bg-void/80 px-4 py-3 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-lilac"
              onClick={() => {
                strollRef.current = clampStroll(strollRef.current + 2);
                go("hub");
              }}
            >
              Walk back
            </button>
            <button
              type="button"
              className="bg-void/80 px-4 py-3 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-lilac"
              onClick={() => {
                strollRef.current = clampStroll(strollRef.current - 2);
                go("hub");
              }}
            >
              Walk forward
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}