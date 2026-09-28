"use client";

import { skills, type SkillGroup } from "@/content/site";
import { useMemo, useState } from "react";

const anchors = [
  { x: 170, y: 150 },
  { x: 390, y: 88 },
  { x: 690, y: 120 },
  { x: 860, y: 310 },
  { x: 690, y: 510 },
  { x: 380, y: 530 },
  { x: 150, y: 400 },
];

const center = { x: 490, y: 310 };

function satellites(group: SkillGroup, anchor: { x: number; y: number }) {
  const dx = anchor.x - center.x;
  const dy = anchor.y - center.y;
  const length = Math.hypot(dx, dy) || 1;
  const ux = dx / length;
  const uy = dy / length;
  const px = -uy;
  const py = ux;
  return group.skills.map((skill, index) => {
    const spread = (index - (group.skills.length - 1) / 2) * 78;
    return {
      skill,
      x: anchor.x + ux * 92 + px * spread,
      y: anchor.y + uy * 62 + py * spread * 0.35,
    };
  });
}

export function SkillConstellation() {
  const [active, setActive] = useState(skills.groups[0].id);
  const selected = skills.groups.find((group) => group.id === active) ?? skills.groups[0];

  const placed = useMemo(
    () =>
      skills.groups.map((group, index) => ({
        group,
        anchor: anchors[index],
        sats: satellites(group, anchors[index]),
      })),
    [],
  );

  return (
    <section id="skills" className="section-pad scroll-mt-24 py-24 md:py-32">
      <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div>
          <p className="eyebrow">{skills.eyebrow}</p>
          <h2 className="display mt-4 max-w-3xl text-4xl leading-none md:text-6xl">{skills.title}</h2>
          <p className="mt-4 max-w-xl text-mute">{skills.lede}</p>
        </div>
        <p className="text-sm leading-relaxed text-dim lg:text-right">{skills.also}</p>
      </div>

      <div className="mt-10 md:hidden">
        <div className="flex flex-col gap-3">
          {skills.groups.map((group) => {
            const open = group.id === active;
            return (
              <div key={group.id} className="border border-lilac/20 bg-night">
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setActive(group.id)}
                  className="flex w-full items-center justify-between px-4 py-4 text-left"
                >
                  <span className="font-serif text-2xl">{group.label}</span>
                  <span className="font-mono text-xs text-lilac">{open ? "Open" : "Show"}</span>
                </button>
                {open ? (
                  <div className="px-4 pb-4">
                    <p className="text-mute">{group.summary}</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {group.skills.map((skill) => (
                        <li key={skill} className="border border-lilac/30 px-3 py-1 font-mono text-xs text-lilac">
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-12 hidden gap-8 md:grid lg:grid-cols-[minmax(0,1fr)_20rem]">
        <svg viewBox="0 0 1000 620" role="group" aria-label="Skill constellation" className="h-auto w-full">
          {placed.map(({ group, anchor, sats }) => {
            const on = group.id === active;
            return (
              <g key={group.id} opacity={on ? 1 : 0.38}>
                <line
                  x1={center.x}
                  y1={center.y}
                  x2={anchor.x}
                  y2={anchor.y}
                  stroke="#C4A5FF"
                  strokeWidth={on ? 1.4 : 0.6}
                />
                {sats.map((sat) => (
                  <line
                    key={sat.skill}
                    x1={anchor.x}
                    y1={anchor.y}
                    x2={sat.x}
                    y2={sat.y}
                    stroke="#9A67FF"
                    strokeWidth="0.8"
                  />
                ))}
                {sats.map((sat) => (
                  <g key={`${group.id}-${sat.skill}`}>
                    <circle cx={sat.x} cy={sat.y} r="3.5" fill="#C4A5FF" />
                    <text
                      x={sat.x + 8}
                      y={sat.y + 4}
                      fill="#F4F1FB"
                      fontSize="13"
                      fontFamily="var(--font-jetbrains), monospace"
                    >
                      {sat.skill}
                    </text>
                  </g>
                ))}
                <g
                  role="button"
                  tabIndex={0}
                  aria-pressed={on}
                  aria-label={group.label}
                  className="cursor-pointer"
                  onClick={() => setActive(group.id)}
                  onFocus={() => setActive(group.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setActive(group.id);
                    }
                  }}
                >
                  <circle cx={anchor.x} cy={anchor.y} r="34" fill={on ? "#9A67FF" : "#110C20"} stroke="#C4A5FF" />
                  <text
                    x={anchor.x}
                    y={anchor.y + 4}
                    textAnchor="middle"
                    fill={on ? "#08070D" : "#F4F1FB"}
                    fontSize="11"
                    fontFamily="Outfit, sans-serif"
                  >
                    {group.label.split(" ")[0]}
                  </text>
                </g>
              </g>
            );
          })}
          <circle cx={center.x} cy={center.y} r="6" fill="#F4F1FB" />
        </svg>
        <aside className="self-end border-t border-lilac/30 pt-6" aria-live="polite">
          <p className="eyebrow">Focus</p>
          <h3 className="display mt-3 text-4xl">{selected.label}</h3>
          <p className="mt-4 text-lg leading-relaxed text-mute">{selected.summary}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {selected.skills.map((skill) => (
              <li key={skill} className="bg-violet/15 px-3 py-1 font-mono text-xs text-lilac">
                {skill}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
