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
        layer: "data",
        org: "overlay",
        start: 24,
        len: 8,
        title: "Protocol subgraph",
        detail: [
          "The protocol doesn't run one market contract. It runs several factories, each issuing a different kind of market, across several networks — and the subgraph's config hardcoded a single PERIPHERY_ADDRESS. Every new factory or new network meant hand-editing YAML.",
          "The fix was to generate the config from the network manifest instead: each factory key in the network config becomes a data source, cloned from the first as a template so a new one inherits correct handlers. Adding a factory or switching network became a data change rather than a code change.",
          "Why it mattered: miss a single data source and that part of the protocol stops indexing silently. Nobody notices until a product query returns wrong data. Matchstick tests and the chapel network's dual factories came with the same work."
        ],
        stack: ["typescript", "ethereum"],
        repo: "https://github.com/overlay-market/v1-subgraph",
        repoLabel: "v1-subgraph",
      },
      {
        layer: "data",
        org: "overlay",
        start: 44,
        len: 3,
        title: "Referral address entity",
        detail: [
          "Made the referral address an indexed entity, so affiliate attribution is answered by the same subgraph the protocol already reads — rather than by a second data source that can quietly disagree with the first.",
          "Small change, and deliberately so: one place that answers the question is worth more here than a faster query would be."
        ],
        stack: ["typescript"],
        repo: "https://github.com/overlay-market/v1-subgraph",
        repoLabel: "v1-subgraph",
      },
      {
        layer: "contracts",
        org: "overlay",
        start: 27,
        len: 4,
        title: "Shiva Router",
        detail: [
          "Overlay's core contracts are immutable. A proxy sits in front of them so higher-level systems — the funded-trader program, referrals — can reach protocol state without the core ever being upgraded. Users hold the router address permanently; the logic behind it does not move.",
          "It does more than forward. Because the core cannot change, the router is also where the protocol states which contracts and which functions those higher-level systems are allowed to reach. That makes it a permission boundary, not just an indirection — which is the same reason the core stays non-upgradeable underneath.",
          "27,000+ transactions have passed through it."
        ],
        stack: ["solidity", "ethereum", "bnbchain"],
        repo: "https://bscscan.com/address/0xeB497c228F130BD91E7F13f81c312243961d894A",
        repoLabel: "BscScan — 27,000+ txns",
      },
      {
        layer: "contracts",
        org: "overlay",
        start: 42,
        len: 3,
        title: "Immutable TWAP oracle",
        detail: [
          "The price oracle started life as a UUPS upgradeable proxy — initializable, owner-controlled, with an initialize() and a PoolUpdated event. It was made non-upgradeable, then fully immutable: constructor arguments, no initializer, no upgrade path.",
          "The reasoning runs opposite to the rest of the protocol, which stays upgradeable on purpose because you have to be able to fix a live deployment. A bug in an ordinary contract means money is stuck or mispriced. A bug in the price means every loan is sized wrong right now — and an upgradeable oracle is a standing invitation: whoever reaches that key controls every user's collateral.",
          "When both a TWAP and a spot price exist, the protocol takes the worse one for the borrower — the higher price, so less can be borrowed. Manipulation can then only ever hurt whoever is doing it. The same conservatism runs through the staleness guard, which rejects an old price rather than trusting it, and through the TWAP period, which was moved out of the constructor into the collateral contract so a single immutable oracle can serve several market configurations.",
          "The trade is real and worth stating plainly: if the oracle is found to be wrong it cannot be patched, and the protocol has to be paused instead. That was a deliberate choice, not an oversight."
        ],
        stack: ["solidity", "ethereum", "openzeppelin"],
        repo: "https://github.com/overlay-market/v1-shiva",
        repoLabel: "v1-shiva",
      },
      {
        layer: "contracts",
        org: "overlay",
        start: 31,
        len: 3,
        title: "Invariant testing",
        detail: [
          "Ordinary tests check the cases you thought of. Invariant tests state a property that must always hold and then fuzz thousands of random inputs trying to break it.",
          "Here the property is that a trader's staked balance must never exceed the notional they can claim — the relationship that decides how much the protocol believes is actually locked up. Foundry's Chimera harness was installed to run it.",
          "Plus mainnet-fork tests, so the oracle path is exercised against real chain state rather than only against fixtures. A fork test catches what a unit test structurally cannot: a contract that behaves correctly against invented data and wrongly against a real pool."
        ],
        stack: ["solidity", "ethereum", "openzeppelin"],
        repo: "https://github.com/overlay-market/v1-shiva",
        repoLabel: "v1-shiva",
      },
      {
        layer: "contracts",
        org: "overlay",
        start: 35,
        len: 2,
        title: "Oracle feed rework",
        detail: [
          "The Chainlink feed test suite was in Python while everything it tested was Solidity. Two languages means the tests and the contract can quietly disagree about what the interface even is. Ported to Foundry so one toolchain verifies both sides of it.",
          "Then covered the cases that actually broke things: a zero price, and a macro window equal to the micro window. Both are inputs the contract has to survive without pricing a loan at nothing or dividing by a zero-length window."
        ],
        stack: ["solidity", "chainlink"],
        repo: "https://github.com/overlay-market/v1-core",
        repoLabel: "v1-core",
      },
      {
        layer: "backend",
        org: "overlay",
        start: 30,
        len: 3,
        title: "Referral verification",
        detail: [
          "Affiliates refer traders, and two parties have to agree a referral happened — the referrer and the referred. Neither should have to trust the other's database, and neither should be able to claim a referral that didn't happen.",
          "MongoDB holds the affiliate records and is checked first, but a record can be missing — after a cleanup, say. So when the database can't answer, the protocol goes to the chain and reads the user's on-chain tier; if the chain says they're an affiliate, the database record is recreated.",
          "The shape is the point: the chain is authoritative and the cache is rebuildable from it. Without the fallback, one database cleanup permanently disqualifies a real affiliate. A claim also needs a minimum trading volume before it counts, and aliases are normalised so one person cannot hold several aliases and be paid more than once."
        ],
        stack: ["solidity", "nodedotjs", "openzeppelin"],
        repo: "https://github.com/overlay-market/Referral",
        repoLabel: "Referral",
      },
      {
        layer: "backend",
        org: "overlay",
        start: 38,
        len: 4,
        title: "Leaderboard & competitions",
        detail: [
          "Written as a rule engine rather than a set of hardcoded queries. Minimum USD collateral, exempt markets, and an OVL price fallback are configuration, not code.",
          "The collateral floor is the one that matters. Without it, a trader could open a dust position, multiply it with leverage, and top a leaderboard without carrying meaningful risk. The floor makes a ranking reflect real conviction.",
          "Money maths goes through decimal.js rather than floats — the same class of decision as the PnL precision fix in the product, applied deliberately on the backend so a payout calculation can't inherit a rounding error."
        ],
        stack: ["nodedotjs", "mongodb"],
        repo: "https://github.com/overlay-market/overlay-leaderboard-backend",
        repoLabel: "leaderboard-backend",
      },
      {
        layer: "backend",
        org: "overlay",
        start: 43,
        len: 4,
        title: "Funded-trader kill switch",
        detail: [
          "Overlay sponsors traders: the protocol puts up the collateral and pays for the leverage, in exchange for a share of the profit. The trader never risks their own money, so the protocol has to be the risk manager instead — it has to be able to close a position the moment the trader blows through their limit.",
          "Each sponsored trader holds a Safe, a contract wallet the protocol controls, watched against two independent limits: a funding threshold at 50% of initial collateral, and a daily threshold at 75% of that day's baseline. The second exists because the first alone can be bled past — losing a little every day without ever crossing the line drains the program over a month. The daily baseline is written once per trader per day and every later check compares against that snapshot, which converts a slow bleed into a fast stop. Either breach closes every position and then pauses the Safe so it cannot trade again.",
          "The hard part was external. A Zodiac module submits transactions on the Safe's behalf through MultiSend, which batches calls by delegatecall. Safe's transaction service then changed policy to reject delegate calls to non-whitelisted contracts, and the kill switch stopped working. The fix was MultiSendCallOnly — the same contract that physically cannot make arbitrary delegate calls, only plain calls, which is exactly why it was safe to whitelist. Delegatecall is still used underneath, because the calls must appear to come from the trader's own Safe: the protocol identifies itself by msg.sender. So the fix was not \"stop using delegatecall\", it was \"use the one variant that is both whitelisted and still executes as the Safe.\"",
          "Least privilege, same system: the kill-switch service holds read-write database credentials because it records baselines and triggers liquidations, while the public-facing API server is read-only. If the API server were compromised, an attacker who could write could corrupt the baselines the kill switch depends on — hiding a blowout until it was too late to stop it. Also in this repo: Safe Global API v2, retry-with-backoff on the Safe client, and Telegram alerts on kill-switch events."
        ],
        stack: ["nodedotjs", "mongodb", "solidity"],
        repo: "https://github.com/overlay-market/avatar-killswitch",
        repoLabel: "avatar-killswitch",
      },
      {
        layer: "sdk",
        org: "overlay",
        start: 41,
        len: 6,
        title: "Published SDK",
        detail: [
          "The package other teams import. Real-time portfolio PnL across multiple markets, with versioned factories and deprecation so a caller is never silently moved onto a contract that is being retired.",
          "The interesting work is defensive: handling a position state the code did not expect rather than throwing, and returning a result rather than failing when a chain address lookup does not resolve.",
          "USDT is 6 decimals where most tokens are 18. Getting that wrong does not error — it silently returns values a trillion off. That class of quiet error is what a public SDK has to get right, because callers cannot see inside it to check your work."
        ],
        stack: ["typescript"],
        repo: "https://github.com/overlay-market/overlay-sdk",
        repoLabel: "overlay-sdk — v0.1.29",
      },
      {
        layer: "frontend",
        org: "overlay",
        start: 29,
        len: 5,
        title: "Referrals in the UI",
        detail: [
          "Referral alias registration and attribution in the product, including self-referral rejection and signature checks — the same off-chain signature verification the backend relies on, enforced on the client as well.",
          "Error copy was decoupled from the input field so a validation failure explains itself instead of echoing a raw SDK message. The user sees what failed and what to do about it; the SDK message stays where it belongs."
        ],
        stack: ["typescript", "react", "nextdotjs"],
        repo: "https://github.com/overlay-market/overlay-interface",
        repoLabel: "overlay-interface",
      },
      {
        layer: "frontend",
        org: "overlay",
        start: 41,
        len: 6,
        title: "Prediction markets & funded UI",
        detail: [
          "Prediction market groups with routing, data model and multi-line probability charts; funded-trader account cards with payout dates; referral modals with correct rates and thresholds.",
          "The commit worth explaining changed portfolio PnL. An oracle price is a bigint — Ethereum integers are 256-bit — and the code coerced it with Number(). JavaScript numbers are 64-bit floats carrying 53 bits of precision, so an on-chain price around 1.5e18 came back as an approximation, and dividing it by 1e18 produced a price that was wrong by a fraction. The fix renders the bigint to its decimal string first with formatUnits and only then makes it a float, so the digits that matter survive the conversion.",
          "Why that was not cosmetic: the affected figures are total value locked and unrealised PnL — the portfolio value and the profit and loss a trader actually looks at. A rounding error in a displayed PnL is a financial bug, and it is the class of defect that makes a trader distrust every other number on the screen.",
          "The same commit fixed a stale closure. A usePrevious hook was being read inside a useCallback, which captured a copy that only updated on the next render, so the callback compared new data against old-old data and its change-detection could be wrong — polling refreshes could silently fail to announce updates. A ref fixes it because assignment to one is synchronous."
        ],
        stack: ["typescript", "react", "nextdotjs"],
        repo: "https://github.com/overlay-market/overlay-interface-v2",
        repoLabel: "overlay-interface-v2",
      },
      /* --- KUMO -------------------------------------------------------
         Source: ~/dev/cvless/KUMO-EXTRACTION.md, reconstructed from the
         `wollooo/kumo-protocol` and `arthurka-o/kumo-protocol` histories.
         Every span below is read off a dated commit in that document; no
         date, technology or claim here is inferred.

         Phase 1 and phase 2 point at public repositories, both confirmed to
         resolve. Phase 3 has no inspectable artefact — `arthurka-o/lending`
         is gone and `kumo-earth/lending` is private — so those three rows
         carry kumo.earth, which resolves but is not a repository. The user
         cleared that work for publication.

         These rows merge into the Protocol contracts band rather than taking a
         band of their own, which makes that band a continuous run of contract
         work from May 2022 to Mar 2026. The other four bands stay Overlay-only
         and therefore read as layers opened after 2024. */
      {
        layer: "contracts",
        org: "kumo",
        start: 0,
        len: 2,
        title: "Tellor oracle integration",
        detail: [
          "The protocol decides what a carbon credit is worth by reading a price feed. Relying on one means a single outage — or a single manipulation — breaks the protocol. Integrated Tellor alongside Chainlink so a bad reading from one source doesn't sink it.",
          "Partly maintenance, partly performance: the Tellor interfaces and functions the price path actually calls were brought current, and an early return was added to TellorCaller so the common case stops before doing expensive work on an input that is already unusable.",
          "This was upstream work on the shared protocol rather than on a private repository — sixteen contributions alongside other contributors, which is the part of it that needed the external review to land."
        ],
        stack: ["solidity", "ethereum", "tellor"],
        repo: "https://github.com/wollooo/kumo-protocol",
        repoLabel: "wollooo/kumo-protocol",
      },
      {
        layer: "contracts",
        org: "kumo",
        start: 0,
        len: 2,
        title: "Polygon deployment and Sushiswap migration",
        detail: [
          "Added the Polygon Mumbai deployment parameters and refactored the deployment scripts for KUMO's own configuration, so a network is targeted from data rather than by editing scripts before every deploy.",
          "Moved the Uniswap V2 addresses to Sushiswap's. It changes the router the deployment points at, not any contract logic — invisible on a CV, and a broken deployment if missed. This is the class of change that only surfaces when somebody tries to launch.",
          "Also in the same stretch: upgrading the Hardhat versions, and moving the RPC provider off Infura to Alchemy."
        ],
        stack: ["solidity", "polygon", "hardhat"],
        repo: "https://github.com/wollooo/kumo-protocol",
        repoLabel: "wollooo/kumo-protocol",
      },
      {
        layer: "contracts",
        org: "kumo",
        start: 6,
        len: 2,
        title: "Multi-asset collateral",
        detail: [
          "The protocol originally accepted one kind of collateral. Accepting several touches everything: each asset needs its own price feed, its own risk parameters, and its own savings pool.",
          "The work threads an asset parameter through IPriceFeed and its tests, extends the SDK for multi-asset use, and adds a StabilityPoolFactory behind an IStabilityPoolFactory interface. A stability pool holds everyone's deposits and pays out the yield — with several assets you need several pools, and copying a deployed contract by hand is error-prone. The factory creates them programmatically, one per asset, correctly linked to that asset's parameters.",
          "The factory is the part that scales. Adding a collateral type became adding a factory and a config entry, not another hand-written clone."
        ],
        stack: ["solidity", "typescript"],
        repo: "https://github.com/arthurka-o/kumo-protocol",
        repoLabel: "arthurka-o/kumo-protocol",
      },
      {
        layer: "contracts",
        org: "kumo",
        start: 7,
        len: 3,
        title: "Diamond migration (EIP-2535)",
        detail: [
          "The core contract was 1,575 lines and had hit a hard machine limit. The EVM gives each function roughly sixteen stack slots — the scratchpad it uses for parameters and locals — and large Liquity-lineage functions run out of room, at which point the compiler stops with Stack too Deep. Two commits in this repository are literally titled Trying to fix \"Stack too deep\" and Fix Stack too Deep.",
          "The second constraint is commercial rather than technical: deploying a changed contract means deploying a new one, and for a protocol holding real money that is a migration its users have to do.",
          "The Diamond pattern answers both. Instead of one contract the logic is split into small facets behind the same address — TroveManagerDiamond is 77 lines and acts as the front door, TroveManagerFacet is 482 lines of position bookkeeping, and the rest cover ownership, facet replacement and introspection. Callers reach the same address they always did; what changed is that new facets can be added later without touching the ones already holding user funds.",
          "So the pattern was not adopted because it was fashionable. A compiler error forced a decision, and the migration requirement confirmed it."
        ],
        stack: ["solidity", "ethereum", "hardhat"],
        repo: "https://github.com/arthurka-o/kumo-protocol",
        repoLabel: "arthurka-o/kumo-protocol",
      },
      {
        layer: "contracts",
        org: "kumo",
        start: 8,
        len: 3,
        title: "TroveRedemptor",
        detail: [
          "The original TroveManager did two unrelated jobs: track who borrowed what and when, and settle it — accept redemptions, liquidate bad loans. Those halves have different users, borrowers versus liquidators, and different risk profiles — and the settling half was enormous.",
          "Moved batch liquidation onto TroveRedemptor, then fixed redeemCollateral and TroveOwners behind it. Batch liquidation closes many underwater positions in a single transaction instead of someone paying gas hundreds of times, which matters on the day a collateral asset drops and the whole pool has to be liquidated at once.",
          "The contract that came out of it holds recovery mode: the protocol-wide failsafe for when the collateral backing everything drops below what the debts are worth, spreading the shortfall across the pool. Rare, serious, and the code path nobody tests until they need it."
        ],
        stack: ["solidity"],
        repo: "https://github.com/arthurka-o/kumo-protocol",
        repoLabel: "arthurka-o/kumo-protocol",
      },
      {
        layer: "contracts",
        org: "kumo",
        start: 8,
        len: 5,
        title: "Test suite through the migration",
        detail: [
          "Moving live functions across facet boundaries changes what every existing test is actually calling. Thirty-plus commits repairing BorrowerOperationsTest, StabilityPool_SPWithdrawalToCDPTest, ConnectContractsTest, DeployKUMOContractsTest and AccessControlTest, alongside refactoring the tests themselves.",
          "This is the bulk of that migration and the part a CV never mentions. The structural change is the interesting commit; the green suite afterwards is the work. On a protocol holding money, a migration that leaves the tests red is not finished."
        ],
        stack: ["hardhat", "mocha"],
        repo: "https://github.com/arthurka-o/kumo-protocol",
        repoLabel: "arthurka-o/kumo-protocol",
      },
      {
        layer: "contracts",
        org: "kumo",
        start: 11,
        len: 2,
        title: "KUSD mint cap",
        detail: [
          "A cap limits how much stablecoin the protocol can ever create. If carbon credit prices fall, new borrowers cannot keep minting KUSD against a shrinking asset base, which is the death spiral that killed several earlier lending protocols. Setting the cap per asset lets each collateral type carry its own risk limit.",
          "KUSDMintRemainder answers a simple question: how much more KUSD can still be minted? The cap, minus what has already been minted. Both are unsigned integers, and when the cap sits below the amount already minted that subtraction wraps around to an enormous positive number instead of going negative.",
          "Every deployed copy of a contract is immutable, so an overflow in a lending protocol's headroom calculation is not cosmetic — it reads as more room than actually exists. Wrote the guard, fixed the helper, and added tests for it."
        ],
        stack: ["solidity"],
        repo: "https://github.com/arthurka-o/kumo-protocol",
        repoLabel: "arthurka-o/kumo-protocol",
      },
      {
        layer: "contracts",
        org: "kumo",
        start: 17,
        len: 3,
        title: "Loans.sol lifecycle",
        detail: [
          "The carbon-credit lending pilot, selected for the ABN AMRO and Techstars Future of Finance accelerator. This contract is deliberately simpler than the protocol it came out of: the goal was something a bank would sign off on, not elegance. 386 lines at Solidity 0.8.19, one file.",
          "Every loan moves through five states — pending, active, repaid, liquidated, closed — and the contract refuses any transition that doesn't follow them. A borrower locks carbon tokens and proposes terms: rate, LTV, duration and amounts. A lender accepts and funds it. It is then repaid, liquidated if the LTV breaks, or withdrawn and closed.",
          "Two design choices carry the weight. Liquidations are owner-triggered and pay a treasury rather than the borrower, and there is a V2 escape hatch — a setV2Address plus a fund-transfer function gated behind onlyV2 — so the pilot contract can hand off to a successor without another deployment."
        ],
        stack: ["solidity", "openzeppelin"],
        repo: "https://kumo.earth/",
        repoLabel: "kumo.earth",
      },
      {
        layer: "contracts",
        org: "kumo",
        start: 17,
        len: 3,
        title: "Lender and borrower allowlists",
        detail: [
          "Lenders and borrowers are explicit on-chain mappings of approved addresses. You cannot simply call the contract — you have to be on the list. This landed as its own pull request rather than folded into a feature.",
          "For a bank pilot that is the entire point. The protocol is permissioned deliberately, so it only ever moves money between counterparties the bank has signed off. It is a permission boundary rather than a feature, which is why it earned its own review."
        ],
        stack: ["solidity"],
        repo: "https://kumo.earth/",
        repoLabel: "kumo.earth",
      },
      {
        layer: "contracts",
        org: "kumo",
        start: 17,
        len: 3,
        title: "Treasury routing and liquidation",
        detail: [
          "withdrawLiquidated sends seized collateral to a designated treasury address rather than back to the borrower or the default recipient. Seized collateral frequently fails to cover the debt it was taken against, so the right destination is a protocol account rather than a person — and the loan state closes once it has run.",
          "Alongside it: markRepaid, liquidate, and the rename of maxLTV to liquidationLTV once it became clear the parameter gated liquidation rather than maximum loan-to-value. In a lending contract a misleading name is a real hazard — and renaming it is exactly the kind of work that only happens when someone reads their own contract closely."
        ],
        stack: ["solidity", "polygon"],
        repo: "https://kumo.earth/",
        repoLabel: "kumo.earth",
      },
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
      kind: "Protocol contract · Solidity 0.8.10 · Foundry",
      logo: "overlay",
      description:
        "The router contract at the centre of Overlay's perps protocol. Every higher-level system — the funded-trader program, the referral system — reaches protocol state through it, which is what lets the core contracts stay immutable once deployed. It also decides which systems may call which functions, so it acts as a permission boundary rather than just a proxy.",
      highlights: [
        "Verified on-chain with 27,000+ transactions processed through it.",
        "Oracle redesign in the same codebase: TWAP from PancakeSwap V3 pools, made non-upgradeable and then fully immutable, resolving to the worst price available so it can never be manipulated in a borrower's favour.",
        "Invariant testing with Chimera on the staking/notional relationship, plus Foundry mainnet-fork tests for the oracle path.",
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
      kind: "Protocol · Solidity 0.8.11 · Hardhat → Foundry",
      logo: "kumo",
      description:
        "KUMO lends against carbon removal: a certified carbon credit is locked as collateral and stablecoins are drawn against it immediately, instead of waiting for the credit to be sold. I took over this fork and made it production-ready — the diamond upgrade, multi-asset support and the oracle work below were mine.",
      highlights: [
        "Converted the protocol to the diamond pattern because its functions had outgrown the EVM's stack limit and the compiler was failing. Settlement moved into its own facet, which also let batch liquidation run many closures in a single transaction instead of hundreds.",
        "Made it multi-asset: threaded an asset parameter through 271 call sites across seven contracts that previously had none, plus a factory that creates a savings pool per asset rather than hand-copying deployed contracts.",
        "Added a per-asset cap on stablecoin creation, and fixed a bug where the \"how much room is left\" calculation wrapped around to report enormous headroom instead of none.",
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
      kind: "Risk system · TypeScript, Solidity",
      logo: "overlay",
      description:
        "The safety system that automatically closes a protocol-sponsored trader's positions when they breach a loss limit, and pauses their account until a human looks at it. Sponsored traders risk none of their own money, so the protocol has to act as the risk manager rather than rely on the trader's judgement.",
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
      kind: "Data layer · TypeScript · The Graph",
      logo: "overlay",
      description:
        "The protocol's on-chain index — the data layer the frontend and the analytics read from. I did most of the indexing for the protocol's main contract and its router, and brought the whole thing onto multiple networks.",
      highlights: [
        "Indexed the router alongside the core contracts, so position and market data flowing through it lands in the subgraph instead of being invisible to the frontend.",
        "Made the index multichain, including Berachain mainnet.",
        "Added the PowerCard ERC1155 entities and their transfer handling.",
        "Reworked several handlers where the recorded state was wrong — unwind, liquidate, emergency withdraw and build — including a funding-payment formula that was computing the wrong value.",
        "Migrated the entity IDs to Bytes across the schema, which changed how every entity is keyed.",
        "Matchstick test suite so handler changes are verified rather than eyeballed.",
      ],
      stack: ["TypeScript", "The Graph", "Ethereum"],
      links: [
        { label: "Source", url: "https://github.com/overlay-market/v1-subgraph" },
      ],
    },
    {
      name: "Immutable TWAP oracle",
      kind: "Price oracle · same repo as the Shiva Router",
      logo: "overlay",
      description:
        "The protocol's price feed, rebuilt on PancakeSwap V3 pools and then deliberately locked down: non-upgradeable first, then fully immutable, while every other contract in the protocol stays upgradeable.",
      highlights: [
        "Immutability chosen because the risk is asymmetric — a bug in a normal contract is fixable, but a bug in the price means every loan is sized wrong the moment it lands, and the upgrade key becomes the obvious target.",
        "Resolves to the worst price available across spot and TWAP. Manipulation can therefore only ever hurt whoever performs it.",
        "Staleness guard rejects an old price rather than trusting it.",
      ],
      stack: ["Solidity", "Ethereum", "OpenZeppelin", "Chainlink"],
      links: [
        { label: "Source", url: "https://github.com/overlay-market/v1-shiva" },
      ],
    },
    {
      name: "Leaderboard & competitions",
      kind: "Product backend · Node.js, Express, MongoDB",
      logo: "overlay",
      description:
        "Seasonal trading leaderboards and competitions. I built this backend from the ground up — schema, rules engine and all — as a configurable system, so launching a new competition is a change to configuration rather than a redeploy.",
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
      kind: "On-chain + backend · Solidity 0.8.19, Node.js",
      logo: "overlay",
      description:
        "Tracks which traders signed up through an affiliate link and pays the affiliate accordingly. I built the attribution layer — settling it on-chain so neither the protocol nor the affiliate has to trust the other's database for who referred whom.",
      highlights: [
        "Attribution is settled on-chain and signed off-chain, so a database cleanup can no longer permanently disqualify a real affiliate — the record is recreated from chain when it's missing.",
        "Minimum trading volume enforced before a referral counts, and aliases are normalised so one person can't claim under several identities.",
      ],
      stack: ["Solidity", "Node.js", "OpenZeppelin"],
      links: [
        { label: "Source", url: "https://github.com/overlay-market/Referral" },
      ],
    },
    {
      name: "Overlay SDK",
      kind: "Published package · TypeScript",
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
      kind: "Protocol frontend · TypeScript, React, Next.js",
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
      name: "ABN AMRO pilot — carbon-credit lending",
      kind: "Pilot contract · Solidity 0.8.19 · BUSL-1.1",
      logo: "kumo",
      description:
        "A contract for lending against carbon credits, built for a pilot with ABN AMRO, a Dutch bank. I wrote it, and kept it deliberately plain — explicit allowlists and a strict loan lifecycle, written so a bank's risk team could review and sign it off without reverse-engineering the logic.",
      privateRepo: true,
      note: "Built for the ABN AMRO + Techstars accelerator.",
      highlights: [
        "Five-state loan lifecycle — pending, active, repaid, liquidated, closed — where the contract refuses any transition that doesn't follow that path.",
        "Explicit on-chain allowlists of lenders and borrowers. The protocol is permissioned on purpose: it only moves money between counterparties the bank has approved.",
        "Liquidation proceeds routed to a designated treasury rather than the default recipient, because seized collateral often doesn't cover the debt.",
        "A V2 escape hatch so the pilot can hand off to a successor contract.",
        "Smaller correctness work: a maxLTV → liquidationLTV rename (the old name implied a borrowing limit rather than a liquidation threshold), the correct OpenZeppelin transfer helper on withdrawal paths, a tolerance on duration comparison, and test coverage for the liquidation and treasury paths.",
      ],
      stack: ["Solidity", "Hardhat", "OpenZeppelin"],
      links: [],
    },
    {
      name: "StreamBeam",
      kind: "ETHGlobal Prague 2025 · Solo · LayerZero General Prize",
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
      kind: "ETHWarsaw 2025 · Team · Prize winner · Foundry",
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