"use client";

import { projects } from "@/content/site";
import { useEffect, useRef, useState } from "react";

function HealStudy() {
  const [healed, setHealed] = useState(false);
  return (
    <div className="border border-lilac/20 bg-void p-5 md:p-7">
      <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-lilac">Interactive illustration</p>
      <pre className="mt-5 overflow-x-auto font-mono text-sm leading-7 text-ink">
        {healed
          ? "getByTestId('composer-send')\n// accepted after review\n// original failure kept in the report"
          : "getByRole('button', { name: 'Send' })\n// 0 elements\n// visible name is now “Send message”"}
      </pre>
      <button
        type="button"
        onClick={() => setHealed((value) => !value)}
        className="mt-6 border border-violet px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-lilac"
      >
        {healed ? "Show the failure" : "Propose a recovery"}
      </button>
    </div>
  );
}

function ChatStudy() {
  const [sent, setSent] = useState<string[]>([]);
  const [arrived, setArrived] = useState<string[]>([]);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((id) => window.clearTimeout(id));
  }, []);

  const send = () => {
    const text = `Message ${sent.length + 1}`;
    setSent((current) => [...current, text]);
    const id = window.setTimeout(() => {
      setArrived((current) => [...current, text]);
    }, 700);
    timers.current.push(id);
  };

  return (
    <div>
      <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-lilac">
        Simulated devices — not a live app
      </p>
      <div className="mt-5 grid grid-cols-2 gap-4">
        {[
          { title: "Device A", items: sent },
          { title: "Device B", items: arrived },
        ].map((device) => (
          <div key={device.title} className="border border-lilac/25 bg-void p-3">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-dim">{device.title}</p>
            <div className="mt-4 flex min-h-36 flex-col justify-end gap-2">
              {device.items.length === 0 ? (
                <p className="text-sm text-dim">Waiting</p>
              ) : (
                device.items.map((item) => (
                  <p key={item} className="bg-night px-3 py-2 text-sm text-ink">
                    {item}
                  </p>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={send}
        className="mt-5 bg-violet px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-void"
      >
        Send across
      </button>
    </div>
  );
}

function UploadStudy() {
  const [step, setStep] = useState(0);
  const checks = [
    "UI accepted the file",
    "API returned the asset id",
    "Processing status is ready",
    "Playback response exists",
  ];

  return (
    <div className="bg-void p-5 md:p-7">
      <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-lilac">Illustrated checks</p>
      <div className="mt-5 h-2 bg-night">
        <div className="h-full bg-violet" style={{ width: `${(step / checks.length) * 100}%` }} />
      </div>
      <ul className="mt-5 space-y-2">
        {checks.map((check, index) => (
          <li key={check} className={index < step ? "text-ink" : "text-dim"}>
            <span className="mr-3 font-mono text-xs text-lilac">{index < step ? "OK" : "—"}</span>
            {check}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => setStep((value) => (value >= checks.length ? 0 : value + 1))}
        className="mt-6 border border-violet px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-lilac"
      >
        {step >= checks.length ? "Reset" : step === 0 ? "Start upload" : "Verify next"}
      </button>
    </div>
  );
}

function PerfStudy() {
  const rows = [
    { name: "POST /sessions", note: "auth contract" },
    { name: "GET /threads", note: "list shape" },
    { name: "POST /messages", note: "write path" },
    { name: "GET /assets/:id", note: "under load" },
  ];
  return (
    <div className="border border-lilac/20">
      <p className="border-b border-lilac/20 px-4 py-3 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-lilac">
        Illustration of a trace, not a recorded benchmark
      </p>
      <ul>
        {rows.map((row, index) => (
          <li key={row.name} className="grid grid-cols-[1.4fr_1fr_auto] items-center gap-3 border-b border-lilac/10 px-4 py-3 last:border-0">
            <span className="font-mono text-sm">{row.name}</span>
            <span className="h-1 bg-night">
              <span className="block h-full bg-lilac" style={{ width: `${42 + index * 14}%` }} />
            </span>
            <span className="text-xs text-dim">{row.note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const visuals = [HealStudy, ChatStudy, UploadStudy, PerfStudy];

export function Projects() {
  return (
    <section id="work" className="scroll-mt-24 bg-night py-24 md:py-32">
      <div className="section-pad">
        <p className="eyebrow">{projects.eyebrow}</p>
        <h2 className="display mt-4 max-w-4xl text-4xl leading-[0.95] md:text-7xl">{projects.title}</h2>
        <p className="mt-6 max-w-2xl text-lg text-mute">{projects.lede}</p>
      </div>

      <div className="mt-16">
        {projects.items.map((project, index) => {
          const Visual = visuals[index];
          const flip = index % 2 === 1;
          return (
            <article
              key={project.id}
              className="section-pad grid items-center gap-10 border-t border-lilac/15 py-16 lg:grid-cols-2 lg:gap-16"
            >
              <div className={flip ? "lg:order-2" : ""}>
                <p className="font-mono text-xs tracking-[0.2em] text-violet">
                  {project.index}  /  {project.kicker}
                </p>
                <h3 className="display mt-3 text-4xl leading-none md:text-6xl">{project.title}</h3>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-mute">{project.summary}</p>
                <ul className="mt-6 space-y-3 text-ink">
                  {project.points.map((point) => (
                    <li key={point} className="grid grid-cols-[auto_1fr] gap-3">
                      <span className="mt-2 h-1.5 w-1.5 bg-violet" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <li key={tag} className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-lilac">
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
              <Visual />
            </article>
          );
        })}
      </div>
    </section>
  );
}
