/* ============================================================================
   PORTFOLIO CONTENT MODEL — the only file you need to edit to make this yours.
   ----------------------------------------------------------------------------
   SOURCE OF TRUTH
   Every career fact below was taken from two files in your career-ops
   repository:
     • cv.md                  — work history, projects, skills, education
     • config/profile.yml     — identity, contact, location
   Nothing here is invented. If a fact is not in those files, it is not on the
   page. When you update those files, update this file to match.

   THE HERO IS DELIBERATELY SHORT
   The long positioning paragraph from the CV used to sit under your name and
   read as a wall. It is now split: one scannable tagline, one sentence of
   proof, one line about how you work. The removed detail lives where a
   reader chooses to read it — the Proof panel and the Experience section.

   BRAND MARKS
   logoLibrary maps a technology to its official mark in assets/logos/.
   Each entry has two files: the dark-ground form and the light-ground
   ("-inv") form. Both are the same official path, rendered in one colour —
   which is how every brand mark is meant to be used, and it is what lets one
   page work on both a white ground and a dark one.

   FIELD NOTES
   - proofPoints[] ..... metric + the context that produced it. Never ship a
     bare number; the detail line is what makes it credible.
   - experience[].entries  nested roles for a period covered by several
     employers (your Rails era spans three companies under one heading).
   - skills[] ........... grouped only, no proficiency levels, because your CV
     does not state them.
   - A skill written as a plain string renders as a text chip. A skill written
     as { name, logo } renders with its official mark beside it.
   - links.resume ...... drop your PDF next to index.html as "resume.pdf" and
     set this to "resume.pdf". Empty string keeps the row hidden.
   ========================================================================= */

