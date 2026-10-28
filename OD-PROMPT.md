# Design brief — arthurka.eu

Paste this into OpenDesign as the project brief. It describes the audience, the
content, and — most importantly — what "good" and "slop" mean for this page.

---

## The one-line brief

A minimal, engineering-credible personal site for a Solidity / protocol engineer.
It has to make a hiring manager believe within 30 seconds that this person ships
audited, money-moving contracts. Everything else is secondary.

## Who this is for

Two readers, in this order:

1. **A protocol engineering hiring manager** scanning for signal. They will not
   read a paragraph. They will look at three numbers, one contract address, and
   one sentence about the work.
2. **An engineer doing due diligence** who opens the links. Whatever the page
   claims must survive that click.

The second reader is the one that constrains the design. Every claim links to
something real — a verified contract, a public repository. Never ship a claim
you cannot link.

## Content — all of it is real, use exactly this

### Hero

- Name: Arthur Galiullin
- Role: Solidity / Protocol Engineer
- Tagline: Perps DEX to TGE · multi-asset lending · 2× hackathon prize winner
- Location: Warsaw, Poland (remote EU)
- Email: work@arthurka.eu · GitHub: github.com/arthurka-o

### Three proof points

Each is a number plus the context that produced it. Never a bare number.

| Stat | Label | Context |
|---|---|---|
| $2.9M | raised | Overlay Protocol, exotic perps DEX on BSC. Polychain Capital, 1kx, ParaFi. Audited by Spearbit, Trail of Bits, Nethermind. One of six core engineers, testnet to TGE. |
| 27,000+ | on-chain transactions | Through the Shiva Router — an upgradeable proxy wrapping Overlay's immutable core contracts. Links to BscScan: `0xeB497c228F130BD91E7F13f81c312243961d894A` |
| 2× | hackathon prize winner | ETHGlobal Prague 2025 (LayerZero General Prize, solo, 36h) · ETHWarsaw 2025 |

### The timeline — this is the centrepiece

**Do not render commit counts anywhere.** In an LLM-assisted workflow a commit
total measures the assistant, not the engineer, and it is the one number on the
page a reader cannot verify. What matters is *what shipped and when*.

Structure it as a horizontal Gantt. Five bands, each a layer of the stack:

```
Data layer        ·······························································
Protocol contracts ·······························································
Systems           ·······························································
SDK               ·······························································
Product           ·······························································
   2024 (8mo)              2025 (12mo)              2026 (3mo)
```

Entries, with month spans counting from 2024-05 as month 0:

**Data layer** — no official The Graph mark exists in the assets; render this band text-only.
- Protocol subgraph · months 0–7 — "Matchstick tests, multi-factory config, chapel network"
- Referral address entity · months 20–22 — "Referral data made queryable from the same index"

**Protocol contracts** — icon: Solidity
- Shiva Router · months 3–6 — "Proxy routing higher-level systems at immutable core contracts"
- Invariant testing · months 7–9 — "staking/notional invariant under Chimera, plus fork tests"
- Oracle feed rework · months 11–12 — "Python test suite ported to Foundry; zero-price cases"
- Immutable TWAP oracle · months 18–20 — "Non-upgradeable → immutable; worst-case spot/TWAP selection"

**Systems** — icon: Node.js
- Referral verification · months 6–8 — "Off-chain signatures with an on-chain fallback"
- Leaderboard & competitions · months 14–17 — "Configurable rules — min-USD collateral, exempt markets"
- Funded-trader kill switch · months 19–22 — "Zodiac MultiSendCallOnly past Safe's delegate-call rejection"

**SDK** — icon: TypeScript
- Published SDK · months 17–22 — "Portfolio PnL across markets; USDT decimals; factories"

**Product** — icon: React
- Referrals in the UI · months 5–9 — "Signature checks, error messages decoupled"
- Prediction markets & funded UI · months 17–22 — "Bigint precision and stale-closure fixes"

**Interaction.** Bars are clickable and open a detail panel with: band name,
entry title, the one-line note above, a paragraph of real engineering detail, the
stack as official brand icons, and a source link. Same bar closes it. Escape
closes. Keyboard must reach every bar.

**Stack icons per entry** — draw from `assets/logos/`, three treatments each
(plain, `-inv` inverted for dark ground, `-mono` monochrome):
`Solidity, Ethereum, BNB Chain, Chainlink, OpenZeppelin, TypeScript, Node.js, MongoDB, React, Next.js`

Full detail copy, use as written:

