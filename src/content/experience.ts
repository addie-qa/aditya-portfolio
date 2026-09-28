/**
 * Copy for the corridor. Employment matches public/Aditya-Arora-Resume.pdf.
 * Do not add employers, dates, certifications, or metrics that are not on that resume.
 * The four testing investigations describe an approach. They are not client case studies.
 */

export type RoomId = "hub" | "lab" | "gallery" | "experience" | "contact";

export const rooms: { id: RoomId; index: string; label: string; hint: string; enter: string }[] = [
  { id: "hub", index: "01", label: "Home", hint: "The corridor", enter: "Walk the corridor" },
  { id: "lab", index: "02", label: "Lab", hint: "Automation lab", enter: "Enter automation lab" },
  { id: "gallery", index: "03", label: "Projects", hint: "Project gallery", enter: "Open project gallery" },
  { id: "experience", index: "04", label: "Experience", hint: "Experience", enter: "Open experience" },
  { id: "contact", index: "05", label: "Contact", hint: "Contact", enter: "Open contact" },
];

export const profile = {
  name: "Aditya Arora",
  role: "SDET  |  QA Automation Engineer",
  place: "India",
  headline: "I engineer quality. I automate confidence.",
  support:
    "I build reliable automation for web, mobile, and APIs — Playwright, Cypress, Selenium, Appium, Postman, JMeter, and pipelines that keep the proof attached to the change.",
  email: "addie.usit@gmail.com",
  phone: "+91 9268678880",
  linkedin: "https://www.linkedin.com/in/aditya-arora-331364234/",
  github: "https://github.com/addie-qa/saucedemo",
  resume: "/Aditya-Arora-Resume.pdf",
};

/** Camera travel along the corridor, in meters. Forward is toward `end`. */
export const corridorTravel = {
  start: 4.2,
  end: -36.2,
};

export const toolkit = {
  title: "My toolkit",
  subtitle: "Technologies I use to build, test and ship reliable software.",
  tools: [
    { name: "Playwright", mark: "PW", blurb: "Web UI and API automation using JavaScript and TypeScript." },
    { name: "Cypress", mark: "CY", blurb: "UI, API, and component or end-to-end checks." },
    { name: "Selenium", mark: "SE", blurb: "Cross-browser UI automation." },
    { name: "Appium", mark: "AP", blurb: "Android and iOS cross-device testing." },
    { name: "Postman", mark: "PM", blurb: "REST API requests, status, and JSON checks." },
    { name: "JMeter", mark: "JM", blurb: "Load testing and performance validation." },
    { name: "JavaScript", mark: "JS", blurb: "Language for tests, tooling, and automation." },
    { name: "TypeScript", mark: "TS", blurb: "Typed test code and page objects." },
    { name: "Git", mark: "GIT", blurb: "Version control for the change under test." },
    { name: "GitHub", mark: "GH", blurb: "Source hosting for projects and suites." },
    { name: "GitHub Actions", mark: "GHA", blurb: "CI for automated regression." },
    { name: "Jenkins", mark: "JK", blurb: "Pipeline runs for build and test." },
    { name: "REST API", mark: "API", blurb: "Contract checks on HTTP APIs." },
    { name: "SQL", mark: "SQL", blurb: "Data checks behind the feature under test." },
    { name: "AI / LLM Testing", mark: "AI", blurb: "Reviewable locator suggestions and assisted workflows." },
  ],
};

export const lab = {
  title: "Automation lab",
  tagline: "Where I turn repetitive testing into reliable automation.",
  lede: "Playwright for UI and API, JavaScript and TypeScript, page objects, cross-browser runs, GitHub Actions, and an assist pass that may suggest a locator. The run below is simulated. No model is being called.",
  skills: ["Playwright", "JavaScript", "TypeScript", "Page Object Model", "Cross-browser", "GitHub Actions", "AI-assisted review"],
  steps: [
    { id: "start", title: "Test starts", log: "simulated  ·  npx playwright test checkout.spec.ts" },
    { id: "fail", title: "Locator failure", log: "simulated  ·  getByRole('button', { name: 'Pay' })  ·  0 elements" },
    { id: "recover", title: "Recovery strategy", log: "simulated  ·  suggest getByTestId('pay-now')  ·  waiting for a person to accept" },
    { id: "revalidate", title: "Revalidation", log: "simulated  ·  same behavior, new locator, trace kept" },
    { id: "result", title: "Result", log: "simulated  ·  recovered after review  ·  this is not a live AI service" },
  ],
};

