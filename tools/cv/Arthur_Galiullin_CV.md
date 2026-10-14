# Arthur Galiullin
**Solidity / Protocol Engineer** — Warsaw, Poland (Remote)

[work@arthurka.eu](mailto:work@arthurka.eu) | [github.com/arthurka-o](https://github.com/arthurka-o) | [linkedin.com/in/arthur-galiullin](https://www.linkedin.com/in/arthur-galiullin/) | [arthurka.eu](https://arthurka.eu)

CET/CEST (UTC+1/+2) · Not relocating · Authorised to work in Poland · Open to B2B or employment

---

Solidity engineer with 4+ years of hands-on contract development and 8 years in production engineering. Shipped a perps DEX from testnet to TGE as one of six core engineers, took a Liquity fork multi-asset and diamond-upgradeable, and built the referral, leaderboard and funded-trader risk systems around the protocol. Twice a hackathon prize winner. Strongest at smart contracts and protocol design. Heavy LLM-assisted workflow — shipping fast matters.

---

## Work Experience

### Independent — Personal Projects *(June 2026 – Present)*
Working independently on personal projects.

---

### Protocol Engineer — Overlay Protocol *(May 2024 – May 2026)*
Exotic perps DEX on BSC ($2.9M raised, backed by Polychain Capital, 1kx, ParaFi; audited by Spearbit, Trail of Bits, Nethermind). One of 6 core engineers through testnet to TGE.

- **Shiva Router Contract** — Contributed to the proxy router in front of Overlay's immutable core contracts. It is also where the protocol states which systems may call which functions, which is what lets the core stay immutable. Verified on-chain, 30,000+ transactions processed.
- **Immutable Price Oracle** — Rebuilt the feed on PancakeSwap V3 pools and removed its upgradeability in two steps until fully immutable, while every other contract stays upgradeable. A price bug sizes every loan wrong the moment it lands; resolution takes the worst of TWAP and spot, so manipulation can only ever hurt whoever performs it.
- **Security Testing** — Built the Foundry invariant suite (a trader's staked balance must never exceed the notional they can claim), fuzzed with Chimera, plus mainnet-fork tests for the oracle path. Ported the Chainlink feed tests from Python into Foundry, and covered the inputs that broke things: a zero price, and a macro window equal to the micro window.
- **Funded Trader System** — Sponsored users trade with protocol-provided USDT, so the protocol is the risk manager. Safe multisigs with Zodiac modules keep funds to Overlay contracts and the allowed functions; off-chain monitoring closes every position and pauses the account on either of two thresholds — value below 50% of initial collateral, or a 25% drop since the day's first check. Split across two processes so the public API holds read-only database credentials.
- **On-Chain Referral System** — Integrated an already-audited referral contract and built the verification layer around it: off-chain signed messages checked against on-chain state, with a fallback that rebuilds a missing record from chain, so a database cleanup can no longer permanently disqualify a real affiliate.
- **Leaderboard & Trading Competitions** — Built the seasonal leaderboard (Node.js, MongoDB) as a configurable rule engine, so launching a new competition is a configuration change rather than a redeploy. The collateral floor is what stops a dust position from topping a board on leverage alone.
- **Subgraph & SDK** — Most of the protocol's indexing is mine: rewrote the config so new factories and networks stopped being hand-edits to YAML, added the router and PowerCard entities, built the Matchstick suite over the handlers, and made the index multichain including Berachain. Also maintain `overlay-sdk`, where USDT's 6 decimals have to be handled against the 18 most tokens assume.
- **Frontend** — Contributor to the web app: fixed a 256-bit on-chain price coerced with `Number()`, silently losing precision in the two figures traders trust — value locked and unrealised PnL. Built the prediction-market screens.

**Stack:** Solidity, Foundry, Safe, Zodiac, TypeScript, Node.js, MongoDB, Ethers.js, React, Next.js, The Graph

---

### Solidity Developer — KUMO *(March 2022 – January 2024)*
Lending protocol secured by carbon credits. Selected for **ABN AMRO + Techstars Future of Finance Accelerator**; built and launched a pilot with ABN AMRO. One of 2 Solidity developers.

- Took over a **Liquity fork** retargeted at carbon credits and made it multi-asset: an asset parameter threaded through 271 call sites across seven contracts, plus a factory that creates a stability pool per asset instead of hand-copying deployed contracts.
- Converted the protocol to the **Diamond Pattern (EIP-2535)** after the core contract outgrew the EVM's stack limit and the compiler was failing. Callers reach the same address they always did, and new facets can be added without touching the ones already holding user funds. Split settlement onto its own contract, which let **batch liquidation** close many underwater positions in one transaction instead of paying gas hundreds of times.
- Added a **per-asset mint cap** on stablecoin creation. Writing the headroom calculation surfaced a real bug: when the cap sat below the amount already minted, the unsigned subtraction wrapped around and reported enormous room instead of none.
- Integrated **Chainlink and Tellor** oracle feeds for multi-source price validation. Upstream contribution to the original protocol, reviewed and merged by their team.
- Built the **carbon-credit lending contract** for the pilot: a five-state loan lifecycle the contract refuses to leave out of order, explicit on-chain allowlists so money only moves between counterparties the bank approved, and liquidation proceeds routed to a treasury rather than the default recipient.

**Stack:** Solidity, Hardhat, Chainlink, Tellor, OpenZeppelin, Diamond Pattern, UUPS, Ethers.js

---

### Ruby on Rails Developer *(2016 – 2022)*
**Flatstack / Galvanize** (2020–2022) — Enterprise GRC platform: public API, async pipelines, N+1 performance work, DataDog and Airbrake monitoring. **meyvn** (2018–2020) — HR platform and news scoring engine; led the migration from a monolithic Rails app to a React SPA with a Rails API backend. **Technokratos** (2016–2017) — Virtual goods marketplace and photo albums: REST APIs, PDF generation, OpenCV face detection.

---

## Hackathons

**StreamBeam** — ETHGlobal Prague 2025 *(Solo)* — **Prize Winner** (LayerZero General Prize)

Cross-chain crypto donations for livestream creators, with real-time OBS alerts on stream. Built solo in 36 hours, then developed for another six weeks. Solidity, TypeScript, Express.js, Next.js, LayerZero.

**InSure** — ETHWarsaw 2025 *(Team)* — **Prize Winner**

On-chain insurance with automated claims and verification. Solidity, Foundry.

---

## Skills

**Protocol:** Solidity, Foundry, Hardhat, EVM, UUPS, Diamond Pattern, OpenZeppelin, Safe, Zodiac

**Oracles & Risk:** Chainlink, Tellor, TWAP, invariant testing, Chimera, liquidation, collateral risk parameters

**Backend:** TypeScript, Node.js, Ethers.js, Ruby on Rails, PostgreSQL, MongoDB, The Graph, React, Next.js

**Testing:** Foundry (unit, invariant, fork), Chai, Mocha, Jest, Vitest, Playwright, RSpec

**Infra:** AWS (Lambda, ECS, Terraform), Docker, CI/CD, Sidekiq, Git

---

## Education

**M.Sc. Computer Software Engineering** — KFU, Institute of Information Technology (2018–2020)

**B.Sc. Applied Informatics** — KFU, Institute of Information Technology (2014–2018)

---

## Languages

Russian (Native) | English (Professional) | Polish (Intermediate)

---

[Shiva Router — BscScan](https://bscscan.com/address/0xeB497c228F130BD91E7F13f81c312243961d894A) | [v1-shiva](https://github.com/overlay-market/v1-shiva) | [v1-subgraph](https://github.com/overlay-market/v1-subgraph) | [overlay-sdk](https://github.com/overlay-market/overlay-sdk) | [KUMO protocol](https://github.com/arthurka-o/kumo-protocol) | [StreamBeam](https://github.com/arthurka-o/streambeam) | [InSure](https://github.com/Eugenerio/InSure)
