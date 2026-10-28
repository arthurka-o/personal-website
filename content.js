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
   read as a wall. What is left is the role, one sentence of proof, and the
   buttons. A tagline and a line about how you work both sat here once and were
   removed: the tagline repeated the figure in the aside panel verbatim, and
   the second line claimed something about the working method that turned out
   not to be true. Everything they gestured at lives where a reader chooses to
   read it — the "At a glance" panel and the Work section.

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
    role: "Smart Contract & Backend Engineer",
    summary:
      "One of six core engineers on an exotic perps DEX, from testnet through TGE. Four years of Solidity, eight years of production engineering.",
    location: "Warsaw, Poland",
    email: "work@arthurka.eu",
    /* The <meta name="description">, used by crawlers that do not read
       Open Graph. A different string from summary on purpose: it carries the
       keywords a search matches on, which reads badly as a link preview. */
    metaDescription:
      "Arthur Galiullin — Smart Contract & Backend Engineer. Perps DEX from testnet to TGE, multi-asset lending protocol, hackathon prize winner. Warsaw, Poland.",
  },

  /* ------------------------------------------------------------- 2. LINKS */
  links: {
    github: "https://github.com/arthurka-o",
    linkedin: "https://www.linkedin.com/in/arthur-galiullin/",
    upwork: "https://www.upwork.com/freelancers/~016038237dd7ada953",
    website: "",
    resume: "cv.pdf", // the site's own CV, served next to index.html
  },

  /* ---------------------------------------------------------- 3. BRAND LOGOS
     file = base name under assets/logos/ (no extension, no -inv suffix)
     Only technologies that appear in your actual CV are listed. Employer and
     protocol marks are deliberately absent: putting a former employer's brand
     on the page would imply a current affiliation it does not claim. */
  logoLibrary: {
    /* Added for the skills rebuild. Simple Icons (CC0-1.0), which is where the
       existing marks came from too. Each ships all three treatments: the brand
       colour for a ground it has contrast against, -inv (white) for the dark
       ground, and -mono (black) for a light ground the brand colour fails on. */
    /* Iconify. Unlike the Simple Icons marks above, these are multi-colour -
       Hardhat has four paints and Playwright six - so -inv and -mono are
       silhouettes (every paint collapsed to one ink) rather than recoloured
       brand marks. That is what the contrast switch falls back to when the
       brand colour fails on a ground. */
    hardhat: { title: "Hardhat", file: "hardhat", hex: "#FFEA00" },
    playwright: { title: "Playwright", file: "playwright", hex: "#2EAD33" },
    rspec: { title: "RSpec", file: "rspec", hex: "#FE405F" },
    vitest: { title: "Vitest", file: "vitest", hex: "#729B1B" },

    /* Foundry's mark is the org's own profile asset (foundry-rs/.github), a
       200x200 raster, filed as foundry-mark so the URL differs from the
       cut it replaced - a same-path swap is served from cache. The ink is
       white on transparent (median pixel
       luminance 255), so it takes tile: true like Overlay rather than being
       recoloured. An earlier cut from getfoundry.sh was 300x300 but read as
       too fine at 16px - a canvas-occupancy check says it covered more of
       the frame, not less, so what changed was stroke weight rather than
       padding. */
    foundry: {
      title: "Foundry",
      file: "foundry-mark",
      hex: "#ffffff",
      tile: true,
    },

    /* GitHub org avatars, and only the two where the org's avatar IS the product's
       mark. Both arrived as square canvases with the mark filling under a
       quarter of the frame - 18% for The Graph - which at an 18px chip is a
       5px smudge. Each is cropped to its ink with 6% padding and re-encoded;
       the artwork is untouched, only the empty margin is gone.

       Rasters with no alpha, so both take tile: true like Overlay: the dark
       ground behind them is the page ground, which makes the tile disappear
       into Night and read as a logo tile on Paper. */
    thegraph: {
      title: "The Graph",
      file: "thegraph",
      hex: "#ffffff",
      tile: true,
    },
    tellor: { title: "Tellor", file: "tellor", hex: "#ffffff", tile: true },

    /* Safe and LayerZero, from their GitHub org avatars - and getting those took
       the `?v=4` query. Without it GitHub serves a stale cached image: both
       orgs returned the grey Octocat identicon, which is what made them look
       like they had no logo at all. The canonical avatar_url carries the
       version and resolves to the real mark.

       Both arrive flattened rather than transparent, and in opposite
       directions - Safe is black-on-white with a faint grid, LayerZero is
       white-on-black - so a brightness rule catches one and misses the other.
       The background is therefore read from the corner, the grid and plate
       are replaced with the page ground, and dark neutral ink is lifted to
       white so both read on the tile. Safe's green is left alone. */
    safe: { title: "Safe", file: "safe", hex: "#ffffff", tile: true },
    layerzero: {
      title: "LayerZero",
      file: "layerzero",
      hex: "#ffffff",
      tile: true,
    },

    ethers: { title: "Ethers.js", file: "ethers", hex: "#2535A0" },
    nestjs: { title: "NestJS", file: "nestjs", hex: "#E0234E" },
    python: { title: "Python", file: "python", hex: "#3776AB" },
    express: { title: "Express", file: "express", hex: "#0A0A0A" },
    graphql: { title: "GraphQL", file: "graphql", hex: "#E10098" },
    tailwindcss: { title: "Tailwind CSS", file: "tailwindcss", hex: "#06B6D4" },
    wagmi: { title: "wagmi", file: "wagmi", hex: "#000000" },
    jest: { title: "Jest", file: "jest", hex: "#C21325" },
    chai: { title: "Chai", file: "chai", hex: "#A30701" },
    docker: { title: "Docker", file: "docker", hex: "#2496ED" },
    sidekiq: { title: "Sidekiq", file: "sidekiq", hex: "#B1003E" },
    solidity: { title: "Solidity", file: "solidity", hex: "#363636" },
    ethereum: { title: "Ethereum", file: "ethereum", hex: "#3c3c3d" },
    bnbchain: { title: "BNB Chain", file: "bnbchain", hex: "#f0b90b" },
    chainlink: { title: "Chainlink", file: "chainlink", hex: "#375bd2" },
    polygon: { title: "Polygon", file: "polygon", hex: "#7B3FE4" },
    openzeppelin: { title: "OpenZeppelin", file: "openzeppelin", hex: "#4e5ee4" },
    typescript: { title: "TypeScript", file: "typescript", hex: "#3178c6" },
    react: { title: "React", file: "react", hex: "#61dafb" },
    nextdotjs: { title: "Next.js", file: "nextdotjs", hex: "#000000" },
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
    upwork: { title: "Upwork", file: "upwork", hex: "#14a800" },

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
      stat: "30,000+",
      label: "on-chain transactions",
      title: "Shiva Router",
      detail:
        "The upgradeable router in front of Overlay's immutable core contracts. Because the core can't change, the router is also where the protocol decides which systems may call which functions.",
      url: "https://bscscan.com/address/0xeB497c228F130BD91E7F13f81c312243961d894A",
      urlLabel: "BscScan",
    },
    {
      stat: "2×",
      label: "hackathon prize winner",
      title: "ETHGlobal Prague 2025 · ETHWarsaw 2025",
      detail:
        "LayerZero General Prize for StreamBeam, built solo in 36 hours. Prize with the InSure team at ETHWarsaw.",
      url: "https://github.com/arthurka-o/streambeam",
      urlLabel: "StreamBeam source",
    },
  ],

  /* ---------------------------------------------------------- 6. EXPERIENCE */
  experience: [
    {
      /* Current period, June 2026 to now: looking for work, and building
         personal projects while he looks.

         TODO: `highlights` is empty, so this period reads as a sentence with
         nothing under it. Project names and repo URLs wire it up as a link the
         way Overlay and KUMO are. */
      role: "Independent — Personal Projects",
      company: "",
      location: "Remote",
      start: "June 2026",
      end: "Present",
      summary:
        "Actively seeking work, with personal projects on the go alongside it.",
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
        "Contributed to the Shiva Router, the upgradeable proxy in front of Overlay's immutable core contracts. Rewrote the price oracle in the same codebase: TWAP from PancakeSwap V3 pools, made non-upgradeable and then fully immutable. 30,000+ transactions verified on-chain.",
        "Built the funded-trader program, where sponsored users trade with protocol-provided USDT. Safe multisig wallets with Zodiac modules enforce that funds interact only with Overlay contracts, and call only the allowed functions. Off-chain monitoring detects drawdown past threshold, then programmatically closes all positions and pauses the Safe.",
        "Integrated an already-audited referral contract and built the verification layer around it: off-chain signed messages checked against on-chain state, with a fallback that rebuilds a missing record from chain. Alias normalisation and migration scripts to move existing records on-chain.",
        "Built the seasonal leaderboard (Node.js, MongoDB) tracking trader performance across configurable criteria, then extended it into a competition platform with filters for market, minimum collateral, and position lifetime.",
        "Wrote most of the protocol's indexing: rewrote the config so new factories and networks stopped being hand-edits to YAML, added the router and PowerCard entities, and built the Matchstick test suite over the handlers.",
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
        "Lending protocol secured by carbon credits. Selected for the ABN AMRO + Techstars Future of Finance Accelerator. One of two Solidity developers.",
      highlights: [
        "Joined KUMO on a Liquity fork retargeted at carbon removal, and threaded the asset parameter through the protocol to make it multi-asset: every function that touches a position now takes the asset it is working with, plus a factory that creates a savings pool per asset rather than hand-copying deployed contracts.",
        "Helped redesign the tokenomics to remove the protocol token while preserving the system's incentives — simpler economics without breaking existing functionality.",
        "Added Tellor alongside Chainlink as a second price source, so a single oracle outage or manipulation cannot sink the protocol. Upstream contribution, reviewed and merged by the original team.",
        "The core contract's functions had outgrown the EVM's stack limit, so the upgradeability question had to be settled. Researched the Diamond pattern (EIP-2535) and prototyped the split; the protocol shipped on UUPS instead, because the upgradeable-proxy ecosystem around it was the more mature one at the time.",
        "Added a per-asset cap on stablecoin creation, and fixed a bug where the \"how much room is left\" calculation wrapped around to report enormous headroom instead of none.",
        "Wrote the test suites across the migration, plus custom Hardhat tasks for deployment and monitoring.",
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
            "Enterprise GRC platform, used by Canadian Government. Built the public API, async processing pipelines and performance optimisation (N+1 fixes). Production monitoring with DataDog and Airbrake. AWS Lambda, Terraform, ECS.",
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
      kind: "Protocol contract · Solidity 0.8.10",
      logo: "overlay",
      description:
        "The router contract at the centre of Overlay's perps protocol. Every higher-level system — the funded-trader program, the referral system — reaches protocol state through it, which is what lets the core contracts stay immutable once deployed. It also decides which systems may call which functions, so it enforces a permission boundary, not just a proxy.",
      highlights: [
        "Verified on-chain with 30,000+ transactions processed through it.",
        "Oracle redesign in the same codebase: TWAP from PancakeSwap V3 pools, made non-upgradeable and then fully immutable, resolving to the worst price available so it can never be manipulated in a borrower's favour.",
        "Invariant testing with Chimera on the staking/notional relationship, plus Foundry mainnet-fork tests for the oracle path.",
        "Ported the Chainlink feed test suite from Python to Foundry so one toolchain verifies both sides of the interface, then covered the inputs that actually broke things: a zero price, and a macro window equal to the micro window.",
      ],
      stack: ["Solidity", "Foundry", "Ethereum", "BNB Chain", "OpenZeppelin"],
      links: [
        {
          label: "BscScan — 30,000+ txns",
          url: "https://bscscan.com/address/0xeB497c228F130BD91E7F13f81c312243961d894A",
        },
        { label: "Source", url: "https://github.com/overlay-market/v1-shiva" },
      ],
    },
    {
      name: "KUMO lending protocol",
      kind: "Protocol · Solidity 0.8.11",
      logo: "kumo",
      description:
        "KUMO's protocol was a fork of the Liquity lending protocol, retargeted at carbon removal, and the work below was done in my own fork of KUMO's. A certified carbon credit is locked as collateral and stablecoins are drawn against it immediately, instead of waiting for the credit to be sold. My work on it was the multi-asset rework, the upgradeability work and the oracle work below.",
      highlights: [
        "Made it multi-asset: every function that touches a position now takes the asset it is working with, plus a factory that creates a savings pool per asset rather than hand-copying deployed contracts.",
        "Split the core contract's functions after they outgrew the EVM's stack limit. The Diamond pattern (EIP-2535) was researched and prototyped for this, but the protocol shipped on UUPS instead — the upgradeable-proxy ecosystem around it was the more mature one at the time.",
        "Added a per-asset cap on stablecoin creation, and fixed a bug where the \"how much room is left\" calculation wrapped around to report enormous headroom instead of none.",
        "Thirty-plus commits repairing the existing test suite across the migration. The structural change is the interesting commit; the green suite afterwards is the work.",
        "Upstream contributor to the original protocol: added Tellor as a second price source alongside Chainlink so a single oracle outage or manipulation cannot sink the protocol.",
      ],
      stack: [
        "Solidity",
        "Hardhat",
        "Foundry",
        "Chainlink",
        "OpenZeppelin",
        "Diamond Pattern",
        "UUPS",
      ],
      links: [
        { label: "Source (my fork)", url: "https://github.com/arthurka-o/kumo-protocol" },
      ],
      note: "Original repo is private",
    },
    {
      name: "ABN AMRO pilot",
      kind: "Pilot contract · BUSL-1.1",
      logo: "kumo",
      description:
        "A contract for lending against carbon credits, built for a pilot with ABN AMRO, a Dutch bank. Two of us wrote it — I took most of it — and kept it deliberately plain: explicit allowlists and a strict loan lifecycle, written so a bank's risk team could review and sign it off without reverse-engineering the logic.",
      privateRepo: true,
      note: "Built for the ABN AMRO + Techstars accelerator.",
      highlights: [
        "Five-state loan lifecycle — pending, active, repaid, liquidated, closed — where the contract refuses any transition that doesn't follow that path.",
        "Explicit on-chain allowlists of lenders and borrowers. The protocol is permissioned on purpose: it only moves money between counterparties the bank has approved.",
        "Liquidation proceeds routed to a designated treasury, not back to the default recipient, because seized collateral often doesn't cover the debt.",
        "A V2 escape hatch so the pilot can hand off to a successor contract.",
        "Smaller correctness work: a maxLTV → liquidationLTV rename (the old name implied a borrowing limit, not a liquidation threshold), the correct OpenZeppelin transfer helper on withdrawal paths, a tolerance on duration comparison, and test coverage for the liquidation and treasury paths.",
      ],
      stack: ["Solidity", "Hardhat", "OpenZeppelin"],
      links: [],
    },
    {
      name: "Funded-trader kill switch",
      kind: "Risk system",
      logo: "overlay",
      description:
        "The safety system that automatically closes a protocol-sponsored trader's positions when they breach a loss limit, and pauses their account until a human looks at it. Sponsored traders risk none of their own money, so the protocol has to act as the risk manager; it cannot leave that to the trader's judgement.",
      privateRepo: true,
      highlights: [
        "Two independent limits: value below 50% of initial collateral, or a 25% drop since the first check of the day. The daily rule exists so a slow bleed cannot go unnoticed for a month.",
        "When Safe's transaction service began rejecting the delegate calls Zodiac automation depends on, switched to the whitelisted call-only MultiSend variant — the one that still executes as the trader's Safe but cannot make arbitrary delegate calls.",
        "Split into two processes so the public-facing API server holds read-only database credentials. A compromised API server cannot corrupt the baselines the risk system depends on.",
        "Safe Global API v2 migration, retry-with-backoff client, Telegram alerting on kill-switch events, and a trader-reassignment operations script.",
      ],
      stack: ["TypeScript", "Node.js", "MongoDB", "Safe", "Zodiac"],
      links: [],
    },
    {
      name: "Protocol subgraph",
      kind: "Data layer",
      logo: "overlay",
      description:
        "The protocol's on-chain index — the data layer the frontend and the analytics read from. I did most of the indexing for the protocol's main contract and its router, and brought the whole thing onto multiple networks.",
      highlights: [
        "Indexed the router alongside the core contracts, so position and market data flowing through it lands in the subgraph instead of being invisible to the frontend.",
        "Made the index multichain, including Berachain mainnet.",
        "Added the PowerCard ERC1155 entities and their transfer handling.",
        "Made the referral address an indexed entity, so affiliate attribution is answered by the same subgraph, with no second source free to disagree with it.",
        "Reworked several handlers where the recorded state was wrong — unwind, liquidate, emergency withdraw and build — including a funding-payment formula that was computing the wrong value.",
        "Migrated the entity IDs to Bytes across the schema, which changed how every entity is keyed.",
        "Matchstick test suite so a handler change is proven by a test instead of by a careful read.",
      ],
      stack: ["TypeScript", "The Graph", "Ethereum"],
      links: [
        { label: "Source", url: "https://github.com/overlay-market/v1-subgraph" },
      ],
    },
    {
      name: "Immutable TWAP oracle",
      kind: "Price oracle · same repo as Shiva Router",
      logo: "overlay",
      description:
        "The protocol's price feed, rebuilt on PancakeSwap V3 pools and then deliberately locked down: non-upgradeable first, then fully immutable, while every other contract in the protocol stays upgradeable.",
      highlights: [
        "Immutability chosen because the risk is asymmetric — a bug in a normal contract is fixable, but a bug in the price means every loan is sized wrong the moment it lands, and the upgrade key becomes the obvious target.",
        "Resolves to the worst price available across spot and TWAP. Manipulation can therefore only ever hurt whoever performs it.",
        "Staleness guard rejects an old price outright.",
      ],
      stack: ["Solidity", "Ethereum", "OpenZeppelin", "Chainlink"],
      links: [
        { label: "Source", url: "https://github.com/overlay-market/v1-shiva" },
      ],
    },
    {
      name: "Leaderboard & competitions",
      kind: "Product backend",
      logo: "overlay",
      description:
        "Seasonal trading leaderboards and competitions. I built this backend from the ground up — schema, rules engine and all — as a configurable system, so launching a new competition is a change to configuration, not a redeploy.",
      privateRepo: true,
      highlights: [
        "Configurable rules: minimum USD collateral per market, exempt markets, and an OVL price fallback so ranking still works when the feed is down. The collateral floor stops a dust position from topping a leaderboard on leverage alone.",
        "All money maths through fixed-point decimals rather than floats.",
        "Scheduled competition windows driven by the schema.",
      ],
      stack: ["Node.js", "Express", "MongoDB", "GraphQL"],
      links: [],
    },
    {
      name: "Referral system",
      kind: "On-chain + backend",
      logo: "overlay",
      description:
        "Tracks which traders signed up through an affiliate link and pays the affiliate accordingly. The referral contract was already built and audited; I integrated it and wrote the verification layer around it.",
      highlights: [
        "Off-chain signed messages checked against on-chain state, with an on-chain fallback — so a database cleanup can no longer permanently disqualify a real affiliate. The record is recreated from chain when it's missing.",
        "Minimum trading volume enforced before a referral counts, and aliases are normalised so one person can't claim under several identities.",
        "Migration scripts to move existing affiliate records from MongoDB on-chain.",
      ],
      stack: ["Solidity", "Node.js", "OpenZeppelin"],
      links: [
        { label: "Source", url: "https://github.com/overlay-market/Referral" },
      ],
    },
    {
      name: "Overlay SDK",
      kind: "Published package",
      logo: "typescript",
      description:
        "The published TypeScript package other teams import to read Overlay's on-chain state. Most of my work here was keeping it in step with the protocol: when the contracts changed, this package had to change with them, without breaking callers.",
      highlights: [
        "Real-time portfolio PnL across multiple markets.",
        "USDT's 6 decimals handled against the 18 most tokens assume — getting this wrong returns values off by 1e12.",
        "Versioned factories with deprecation, so a caller is never silently moved onto a contract being retired.",
        "Graceful handling of state the SDK doesn't expect instead of throwing.",
      ],
      stack: ["TypeScript"],
      links: [
        {
          label: "Source",
          url: "https://github.com/overlay-market/overlay-sdk",
        },
      ],
    },
    {
      name: "Overlay frontend",
      kind: "Protocol frontend",
      logo: "nextdotjs",
      description:
        "The protocol's web app — the surface traders actually use. I was one of its main contributors, working mostly in the portfolio view, the prediction-market screens and the charts.",
      highlights: [
        "Found and fixed a bigint precision bug in the portfolio overview: a 256-bit on-chain price was being coerced to a JavaScript number, silently losing precision in exactly the two figures traders trust — value locked and unrealised PnL.",
        "Built the prediction-market screens: market groups, routing, data model and multi-line probability charts.",
        "Referral guardrails: actions disabled for funded and avatar accounts, thresholds and rates correct after a successful claim.",
      ],
      stack: ["TypeScript", "React", "Next.js"],
      links: [
        {
          label: "Source",
          url: "https://github.com/overlay-market/overlay-interface-v2",
        },
      ],
    },
    {
      name: "StreamBeam",
      kind: "ETHGlobal Prague 2025 · Solo",
      description:
        "Cross-chain crypto donations for livestream creators. I built it solo in 36 hours at ETHGlobal Prague, won the LayerZero General Prize, and then kept working on it for another six weeks.",
      highlights: [
        "Won the LayerZero General Prize at ETHGlobal Prague 2025.",
        "LayerZero cross-chain donations with a real-time OBS alert system — donations surface on stream via browser source while they land.",
        "Solo build throughout, on my own repository.",
      ],
      stack: ["Solidity", "TypeScript", "Express.js", "Next.js", "LayerZero"],
      links: [
        { label: "Source", url: "https://github.com/arthurka-o/streambeam" },
      ],
    },
    {
      name: "InSure",
      kind: "ETHWarsaw 2025 · Team",
      description:
        "On-chain insurance with automated claims and verification. Built with a team; prize winner at ETHWarsaw 2025.",
      highlights: [
        "Team project — the repository belongs to a collaborator, not to me.",
      ],
      stack: ["Solidity", "Foundry"],
      links: [
        {
          label: "Source (teammate's repository)",
          url: "https://github.com/Eugenerio/InSure",
        },
      ],
    },
    {
      name: "Blox — Rails backend",
      kind: "Backend · Ruby on Rails 8",
      logo: "rubyonrails",
      description:
        "Quests that walk new users through onboarding to the TON blockchain, built for a TON hackathon. I worked on the Rails 8 backend that runs them, as part of a four-person team.",
      privateRepo: true,
      note: "Client repository.",
      highlights: [
        "Rails 8.0 — propshaft, importmap, turbo, stimulus, Tailwind, Solid Cache/Queue/Cable, Kamal deploys, Pundit authorisation.",
        "Owned the quest and loan domain, plus the budget logic behind it, written with tests.",
        "Built the redirect-token system, a Telegram integration, and the onboarding flow.",
        "RSpec and Capybara suite; a repository-wide Rubocop pass.",
      ],
      stack: [
        "Ruby on Rails",
        "PostgreSQL",
        "TON",
        "Pundit",
        "RSpec",
        "Capybara",
        "Kamal",
        "Docker",
      ],
      links: [],
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
        { name: "Foundry", logo: "foundry" },
        { name: "Hardhat", logo: "hardhat" },
        { name: "EVM", logo: "ethereum" },
        "UUPS",
        "Diamond Pattern",
        { name: "OpenZeppelin", logo: "openzeppelin" },
        { name: "Chainlink", logo: "chainlink" },
        { name: "Tellor", logo: "tellor" },
        { name: "Safe", logo: "safe" },
        "Zodiac",
        "Merkle Trees",
        { name: "LayerZero", logo: "layerzero" },
        "Chimera",
        "TypeChain",
      ],
    },
    {
      id: "backend",
      label: "Backend",
      items: [
        { name: "TypeScript", logo: "typescript" },
        { name: "Node.js", logo: "nodedotjs" },
        { name: "Ethers.js", logo: "ethers" },
        "Viem",
        { name: "NestJS", logo: "nestjs" },
        { name: "Express", logo: "express" },
        { name: "Python", logo: "python" },
        { name: "GraphQL", logo: "graphql" },
        { name: "PostgreSQL", logo: "postgresql" },
        { name: "MongoDB", logo: "mongodb" },
        "REST APIs",
        { name: "The Graph", logo: "thegraph" },
        { name: "Ruby on Rails", logo: "rubyonrails" },
        "Pundit",
        { name: "Sidekiq", logo: "sidekiq" },
        "Kamal",
      ],
    },
    {
      id: "frontend",
      label: "Frontend",
      items: [
        { name: "React", logo: "react" },
        { name: "Next.js", logo: "nextdotjs" },
        { name: "Tailwind CSS", logo: "tailwindcss" },
        { name: "wagmi", logo: "wagmi" },
      ],
    },
    {
      id: "testing",
      label: "Testing",
      items: [
        { name: "Jest", logo: "jest" },
        { name: "Vitest", logo: "vitest" },
        { name: "Chai", logo: "chai" },
        { name: "Playwright", logo: "playwright" },
        "Supertest",
        { name: "RSpec", logo: "rspec" },
        "Capybara",
      ],
    },
    {
      id: "infra",
      label: "Infrastructure",
      items: [
        { name: "Amazon Web Services", logo: "amazonwebservices" },
        { name: "Docker", logo: "docker" },
        { name: "GitHub Actions", logo: "github" },
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
  /* The single source for whether he is looking. The generated llms files lead
     their blockquote with the Availability row below rather than carrying a
     second copy, so the page and the markdown cannot disagree. No
     compensation figure — it changes and goes stale. */
  workingSetup: [
    { label: "Availability", value: "Available now — actively seeking" },
    { label: "Notice period", value: "Immediate" },
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
    { name: "Polish", level: "Intermediate" },
  ],

  /* ------------------------------------------------------------- 10. FOOTER */
  footer: {
    note: "Smart Contract & Backend Engineer — Warsaw, Poland.",
  },
};