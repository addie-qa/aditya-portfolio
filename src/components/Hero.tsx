"use client";

import { site } from "@/content/site";
import { motion, MotionConfig } from "framer-motion";
import { useEffect, useRef } from "react";

function Atmosphere() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const motes = Array.from({ length: 42 }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: 30 + Math.random() * 190,
      speed: 0.12 + Math.random() * 0.4,
      size: 0.6 + Math.random() * 1.6,
    }));

    let frame = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      const cx = width * 0.5;
      const cy = height * 0.48;
      const glow = context.createRadialGradient(cx, cy, 10, cx, cy, width * 0.55);
      glow.addColorStop(0, "rgba(154,103,255,0.55)");
      glow.addColorStop(0.38, "rgba(72,32,140,0.18)");
      glow.addColorStop(1, "rgba(8,7,13,0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);

      motes.forEach((mote) => {
        const angle = mote.angle + time * 0.00012 * mote.speed;
        const x = cx + Math.cos(angle) * mote.radius;
        const y = cy + Math.sin(angle) * mote.radius * 0.52;
        context.fillStyle = "rgba(196,165,255,0.8)";
        context.beginPath();
        context.arc(x, y, mote.size, 0, Math.PI * 2);
        context.fill();
      });

      if (!reduce) frame = requestAnimationFrame(draw);
    };

    resize();
    frame = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}

export function Hero() {
  return (
    <MotionConfig reducedMotion="user">
      <section className="relative flex min-h-screen items-end overflow-hidden pb-16 pt-28">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-full md:w-[58%]">
          <Atmosphere />
          <div className="prism absolute right-[4%] top-[18%] h-72 w-72 md:top-1/2 md:h-auto md:w-[min(34rem,100%)] md:-translate-y-1/2" aria-hidden="true">
            <span className="prism-ring" />
            <span className="prism-ring" />
            <span className="prism-ring" />
            <span className="prism-slash" />
            <span className="prism-core" />
          </div>
        </div>

        <div className="section-pad relative z-10 grid w-full gap-10 md:grid-cols-[minmax(0,42rem)_1fr]">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="eyebrow"
            >
              01  —  The Quality Dimension
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="display mt-6 max-w-[12ch] text-[clamp(3.3rem,8vw,7.4rem)] leading-[0.9] text-ink"
            >
              {site.headline}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12 }}
              className="mt-8 max-w-xl text-lg leading-relaxed text-mute md:text-xl"
            >
              {site.deck}
            </motion.p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <a
                href="#story"
                className="inline-flex items-center gap-3 bg-violet px-6 py-3 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-void"
              >
                Explore my work
                <span aria-hidden="true">↓</span>
              </a>
              <a
                href={site.resume}
                className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-lilac underline decoration-violet/50 underline-offset-4"
              >
                Resume
              </a>
            </div>
          </div>
          <div className="flex items-end justify-between md:flex-col md:items-end md:justify-end md:pb-2">
            <p className="font-serif text-2xl text-ink md:text-3xl">{site.name}</p>
            <p className="text-right font-mono text-[0.68rem] uppercase tracking-[0.16em] text-dim md:mt-3">
              {site.role}
              <span className="mt-1 block normal-case tracking-normal text-mute">{site.availability}</span>
            </p>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
