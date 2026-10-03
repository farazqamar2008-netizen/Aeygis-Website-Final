// TODO: confirm the public tenders inbox before launch.
export const CONTACT_EMAIL = "tenders@aeygis.com";

export interface OfferingSection {
  title: string;
  lede?: string;
  items: { label?: string; title: string; body?: string }[];
}

export interface Offering {
  /** Route for the offering's page on this site: /<slug>. */
  slug: string;
  name: string;
  kind: "Software" | "Service";
  tagline: string;
  /** The offering's own website. Unset shows "Website coming soon" on its page. */
  website?: string;
  /** Decorative mark shown in the artwork column (see ServiceMark). */
  mark: "cadence" | "gantry" | "health" | "security";
  /** Loop that plays over the mark on hover. Swap for final footage in public/media/services/. */
  video: string;
  /** Opening paragraphs on the offering's page. */
  intro: string[];
  facts: { label: string; value: string }[];
  sections?: OfferingSection[];
  /** Primary call to action on the offering's page. */
  cta: { label: string; href: string };
}

// "Our Software & Services" list, in display order.
// Known site, to set as `website` once it goes live:
//   Aeygis Health: https://health.aeygis.com/
export const OFFERINGS: Offering[] = [
  {
    slug: "cadence",
    name: "Cadence",
    kind: "Software",
    tagline: "Run a whole staffing agency in one place, from intake to payroll",
    website: "https://app-cadence.com/index.html",
    mark: "cadence",
    video: "/media/services/cadence.mp4",
    intro: [
      "Cadence is staffing agency software that runs the whole operation in one place, from the first intake to the final payroll run.",
      "It is built and supported by Aeygis and offered to public-sector buyers through the Aeygis tenders desk.",
    ],
    facts: [
      { label: "Type", value: "Software" },
      { label: "Scope", value: "Intake to payroll" },
      { label: "Buy through", value: "Aeygis tenders desk" },
    ],
    cta: { label: "Send us a solicitation", href: "/#contact" },
  },
  {
    slug: "gantry",
    name: "Gantry",
    kind: "Service",
    tagline: "AWS infrastructure, built and run",
    mark: "gantry",
    video: "/media/services/gantry.mp4",
    intro: [
      "Gantry does one thing: it designs, builds and runs AWS for teams that have outgrown the setups they improvised.",
      "The name comes from the launch pad, where a gantry holds a rocket steady until launch. Reach beyond the cloud, shoot for the stars.",
    ],
    facts: [
      { label: "Focus", value: "AWS, end to end" },
      { label: "Industries", value: "Finance · Healthcare · Retail · Public sector · SaaS" },
      { label: "Contact", value: "cto.cloud@aeygis.com" },
    ],
    sections: [
      {
        title: "What Gantry builds",
        items: [
          { title: "Cloud foundations", body: "A landing zone spread across multiple AWS accounts, with guardrails and central logging." },
          { title: "Migration and modernisation", body: "Moving off legacy hosting, with each workload assessed separately and every cutover rehearsed." },
          { title: "Managed operations", body: "Monitoring, patching, backups and someone on call." },
          { title: "Security and compliance", body: "SOC 2, HIPAA, PCI DSS and ISO 27001, with controls built into the baseline setup." },
          { title: "Cost optimisation", body: "Right-sizing, Savings Plans and tagging." },
          { title: "DevOps and delivery", body: "Infrastructure as code (Terraform, CDK) and CI/CD pipelines." },
        ],
      },
      {
        title: "Countdown to launch",
        lede: "Every engagement runs through the same five phases.",
        items: [
          { label: "T-4", title: "Assess", body: "A fixed-price findings document." },
          { label: "T-3", title: "Design", body: "An architecture you sign off before anything is provisioned." },
          { label: "T-2", title: "Build", body: "All in code, every change reversible." },
          { label: "T-1", title: "Operate", body: "Gantry runs it, hands it to your team, or both." },
          { label: "Lift off", title: "Optimise", body: "Quarterly reviews." },
        ],
      },
      {
        title: "Principles",
        items: [
          { title: "Design before build", body: "Nothing is provisioned until the architecture is agreed." },
          { title: "No lock-in", body: "You get the docs, the code and the training." },
          { title: "Waste is our failure", body: "Money lost to idle or oversized resources is ours to fix." },
          { title: "Real status, early", body: "You hear how things actually stand, while there is still time to act." },
        ],
      },
    ],
    cta: { label: "Book a free assessment", href: "mailto:cto.cloud@aeygis.com?subject=Gantry%20free%20assessment" },
  },
  {
    slug: "health",
    name: "Aeygis Health",
    kind: "Service",
    tagline: "Healthcare infrastructure, engineered like critical infrastructure",
    mark: "health",
    video: "/media/services/health.mp4",
    intro: [
      "Aeygis Health builds healthcare infrastructure and engineers it to the standard of critical infrastructure.",
      "It is offered to public-sector buyers through the Aeygis tenders desk.",
    ],
    facts: [
      { label: "Type", value: "Service" },
      { label: "Sector", value: "Healthcare" },
      { label: "Buy through", value: "Aeygis tenders desk" },
    ],
    cta: { label: "Send us a solicitation", href: "/#contact" },
  },
  {
    slug: "security",
    name: "Aeygis Security",
    kind: "Service",
    tagline: "SOC 2 readiness, cyber assessments and CPCSC Level 1 audits",
    mark: "security",
    video: "/media/services/security.mp4",
    intro: [
      "Aeygis Security gets organizations ready for SOC 2, runs cyber assessments and delivers Canadian Program for Cyber Security Certification (CPCSC) Level 1 audits for the defence supply chain.",
      "In 2027 the team is delivering more than 200 CPCSC Level 1 audits, helping suppliers stay eligible for federal contracts.",
    ],
    facts: [
      { label: "Compliance", value: "SOC 2 readiness" },
      { label: "Program", value: "CPCSC Level 1" },
      { label: "2027 audits", value: "200+" },
      { label: "Sector", value: "Defence supply chain" },
    ],
    sections: [
      {
        title: "How we help with SOC 2",
        lede: "From a first look at your controls to the day your auditor signs off.",
        items: [
          { title: "Scope and gap assessment", body: "We map your systems against the Trust Services Criteria you need and show exactly where the gaps are." },
          { title: "Controls and policies", body: "We help you put the missing controls and written policies in place, sized to how your team actually works." },
          { title: "Evidence readiness", body: "We set up the evidence your auditor will ask for, so collecting it is routine rather than a scramble." },
          { title: "Type I and Type II support", body: "We prepare you for the Type I point-in-time review, then keep controls running through the Type II observation period." },
          { title: "Audit day support", body: "We work alongside your independent CPA auditor, answering requests and closing findings quickly." },
        ],
      },
    ],
    cta: { label: "Book an audit", href: "/#contact" },
  },
];