- **Protocol subgraph** — The protocol's on-chain index. Rewrote the factory
  configuration from a single PERIPHERY_ADDRESS into generated multi-factory
  config, added the chapel network with dual factories, and added matchstick
  tests so handler changes are verified rather than eyeballed.
- **Referral address entity** — Added the referral address as an indexed entity,
  so affiliate attribution is queryable through the same subgraph the protocol
  already reads, instead of a separate data source.
- **Shiva Router** — The seam that lets the funded-trader program and the referral
  system reach protocol state without the core being upgradeable. It also
  constrains which contracts and which functions those higher-level systems are
  allowed to call — the permission boundary, not just a proxy.
- **Immutable TWAP oracle** — Built the price feed on PancakeSwap V3 pools. Took
  it in two deliberate steps — first removing upgradeability, then making the
  oracle itself immutable — and moved the TWAP period into the loan-based stable
  collateral contract so it cannot be retuned after deployment. Price resolution
  takes the worst case across spot and TWAP rather than whichever reads higher.
- **Invariant testing** — Property-based testing on the router. Encoded the
  relationship between staked balance and position notional as an invariant and
  fuzzed it with Chimera, then added Foundry mainnet-fork tests so the oracle path
  is exercised against live state.
- **Oracle feed rework** — Ported the Chainlink feed test suite from Python into
  Foundry so the oracle is verified by the same toolchain that verifies the
  contracts it feeds, and covered the cases that actually broke things: a zero
  price, and macroWindow equal to microWindow.
- **Referral verification** — Wired affiliate verification so a claim carries an
  off-chain signed message and is checked against on-chain state — with an
  on-chain verification path as fallback when the signature route cannot be
  trusted. Enforced a minimum trading volume before a referral counts, and
  normalised aliases so one person cannot hold several.
- **Leaderboard & competitions** — Seasonal leaderboards and trading competitions
  driven by a rule engine rather than hardcoded queries: minimum USD collateral
  per market, exempt markets, OVL fallback for stable stats. Money maths goes
  through decimal.js — no floats anywhere near a payout.
- **Funded-trader kill switch** — Off-chain monitoring of trader drawdown that
  closes positions and pauses the trader's Safe. The hard part was Safe's
  transaction service rejecting the delegate calls Zodiac needs, solved with
  MultiSendCallOnly. Also migrated to Safe Global API v2, added retry-with-backoff
  to the client, split reads onto a read-only MongoDB instance, and wired
  Telegram alerts on kill-switch events.
- **Published SDK** — The package other teams import. Real-time portfolio PnL
  across multiple markets, USDT decimals handled correctly at 6 rather than 18,
  and versioned factories with deprecation so a caller is never silently moved
  onto the wrong one.
- **Referrals in the UI** — Referral alias registration and attribution in the
  app, including self-referral rejection and signature checks. Error copy was
  decoupled from the input field so a validation failure explains itself instead
  of echoing a raw SDK message.
- **Prediction markets & funded UI** — Prediction market groups with routing,
  data model and multi-line probability charts; funded-trader account cards with
  payout dates; referral modals with correct rates and thresholds. Also fixed two
  defects worth naming: a bigint precision bug and a stale closure, both in the
  position PnL path where a rounding error is a financial one.

### Experience

- **Protocol Engineer, Overlay Protocol** · May 2024 – May 2026 · Remote
  Exotic perps DEX on BSC. One of six core engineers, testnet through TGE.
  Exotic perps DEX on BSC ($2.9M raised, backed by Polychain Capital, 1kx,
  ParaFi; audited by Spearbit, Trail of Bits, Nethermind). One of 6 core engineers
  through testnet to TGE. Stack: Solidity, Foundry, Safe, Zodiac, TypeScript,
  Node.js, MongoDB, Ethers.js, The Graph
- **Solidity Developer, KUMO** · March 2022 – January 2024
  Lending protocol secured by carbon credits. Selected for the ABN AMRO +
  Techstars Future of Finance Accelerator; built and launched a pilot with ABN
  AMRO. One of two Solidity developers. Stack: Solidity, Hardhat, Chainlink,
  OpenZeppelin, Diamond Pattern, UUPS, Ethers.js
- **Ruby on Rails Developer** · 2016 – 2022
  Six years backend and full-stack across three companies. Flatstack/Galvanize
  (enterprise GRC), meyvn (HR platform), Technokratos (marketplace). Stack:
  Ruby on Rails, PostgreSQL, React, TypeScript, AWS, Sidekiq

### Skills — grouped, no proficiency ratings

