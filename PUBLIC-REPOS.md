# Public repos with commits — linkable work

Every repo where Arthur has commits, checked against the GitHub API for whether it
is actually reachable. **A 404 means private or deleted — those cannot be linked
from a public site, and no amount of description substitutes for a working link.**

Method: `git log --author="Arthur" --all` locally, then
`GET /repos/{owner}/{repo}` for publicness. Counts are all-branch, so they can
exceed the default-branch numbers in earlier docs.

---

## TL;DR — the honest position

**468 of his 636 Overlay commits live in 10 public repos. 168 sit in 13 private
ones.** The most interesting systems — the kill switch, the leaderboard, the
competition engine — are private. The Techstars/ABN AMRO prototype
(`kumo-earth/lending`) has **0 public repos at the org level**.

That is the single most important fact for this project: **the page cannot be
built out of links alone.** Anything private has to be described in prose and left
unlinked, or not claimed at all.

---

## Tier 1 — public, substantive, linkable

### Overlay-market (employer, all reachable)

| Repo | Mine/Total | Lang | URL |
|---|---|---|---|
| `overlay-interface-v2` | **152**/1998 | TypeScript | https://github.com/overlay-market/overlay-interface-v2 |
| `v1-subgraph` | **125**/407 | TypeScript | https://github.com/overlay-market/v1-subgraph |
| `overlay-sdk` | **50**/484 | TypeScript | https://github.com/overlay-market/overlay-sdk |
| `v1-shiva` | **39**/358 | Solidity | https://github.com/overlay-market/v1-shiva |
| `Referral` | **35**/242 | TypeScript | https://github.com/overlay-market/Referral |
| `v1-core` | **32**/775 | Python | https://github.com/overlay-market/v1-core |
| `interface` (v1) | 11/2603 | TypeScript | https://github.com/overlay-market/overlay-interface |
| `faucet` | 11/38 | TypeScript | https://github.com/overlay-market/faucet |
| `v2-liquidator` | 10/240 | TypeScript | https://github.com/overlay-market/v2-liquidator |
| `v1-periphery` | 3/37 | Python | https://github.com/overlay-market/v1-periphery |
| `FaucetBot` | 29/60 | JavaScript | https://github.com/overlay-market/FaucetBot (org fork) |

`v1-shiva` is the important one — it's the **Shiva Router**, the contract with
27,000+ transactions, and it's public. That validates the site's existing
headline claim.

### KUMO lineage — public

| Repo | Mine | Note | URL |
|---|---|---|---|
| `arthurka-o/kumo-protocol` | 97 | His fork. Diamond, multi-asset, mint cap | https://github.com/arthurka-o/kumo-protocol |
| `wollooo/kumo-protocol` | 16 | Upstream contribution — Tellor, Polygon Mumbai | https://github.com/wollooo/kumo-protocol |

Both public. This is the **only public record of the Diamond prototype and the
multi-asset work** — note that the Diamond split is the research and the
prototype; the protocol itself shipped on UUPS. It's the strongest artifact for
the KUMO section — see `KUMO-EXTRACTION.md` §0.

### Personal

| Repo | Mine | Note | URL |
|---|---|---|---|
| `arthurka-o/streambeam` | 212 | StreamAid, ETHGlobal Prague winner | https://github.com/arthurka-o/streambeam |
| `arthurka-o/2025-eth-global-prague` | 11 | Hackathon repo | https://github.com/arthurka-o/2025-eth-global-prague |
| `arthurka-o/degen-hack-smart-contract` | 2 | Degen hackathon | https://github.com/arthurka-o/degen-hack-smart-contract |
| `arthurka-o/onboardingtest` | 1 | trivial | https://github.com/arthurka-o/onboardingtest |

Note `streambeam` (212) and `2025-eth-global-prague` (11) are almost certainly the
same project — StreamAid — at two stages. The site currently links only the
smaller one.

### Previous workplaces

| Repo | Mine/Total | Public? | URL |
|---|---|---|---|
| `DriversLab/blox-back` | **121**/299 | **404 — private** | — |
| `DriversLab/onblock` | 1/49 | public | https://github.com/DriversLab/onblock |
| `DriversLab/blox-SDK` | 0/9 | **404 — private** | — |
| `tlsnotary/tlsn-extension` | 1/353 | public | https://github.com/tlsnotary/tlsn-extension |
| `artem-ogre/CDT` | 0/488 | public | (no commits by him) |

**Blox is the painful one.** 121 commits, ~40% of the repo, ten weeks of Rails 8
work on a team — and the repository is private. Nothing to link.

---

## Tier 2 — private, has commits, cannot be linked

Overlay-market, all 404:

| Repo | Mine/Total | What it is |
|---|---|---|
| `avatar-killswitch` | **43**/76 | The funded-trader kill switch |
| `overlay-leaderboard-backend` | 23/284 | Leaderboard + competitions |
| `siwa-peripherals` | 29/29 | NFT tooling |
| `stork-poc` | 11/11 | Stork oracle POC |
| `faucet`-adjacent `dev-scripts` | 8/57 | Address extraction, volumes |
| `charting-backend` | 11/95 | Price push |
| `data-api-backend` | 9/37 | Supply endpoints |
| `v1-vault` | 8/8 | Vault PnL tests |
| `lifi-poc` | 5/5 | LI.FI POC |
| `aggregator` | 4/86 | Ownable refactor |
| `monitoring-alerting-system` | 3/176 | Alerting |
| `v1-vault`, `rewards-api` | 1/31 | misc |
| `power-cards` | 19/46 | Foundry hackathon |

KUMO:
- `kumo-earth/lending` — **org has 0 public repos.** The Techstars/ABN AMRO
  prototype, 85 of Arthur's commits in it, entirely unlinkable.

**168 Overlay commits + the entire KUMO prototype are invisible from outside.**

---

## Recommendation for the Projects section

Currently 3 entries (Shiva Router, StreamAid, InSure). Nine public repos are
linkable. Two shapes of card:

### Shape A — has a link, describe the work

1. **Shiva Router** — already there. The keystone: public repo *and* verified
   on-chain address.
2. **Protocol subgraph** — `v1-subgraph`, 125 commits. Link.
3. **Overlay SDK** — `overlay-sdk`, 50 commits, v0.1.29 published. Link.
4. **KUMO protocol** — `arthurka-o/kumo-protocol`, 97 surviving commits. Diamond
   prototype + multi-asset, publicly verifiable. Link.
5. **Oracle design** — `v1-shiva`, 39 commits. Link. (Or fold into #1.)
6. **Referral system** — `Referral`, 35 commits. Link.

### Shape B — no link, describe honestly or drop

- **Kill switch**, **leaderboard/competitions**, **Techstars pilot** — all real,
  all private. Either describe without a link, or omit.

---

## Open questions

- [ ] Is `streambeam` the same project as `2025-eth-global-prague`? If so, the
      site should link the 212-commit repo, not the 11-commit one.
- [ ] Blox — 121 commits on a Rails 8 fintech backend, repo private. Show it with
      no link, or omit?
- [ ] Will Overlay's private repos become public later? Worth asking — it would
      change the whole page.
- [ ] `FaucetBot` is an org fork; his 29 commits are in `garbanzo` locally but the
      remote points at `overlay-market/dev-scripts` (404). Where did those land?