export const labPanels = [
  { title: "Playwright", lines: ["JavaScript / TypeScript", "UI automation", "API automation", "Cross-browser", "End to end"] },
  { title: "Cypress", lines: ["UI testing", "API testing", "Component and end to end"] },
  { title: "Appium", lines: ["Android", "iOS", "Cross-device testing"] },
  { title: "API testing", lines: ["Postman", "REST APIs", "JSON validation"] },
  { title: "Performance", lines: ["JMeter", "Load testing", "Performance validation"] },
  { title: "CI/CD", lines: ["GitHub Actions", "Jenkins", "Automated regression"] },
  { title: "AI-assisted testing", lines: ["LLM-assisted generation", "Self-healing locators", "Reviewable workflows"] },
];

export const labScreens = [
  {
    title: "Test run",
    lines: ["Demonstration only", "Not a recorded result", "Playwright layout", "Passed / failed / rate"],
  },
  {
    title: "CI/CD pipeline",
    lines: ["Demonstration only", "Code", "Build", "Test", "Report", "Deploy"],
  },
  {
    title: "AI self-healing",
    lines: ["Demonstration only", "Broken locator", "Analysis", "Alternative locator", "Recovered after review"],
  },
];

export const galleryClients = [
  "Simpplr",
  "FBI - Farm Bureau Insurance",
  "Gitsy",
  "Vital",
  "Pan App",
  "Northstar Home Tech",
  "Provider Note",
  "VFX AI",
].map((name) => ({
  name,
  scope: "Not documented in the current resume or site copy.",
  stack: "Not documented for this project.",
  type: "Not documented for this project.",
  responsibilities: "Not documented for this project.",
}));

export const projects = [
  {
    title: "AI-assisted self-healing",
    problem: "A locator tied to visible copy fails when the copy changes, and the failure looks like a flake.",
    contribution: "I separate the broken step from a suggested repair so the suite can explain itself.",
    approach: "Read the trace, compare the expected role with what is actually in the accessibility tree, and propose a test id or role fallback.",
    strategy: "The original error stays in the report. A person accepts the locator before it is trusted again.",
    outcome: "No client metric is published for this investigation. The verified part is the method: suggestion, review, rerun.",
  },
  {
    title: "Appium cross-device chat",
    problem: "A message can look sent on one device and never arrive on the other.",
    contribution: "I treat delivery as a two-session test instead of a single-screen assertion.",
    approach: "Appium drives each device with its own locators, then checks order and unread state.",
    strategy: "Android and iOS stay separate. The test fails if only the sender updates.",
    outcome: "No device-lab report is attached here. Add a link in this file when one exists.",
  },
  {
    title: "Video upload and backend verification",
    problem: "The upload screen can say finished while the asset is not playable.",
    contribution: "I pair the UI action with an API check of the asset itself.",
    approach: "Drive the file selection, then confirm identity, processing status, and a playback response.",
    strategy: "UI success without a ready asset is a failure.",
    outcome: "No upload report or screenshot is in the repo. The check is described, not measured.",
  },
  {
    title: "API and performance testing",
    problem: "A correct slow response and a fast wrong one both ship if only one layer is tested.",
    contribution: "I keep the contract and the load story on the same paths.",
    approach: "Postman for status, shape, and auth. JMeter for journeys that match real use, not an empty loop.",
    strategy: "Functional checks run in CI. Heavier runs stay scheduled.",
    outcome: "No benchmark numbers are claimed. GitHub Actions is the pipeline named on the resume.",
  },
];

