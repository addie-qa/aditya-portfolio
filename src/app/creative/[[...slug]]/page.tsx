import { ExperienceShell } from "@/components/experience/ExperienceShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Creative corridor",
  description:
    "Walk Aditya Arora's corridor: automation lab, project gallery, verified experience, and contact.",
};

export default function CreativePage() {
  return <ExperienceShell />;
}
