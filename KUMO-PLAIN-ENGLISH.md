# KUMO — what the work actually was

Plain-English explanation of the code, for readers who are not protocol
engineers. Written after reading the contracts, not the commit messages.

---

## The one-paragraph version

KUMO is a lending platform for carbon credits. A forest project or carbon-removal
company has a certified credit worth real money but no cash today. KUMO lets them
lock that credit up as collateral and borrow stablecoins against it immediately —
no waiting for the credit to sell. Arthur worked on this for roughly 21 months
across three phases: hardening the core protocol, restructuring it so it could
handle multiple collateral types at once, and then building a simpler purpose-built
contract for a pilot with a bank.

---

## Vocabulary you need first

**Collateral / loan.** You lock something valuable up, you get money now. The
locked thing is collateral, the borrowed money is the debt.

**Tokenised carbon credit.** A certified tonne of CO₂ removed or avoided, minted
as a token. It's the *asset* being financed.

**Stablecoin (KUSD).** A token pegged 1:1 to the dollar, so lenders get something
that doesn't swing like the carbon market does.

**LTV — loan to value.** How much you can borrow against your collateral. Say the
credit is worth $100 and LTV is 80% — you can borrow $80. If the credit's price
falls so the position exceeds its LTV, **the loan gets liquidated**: somebody
takes your collateral to repay the debt. This is the risk mechanism that makes an
unsecured-looking loan safe.

**Liquidation.** Seizing collateral because a loan went underwater. Automatic,
punishing, and necessary — without it the protocol loses money the moment a
collateral asset drops.

**Redemption.** The opposite direction: someone pays back KUSD to claim the
collateral. It keeps the stablecoin honestly backed.

---

## Phase 1 — hardening the core protocol (May–Jun 2022)

**Repo:** `wollooo/kumo-protocol` · 16 of ~2,900 commits · 10th contributor

### The base protocol

Liquity's open-source lending code, adapted. Liquity is a well-known blueprint:
borrow stablecoins against collateral with no bank and no middleman. KUMO swapped
the collateral from ETH to tokenised carbon credits and re-geared the economics
around them.

The whole protocol hinges on one contract, `TroveManager.sol` — **1,575 lines**.
Every borrower's position lives in it. "Trove" is Liquity's word for a single
borrower's collateralised debt position, and there are a lot of them.

### What Arthur actually did

**Added a second price source.** The protocol decides how much a credit is worth
by reading a price feed. Relying on one means a single outage or manipulation
breaks the protocol. He integrated **Tellor** alongside Chainlink so a bad reading
from one doesn't sink it.

The commit `Add early return to TellorCaller` is a **gas optimisation** — bail out
of the function before doing expensive work if the input is already unusable.

**Migrated Polygon testnet deployment**, and swapped **Infura → Alchemy** as the
RPC provider.

---

## Phase 2 — making the protocol bigger (Jun 2022 – May 2023)

**Repo:** `arthurka-o/kumo-protocol` (his fork) · **97 surviving commits**
The largest body of KUMO work — and a floor, not a total. The team worked in
forks and opened PRs against the KUMO repo; later they pushed straight into it.
That repo is the one that was deleted, so everything from that switch survives
only where it was mirrored. See `KUMO-EXTRACTION.md` §"The org".

This phase is two problems and their solutions: the contract got too big to
manage, and it could only take one kind of collateral.

### 2a. The problem: Solidity contracts have a hard size and shape limit

There are two constraints that bite here, and both are worth understanding because
they're the *reason* the next thing happened:

**1. The EVM gives each function about 16 stack slots.** Stack slots are the
scratchpad a function uses for parameters and local variables. If a function takes
9 parameters and computes 10 locals, it runs out of room — and the compiler stops
with `Stack too deep`. It's not a bug, it's the machine.

Liquity's functions are large enough to hit it. Two commits in this repo are
literally `Trying to fix "Stack too deep"` and `Fix Stack too Deep`.

**2. Deploying a changed contract requires deploying a new one.** For a protocol
with real money in it, that means a migration users have to do.

### 2b. The research and prototype: the Diamond pattern (EIP-2535)

Instead of one 1,575-line contract, split it into many small ones — in Solidity
these are called **facets** — all reachable behind a single address:

```
TroveManagerDiamond.sol        (77 lines)   ← the front door
├── TroveManagerFacet.sol      (482 lines)  ← positions, trove bookkeeping
├── TroveRedemptorFacet.sol  (1,372 lines)  ← redemption, liquidation
├── OwnershipFacet.sol         ( 31 lines)
├── DiamondCutFacet.sol        ( 59 lines)  ← add/replace facets later
└── DiamondLoupeFacet.sol     (224 lines)  ← introspection
```

Readers call the same address they always did. What changed is that the logic
behind it lives in separate small contracts, and **new facets can be added later
without touching the ones already holding user funds**. That kills both problems:
functions stop overflowing their stack slots, and the protocol can grow without a
migration.

