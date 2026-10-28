# KUMO — work extraction

Three distinct phases, not one. Reconstructed from `~/dev/lending` plus
GitHub history for `wollooo/kumo-protocol` and `arthurka-o/kumo-protocol`.

**Corrects the CV.** The CV described KUMO as "Evolved the protocol from a
Liquity fork to support multiple collateral assets... Implemented the Diamond
Pattern (EIP-2535)". That is right about the *fork* but compresses ~18 months
and three separate bodies of work into two bullets — and the Diamond half is
wrong in its outcome: that was the research and prototype, and the protocol
shipped on UUPS.

---

## 0. Lineage — what is inherited and what is Arthur's

Measured by cloning and diffing. This matters because it decides what can
honestly be claimed.

```
Liquity (solc 0.6.11)  →  original KUMO repo [GONE]  →  ├── wollooo/kumo-protocol
                                                              (0.8.11, 1,575 lines)
                                                          └── arthurka-o/kumo-protocol
                                                              (restructured)
```

**Correction, from Arthur:** there was an original KUMO repo, and **both**
Wollo's and Arthur's are forks of *it*, not of each other. The original is no
longer available, which is why the diagram in earlier drafts of this note went
straight from Liquity to `wollooo/kumo-protocol` and made it look like that
repo was the root. It is not — it is a sibling fork, one branch removed.

Kevin Wollowski ("Wollo", `wollooo`) was the original author of the KUMO
protocol and did the first multi-asset work himself — `KumoParameters`, the
per-asset parameter contract, June–July 2022. He left KUMO after Arthur arrived.
So the multi-asset architecture was his, and Arthur carried it through the
protocol. See §2c.

### Liquity → KUMO upstream: a rebrand, not a rewrite

Every Liquity contract survives under the same name: `TroveManager`,
`StabilityPool`, `BorrowerOperations`, `ActivePool`, `SortedTroves`,
`HintHelpers`. The changes are mechanical — `ILUSDToken`→`IKUSDToken`,
`ILQTYToken`→`IKUMOToken`, `LiquityBase`→`KumoBase`, pragma 0.6.11→0.8.11.

| Contract | Liquity lines | KUMO lines | lines changed |
|---|---|---|---|
| StabilityPool | 993 | 1,004 | 53% |
| DefaultPool | 110 | — | 45% |
| HintHelpers | 171 | 178 | 43% |
| BorrowerOperations | 666 | 671 | 34% |
| TroveManager | 1,562 | 1,575 | 29% |
| PriceFeed | 572 | 580 | 9% |
| SortedTroves | 420 | 429 | 7% |

The high percentages are misleading — much of it is every `L_ETH`/`L_LUSDDebt`
comment becoming `L_KUSDDebt`. **This layer is inherited. It should not be claimed
as innovation.**

### KUMO upstream → Arthur's fork: genuinely his

`TroveManager.sol` **does not exist** in the fork. It was split into Diamond
facets — a research and prototype branch of the work, not what shipped.

New in the fork:
```
TroveManagerDiamond.sol        77 lines
DiamondInit.sol
Facets/            TroveManagerFacet 482 · TroveRedemptorFacet 1,372
Libraries/
StabilityPoolFactory.sol        31 lines
```

The measurable core of the multi-asset work — `_asset` parameters threaded
through contracts that previously had none:

| Contract | upstream | fork |
|---|---|---|
| BorrowerOperations | 0 | **109** |
| SortedTroves | 0 | **98** |
| StabilityPool | 0 | 5 |
| ActivePool | 0 | 20 |
| DefaultPool | 0 | 20 |
| CollSurplusPool | 0 | 19 |
| PriceFeed | 0 | 2 |

**273 new `_asset` references across seven contracts.** That is a diff, not a
claim — anyone can clone the fork and count.

> The earlier note here said 271. That was the sum of the first six rows, with
> PriceFeed's 2 left off. Re-counted against both repos at their current HEAD:
> upstream has **zero** `_asset` in all seven files, the fork has **273** lines
> containing one. The table above is right; the headline number was not.

### How to frame it

Not *"I evolved a Liquity fork"* (inherited, and readable as such), and not
*"I worked on a lending protocol"* (says nothing). Say:

> I joined KUMO on a Liquity fork retargeted at carbon removal and threaded the
> asset parameter through the protocol to make it multi-asset — every function that
> touches a position now takes the asset it is working with — while the oversized
> core forced the upgradeability question: the Diamond pattern was researched and
> prototyped, and the protocol shipped on UUPS.

Two corrections sit behind that wording, both from Arthur:

