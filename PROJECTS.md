# Projects — full list for arthurka.eu

Ready-to-use project entries. **Nothing here is written into `content.js`** —
this is the source doc, and the site edits happen separately.

**Link status is verified against the GitHub API.** Every "private" marker means
`GET /repos/{owner}/{repo}` returned 404 — unreachable from a public page, so the
card must say so rather than carry a dead button.

**Card field meanings** (matches the current `content.js` schema):
`name` · `kind` · `logo` · `description` · `highlights[]` · `stack[]` · `links[]`

---

## Linkability summary

| # | Project | Link | Status |
|---|---|---|---|
| 1 | Shiva Router | BscScan + repo | **public** |
| 2 | Protocol subgraph | `overlay-market/v1-subgraph` | **public** |
| 3 | Funded-trader kill switch | `overlay-market/avatar-killswitch` | private |
| 4 | Leaderboard & competitions | `overlay-market/overlay-leaderboard-backend` | private |
| 5 | Referral system | `overlay-market/Referral` | **public** |
| 6 | Immutable TWAP oracle | `overlay-market/v1-shiva` | **public** |
| 7 | Overlay SDK | `overlay-market/overlay-sdk` | **public** |
| 8 | Portfolio & prediction UI | `overlay-market/overlay-interface-v2` | **public** |
| 9 | KUMO lending protocol | `arthurka-o/kumo-protocol` | **public** |
| 10 | Loans.sol — ABN AMRO pilot | `kumo-earth/lending` | private (org has 0 public repos) |
| 11 | StreamBeam | `arthurka-o/streambeam` | **public** |
| 12 | InSure | `github.com/Eugenerio/InSure` | **public** |
| 13 | Blox — Rails backend | `DriversLab/blox-back` | private |

Six public, five private, two under other people's handles.

---

## 1. Shiva Router — `overlay-market/v1-shiva` · **PUBLIC**

> **kind:** Protocol contract · 39 commits · Solidity 0.8.10 · Foundry

**description**
The upgradeable proxy router wrapping Overlay's immutable core contracts. It is
the seam that lets higher-level systems — the funded-trader program, the referral
system — reach protocol state without the core ever being upgradeable. It also
constrains which contracts and which functions those systems may call, so it is a
permission boundary and not just a proxy.

**highlights**
- Verified on-chain with 27,000+ transactions processed through it.
- Oracle redesign in the same codebase: TWAP from PancakeSwap V3 pools, made
  non-upgradeable and then fully immutable, resolving to the worst price available
  so it can never be manipulated in a borrower's favour.
- Invariant testing with Chimera on the staking/notional relationship, plus
  Foundry mainnet-fork tests for the oracle path.

**stack** Solidity, Foundry, Ethereum, BNB Chain, OpenZeppelin

**links**
- `https://bscscan.com/address/0xeB497c228F130BD91E7F13f81c312243961d894A` — label: BscScan — 27,000+ txns
- `https://github.com/overlay-market/v1-shiva` — label: Source

> This is the site's keystone: it is the only project with **both** a public repo
> and a verified on-chain address. Keep it first.

---

## 2. Protocol subgraph — `overlay-market/v1-subgraph` · **PUBLIC**

> **kind:** Data layer · 125 commits of 407 · TypeScript · The Graph

**description**
The protocol's on-chain index, and the single largest piece of data-layer work.
Replaced a single hardcoded market address with generated multi-factory
configuration, so adding a factory or a network became a data change rather than a
hand-edit that could silently fail to index part of the protocol.

**highlights**
- Generated per-factory data sources from a network config, cloning a template so
  a new factory inherits correct handlers automatically.
- Dual-factory support and three factories wired up.
- Matchstick test suite, so handler changes are verified rather than eyeballed.
- Referral address added as an indexed entity, making affiliate attribution
  queryable through the same subgraph the protocol already reads.

**stack** TypeScript, The Graph, Ethereum

**links**
- `https://github.com/overlay-market/v1-subgraph` — label: Source

---

## 3. Funded-trader kill switch — `overlay-market/avatar-killswitch` · **PRIVATE**

> **kind:** Risk system · 43 commits of 76 (majority owner) · TypeScript, Solidity
> **note to attach:** *This repository is private — no public link.*

**description**
The off-chain system that automatically closes a protocol-sponsored trader's
positions and pauses their Safe when they exceed their loss limit. Sponsored
traders risk none of their own money, so the protocol has to act as the risk
manager rather than rely on the trader's judgement.