**Correction, from Arthur: this was the research and the prototype, not what
shipped.** The fork contains the facets, and building them is real work — but
the protocol went out on **UUPS** instead, because the ecosystem around
upgradeable proxies was the more mature one at the time. The diamond split is a
PoC that informed the decision, not the decision.

That is still worth stating on the site, and it is worth stating accurately: the
upgradeability question was forced by a hard compiler constraint, two patterns
were evaluated against it, and the one that shipped was chosen for ecosystem
maturity rather than novelty. Do not claim the protocol was converted to the
diamond pattern.

### 2c. `TroveRedemptor` — splitting one god-contract by responsibility

The original `TroveManager` did two unrelated jobs:

- **track** who borrowed what, and when
- **settle** it — accept redemptions, liquidate bad loans

Those have different users (borrowers vs liquidators) and different risk. And the
settling half was enormous. So it moved:

```
"Move batchLiquidateTroves to TroveRedemptor"
"Fix redeemCollateral"  ·  "Fix TroveOwners"
"Move redistributeDebtAndColl, remove setAddress and SafeMath from TroveManager"
```

**The move added no functionality.** The inherited upstream `wollooo/kumo-protocol`
`TroveManager.sol` (1,575 lines) already had `batchLiquidateTroves(address[])`,
`liquidateTroves(uint)`, `redeemCollateral` and the whole recovery-mode branch —
all inherited from Liquity. The upstream file even carries a comment explaining
that its liquidation structs exist "in order to avoid the error: `CompilerError:
Stack too deep`", so the constraint was already known there. The commit says
"Move", and that is the whole of it.

The commit `add hardhat-contract-sizer` is the tooling to watch contract sizes
while doing this — you cannot manage a size limit without measuring it.

### 2d. `TroveRedemptor` in plain terms

`TroveRedemptorFacet.sol` is 1,372 lines and holds:

| Function | What it does, plainly |
|---|---|
| `liquidate` | Close one underwater position, seize collateral |
| `liquidateTroves` / `batchLiquidateTroves` | Close many, in one transaction |
| `_liquidateRecoveryMode` | The branch used when the *whole system* is under-collateralised |
| `redeemCollateral` | Someone repays KUSD to claim collateral |
| `_redistributeDebtAndColl` | When collateral can't cover the debt, spread the loss across the pool |
| `_sendGasCompensation` | Pays the liquidator for doing the work |
| `_checkPotentialRecoveryMode` | Decides whether the system is in trouble |

Recovery mode is the part worth flagging: it's the protocol-wide failsafe for when
the collateral backing *everything* drops below what the debts are worth. Rare,
serious, and the code path nobody tests until they need it. It is also **inherited**
— the upstream `TroveManager.sol` already had it — so it is not a claim to make,
only a path Arthur had to keep working through the move.

### 2e. KUSD mint cap — a hard ceiling on the money supply

```
"Implementation of KUSD mint cap"
"Make KUSDMintCap asset based"
"Add KUSDMintRemainder helper"
"Fix negative values for KUSDMintRemainder"
```

A cap limits how much stablecoin the protocol can ever create. If carbon credit
prices fall, new borrowers can't keep minting KUSD against a shrinking asset base —
which is exactly the death spiral that killed several earlier lending protocols.
Setting it per-asset lets each collateral type carry its own risk limit.

**The bug worth telling.** `KUSDMintRemainder` answers "how much more KUSD can
still be minted?" — the cap, minus what's already been minted. Both are unsigned
integers. When the cap is *lower* than what's already minted, that subtraction
wraps around to an enormous positive number instead of going negative:

```solidity
uint256 remainder = kumoParams.KUSDMintCap(_asset) - kusdToken.totalSupply();
// ... wrapped to a huge number instead of "you have minted too much"
```

Every deployed copy of a contract is immutable. A bug in a lending protocol's
overflow logic isn't a cosmetic bug — it's the kind that reads as *more headroom
than actually exists*. He wrote the guard, the fix, and additional tests.

### 2f. Multi-asset support

The protocol originally accepted one kind of collateral. Making it accept several
touches everything, because each asset needs its own price feed, its own risk
parameters, and its own savings pool:

```
"Add asset to IPriceFeed"                    ← price feed takes an asset
"Add asset address in tests for priceFeed"
Merge PR #287 — implement a test pricefeed for multiple asset
Merge PR #280 — mulit-asset-SDK
"Create StabilityPoolFactory" / "Add IStabilityPoolFactory"
Merge PR #297 — create stabilitypoolfactory with stabilitypool clone
```

The factory is the neat part. A `StabilityPool` holds everyone's deposits and pays
out the yield. With several assets you need several pools, and copying a
deployed contract by hand is error-prone — so the factory creates them
programmatically, one per asset, correctly linked to that asset's parameters.

---

## Phase 3 — the pilot contract (Nov–Dec 2023)

**Repo:** `kumo-earth/lending` (private) · **85 of 532 commits**

Selected for the **ABN AMRO + Techstars Future of Finance accelerator**; built and
launched a pilot with ABN AMRO. This one is deliberately simpler — the goal was to
ship something a bank would sign off on, not to be elegant.

### `Loans.sol` — 386 lines, one file, no cleverness

```solidity
enum LoanStatus { PENDING, ACTIVE, REPAID, LIQUIDATED, CLOSED }
```

Every loan moves through five states, and the contract refuses any transition that
doesn't follow them:

```
PENDING ──accept──▶ ACTIVE ──repay──▶ REPAID
                      │
                      ├──LTV exceeded──▶ LIQUIDATED ──▶ (collateral to treasury)
                      │
                      └──withdraw──────▶ CLOSED
