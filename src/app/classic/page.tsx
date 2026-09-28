import { ContactFinale } from "@/components/ContactFinale";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { ScrollStory } from "@/components/ScrollStory";
import { SiteNav } from "@/components/SiteNav";
import { SkillConstellation } from "@/components/SkillConstellation";
import { Timeline } from "@/components/Timeline";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Classic portfolio",
  description: "A scroll-based reading of Aditya Arora's quality engineering work.",
};

export default function ClassicPage() {
  return (
    <>
      <SiteNav />
      <main id="content">
        <Hero />
        <ScrollStory />
        <SkillConstellation />
        <Projects />
        <Timeline />
        <ContactFinale />
      </main>
    </>
  );
}