**highlights**
- Two independent limits: value below 50% of initial collateral, or a 25% drop
  since the first check of the day. The daily rule exists so a slow bleed cannot
  go unnoticed for a month.
- When Safe's transaction service began rejecting the delegate calls Zodiac
  automation depends on, switched to the whitelisted call-only MultiSend variant —
  the one that still executes as the trader's Safe but cannot make arbitrary
  delegate calls.
- Split into two processes so the public-facing API server holds **read-only**
  database credentials. A compromised API server cannot corrupt the baselines the
  risk system depends on.
- Safe Global API v2 migration, retry-with-backoff client, Telegram alerting on
  kill-switch events, and a trader-reassignment operations script.

**stack** TypeScript, Node.js, MongoDB, Safe, Zodiac

**links** — none. State the private status in the card body.

---

## 4. Leaderboard & competitions — `overlay-market/overlay-leaderboard-backend` · **PRIVATE**

> **kind:** Product backend · 23 commits of 284 · Node.js, Express, MongoDB
> **note to attach:** *This repository is private — no public link.*

**description**
Seasonal leaderboards and trading competitions, built as a rule engine rather than
hardcoded queries so a new competition is configuration rather than a deploy.

**highlights**
- Configurable rules: minimum USD collateral per market, exempt markets, and an
  OVL price fallback so ranking still works when the feed is down. The collateral
  floor stops a dust position from topping a leaderboard on leverage alone.
- All money maths through fixed-point decimals rather than floats.
- Scheduled competition windows driven by the schema.

**stack** Node.js, Express, MongoDB, GraphQL

**links** — none.

---

## 5. Referral system — `overlay-market/Referral` · **PUBLIC**

> **kind:** On-chain + backend · 35 commits of 242 · Solidity 0.8.19, Node.js

**description**
Affiliate attribution where neither party has to trust the other's database. The
on-chain tier is the source of truth; the database is a cache that can be rebuilt
from it.

**highlights**
- Off-chain signed messages checked against on-chain state, with an **on-chain
  verification fallback** — so a database cleanup can no longer permanently
  disqualify a real affiliate. The record is recreated from chain when missing.
- Minimum trading volume enforced before a referral counts.
- Alias normalisation and indexing, so one person cannot hold several aliases and
  claim multiple times.

**stack** Solidity, Node.js, OpenZeppelin

**links**
- `https://github.com/overlay-market/Referral` — label: Source

---

## 6. Immutable TWAP oracle — `overlay-market/v1-shiva` · **PUBLIC**

> **kind:** Price oracle · shares repo with #1

*Only include as a separate card if you want the oracle foregrounded. Otherwise it
belongs in the Shiva Router highlights, where it already is.*

**description**
The protocol's price feed, rebuilt on PancakeSwap V3 pools and then deliberately
locked down: non-upgradeable first, then fully immutable, while every other
contract in the protocol stays upgradeable.

**highlights**
- Immutability chosen because the risk is asymmetric — a bug in a normal contract
  is fixable, a bug in the *price* means every loan is sized wrong immediately and
  the upgrade key is the obvious target.
- Resolves to the **worst** price available across spot and TWAP. Manipulation can
  therefore only ever hurt whoever performs it.
- Staleness guard rejects an old price rather than trusting it.

**stack** Solidity, Ethereum, OpenZeppelin, Chainlink

**links**
- `https://github.com/overlay-market/v1-shiva` — label: Source

---

## 7. Overlay SDK — `overlay-market/overlay-sdk` · **PUBLIC**

> **kind:** Published package · 50 commits of 484 · TypeScript

**description**
The package other teams import. Every commit in it is defensive work, which is
what distinguishes a library from an internal script.

**highlights**
- Real-time portfolio PnL across multiple markets.
- USDT's 6 decimals handled against the 18 most tokens assume — getting this
  wrong returns values off by 1e12.
- Versioned factories with deprecation, so a caller is never silently moved onto
  a contract being retired.
- Graceful handling of state the SDK doesn't expect instead of throwing.

**stack** TypeScript

**links**
- `https://github.com/overlay-market/overlay-sdk` — label: Source — v0.1.29

---

## 8. Portfolio & prediction UI — `overlay-market/overlay-interface-v2` · **PUBLIC**

> **kind:** Frontend · 152 commits of 1998 · TypeScript, React, Next.js

**description**
The largest single contribution by volume — the protocol's product surface,
including prediction markets, funded-trader account cards and the referral flows.

