/**
 * All public copy lives in this file.
 *
 * Experience matches the public resume in /public/Aditya-Arora-Resume.pdf
 * (Techsphere, EddyTools, JobSearchAI, RIMT University).
 * Do not add employers, metrics, dates, or tools that are not on that resume
 * or explicitly confirmed. Project investigations describe a testing approach
 * without client names or performance claims.
 */

export const site = {
  name: "Aditya Arora",
  role: "SDET / QA Automation Engineer",
  url: "https://aditya-portfolio-liard-chi.vercel.app/",
  email: "addie.usit@gmail.com",
  linkedin: "https://www.linkedin.com/in/aditya-arora-331364234/",
  github: "https://github.com/addie-qa/saucedemo",
  resume: "/Aditya_Arora_Senior_QA_Engineer_final_Resume.pdf",
  location: "India",
  availability: "Open to SDET and Senior QA Automation interviews",
  headline: "I don't just test software. I challenge it.",
  contactHeadline: "Let's build software that earns trust.",
  deck: "I build automation that is allowed to fail in the open, explain itself, and earn another run — across web, mobile, API, performance, and AI-assisted testing.",
} as const;

export const nav = [
  { href: "#story", label: "Run" },
  { href: "#skills", label: "Skills" },
  { href: "#work", label: "Work" },
  { href: "#path", label: "Path" },
  { href: "#contact", label: "Contact" },
] as const;

export type StoryStage = {
  id: string;
  index: string;
  title: string;
  body: string;
  log: string[];
};

export const story = {
  eyebrow: "02  —  A run under observation",
  title: "From a red step to a second proof",
  lede: "Scroll to move through one illustrated test. The terminal is simulated. It is not a log from a production suite.",
  stages: [
    {
      id: "init",
      index: "01",
      title: "Initialization",
      body: "The suite wakes a browser, opens a context, and starts a trace before it touches the product. Setup is part of the evidence.",
      log: [
        "$ npx playwright test chat.spec.ts --project=chromium",
        "Running 1 test using 1 worker",
        "[setup] browser.newContext()",
        "[setup] tracing.start()  ·  screenshots, snapshots",
        "[setup] page.goto('/chat')",
      ],
    },
    {
      id: "fail",
      index: "02",
      title: "Locator failure",
      body: "The button the test asked for is not the button on the screen. The failure is the useful part. It names exactly what it could not see.",
      log: [
        "× locator.click: Timeout 5000ms exceeded",
        "  waiting for getByRole('button', { name: 'Send' })",
        "  locator resolved to 0 elements",
        "  note: a control labeled “Send message” is visible",
      ],
    },
    {
      id: "analyze",
      index: "03",
      title: "Analysis",
      body: "Compare the intention with the accessibility tree. The action is still there. The accessible name moved, which is a product change, not a mystery flake.",
      log: [
        "[analyze] trace snapshot at the failing step",
        "expected role: button  name: Send",
        "visible role:  button  name: Send message",
        "attribute: data-testid=composer-send",
        "likely cause: copy change, same control",
      ],
    },
    {
      id: "recover",
      index: "04",
      title: "Recovery",
      body: "An assisted pass can propose a sturdier locator. It does not get to bless itself. A person accepts the change, and the original failure stays in the report.",
      log: [
        "[assist] suggestion, not an auto-commit",
        "replace name-only locator",
        "with getByTestId('composer-send')",
        "status: waiting for review",
        "original error retained in the report",
      ],
    },
    {
      id: "revalidate",
      index: "05",
      title: "Revalidation",
      body: "Run the same behavior again. A green step is a claim. The trace is what makes the claim inspectable.",
      log: [
        "[revalidate] retrying chat.spec.ts",
        "✓ composer accepts the message",
        "✓ thread shows the sent text",
        "trace: ./test-results/chat/trace.zip",
        "result: recovered after review  ·  simulated",
      ],
    },
  ] satisfies StoryStage[],
};

export type SkillGroup = {
  id: string;
  label: string;
  summary: string;
  skills: string[];
};

export const skills = {
  eyebrow: "03  —  Constellation",
  title: "Tools, grouped by the risk they cover",
  lede: "Select a cluster. On a small screen the same groups open as a list.",
  also: "The public resume also lists product work with React, Next.js, Node.js, and cloud tooling. Those sit beside this quality practice, not instead of it.",
  groups: [
    {
      id: "web",
      label: "Web",
      summary: "Browser automation for flows a person can see: Playwright, Cypress, and Selenium.",
      skills: ["Playwright", "Cypress", "Selenium"],
    },
    {
      id: "languages",
      label: "Languages",
      summary: "The suites are written in JavaScript and TypeScript, close to the product code.",
      skills: ["JavaScript", "TypeScript"],
    },
    {
      id: "mobile",
      label: "Mobile",
      summary: "Appium for native and cross-device behavior, where one phone is not the whole story.",
      skills: ["Appium"],
    },
    {
      id: "api",
      label: "API",
      summary: "Contracts checked on purpose with API tests and Postman, not only through the UI.",
      skills: ["API testing", "Postman"],
    },
    {
      id: "performance",
      label: "Performance",
      summary: "JMeter for the paths that are correct and still too slow, or correct until load arrives.",
      skills: ["JMeter"],
    },
    {
      id: "cicd",
      label: "CI/CD",
      summary: "Pipelines that run the proof on every change. Resume tools include GitHub Actions, Jenkins, and Docker.",
      skills: ["GitHub Actions", "Jenkins", "Docker"],
    },
    {
      id: "ai",
      label: "AI testing",
      summary: "AI-assisted testing as a second reader for failures. Suggestions stay reviewable.",
      skills: ["AI-assisted testing"],
    },
  ] satisfies SkillGroup[],
};