export const record = {
  positioning: "Senior QA Engineer · SDET · Automation Testing Specialist · 4+ years",

  note:
    "SDET and Quality Engineer with 4+ years of experience building scalable test automation frameworks for web, mobile, API, performance, and AI-native applications.",

  roles: [
    {
      when: "Jun 2022 — Aug 2026",
      title: "SDET",
      org: "Radiansys Technologies · Simpplr · Gurgaon",
      points: [
        "Designed and maintained scalable automation frameworks using Playwright, Cypress, and Appium for web and mobile applications.",
        "Built LLM-driven testing workflows using Claude Code and custom agent skills for automated Playwright test generation, execution, and validation.",
        "Engineered self-healing test automation using agent checks with multimodal computer vision, including pixel and DOM inspection.",
        "Developed and maintained 300+ automated test cases for a healthcare AI mobile application.",
        "Built hybrid UI + API automation frameworks and integrated automated regression testing with GitHub Actions and Jenkins.",
        "Led Android and iOS automation using Appium and performed API, performance, and load testing using Postman, RestAssured, and Apache JMeter.",
      ],
    },

    {
      when: "Jan 2021 — Jan 2022",
      title: "QA Engineer",
      org: "Kyro Consulting · Gurgaon",
      points: [
        "Developed end-to-end automation frameworks for web and mobile applications using Cypress, Playwright, and Appium.",
        "Performed cross-platform testing across Android and iOS devices.",
        "Conducted performance testing using Apache JMeter to identify application bottlenecks.",
        "Worked with JavaScript-based automation and supported functional, regression, and end-to-end testing.",
      ],
    },
  ],

  groups: [
    {
      label: "Automation",
      items: ["Playwright", "Cypress", "Selenium", "Appium"],
    },

    {
      label: "Languages",
      items: ["JavaScript", "TypeScript"],
    },

    {
      label: "Frameworks",
      items: ["Page Object Model", "BDD / Cucumber", "Hybrid UI + API"],
    },

    {
      label: "API Testing",
      items: ["Postman", "REST APIs", "RestAssured", "JSON", "Schema Validation"],
    },

    {
      label: "Performance",
      items: ["Apache JMeter", "k6", "Load Testing", "Stress Testing"],
    },

    {
      label: "CI/CD",
      items: ["Git", "GitHub Actions", "Jenkins"],
    },

    {
      label: "AI & Agentic QA",
      items: [
        "LLM Test Case Generation",
        "Claude Code",
        "Self-Healing Locators",
        "Agent Verification",
        "Vision / Pixel Inspection",
        "LLM Benchmarking",
      ],
    },

    {
      label: "Testing",
      items: [
        "Functional Testing",
        "Regression Testing",
        "Integration Testing",
        "System Testing",
        "E2E Testing",
        "Defect Lifecycle",
      ],
    },

    {
      label: "Domains",
      items: [
        "Healthcare AI",
        "SaaS",
        "Insurance",
        "E-commerce",
        "Customer Onboarding",
      ],
    },
  ],

  education: {
    degree: "Bachelor of Computer Applications (BCA)",
    university: "Himalayan Garhwal University",
    when: "Aug 2020 — May 2023",
  },

  contact: {
    email: "addie.usit@gmail.com",
    phone: "+91 92686 78880",
    location: "Gurugram, India",
    linkedin: "https://www.linkedin.com/in/aditya-arora-331364234/",
  },
};  

export function roomFromSlug(slug: string | undefined): RoomId {
  if (!slug || slug === "hub" || slug === "corridor") return "hub";
  if (slug === "lab" || slug === "studio") return "lab";
  if (slug === "gallery" || slug === "projects") return "gallery";
  if (slug === "experience" || slug === "about" || slug === "skills") return "experience";
  if (slug === "contact") return "contact";
  return "hub";
}

export function slugForRoom(room: RoomId) {
  if (room === "hub") return "";
  if (room === "lab") return "studio";
  if (room === "experience") return "about";
  return room;
}