- **The diamond split in the fork is the research and the prototype.** The
  protocol shipped on **UUPS**, because the ecosystem around upgradeable proxies
  was the more mature one at the time. Do not write "converted the protocol to
  the Diamond pattern" — the split is visible in the repo, so the claim is
  checkable, and it is checkable as false.
- **The multi-asset design was Wollowski's**, and the multi-asset *work* was
  shared with udosson (see §2c). Threading the parameter through the protocol
  is Arthur's part, and it is the part with a diff attached.

---

## The org

`kumo-earth` — "Kumo provides software to facilitate institutional debt financing
for the carbon removal industry." Created 2022-02-03. **0 public repos** — the
`kumo-earth/lending` remote in `dev/lending` is not publicly reachable, which is
why the prototype is invisible from outside.

### How the code actually moved — and what is missing

Two workflows, in sequence:

1. **Fork-and-PR.** Everyone worked in their own fork and opened pull requests
   against the KUMO repo. This is where the 16 Phase 1 commits came from — they
   landed in the KUMO repo, and are visible today in `wollooo/kumo-protocol`.
2. **Direct push.** The team later switched to committing straight into the KUMO
   repo instead. **That repo is the one that is gone**, so this body of work
   survives only where it was mirrored — into a fork, or nowhere.

This is why a commit count is a floor and not a total. `arthurka-o/kumo-protocol`
holds **97** of Arthur's commits (2022-05-13 → 2023-10-05), which include the
16 that also landed in `wollooo/kumo-protocol` — so 97 is the count of his
commits that survive publicly, not the count he made.

GitHub now shows `arthurka-o/kumo-protocol` as a fork of `wollooo/kumo-protocol`,
and `wollooo/kumo-protocol` as the network root. That is an artefact of the
original repo being deleted: the network re-parents onto the surviving sibling.
The truth is that **both were forks of the deleted original**, and neither is
upstream of the other in the way the current fork graph suggests.

---

## Phase 1 — upstream contribution, May–Jun 2022

**Repo:** `wollooo/kumo-protocol` (JavaScript, 51 MB, created 2022-02-04)
**Arthur's share:** 16 commits, ranked 10th of 15 contributors

The Liquity-lineage protocol: 0% interest loans against natural assets, paid in
KUSD. Classic Liquity surface — `TroveManager`, `StabilityPool`,
`BorrowerOperations`, `ActivePool`.

```
2022-05-13  Add Polygon Mumbai deployment params
2022-05-13  Change Uniswap addresses to Sushiswap ones
2022-05-13  Merge PR #123 — 109-ll-switch-from-uniswap-v2-to-sushiswap-v2
2022-05-15  Update Tellor's interfaces and functions
2022-05-15  Add early return to TellorCaller          ← gas optimisation
2022-05-15  Refactor deployment scripts to Kumo
2022-05-20  Fix PriceFeed tests
2022-06-07  Change Infura to Alchemy
2022-06-10  Update packages versions / MDs
2022-06-11  Optimize contract connection
2022-06-16  Upgrade hardhat versions
```

**What this substantiates.** `cv.md` says "Integrated Chainlink and Tellor oracle
feeds for multi-source price validation" — the Tellor work is here, including a
gas optimisation (early return in `TellorCaller`). Also Polygon Mumbai
deployment and an Infura→Alchemy migration.

---

## Phase 2 — multi-asset, Diamond, mint cap (Jun 2022 – May 2023)

**Repo:** `arthurka-o/kumo-protocol`, a fork of the (deleted) KUMO repo
**Arthur's share:** 97 surviving commits — a floor, not a total. See "How the
code actually moved" above.

### 2a. Diamond Pattern / EIP-2535

```
2023-02-21  Diamond Standard
2023-02-13  Move redistributeDebtAndColl, remove setAddress and SafeMath from TroveManager
2023-02-02  Tried to organize functions in facets
2023-01-31  Fix ActivePool permissions + small fixes
2023-01-31  Fix Ownership and GasCompensation tests
2023-01-24  Move batchLiquidateTroves to TroveRedemptor
2023-01-20  Fix Stack too Deep                    ← EVM stack-depth limit
2023-01-18  Trying to fix "Stack too deep"
2023-01-12  Revert "WIP optimizing TroveManager"
2022-12-28  WIP optimizing TroveManager
2022-12-22  Add hardhat-contract-sizer
```

The "Stack too deep" pair is worth naming plainly: splitting large Liquity
functions to get under the 16-slot EVM limit is *the* reason the upgradeability
question came up at all. That's a real constraint driving a real architecture
decision, not a trend-chasing bullet.