export interface UpdateItem {
  id: string;
  /** Short label for the topic chip row. */
  chip: string;
  tag: string;
  date: string;
  title: string;
  body: string;
  /** Drop Midjourney loops into public/media/updates/ and point here. */
  video?: string;
  poster?: string;
  cta?: { label: string; href: string };
}

export const UPDATES: UpdateItem[] = [
  {
    id: "cpcsc-2027",
    chip: "CPCSC 2027",
    tag: "Aeygis Security · CPCSC",
    date: "2027 Program",
    title: "200+ CPCSC Level 1 audits in 2027",
    body:
      "Aeygis Security is delivering over 200 Canadian Program for Cyber Security Certification Level 1 audits across the defence supply chain in 2027, helping suppliers stay eligible for federal contracts.",
    video: "/media/updates/cpcsc.mp4",
    cta: { label: "Book an audit", href: "/security/" },
  },
  {
    id: "tenders",
    chip: "Public tenders",
    tag: "Corporate",
    date: "2026",
    title: "Aeygis is now bidding on public-sector tenders",
    body:
      "One prime contractor, four specialist offerings. We respond to RFPs, RFQs and standing-offer solicitations across workforce, health infrastructure, cyber and more.",
    video: "/media/updates/tenders.mp4",
    cta: { label: "Send us a solicitation", href: "/#contact" },
  },
  {
    id: "gantry",
    chip: "Gantry",
    tag: "Gantry",
    date: "Upcoming",
    title: "Meet Gantry: AWS infrastructure, built and run",
    body: "The fourth offering in the Aeygis group designs, builds and runs AWS for teams that have outgrown the setups they improvised.",
    video: "/media/updates/gantry.mp4",
    cta: { label: "Explore Gantry", href: "/gantry/" },
  },
];
