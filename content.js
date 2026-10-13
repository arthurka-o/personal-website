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
        "The upgradeable router in front of Overlay's immutable core contracts. Because the core can't change, the router is also where the protocol decides which systems may call which functions.",
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

  /* ------------------------------------------------------------ 5. TIMELINE
     What shipped, and when. Deliberately NOT a commit-count chart: in an
     LLM-assisted workflow the number means nothing, because the person
     writing the code and the person shipping the protocol are no longer the
     same unit of work. Every entry here is a thing that exists and can be
     inspected — a contract with an address, a repo, an audit report.

     Read left to right the bands show the shape of two years: the data layer
     first, then the protocol core, then the systems and product surface built
     on top of it. That arc is the claim; the entries are the evidence.

     `layer` maps to a band. `start`/`len` are month offsets on the axis.
     `stack` renders as official marks beside the detail — the same logoLibrary
     the Skills section uses, so a technology is drawn the same way everywhere
     on the page. `detail` is the long form, shown when a bar is opened.
     `repo` is the only link; every entry points at something real. */
  timeline: {
    title: "Shipped",
    lede:
      "Two years inside one protocol, from the data layer up. Open any bar for the detail. Every entry is something that exists and can be inspected.",
    axis: [
      { label: "2022", span: 8 },
      { label: "2023", span: 12 },
      { label: "2024", span: 12 },
      { label: "2025", span: 12 },
      { label: "2026", span: 3 },
    ],
    bands: [
      { id: "data", label: "Data layer" },
      { id: "contracts", label: "Protocol contracts", logo: "solidity" },
      { id: "backend", label: "Systems", logo: "nodedotjs" },
      { id: "sdk", label: "SDK", logo: "typescript" },
      { id: "frontend", label: "Product", logo: "react" },
    ],
    entries: [
      {
        group: "Protocol contracts",
        org: "overlay",
        start: 27,
        len: 4,
        title: "Shiva Router",
        detail: [
          "The router is the protocol's front door. Overlay's core contracts behind it are immutable, so the router is also where the protocol states which higher-level systems — the funded-trader program, referrals — are allowed to reach which functions.",
          "Users hold the router address permanently; the logic behind it never moves. 27,000+ transactions have passed through it.",
        ],
        stack: ["solidity", "ethereum", "bnbchain"],
        repo: "https://bscscan.com/address/0xeB497c228F130BD91E7F13f81c312243961d894A",
        repoLabel: "BscScan — 27,000+ txns",
      },
      {
        group: "Protocol contracts",
        org: "overlay",
        start: 42,
        len: 3,
        title: "Immutable TWAP oracle",
        detail: [
          "The price feed, rebuilt on PancakeSwap V3 pools and then locked down: non-upgradeable first, then fully immutable — while every other contract in the protocol stays upgradeable.",
          "The reason is that a price bug cannot be patched. A bug elsewhere means money is stuck; a bug in the price means every loan is sized wrong immediately, and an upgradeable oracle hands every user's collateral to whoever reaches the key. When both a TWAP and a spot price exist the protocol takes the worse one for the borrower, so manipulation can only ever hurt whoever performs it.",
        ],
        stack: ["solidity", "ethereum", "openzeppelin"],
        repo: "https://github.com/overlay-market/v1-shiva",
        repoLabel: "v1-shiva",
      },
      {
        group: "Protocol contracts",
        org: "overlay",
        start: 31,
        len: 3,
        title: "Invariant testing",
        detail: [
          "Invariant tests state a property that must always hold, then fuzz thousands of inputs trying to break it. Here: a trader's staked balance must never exceed the notional they can claim.",
          "Added Foundry mainnet-fork tests alongside it, so the oracle path runs against real chain state rather than fixtures — which catches what a unit test structurally cannot.",
        ],
        stack: ["solidity", "ethereum", "openzeppelin"],
      },
      {
        group: "Protocol contracts",
        org: "overlay",
        start: 35,
        len: 2,
        title: "Oracle feed rework",
        detail: [
          "The Chainlink feed tests were written in Python while everything they tested was Solidity, so the two could quietly disagree about the interface. Ported to Foundry so one toolchain verifies both sides.",
          "Then covered the cases that actually broke things: a zero price, and a macro window equal to the micro window.",
        ],
        stack: ["solidity", "chainlink"],
      },
      {
        group: "Risk & backend",
        org: "overlay",
        start: 43,
        len: 4,
        title: "Funded-trader kill switch",
        detail: [
          "Overlay sponsors traders — it puts up the collateral and pays for the leverage in exchange for a share of the profit. The trader never risks their own money, so the protocol has to be the risk manager. I built the system that closes their positions the moment they breach a limit.",
          "Two independent limits, because one can be bled past: a funding threshold at 50% of collateral, and a daily threshold against a baseline written once per day. Either breach closes every position and pauses the account. The external problem was Safe's transaction service rejecting the delegate calls Zodiac automation depends on — fixed by switching to MultiSendCallOnly, the one variant that is both whitelisted and still executes as the trader's own Safe.",
        ],
        stack: ["nodedotjs", "mongodb", "solidity"],
      },
      {
        group: "Risk & backend",
        org: "overlay",
        start: 30,
        len: 3,
        title: "Referral verification",
        detail: [
          "Affiliates refer traders, and two parties have to agree a referral happened. Neither should have to trust the other's database, so the database is only a cache: when a record is missing, the protocol reads the user's on-chain tier and rebuilds it from the chain.",
          "Without that fallback a single database cleanup permanently disqualifies real affiliates. A claim also needs a minimum trading volume before it counts, and aliases are normalised so one person cannot be paid twice.",
        ],
        stack: ["solidity", "nodedotjs", "openzeppelin"],
      },
      {
        group: "Risk & backend",
        org: "overlay",
        start: 38,
        len: 4,
        title: "Leaderboard & competitions",
        detail: [
          "Built from the ground up — schema, rules engine and all — for seasonal trading leaderboards, as a configurable system so a new competition is a change to configuration rather than a redeploy.",
          "The part that mattered was the collateral floor: without it a trader could open a dust position, lever it up and top a leaderboard without carrying meaningful risk.",
        ],
        stack: ["nodedotjs", "mongodb"],
      },
      {
        group: "Data, SDK & product",
        org: "overlay",
        start: 24,
        len: 8,
        title: "Protocol subgraph",
        detail: [
          "The protocol's on-chain index, and the data layer the frontend and the analytics read from. Most of the indexing is mine — I rewrote the config so new factories and networks stopped being hand-edits to YAML, and made the index multichain, including Berachain mainnet.",
          "Also made it multichain, including Berachain mainnet, and replaced a hardcoded market address with generated per-factory config — previously every new factory or network was a hand-edit that could silently stop part of the protocol indexing.",
        ],
        stack: ["typescript", "ethereum"],
        repo: "https://github.com/overlay-market/v1-subgraph",
        repoLabel: "v1-subgraph",
      },
      {
        group: "Data, SDK & product",
        org: "overlay",
        start: 41,
        len: 6,
        title: "Published SDK",
        detail: [
          "The package other teams import. Real-time portfolio PnL across markets, with versioned factories and deprecation so a caller is never silently moved onto a contract being retired.",
          "Most of my work was keeping it in step with the protocol without breaking callers. The quiet failure worth knowing about: USDT is 6 decimals where most tokens are 18, and getting that wrong doesn't error — it returns values a trillion off.",
        ],
        stack: ["typescript"],
        repo: "https://github.com/overlay-market/overlay-sdk",
        repoLabel: "overlay-sdk",
      },
      {
        group: "Data, SDK & product",
        org: "overlay",
        start: 29,
        len: 5,
        title: "Referrals in the UI",
        detail: [
          "Referral registration and attribution in the product, including self-referral rejection and the same off-chain signature check the backend relies on, enforced on the client as well.",
          "Error copy decoupled from the input field, so a validation failure explains itself instead of echoing a raw SDK message.",
        ],
        stack: ["typescript", "react", "nextdotjs"],
      },
      {
        group: "Data, SDK & product",
        org: "overlay",
        start: 41,
        len: 6,
        title: "Prediction markets & funded UI",
        detail: [
          "Prediction-market screens — market groups, routing, data model and multi-line probability charts — plus funded-trader account cards and the referral modals.",
          "The one worth naming: a 256-bit on-chain price was being coerced with Number(), silently losing precision in exactly the two figures traders trust, value locked and unrealised PnL. Fixed by rendering the bigint to its decimal string before converting. The same commit fixed a stale closure that could break the polling refresh.",
        ],
        stack: ["typescript", "react", "nextdotjs"],
      },
      {
        group: "Lending protocol",
        org: "kumo",
        start: 7,
        len: 3,
        title: "Diamond migration",
        detail: [
          "The core contract hit the EVM's stack limit and the compiler was failing. The diamond pattern splits the logic into small facets behind the same address, so new facets can be added later without touching the ones already holding user funds.",
          "It also answers a commercial problem: deploying a changed contract means deploying a new one, and for a protocol holding real money that is a migration its users have to do. Callers reach the same address they always did.",
        ],
        stack: ["solidity", "ethereum", "hardhat"],
      },
      {
        group: "Lending protocol",
        org: "kumo",
        start: 8,
        len: 5,
        title: "Test suite through the migration",
        detail: [
          "Moving live functions across facet boundaries changes what every existing test is actually calling — thirty-plus commits repairing the suite covering borrower operations, stability-pool withdrawals, deployment and access control.",
          "The structural change is the interesting commit; the green suite afterwards is the work. A migration that leaves the tests red is not finished.",
        ],
        stack: ["hardhat", "mocha"],
      },
      {
        group: "Lending protocol",
        org: "kumo",
        start: 6,
        len: 2,
        title: "Multi-asset collateral",
        detail: [
          "The protocol originally accepted one kind of collateral. Accepting several touches everything: each asset needs its own price feed, its own risk parameters and its own savings pool.",
          "Threaded an asset parameter through the price feed and its tests, extended the SDK for multi-asset use, and added a factory that creates a stability pool per asset programmatically. Adding a collateral type became a config entry rather than another hand-written clone.",
        ],
        stack: ["solidity", "typescript"],
      },
      {
        group: "Lending protocol",
        org: "kumo",
        start: 8,
        len: 3,
        title: "TroveRedemptor",
        detail: [
          "The original contract tracked who borrowed what and settled it — two unrelated jobs with different users and different risk profiles. Moved settlement, including batch liquidation, onto its own contract.",
          "Batch liquidation closes many underwater positions in a single transaction instead of paying gas hundreds of times, which matters on the day a collateral asset drops and the whole pool has to be liquidated at once.",
        ],
        stack: ["solidity"],
      },
      {
        group: "Lending protocol",
        org: "kumo",
        start: 11,
        len: 2,
        title: "KUSD mint cap",
        detail: [
          "A cap on how much stablecoin the protocol can create, set per collateral type. Without it, falling carbon prices let borrowers keep minting against a shrinking asset base — the death spiral that killed several earlier lending protocols.",
          "Writing the headroom calculation surfaced a real bug: when the cap sat below the amount already minted, the subtraction wrapped around and reported enormous room instead of none. Guarded it and added tests.",
        ],
        stack: ["solidity"],
      },
      {
        group: "Lending protocol",
        org: "kumo",
        start: 0,
        len: 2,
        title: "Tellor oracle integration",
        detail: [
          "The protocol priced carbon credits from a single feed, meaning one outage or one manipulation breaks it. Added Tellor alongside Chainlink so a bad reading from one source cannot sink the protocol.",
          "Upstream work on the shared protocol rather than on a private repository — which is the part that needed external review to land.",
        ],
        stack: ["solidity", "ethereum", "tellor"],
      },
      {
        group: "Carbon-credit pilot",
        org: "kumo",
        start: 17,
        len: 3,
        title: "Carbon-credit lending contract",
        detail: [
          "A lending contract built for a pilot with ABN AMRO, selected for their accelerator. Deliberately plainer than the protocol it came out of.",
          "Five states — pending, active, repaid, liquidated, closed — with the contract refusing any transition that doesn't follow them. A borrower locks carbon and proposes terms; a lender accepts and funds it.",
        ],
        stack: ["solidity", "openzeppelin"],
      },
      {
        group: "Carbon-credit pilot",
        org: "kumo",
        start: 17,
        len: 3,
        title: "Lender and borrower allowlists",
        detail: [
          "Lenders and borrowers are explicit on-chain mappings of approved addresses — you cannot call the contract without being on the list.",
          "For a bank pilot that is the entire point: the protocol only ever moves money between counterparties the bank has signed off. It landed as its own pull request rather than folded into a feature.",
        ],
        stack: ["solidity"],
      },
      {
        group: "Carbon-credit pilot",
        org: "kumo",
        start: 17,
        len: 3,
        title: "Treasury routing and liquidation",
        detail: [
          "Liquidations pay a designated treasury rather than the borrower or the default recipient. Seized collateral frequently fails to cover the debt it was taken against, so the destination should be a protocol account rather than a person.",
          "Alongside it: markRepaid, liquidate, and renaming maxLTV to liquidationLTV once it was clear the parameter gated liquidation rather than maximum loan-to-value. In a lending contract a misleading name is a real hazard.",
        ],
        stack: ["solidity", "polygon"],
      },
      {
        group: "Deployment & tooling",
        org: "kumo",
        start: 0,
        len: 2,
        title: "Polygon deployment and Sushiswap migration",
        detail: [
          "Added the Polygon deployment parameters and refactored the deploy scripts so a network is targeted from data rather than by editing scripts before every deploy.",
          "Moved the Uniswap V2 addresses to Sushiswap's, upgraded Hardhat, and moved the RPC provider off Infura to Alchemy. Invisible in a diff, and a broken deployment if missed.",
        ],
        stack: ["solidity", "polygon", "hardhat"],
      }
    ],
  },

  /* ---------------------------------------------------------- 6. EXPERIENCE */
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
        "Shiva Router — contributed to the upgradeable proxy in front of Overlay's immutable core contracts. Rewrote the price oracle in the same codebase: TWAP from PancakeSwap V3 pools, made non-upgradeable and then fully immutable. 27,000+ transactions verified on-chain.",
        "Funded Trader System — built the program where sponsored users trade with protocol-provided USDT. Safe multisig wallets with Zodiac modules enforce that funds interact only with Overlay contracts, and call only the allowed functions. Off-chain monitoring detects drawdown past threshold, then programmatically closes all positions and pauses the Safe.",
        "Referral System — integrated an already-audited referral contract and built the verification layer around it: off-chain signed messages checked against on-chain state, with a fallback that rebuilds a missing record from chain. Alias normalisation and migration scripts to move existing records on-chain.",
        "Leaderboard & Trading Competitions — built the seasonal leaderboard (Node.js, MongoDB) tracking trader performance across configurable criteria, then extended it into a competition platform with filters for market, minimum collateral, and position lifetime.",
        "Subgraph — most of the indexing is mine: rewrote the config so new factories and networks stopped being hand-edits to YAML, added the router and PowerCard entities, and built the Matchstick test suite over the handlers.",
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
        "Evolved the protocol from a Liquity fork to support multiple collateral assets with governance-controlled risk parameters.",
        "Redesigned tokenomics to remove the protocol token while preserving system incentives — simpler economics without breaking existing functionality.",
        "Added Tellor alongside Chainlink as a second price source, so a single oracle outage or manipulation cannot sink the protocol. Upstream contribution, reviewed and merged by the original team.",
        "Moved the protocol to the diamond pattern because the core contract had outgrown the EVM's stack limit and the compiler was failing.",
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
      kind: "Protocol contract · Solidity 0.8.10",
      logo: "overlay",
      description:
        "The router contract at the centre of Overlay's perps protocol. Every higher-level system — the funded-trader program, the referral system — reaches protocol state through it, which is what lets the core contracts stay immutable once deployed. It also decides which systems may call which functions, so it enforces a permission boundary, not just a proxy.",
      highlights: [
        "Verified on-chain with 27,000+ transactions processed through it.",
        "Oracle redesign in the same codebase: TWAP from PancakeSwap V3 pools, made non-upgradeable and then fully immutable, resolving to the worst price available so it can never be manipulated in a borrower's favour.",
        "Invariant testing with Chimera on the staking/notional relationship, plus Foundry mainnet-fork tests for the oracle path.",
        "Ported the Chainlink feed test suite from Python to Foundry so one toolchain verifies both sides of the interface, then covered the inputs that actually broke things: a zero price, and a macro window equal to the micro window.",
      ],
      stack: ["Solidity", "Foundry", "Ethereum", "BNB Chain", "OpenZeppelin"],
      links: [
        {
          label: "BscScan — 27,000+ txns",
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
        "KUMO is a fork of the Liquity lending protocol, retargeted at carbon removal. A certified carbon credit is locked as collateral and stablecoins are drawn against it immediately, instead of waiting for the credit to be sold. I took over this fork and made it production-ready — the diamond upgrade, multi-asset support and the oracle work below were mine.",
      highlights: [
        "Converted the protocol to the diamond pattern because its functions had outgrown the EVM's stack limit and the compiler was failing. Callers reach the same address they always did, and new facets can be added later without touching the ones already holding user funds.",
        "Split settlement onto its own contract, which let batch liquidation close many underwater positions in a single transaction instead of paying gas hundreds of times, and added recovery mode for when the collateral backing everything drops below what the debts are worth.",
        "Made it multi-asset: threaded an asset parameter through 271 call sites across seven contracts that previously had none, plus a factory that creates a savings pool per asset rather than hand-copying deployed contracts.",
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
      ],
      links: [
        { label: "Source", url: "https://github.com/arthurka-o/kumo-protocol" },
        {
          label: "Upstream contribution",
          url: "https://github.com/wollooo/kumo-protocol",
        },
      ],
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
      name: "ABN AMRO pilot",
      kind: "Pilot contract · BUSL-1.1",
      logo: "kumo",
      description:
        "A contract for lending against carbon credits, built for a pilot with ABN AMRO, a Dutch bank. I wrote it, and kept it deliberately plain — explicit allowlists and a strict loan lifecycle, written so a bank's risk team could review and sign it off without reverse-engineering the logic.",
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
    note: "Smart Contract & Backend Engineer — Warsaw, Poland.",
  },
};