**But the protocol did not ship on Diamond.** This branch is the research and
the prototype; the production choice was **UUPS**, because the ecosystem around
upgradeable proxies was the more mature one at the time. The claim to make is
about the decision, not the outcome of the PoC.

### 2b. KUSD mint cap

```
2023-04-25  Implementation of KUSD mint cap
2023-05-02  Make KUSDMintCap asset based
2023-05-02  Add KUSDMintRemainder helper
2023-05-03  Fix negative values for KUSDMintRemainder   ← rounding bug
2023-05-23  Add additional tests
2023-04-07  Add back bootstrap phase for redemptions
```

### 2c. Multi-asset support

**The design is Kevin Wollowski's.** He wrote `KumoParameters` — the per-asset
parameter contract that the whole multi-asset approach rests on:

```
2022-06-22  Kevin Wollowski  first def of KumoParameters
2022-06-22  Kevin Wollowski  added first KumoParameters to BorrowerOperations
2022-07-07  Kevin Wollowski  first release of KumoParameters
2022-07-21  Kevin Wollowski  KumoParameters with multi asset
2022-08-28  udosson           replaced msg.value with _assetSent
2022-11-11  udosson           implemented StabilityPoolFactory in KUMO smart contracts
```

Arthur joined while that was in flight and carried it through the protocol — the
bulk of the work being threading the asset parameter into every function that
touches a position, across seven contracts that previously had none (§0), plus
the price feed, the SDK and the factory:

```
2022-11-25  Add asset to IPriceFeed
2022-12-13  Add asset address in tests for priceFeed
2022-12-15  Merge PR #287 — 283-implement-a-test-pricefeed-for-mutliple-asset
2022-12-14  Merge PR #280 — mulit-asset-SDK
2022-12-15  Merge PR #297 — 248-create-staboilitypoolfactory-with-stabilitypool-clone
```

**How to claim it:** *threaded the asset parameter through the protocol*, not
*designed it multi-asset*. The design was Wollowski's and udosson's; the
threading was Arthur's, and the threading is the part with a diff attached.

### 2d. TroveRedemptor

```
2023-01-24  Move batchLiquidateTroves to TroveRedemptor
2023-03-20  Fix redeemCollateral / Fix TroveOwners
2023-03-21  The Great Fix
2023-02-13  Move redistributeDebtAndColl
```

**The move added no functionality.** The inherited upstream
`wollooo/kumo-protocol` `TroveManager.sol` (1,575 lines) already had
`batchLiquidateTroves(address[])`, `liquidateTroves(uint)`, `redeemCollateral`
and the whole recovery-mode branch, all inherited from Liquity. The commit title
says "Move", and that is the whole of it.

### 2e. Test suite

30+ commits of the form `Fix BorrowerOperationsTest`, `Fix StabilityPool_SPWithdrawalToCDPTest`,
`Fix ConnectContractsTest`, `Fix DeployKUMOContractsTest`, `Refactoring tests`,
`Fix AccessControlTest`. Re-establishing a green suite through a Diamond
migration is substantial work and currently invisible on the CV.

---

## Phase 3 — the Techstars / ABN AMRO prototype (Nov–Dec 2023)

**Repo:** `arthurka-o/lending` → upstream `kumo-earth/lending` (**private**)
**Arthur's share:** 85 of 532 commits
**Window:** 2023-10-19 → 2023-12-20

The carbon-credit lending pilot. Yarn PnP monorepo — workspaces `contracts`,
`frontend`, `cloud-functions`, `kumo-firebase`.

### The contract

`packages/contracts/contracts/Loans.sol` — **386 lines**, `^0.8.19`, BUSL-1.1

Loan lifecycle:

```solidity
enum LoanStatus { PENDING, ACTIVE, REPAID, LIQUIDATED, CLOSED }
```

Interface + implementation, using OpenZeppelin `IERC20`, `SafeERC20`, `Ownable`.

| Function | Modifier |
|---|---|
| `createLoanRequest(collateralToken, interestRate, liquidationLTV, duration, borrowAmount, collateralAmount)` | — |
| `acceptLoanRequest(loanId)` | `onlyLenders` |
| `withdrawLoanRequest(loanId)` | — |
| `withdrawCollateral(loanId)` | — |
| `increaseCollateral(loanId, amount)` | — |
| `markRepaid(loanId)` | `onlyOwner` |
| `addCollateralToken(token)` | `onlyOwner` |
| `liquidate(loanId, currentLTV)` | `onlyOwner` |
| `withdrawLiquidated(loanId, sendToTreasury)` | `onlyOwner` |
| `submitTreasuryAddress(treasury)` | `onlyOwner` |
| `setV2Address(newV2Address)` | `onlyOwner` |
| `addLender` / `removeLender` / `addBorrower` / `removeBorrower` | `onlyOwner` |
| `transferOfFunds(loanId, borrowerAddress)` | `onlyV2` |
| `calculateOutstandingDebt(loanId)` | view |
| `calculateCurrentLTV(loanId, price)` | view |
| `_calculateInterest(loan)` | internal view |

