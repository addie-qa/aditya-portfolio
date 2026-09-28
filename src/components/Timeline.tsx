"use client";

import { timeline } from "@/content/site";
import { motion, MotionConfig } from "framer-motion";

export function Timeline() {
  return (
    <MotionConfig reducedMotion="user">
      <section id="path" className="section-pad scroll-mt-24 py-24 md:py-32">
        <div className="grid gap-8 md:grid-cols-[minmax(0,18rem)_1fr] md:gap-16">
          <div>
            <p className="eyebrow">{timeline.eyebrow}</p>
            <h2 className="display mt-4 text-4xl leading-none md:text-6xl">{timeline.title}</h2>
            <p className="mt-5 text-mute">{timeline.lede}</p>
          </div>
          <ol className="relative border-l border-lilac/25 pl-6 md:pl-10">
            {timeline.entries.map((entry, index) => (
              <motion.li
                key={entry.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.45, delay: index * 0.04 }}
                className="relative pb-14 last:pb-0"
              >
                <span className="absolute -left-[1.85rem] top-1.5 h-3 w-3 bg-violet md:-left-[2.85rem]" aria-hidden="true" />
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-lilac">{entry.when}</p>
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-dim">{entry.kind} · On the resume</p>
                </div>
                <h3 className="display mt-3 text-3xl md:text-4xl">{entry.title}</h3>
                <p className="mt-1 text-mute">
                  {entry.org}
                  <span className="text-dim"> — {entry.place}</span>
                </p>
                <ul className="mt-4 space-y-3 text-ink/95">
                  {entry.points.map((point) => (
                    <li key={point} className="max-w-3xl leading-relaxed">
                      {point}
                    </li>
                  ))}
                </ul>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>
    </MotionConfig>
  );
}