**highlights**
- Prediction market groups with routing, data model and multi-line probability
  charts.
- Found and fixed a **bigint precision bug** in the portfolio overview: a 256-bit
  on-chain price was being coerced to a JavaScript number, silently losing
  precision in exactly the two figures traders trust — value locked and
  unrealised PnL.
- Fixed a stale closure in the same file that could break the polling refresh's
  change detection.
- Referral guardrails: actions disabled for funded and avatar accounts, thresholds
  and rates correct after a successful claim.

**stack** TypeScript, React, Next.js

**links**
- `https://github.com/overlay-market/overlay-interface-v2` — label: Source

---

## 9. KUMO lending protocol — `arthurka-o/kumo-protocol` · **PUBLIC**

> **kind:** Protocol · 97 surviving commits · Solidity 0.8.11 · Hardhat → Foundry

**description**
KUMO's protocol was a fork of the Liquity lending protocol, retargeted at carbon
removal, and the work below was done in Arthur's own fork of KUMO's. A certified
credit is locked as collateral and stablecoins are drawn against it immediately,
instead of waiting for the credit to sell.

**highlights**
- **Made it multi-asset**: every function that touches a position now takes the
  asset it is working with, plus a factory that creates a savings pool per asset
  rather than hand-copying deployed contracts.
- Split the core contract's functions after they stopped fitting inside the EVM's
  stack limit — the compiler was failing with `Stack too deep`. The **Diamond
  pattern (EIP-2535)** was researched and prototyped for this, but the protocol
  shipped on **UUPS** instead, because the upgradeable-proxy ecosystem around it
  was the more mature one at the time.
- Added a per-asset cap on stablecoin creation, and fixed a bug where the
  "how much room is left" calculation wrapped around to report enormous headroom
  instead of none.
- Upstream contributor to the original protocol: added Tellor as a second price
  source alongside Chainlink so a single oracle outage or manipulation cannot sink
  the protocol.

**stack** Solidity, Hardhat, Foundry, Chainlink, OpenZeppelin, Diamond Pattern, UUPS

**links**
- `https://github.com/arthurka-o/kumo-protocol` — label: Source (my fork)

**note** Original repo is private

> This is the **only public record** of the Diamond prototype, the 273-site
> threading and the mint cap. It makes the KUMO section verifiable rather than
> asserted — see `KUMO-EXTRACTION.md` §0 for the diff that proves it.

---

## 10. Loans.sol — ABN AMRO / Techstars pilot · `kumo-earth/lending` · **PRIVATE**

> **kind:** Pilot contract · 85 of 532 commits · Solidity 0.8.19 · BUSL-1.1
> **note to attach:** *Built for the ABN AMRO + Techstars Future of Finance
> accelerator. This repository is private — no public link.*

**description**
The carbon-credit lending contract built for the bank pilot, written by two people —
Arthur took most of it. The design goal was obviousness rather than cleverness —
something a bank would sign off on. A five-state loan lifecycle, explicit allowlists,
and seized collateral routed to a treasury.

**highlights**
- `Loans.sol`, 386 lines: `PENDING → ACTIVE → REPAID / LIQUIDATED / CLOSED`, with
  the contract refusing any transition that doesn't follow that path.
- **Explicit on-chain allowlists** of lenders and borrowers. You cannot call the
  contract without being registered — the protocol is permissioned on purpose, so
  it only moves money between counterparties the bank has approved.
- Liquidation proceeds routed to a designated treasury rather than back to the
  default recipient, because seized collateral often doesn't cover the debt.
- A V2 escape hatch so the pilot can hand off to a successor contract.
- The unglamorous half: a `maxLTV` → `liquidationLTV` rename (the old name implied
  a borrowing limit rather than a liquidation threshold), the correct OpenZeppelin
  transfer helper on withdrawal paths, a tolerance on duration comparison, and
  test coverage for the liquidation and treasury paths.

**stack** Solidity, Hardhat, OpenZeppelin

**links** — none. `kumo-earth` has **0 public repositories**.

---

## 11. StreamBeam — `arthurka-o/streambeam` · **PUBLIC**

> **kind:** ETHGlobal Prague 2025 · Solo · **LayerZero General Prize** · 212 commits
> **replaces `2025-eth-global-prague` on the site**

**description**
Cross-chain crypto donations for livestream creators. Built solo in 36 hours during
the hackathon, then kept going for six more weeks afterwards — the hackathon repo
closes on 2025-06-01 and this one opens the next day, running to 2025-07-13.