window.PORTFOLIO = {
  /* ---------------------------------------------------------------- 1. WHO */
  profile: {
    name: "Arthur Galiullin",
    initials: "AG",
    role: "Solidity / Protocol Engineer",
    tagline: "Perps DEX to TGE · multi-asset lending · 2× hackathon prize winner",
    summary:
      "Shipped a perps DEX from testnet to mainnet launch. 4+ years of Solidity, 8 years of production engineering.",
    approach: "Heavy LLM-assisted workflow — shipping fast matters.",
    location: "Warsaw, Poland",
    email: "work@arthurka.eu",
  },

  /* ------------------------------------------------------------- 2. LINKS */
  links: {
    github: "https://github.com/arthurka-o",
    linkedin: "https://www.linkedin.com/in/arthur-galiullin/",
    website: "",
    resume: "cv.pdf", // the site's own CV, served next to index.html
  },

  /* ---------------------------------------------------------- 3. BRAND LOGOS
     file = base name under assets/logos/ (no extension, no -inv suffix)
     Only technologies that appear in your actual CV are listed. Employer and
     protocol marks are deliberately absent: putting a former employer's brand
     on the page would imply a current affiliation it does not claim. */
  logoLibrary: {
    solidity: { title: "Solidity", file: "solidity", hex: "#363636" },
    ethereum: { title: "Ethereum", file: "ethereum", hex: "#3c3c3d" },
    bnbchain: { title: "BNB Chain", file: "bnbchain", hex: "#f0b90b" },
    chainlink: { title: "Chainlink", file: "chainlink", hex: "#375bd2" },
    openzeppelin: { title: "OpenZeppelin", file: "openzeppelin", hex: "#4e5ee4" },
    typescript: { title: "TypeScript", file: "typescript", hex: "#3178c6" },
    nodedotjs: { title: "Node.js", file: "nodedotjs", hex: "#5fa04e" },
    rubyonrails: { title: "Ruby on Rails", file: "rubyonrails", hex: "#d30001" },
    postgresql: { title: "PostgreSQL", file: "postgresql", hex: "#4169e1" },
    mongodb: { title: "MongoDB", file: "mongodb", hex: "#47a248" },
    amazonwebservices: {
      title: "Amazon Web Services",
      file: "amazonwebservices",
      hex: "#232f3e",
    },
    git: { title: "Git", file: "git", hex: "#f05032" },
    github: { title: "GitHub", file: "github", hex: "#181717" },
    linkedin: { title: "LinkedIn", file: "linkedin", hex: "#0a66c2" },

    /* Protocol marks — these are his own work, so they belong on the page.
       Each was taken from the organisation's own published asset:
         kumo    — kumo.earth app icon, 3 paths, official teal #2D6F7C
         overlay — overlay-interface-v2/public favicon, white ink, transparent

       `tile` means the mark ships as a raster whose white ink cannot be
       recoloured without falsifying it, so it is shown on an opaque backing
       tile. That tile is the page's own dark ground, which makes the mark
       readable on Paper and lets it disappear into Night. */
    kumo: { title: "Kumo", file: "kumo", hex: "#2d6f7c" },
    overlay: {
      title: "Overlay",
      file: "overlay",
      hex: "#ffffff",
      tile: true,
    },

    /* KFU — the university emblem from Wikimedia Commons, credited as
       Kazan Federal University, licensed CC BY-SA 4.0. This is the ONE asset
       on the page carrying a licence obligation: attribution is required, so
       it is printed in the footer rather than buried in a comment. Used
       verbatim at a smaller display size — no recolour, no crop — and it
       needs the same `tile` backing as Overlay, because pale ink at 1.56:1
       disappears against Paper's white ground. */
    kfu: {
      title: "Kazan Federal University",
      file: "kfu",
      hex: "#c2d1dd",
      tile: true,
      credit: "Kazan Federal University",
      license: "CC BY-SA 4.0",
    },
  },

  /* Printed in the footer. Any third-party mark carrying a licence
     obligation belongs here — see the `license` field in logoLibrary. */
  credits: [
    "Kazan Federal University emblem by Kazan Federal University, CC BY-SA 4.0, via Wikimedia Commons.",
  ],

  /* The anchor band under the hero — the tools a screener looks for first. */
  logoRail: [
    "solidity",
    "ethereum",
    "bnbchain",
    "chainlink",
    "openzeppelin",
    "typescript",
    "nodedotjs",
    "rubyonrails",
    "postgresql",
    "mongodb",
    "amazonwebservices",
    "git",
    "github",
  ],

  /* ------------------------------------------------------- 4. PROOF POINTS */
  proofPoints: [
    {
      stat: "$2.9M",
      label: "raised",
      title: "Overlay Protocol — testnet to TGE",
      detail:
        "Exotic perps DEX on BSC. Polychain Capital, 1kx and ParaFi backed; audited by Spearbit, Trail of Bits and Nethermind. One of six core engineers.",
      url: "",
    },
    {
      stat: "27,000+",
      label: "on-chain transactions",
      title: "Shiva Router",
      detail:
        "Contributed to the upgradeable proxy router that wraps the protocol's immutable core contracts, verified on-chain.",
      url: "https://bscscan.com/address/0xeB497c228F130BD91E7F13f81c312243961d894A",
      urlLabel: "BscScan",
    },
    {
      stat: "2×",
      label: "hackathon prize winner",
      title: "ETHGlobal Prague 2025 · ETHWarsaw 2025",
      detail:
        "LayerZero General Prize for StreamAid, built solo in 36 hours. Prize with the InSure team at ETHWarsaw.",
      url: "https://github.com/arthurka-o/2025-eth-global-prague",
      urlLabel: "StreamAid source",
    },
  ],

  /* ---------------------------------------------------------- 5. EXPERIENCE */
  experience: [
    {
      /* Self-directed period, May 2026 to now.
         The page says "personal projects", not "job seeking". Both are true,
         but a timeline entry that labels itself unemployed invites a recruiter
         to score the gap instead of the work — and leading with the building
         is the stronger read while staying honest.

         TODO: this entry is thin until the project lands. Add what you built
         to `highlights`, and give me the project name and repo URL so I can
         wire it up as a link the way Overlay and KUMO are. */
      role: "Independent — Personal Projects",
      company: "",
      location: "Remote",
      start: "June 2026",
      end: "Present",
      summary: "Self-directed work on personal projects.",
      highlights: [],
      stack: [],
      entries: [],
    },
    {
      role: "Protocol Engineer",
      company: "Overlay Protocol",
      logo: "overlay",
      url: "https://overlay.market/",
      location: "Remote",
      start: "May 2024",
      end: "May 2026",
      summary:
        "Exotic perps DEX on BSC. One of six core engineers, from testnet through TGE.",
      highlights: [
        "Shiva Router Contract — contributed to a proxy router wrapping the protocol's immutable core contracts, enabling features like the funded trader system to interact with the protocol. Upgradeable proxy, verified on-chain, 27,000+ transactions processed.",
        "Funded Trader System — built the program where sponsored users trade with protocol-provided USDT. Safe multisig wallets with Zodiac modules enforce that funds only interact with Overlay contracts and only invoke allowed functions. Off-chain monitoring detects drawdown past threshold, then programmatically closes all positions and pauses the Safe.",
        "On-Chain Referral System — integrated an existing referral contract with off-chain signed messages and Merkle tree-based verification, wiring it to the protocol's on-chain state.",
        "Leaderboard & Trading Competitions — built the seasonal leaderboard (Node.js, MongoDB) tracking trader performance across configurable criteria, then extended it into a competition platform with filters for market, minimum collateral, and position lifetime.",
        "Subgraph — extended the protocol's subgraph (TypeScript) with queries and handlers for leaderboard, competitions, referrals and position data.",
      ],
      stack: ["Solidity", "Foundry", "Safe", "Zodiac", "TypeScript", "Node.js", "MongoDB", "Ethers.js", "The Graph"],
      entries: [],
    },
    {
      role: "Solidity Developer",
      company: "KUMO",
      logo: "kumo",
      url: "https://kumo.earth/",
      location: "Remote",
      start: "March 2022",
      end: "January 2024",
      summary:
        "Lending protocol secured by carbon credits. Selected for the ABN AMRO + Techstars Future of Finance Accelerator and built and launched a pilot with ABN AMRO. One of two Solidity developers.",
      highlights: [
        "Evolved the protocol from a Liquity fork to support multiple collateral assets with governance-controlled risk parameters.",
        "Redesigned tokenomics to remove the protocol token while preserving system incentives — simpler economics without breaking existing functionality.",
        "Integrated Chainlink and Tellor oracle feeds for multi-source price validation, reducing reliance on any single oracle.",
        "Implemented the Diamond Pattern (EIP-2535) for upgradeable, modular contract architecture.",
        "Wrote comprehensive test suites (Chai, Mocha) and custom Hardhat tasks for deployment and monitoring.",
      ],
      stack: ["Solidity", "Hardhat", "Chainlink", "OpenZeppelin", "Diamond Pattern", "UUPS", "Ethers.js"],
      entries: [],
    },
    {
      role: "Ruby on Rails Developer",
      company: "Multiple companies",
      location: "Remote",
      start: "2016",
      end: "2022",
      summary: "Six years of backend and full-stack engineering across three companies and products.",
      highlights: [],
      stack: ["Ruby on Rails", "PostgreSQL", "React", "TypeScript", "RSpec", "AWS", "Sidekiq"],
      entries: [
        {
          title: "Flatstack / Galvanize",
          period: "2020 – 2022",
          detail:
            "Enterprise GRC platform. Built the public API, async processing pipelines and performance optimisation (N+1 fixes). Production monitoring with DataDog and Airbrake. AWS Lambda, Terraform, ECS.",
        },
        {
          title: "meyvn",
          period: "2018 – 2020",
          detail:
            "HR platform for the US/EU market and a news scoring engine. Led the migration from a monolithic Rails app to a React SPA with a Rails API backend. Integrated Azure Cognitive Services for ML-powered language features.",
        },
        {
          title: "Technokratos",
          period: "2016 – 2017",
          detail:
            "Virtual goods marketplace and photo album service. Built REST APIs, PDF generation, and face detection via OpenCV for smart image cropping.",
        },
      ],
    },
  ],

  /* ------------------------------------------------------------ 6. PROJECTS */
  projects: [
    {
      name: "Shiva Router",
      kind: "Protocol contract",
      logo: "overlay",
      description:
        "Upgradeable proxy router wrapping Overlay's immutable core contracts. It is the seam that lets higher-level systems — the funded trader program, the referral system — interact with the protocol without the core being upgradeable.",
      highlights: [
        "Verified on-chain, with 27,000+ transactions processed through it.",
        "Constrains which contracts and functions downstream systems may call.",
      ],
      stack: ["Solidity", "Safe", "Zodiac"],
      links: [
        {
          label: "BscScan",
          url: "https://bscscan.com/address/0xeB497c228F130BD91E7F13f81c312243961d894A",
        },
      ],
    },
    {
      name: "StreamAid",
      kind: "ETHGlobal Prague 2025 · Solo · Prize winner",
      description:
        "Cross-chain crypto donations for livestream creators, built in 36 hours. Won the LayerZero General Prize.",
      highlights: ["Solo build, hackathon weekend, prize-winning submission."],
      stack: ["Solidity", "Express.js", "Next.js", "LayerZero"],
      links: [
        {
          label: "Source",
          url: "https://github.com/arthurka-o/2025-eth-global-prague",
        },
      ],
    },
    {
      name: "InSure",
      kind: "ETHWarsaw 2025 · Team · Prize winner",
      description:
        "On-chain insurance platform with automated claims and verification. Built with a team; prize winner at ETHWarsaw.",
      highlights: ["Team project — the repository is under a teammate's handle."],
      stack: ["Solidity", "Foundry"],
      links: [
        { label: "Source", url: "https://github.com/Eugenerio/InSure" },
      ],
    },
  ],

  /* --------------------------------------------------------------- 7. SKILLS
     A plain string = text chip. { name, logo } = text chip + official mark.
     Technologies with no official mark stay as plain strings rather than
     getting a stand-in glyph. */
  skills: [
    {
      id: "protocol",
      label: "Protocol",
      items: [
        { name: "Solidity", logo: "solidity" },
        "Foundry",
        "Hardhat",
        { name: "EVM", logo: "ethereum" },
        "UUPS",
        "Diamond Pattern",
        { name: "OpenZeppelin", logo: "openzeppelin" },
        "Safe",
        "Zodiac",
      ],
    },
    {
      id: "backend",
      label: "Backend",
      items: [
        { name: "TypeScript", logo: "typescript" },
        { name: "Node.js", logo: "nodedotjs" },
        { name: "Ruby on Rails", logo: "rubyonrails" },
        { name: "PostgreSQL", logo: "postgresql" },
        { name: "MongoDB", logo: "mongodb" },
        "REST APIs",
        "The Graph",
      ],
    },
    {
      id: "infra",
      label: "Infrastructure",
      items: [
        { name: "Amazon Web Services", logo: "amazonwebservices" },
        "CI/CD",
        { name: "Git", logo: "git" },
      ],
    },
  ],

  /* ----------------------------------------------------------- 8. EDUCATION */
  education: [
    {
      degree: "M.Sc. Computer Software Engineering",
      school: "KFU, Institute of Information Technology",
      logo: "kfu",
      period: "2018 – 2020",
    },
    {
      degree: "B.Sc. Applied Informatics",
      school: "KFU, Institute of Information Technology",
      logo: "kfu",
      period: "2014 – 2018",
    },
  ],

  /* -------------------------------------------------------- 9. WORKING SETUP */
  /* Factual working arrangement only — this is a capability showcase, so it
     carries no availability date, notice period, target role list, or
     compensation figure. */
  workingSetup: [
    { label: "Based in", value: "Warsaw, Poland" },
    { label: "Timezone", value: "CET/CEST (UTC+1/+2)" },
    { label: "Work mode", value: "Remote" },
    { label: "Engagement", value: "B2B / contract or employment" },
    { label: "Relocation", value: "Not relocating" },
    { label: "Work rights", value: "Authorised to work in Poland" },
  ],

  languages: [
    { name: "Russian", level: "Native" },
    { name: "English", level: "Professional" },
    { name: "Polish", level: "Basic" },
  ],

  /* ------------------------------------------------------------- 10. FOOTER */
  footer: {
    note: "Solidity / Protocol Engineer — Warsaw, Poland.",
  },
};