```

The full surface, in plain terms:

| Function | What it does |
|---|---|
| `createLoanRequest` | Borrower locks carbon tokens, proposes terms (rate, LTV, duration, amounts) |
| `acceptLoanRequest` | A lender takes the loan; funds move |
| `withdrawLoanRequest` | Borrower cancels before funding |
| `withdrawCollateral` | Borrower retrieves collateral |
| `increaseCollateral` | Borrower adds more, pulling the position back from the LTV edge |
| `markRepaid` | Off-chain confirmation that the loan was paid |
| `liquidate` | Owner-side: the loan is underwater, seize it |
| `withdrawLiquidated` | Send seized collateral to the **treasury**, not the borrower |
| `calculateCurrentLTV` | Live ratio, given a current price |
| `calculateOutstandingDebt` | Interest accrued to date |

Two design choices worth explaining:

**1. Explicit allowlists.** `lenders` and `borrowers` are on-chain mappings of
approved addresses. You cannot simply call the contract — you have to be on the
list. For a bank pilot this is the entire point: the protocol is permissioned on
purpose, so the contract only ever moves money between counterparties the bank has
signed off.

**2. Liquidation pays the treasury.** `withdrawLiquidated(loanId, sendToTreasury)`
— seized collateral goes to a designated treasury address rather than back to the
default. Seized collateral often doesn't cover the debt, so the default recipient
is a protocol account, not a person.

Plus a **V2 escape hatch** — `setV2Address` and a `transferOfFunds` function
gated behind `onlyV2`, so the pilot contract can hand off to a successor.

### The unglamorous work

Most of the 85 commits aren't features. They're:

- `refactor: rename maxLTV to liquidationLTV` — the original name implied "max you
  can borrow"; it's actually the threshold that liquidates you. Misleading names
  in a lending contract are a real hazard, so he fixed it.
- `change safeTransferFrom to safeTransfer for withdrawal functions` — the wrong
  OpenZeppelin helper on a withdrawal path
- `add fail tolerance when comparing duration` — off-by-a-little failures in a
  date comparison
- `change loan status to closed after withdrawLiquidated` — a state machine that
  could end up inconsistent
- ~10 commits adding test coverage for liquidation, treasury and transfer paths
- Hardhat deployment scripts, Polygon deployment, artifacts, deployment docs

---

## What to say on the site

If a reader only remembers one line, it should be this:

> **A lending protocol ran out of room — literally. Its functions had more inputs
> and variables than the EVM gives a function. He researched the Diamond pattern
> as the fix and prototyped the split, but shipped on UUPS because the ecosystem
> around it was the mature one; added a per-asset mint cap, and did the same again
> for a bank pilot.**

The through-line is not "I used Diamond Pattern." It's **"I hit a hard constraint,
understood why it existed, and restructured around it."** That's the transferable
claim, and it's the one every other bullet is evidence for.

The upgradeability claim needs its own wording, because the obvious one is false.
The correct shape is: *the constraint forced the question, two patterns were
evaluated against it, and the one that shipped was chosen for ecosystem maturity.*
Saying "converted the protocol to the diamond pattern" is not what happened, and
it is checkable from the repo — so it is exactly the kind of claim that must not
be made.

### Supporting one-liners, if a longer format is available

- Built the second price source. One oracle means one outage or manipulation ends
  the protocol; added Tellor alongside Chainlink.
- Added a per-asset cap on stablecoin creation, and fixed a bug where the
  "how much room is left" calculation wrapped around to report huge headroom
  instead of none. Contracts are immutable; that's a serious class of bug.
- Turned a single-collateral protocol into a multi-asset one: asset-aware price
  feeds, per-asset risk parameters, and a factory that creates a savings pool per
  asset instead of hand-copying contracts.
- Wrote the contract for a bank pilot where the design goal was obviousness, not
  cleverness: a five-state loan lifecycle, explicit lender and borrower allowlists,
  and seized collateral routed to a treasury.