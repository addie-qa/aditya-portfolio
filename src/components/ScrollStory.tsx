"use client";

import { story } from "@/content/site";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ScrollStory() {
  const rootRef = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(0);
  const currentRef = useRef(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const media = window.matchMedia(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
    );

    let trigger: ScrollTrigger | null = null;

    const bind = () => {
      trigger?.kill();
      trigger = null;
      if (!media.matches) {
        root.style.removeProperty("--p");
        return;
      }

      trigger = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          root.style.setProperty("--p", `${Math.round(self.progress * 100)}%`);
          const next = Math.min(
            story.stages.length - 1,
            Math.floor(self.progress * story.stages.length * 0.999),
          );
          if (next !== currentRef.current) {
            currentRef.current = next;
            setCurrent(next);
          }
        },
      });
    };

    bind();
    media.addEventListener("change", bind);
    window.addEventListener("resize", bind);
    return () => {
      media.removeEventListener("change", bind);
      window.removeEventListener("resize", bind);
      trigger?.kill();
    };
  }, []);

  const jumpTo = (index: number) => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    if (!desktop || reduce) {
      document.getElementById(story.stages[index].id)?.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
      return;
    }
    const distance = root.offsetHeight - window.innerHeight;
    const top = root.offsetTop + (distance * (index + 0.45)) / story.stages.length;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section id="story" ref={rootRef} className="story-scene relative bg-night">
      <div className="story-frame section-pad flex flex-col justify-center py-24">
        <div className="mb-8 max-w-3xl">
          <p className="eyebrow">{story.eyebrow}</p>
          <h2 className="display mt-4 text-4xl leading-none text-ink md:text-6xl">{story.title}</h2>
          <p className="mt-4 max-w-2xl text-mute">{story.lede}</p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[15rem_minmax(0,1fr)]">
          <div className="relative">
            <div className="story-rail absolute bottom-1 left-[13px] top-1 hidden w-px lg:block" aria-hidden="true" />
            <ol className="flex gap-3 overflow-x-auto lg:flex-col lg:gap-5 lg:overflow-visible" aria-label="Run progress">
              {story.stages.map((stage, index) => {
                const active = index === current;
                return (
                  <li key={stage.id}>
                    <button
                      type="button"
                      onClick={() => jumpTo(index)}
                      aria-current={active ? "step" : undefined}
                      className={`flex min-w-36 items-center gap-3 text-left font-mono text-[0.68rem] uppercase tracking-[0.16em] ${
                        active ? "text-lilac" : "text-dim"
                      }`}
                    >
                      <span
                        className={`relative z-10 grid h-7 w-7 shrink-0 place-items-center border bg-night ${
                          active ? "border-violet text-ink" : "border-lilac/30"
                        }`}
                      >
                        {stage.index}
                      </span>
                      <span className="hidden lg:inline">{stage.title}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          <div>
            {story.stages.map((stage, index) => (
              <article
                key={stage.id}
                id={stage.id}
                className={`stage-card scroll-mt-28 mb-6 grid gap-6 border border-lilac/15 bg-void/40 p-5 last:mb-0 md:p-7 lg:mb-0 lg:grid-cols-2 lg:border-0 lg:bg-transparent lg:p-0 ${
                  index === current ? "is-current" : ""
                }`}
              >
                <div>
                  <p className="font-mono text-xs tracking-[0.18em] text-violet">{stage.index} / 05</p>
                  <h3 className="display mt-3 text-4xl text-ink md:text-5xl">{stage.title}</h3>
                  <p className="mt-4 max-w-md text-lg leading-relaxed text-mute">{stage.body}</p>
                </div>
                <div className="terminal p-4 md:p-5">
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-lilac">
                    Simulated terminal output
                  </p>
                  <pre className="mt-4 overflow-x-auto whitespace-pre-wrap font-mono text-[0.78rem] leading-6 text-ink">
                    {stage.log.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </pre>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
