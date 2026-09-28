import { contact, site } from "@/content/site";

const links = [
  { label: "Email", value: site.email, href: `mailto:${site.email}` },
  { label: "LinkedIn", value: "linkedin.com/in/adityaarorasde", href: site.linkedin },
  { label: "GitHub", value: "github.com/Adityasgit", href: site.github },
  { label: "Resume", value: "Open PDF", href: site.resume },
];

export function ContactFinale() {
  return (
    <section id="contact" className="relative scroll-mt-24 overflow-hidden bg-night">
      <div
        className="pointer-events-none absolute -bottom-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-violet/30 blur-3xl"
        aria-hidden="true"
      />
      <div className="section-pad relative py-28 md:py-40">
        <p className="eyebrow">{contact.eyebrow}</p>
        <h2 className="display mt-6 max-w-5xl text-[clamp(3rem,8vw,7rem)] leading-[0.9]">
          {contact.headline}
        </h2>
        <p className="mt-6 max-w-xl text-lg text-mute">{contact.lede}</p>
        <div className="mt-14 max-w-3xl">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="link-row group text-ink"
              {...(link.href.startsWith("http") || link.href.endsWith(".pdf")
                ? { target: "_blank", rel: "noreferrer" }
                : {})}
            >
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-lilac">{link.label}</span>
              <span className="truncate text-lg md:text-2xl">{link.value}</span>
              <span aria-hidden="true" className="text-lilac transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
          ))}
        </div>
        <p className="mt-12 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-dim">
          {site.name} · {site.location}
        </p>
      </div>
    </section>
  );
}
