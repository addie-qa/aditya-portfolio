"use client";

import { nav, site } from "@/content/site";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { useEffect, useState } from "react";

export function SiteNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <MotionConfig reducedMotion="user">
      <header className="fixed inset-x-0 top-0 z-30 mix-blend-normal">
        <div className="section-pad relative z-40 flex items-center justify-between bg-void/75 py-4 backdrop-blur-md">
          <a href="#content" className="font-serif text-lg tracking-tight text-ink">
            {site.name}
          </a>
          <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-mute hover:text-lilac"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href="#contact"
            className="hidden font-mono text-[0.68rem] uppercase tracking-[0.18em] text-lilac md:inline"
          >
            Say hello
          </a>
          <button
            type="button"
            className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-lilac md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
        <AnimatePresence>
          {open ? (
            <motion.nav
              id="mobile-nav"
              aria-label="Mobile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="section-pad fixed inset-0 top-0 flex flex-col justify-end gap-5 bg-void/95 pb-16 pt-24 md:hidden"
            >
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="display text-5xl text-ink"
                >
                  {item.label}
                </a>
              ))}
            </motion.nav>
          ) : null}
        </AnimatePresence>
      </header>
    </MotionConfig>
  );
}