**highlights**
- Won the LayerZero General Prize at ETHGlobal Prague 2025.
- LayerZero cross-chain donations with a real-time OBS alert system — donations
  surface on stream via browser source while they land.
- **212 commits**, all his. The hackathon entry was the seed; this is what it
  became afterwards.

**stack** Solidity, TypeScript, Express.js, Next.js, LayerZero

**links**
- `https://github.com/arthurka-o/streambeam` — label: Source

> Supersedes `2025-eth-global-prague` (11 commits, last commit 2025-06-01), which
> is the same project at its hackathon stage. The 212-commit repo is the better
> link and the six-week continuation is a stronger story.

---

## 12. InSure — `github.com/Eugenerio/InSure` · **PUBLIC**

> **kind:** ETHWarsaw 2025 · Team · Prize winner · Foundry

**description**
On-chain insurance with automated claims and verification. Built with a team;
prize winner at ETHWarsaw 2025. The repository is under a teammate's handle.

**highlights**
- Team project — the repo belongs to a collaborator, not to him.

**stack** Solidity, Foundry

**links**
- `https://github.com/Eugenerio/InSure` — label: Source (teammate's repo)

---

## 13. Blox — Rails backend · `DriversLab/blox-back` · **PRIVATE**

> **kind:** Backend · **121 commits of 299 (~40%)** · Ruby on Rails 8
> **note to attach:** *Private client repository. Built during a TON hackathon
> origin project. Never deployed — no production users.*

**description**
Ten weeks on a fintech Rails backend as part of a four-person team. Never shipped
to real users, but it is the only place the Rails and team-delivery side of the
profile is evidenced.

**highlights**
- **Rails 8.0** — propshaft, importmap, turbo, stimulus, Tailwind, Solid
  Cache/Queue/Cable, Kamal deploys, Pundit authorisation.
- Owned workstreams rather than incidental commits: the loan and quest domain,
  budget logic with tests, the redirect-token system, a Telegram integration, and
  the onboarding flow.
- RSpec and Capybara suite; a repo-wide Rubocop pass.
- Commits under his own branches (`arthurka/fix`, `arthurka/sdk-backend-part-2`,
  `arthurka/smart-contract-allow-list`-equivalent).

**stack** Ruby on Rails, PostgreSQL, Pundit, RSpec, Capybara, Kamal, Docker

**links** — none. `DriversLab/blox-back` is private.

> **Frame honestly.** Never deployed, no real users. It is evidence of team
> delivery and of non-Solidity depth — not of production ownership. Do not let a
> reader infer it shipped.

---

## Suggested ordering

1. **Shiva Router** — on-chain address + public repo. The keystone.
2. **KUMO lending protocol** — the 273-site refactor, publicly verifiable.
3. **Funded-trader kill switch** — private, best story.
4. **Protocol subgraph** — largest Overlay data contribution.
5. **Immutable TWAP oracle** — or fold into #1.
6. **Leaderboard & competitions** — private.
7. **Referral system** — public.
8. **Overlay SDK** — public.
9. **Portfolio & prediction UI** — public, the precision bug.
10. **Loans.sol — ABN AMRO pilot** — private, the bank angle.
11. **StreamBeam** — public, prize.
12. **InSure** — public, teammate's repo.
13. **Blox** — private, frame honestly.

Public and private interleaved deliberately: the page should not read as though
everything is hidden, nor as though everything is linkable.

---

## Notes on the private cards

The three private cards need a line making the status explicit, not a silent
absence of a button. Suggested wording, consistent across all three:

> *Repository is private — no public link.*

Vary only the reason clause where it earns its place:
- kill switch — no reason needed
- leaderboard — no reason needed
- Loans.sol — *"built for the ABN AMRO + Techstars accelerator"*
- Blox — *"private client repository; never deployed"*

A reader who knows the work is real will respect the honesty. A reader who finds
a dead link will assume the work isn't real either.

---

## Still open

- [ ] `FaucetBot` — 29 commits, org fork, but his local remote
      (`overlay-market/dev-scripts`) is 404. Where did those commits land? Possibly
      worth a card; currently unresolved.
- [ ] `overlay-market/v1-core` (32 commits, public) — the Python→Foundry oracle
      test port. Currently only mentioned inside the oracle card. Could be its own.
- [ ] Blox — include at all? It's 13th of 13 and unlinkable.
- [ ] Should private cards carry the repo name in text, so someone with access can
      find it?