export type Project = {
  id: string;
  index: string;
  title: string;
  kicker: string;
  summary: string;
  points: string[];
  tags: string[];
};

export const projects = {
  eyebrow: "04  —  Investigations",
  title: "Four ways a product can lie",
  lede: "These are testing problems I work through. They are not client case studies, and they do not claim measured outcomes. Edit this file before adding a number or an employer.",
  items: [
    {
      id: "heal",
      index: "01",
      title: "AI-assisted self-healing",
      kicker: "When the name of a control drifts",
      summary:
        "A locator tied only to visible copy breaks the moment the copy changes. I treat that as a reviewable repair: keep the failure, propose a stable hook, and rerun the behavior after a person accepts it.",
      points: [
        "Playwright traces show the accessibility tree at the failing step.",
        "An assist pass may suggest a test id, role, or text fallback.",
        "Nothing is rewritten in silence. The first error stays in the report.",
      ],
      tags: ["Playwright", "TypeScript", "AI-assisted testing"],
    },
    {
      id: "chat",
      index: "02",
      title: "Cross-device chat",
      kicker: "A message has two ends",
      summary:
        "Sending on one device is not delivery. I automate both sides with Appium so a message has to leave, arrive, and land in the right thread on another device.",
      points: [
        "Separate sessions for each device, not one shared locator file.",
        "Assertions on delivery, order, and unread state.",
        "Android and iOS stay in the same story without pretending they share a DOM.",
      ],
      tags: ["Appium", "Mobile", "End-to-end"],
    },
    {
      id: "video",
      index: "03",
      title: "Video upload, then the backend",
      kicker: "The progress bar is not the file",
      summary:
        "A finished upload animation can hide a file that never became playable. I drive the UI, then ask the API whether the asset exists, finished processing, and can actually be played.",
      points: [
        "UI confirms the person could choose a file and start the upload.",
        "API confirms status, identity, and a playback-ready response.",
        "The test fails if the screen says success and the asset does not.",
      ],
      tags: ["UI", "API testing", "Media"],
    },
    {
      id: "perf",
      index: "04",
      title: "API and performance",
      kicker: "Correct, and still in time",
      summary:
        "I check the contract in Postman and put weight on the same paths with JMeter. A fast wrong response and a slow right one are both defects.",
      points: [
        "Functional checks for status, shape, and auth failures.",
        "Load modeled after a real journey, not an empty loop.",
        "CI runs the functional suite even when the heavy test stays scheduled.",
      ],
      tags: ["Postman", "JMeter", "CI/CD"],
    },
  ] satisfies Project[],
};

export type TimelineEntry = {
  id: string;
  when: string;
  title: string;
  org: string;
  place: string;
  kind: string;
  points: string[];
};

export const timeline = {
  eyebrow: "05 — Record",
  title: "Experience, projects & education",
  lede:
    "My professional experience, projects, and education in software quality and test automation.",

  entries: [
    {
      id: "radiansys",
      when: "Jan 2022 — Aug 2026",
      title: "SDET / QA Automation Engineer",
      org: "Radiansys Technologies",
      place: "Gurugram, India",
      kind: "Full-time",
      points: [
        "Built and maintained UI and API automation frameworks using Playwright, JavaScript, TypeScript, and Cypress.",
        "Automated web and mobile applications using Playwright and Appium.",
        "Integrated automated tests into CI/CD pipelines and supported continuous regression testing.",
        "Performed API and performance testing using Postman and Apache JMeter.",
        "Explored AI-assisted testing, LLM-based test generation, and self-healing automation.",
      ],
    },
    {
      id: "kyrox",
      when: "Jan 2021 — Dec 2022",
      title: "QA Engineer",
      org: "Kyrox Consulting",
      place: "India",
      kind: "Full-time",
      points: [
        "Performed functional, regression, and integration testing.",
        "Created test cases, reported defects, and collaborated with developers to validate fixes.",
      ],
    },
  ],
};

export const contact = {
  eyebrow: "06  —  Finale",
  headline: site.contactHeadline,
  lede: "For SDET and senior QA automation conversations. The resume is the same PDF linked from this site.",
} as const;