Storage: `loanData`, `loanToBorrower`, `loanToLender`, `supportedTokens`,
`lenders`, `borrowers`. Events: `LoanRequestCreated`, `LoanStatusChanged`.

Modifiers: `onlyV2`, `onlyLenders`, `onlyBorrowers`.

Supporting contracts: `LoansTester.sol`, `ERC20Test.sol`. Hardhat with `deploy/`,
`deployments/`, `tasks/`.

### What Arthur built, from commit subjects

| Area | Evidence |
|---|---|
| Full lifecycle | `withdrawLoanRequest`, `withdrawCollateral`, `increaseCollateral`, `markRepaid`, `liquidate`, `withdrawLiquidated` |
| Loan acceptance | `feat: add acceptLoan task`, `chore: add loans:accept doc`, `add more information to loans:accept task` |
| Treasury | `feat: submitTreasuryAddress tests`, `setV2Address` + v2 control |
| Lender/borrower allowlists | `Merge PR #127 — smart-contract-allow-list`, `feat: add borrowers check and control` |
| Money correctness | `refactor: rename maxLTV to liquidationLTV`, `change loan status to closed after withdrawLiquidated`, `add fail tolerance when comparing duration`, `change safeTransferFrom to safeTransfer for withdrawal functions` |
| Multi-collateral | `feat: add more 'Project Sector' options` |
| Events | `feat: add LoanRequestCreated event`, `LoanStatusChanged event` |
| Deployment | `chore: add matic deployment`, `deployment artifacts`, `documentation on how to deploy` |
| Test suite | `submitTreasuryAddress tests`, `withdrawLiquidated tests`, `liquidate tests`, `move reusable code from Loans test` |
| Hygiene | `remove transferFrom override from ERC20Test`, `extract getDeployedContract into utils` |

**Worked own branches:** `arthurka-o/smart-contract-allow-list`, plus a
`loans:accept` workstream.

---

## What the CV misses

0. **A measurable boundary between inherited and original.** The org's protocol is
   a renamed Liquity; the fork is where the work is. `TroveManager.sol` is gone,
   replaced by a Diamond prototype, and 273 `_asset` references were threaded
   through seven contracts that previously had none. See §0.
1. **16 upstream contributions** to the core protocol — Tellor integration with a
   gas optimisation, Polygon Mumbai deployment, Uniswap→Sushiswap migration.
2. **97 surviving commits on the fork** — the Diamond prototype driven by an EVM
   stack-depth limit, KUSD mint cap with a rounding fix, multi-asset threading
   through price feed + SDK + `StabilityPoolFactory`, `TroveRedemptor`. A floor,
   not a total: the later direct-push work went into the repo that is gone.
3. **30+ test-repair commits** through that migration.
4. **The allowlist model** — lenders and borrowers as explicit on-chain
   allowlists, with a dedicated PR.
5. **`withdrawLiquidated` + treasury routing** — liquidation proceeds routed to a
   treasury rather than the borrower.
6. **The rename `maxLTV` → `liquidationLTV`** — the kind of naming-accuracy work
   that shows you read your own contract.

## Claim shape for the site

`Loans.sol` is the strongest single artifact in the KUMO phase — 386 lines, a
complete five-state lifecycle, three roles (owner / lender / borrower), and
allowlist gating. It substantiates `cv.md` rather than replacing it, and it should
sit *alongside* the ABN AMRO / Techstars framing, which is the part a recruiter
actually cares about.

## Caveats

- `kumo-earth/lending` is private. Links to it will not resolve for a reader.
- `wollooo/kumo-protocol` and `arthurka-o/kumo-protocol` are public, so the
  Tellor / Diamond / mint-cap work *is* linkable.
- Confirm before publishing whether KUMO's internal work is cleared for a
  public portfolio — the org has no public repos, which suggests deliberate
  opacity.

## Open

- [ ] Does `kumo-earth` have private repos holding other phases? (0 public)
- [ ] Is there a deployed address for `Loans.sol`?
- [ ] Was the Techstars pilot actually launched with ABN AMRO, and is that
      publicly stateable?