The CV does not state levels, so do not invent them. Grouping only.

- **Protocol**: Solidity, Foundry, Hardhat, EVM, UUPS, Diamond Pattern, OpenZeppelin, Safe, Zodiac
- **Backend**: TypeScript, Node.js, Express, MongoDB, PostgreSQL, REST APIs, The Graph
- **Infra**: AWS (Lambda, ECS, Terraform), Docker, CI/CD, Git

### Education

- **M.Sc. Computer Software Engineering** — Kazan Federal University, Institute of Information Technology, 2018–2020
- **B.Sc. Applied Informatics** — Kazan Federal University, Institute of Information Technology, 2014–2018

### Languages

Russian (native) · English (professional) · Polish (basic)

### Contact

work@arthurka.eu · github.com/arthurka-o · Warsaw, Poland · CET/CEST
Also: a PDF CV download, and a 404 page.

## Design constraints — read carefully, these are the whole job

### Absolute bans

- **No purple.** No `#8b5cf6`, `#a855f7`, `#7c3aed`, `#6366f1`. No indigo, no
  violet, no purple-tinted shadow. This is the single most important constraint
  on the page. If you are about to reach for a violet-500 accent, stop.
- **No gradients.** Not on text, not on backgrounds, not on buttons. Not even
  subtle. A flat surface beats a gradient at every point.
- **No glassmorphism, no glow, no drop shadows.**
- **No oversized border radii.** Square or 2–4px. No `border-radius: 16px`.
- **No generic AI-startup visual language:** no centred hero with a big CTA
  button, no "Trusted by" logo strip, no testimonial cards, no three-column
  feature grid, no gradient mesh blobs.
- **No skill radar/spider charts.** No donut charts. No bar charts of skill
  levels. They read as decoration and cannot be verified.
- **No stock photography.** No illustration. No 3D render.

### Do

- **Type first.** This page is mostly text. Hierarchy, measure and rhythm do the
  work that colour and imagery would do on a product page.
- **Pick a real type pairing.** Do not default to Inter. System font stacks are
  acceptable and preferred for load performance, but the pairing must be a
  considered choice with distinct roles — one for prose, one for data/labels/metadata.
- **Two themes, both first-class.** Light (paper) and dark (night), toggle in the
  header, persisted, respecting `prefers-color-scheme` on first visit. Theme must
  apply before first paint — no flash of the wrong theme. The toggle must not
  re-flow the page.
- **One accent colour**, used sparingly — for links, focus rings, the active bar
  in the timeline, and nothing else. A muted green, an oxide orange, a deep navy,
  whatever reads as engineering rather than consumer.
- **Restrained palette.** Near-black or paper ground, off-white or near-black
  text, one mid grey for secondary, hairline borders. That is the whole palette.
- **Hairline rules and generous whitespace** instead of cards and containers.
  Prefer a section separated by a rule over a section inside a box.
- **Monospace for metadata** — dates, versions, addresses, stack chips, the year
  axis. It reinforces the engineering read and costs nothing.
- **Real responsive behaviour.** 375px must work. The Gantt has 23 columns — it
  needs a deliberate narrow strategy, not a horizontal scrollbar.

### Logo handling

`assets/logos/` holds three treatments per technology:

- `name.svg` — the mark as published
- `name-inv.svg` — inverted, for dark grounds
- `name-mono.svg` — monochrome, for grounds where the brand colour fails contrast

Pick per logo against the actual background luminance and require 4.5:1 contrast.
A black GitHub mark stays put in dark mode; a light one flips. Do not use a single
treatment for both themes.

### Technical constraints

- **Single self-contained `index.html`** plus separate `content.js` (all copy as
  a JS object), `app.js`, `styles.css`, and `assets/`. No build step, no
  framework, no bundler, no npm.
- **No webfonts, no CDN, no external requests, no analytics.** The page must
  render fully offline. System font stacks only.
- **No ES modules** — plain scripts, no `type="module"`, so it works from
  `file://` and any static host.
- **All paths relative.** It must work at a domain root and in a subdirectory.
- Must pass: light and dark, 375px / 768px / 1440px, keyboard navigation, and
  `prefers-reduced-motion: reduce` (which must render the finished state, never
  a half-animated one).

### Content rules

- All copy lives in `content.js`. Markup holds empty containers only, so copy can
  never drift out of sync with the data.
- Every claim links to something real. If there is no link, do not make the claim.
- No proficiency levels, no "passionate about", no "years of experience" that the
  source does not support.
- Do not invent employers, dates, metrics, or technologies.