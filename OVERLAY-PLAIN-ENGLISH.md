# Overlay — what the work actually was

Plain-English explanation, for readers who are not DeFi engineers. Written by
reading the code and the diffs, not the commit subjects.

The question this document answers is **"why did he do it that way?"** — which is
the only question a commit message can't answer.

---

## Vocabulary first

**Perpetuals (perps).** A derivative that tracks an asset's price. You don't own
the thing, you bet on its price going up or down. Leverage means a small price move
forces a large gain or loss. No margin call with a broker — the loss is taken
automatically.

**Open interest.** All the open perps positions. It's the size of the market.

**Collateral.** Something locked up as security. You borrow against it; if your
position goes bad, it's taken.

**Notional.** The face value of a position. If a position has $10,000 of notional
and you control $1,000 of your own money, you have 10× leverage.

**Lending rate.** What borrowers pay the protocol for the privilege of using its
leverage. Often a market rate that curves sharply against the borrower as open
interest grows, so the protocol automatically becomes more expensive when the market
is crowded — which pushes people out before a cascade.

**Liquidation.** Forcibly closing a position that can no longer cover its loss.
Someone else does it and is paid a fee for the risk.

**Oracle.** A contract that reports an asset's price from outside the protocol.
If the price is wrong, the protocol hands out wrong money. It's the single most
valuable thing to attack.

**TWAP (time-weighted average price).** Instead of trusting the price *right now*,
average the price over the last N minutes. An attacker has to manipulate the price
steadily for the whole window to move it, which is expensive and obvious.

**Proxy.** A contract that forwards calls to the real implementation. Users hold
the proxy address permanently; the logic behind it can be swapped.

**Upgradeable (UUPS).** A proxy whose owner can point it at new code. Necessary to
fix a live protocol — and the single largest security liability in DeFi, because
whoever holds that key controls every user's funds.

---

## 1. The funded-trader kill switch — `avatar-killswitch`

**33 of 63 commits. Majority ownership.** This is the most substantive system.

### What the program is

Overlay lets the protocol sponsor traders: the protocol puts up the collateral and
pays for a trader's leverage, in exchange for a share of the profit. The trader
never risks their own money, so they have no incentive to be careful. Overlay
therefore has to act as the risk manager instead — which means it needs to be
able to close a position the moment the trader blows through their limit.

### How it works

Each sponsored trader has a **Safe** — a smart-contract wallet — that the protocol
controls. Two independent limits:

```typescript
// backend/src/services/threshold-checker.ts
1. Funding threshold   — value < 50% of initial collateral
2. Daily threshold     — value < 75% of today's baseline (25% drop since midnight)
```

**Why two thresholds, and why the daily one resets.** The funding threshold alone
isn't enough: a trader can lose a little every day, never crossing the 50% line,
and bleed the program dry over a month. So there's also a *daily* rule — lose 25%
since the first check of the day and you're out, whatever your total position is.
The daily baseline is written once per trader per day, and every later check
compares against that same snapshot. It converts a slow bleed into a fast stop.

Either breach triggers liquidation: close every position, then pause the Safe so
it cannot trade again.

### The hard part: Safe started rejecting the calls

A Zodiac module (Overlay's "autopilot" contract) has to submit transactions on
behalf of the Safe. Zodiac does this with `MultiSend`, which batches calls and
executes them via **delegatecall**.

Then Safe changed their policy:

> `Safe Transaction Service now rejects DelegateCall to non-whitelisted contracts.`

The kill switch stopped working. The fix:

```typescript
// backend/src/config/deploy-constants.ts
const MULTI_SEND_CALL_ONLY_ADDRESS = '0x9641d764fc13c8B624c04430C7356C1C7C8102e2';
```

`MultiSendCallOnly` is a variant of the same contract that **cannot make arbitrary
delegatecalls** — it can only call `call`. That makes it safe to whitelist, because
it physically cannot be used for the attacks a general `MultiSend` enables. So it
was whitelisted, and the kill switch pointed at it.

The subtle part, and the reason the commit keeps a specific line: delegatecall is
still used (`operation: 1`), because the whole point is that the calls must appear
to come *from the trader's Safe* — the protocol's contracts identify themselves by
`msg.sender`. So the fix wasn't "stop using delegatecall," it was "use the one
variant that is both whitelisted and still executes as the Safe."

This is a good story because it shows a dependency's *policy* changed under you,
and you diagnosed it precisely and chose the narrowest correct workaround.

### Least privilege: two processes, two database permissions

The kill switch has two halves that needed opposite database access:

| Process | MongoDB | Job |
|---|---|---|
| Kill-switch service | **read-write** | records daily baselines, triggers liquidations |
| API server | **read-only** | serves stats to the frontend |

```
fix: make API server fully read-only for MongoDB
  "The kill-switch service (rw) records baselines, the API server (read-only)
   just reads them."
```

They share a service, but the read path got its own function that never writes:

```typescript
/**
 * Read-only version of daily baseline lookup.
 * Never writes to MongoDB.
 * Used by the API server which connects with a read-only MongoDB user.
 */
export async function getDailyBaselineReadOnly(safeAddress, currentValue) { ... }
```

Why it matters: the API server faces the public internet. If it were compromised,
an attacker who could write to the database could corrupt the baselines the
kill switch depends on — meaning they could hide a blowout until it was too late to
stop it. Read-only credentials make that impossible regardless of any bug in the
serving code.

Also in this repo: Safe Global API v2 migration, retry-with-backoff on the Safe
client, `MultiSendCallOnly` reassignment script, and Telegram alerts on kill-switch
events.

---

## 2. The immutable oracle — `v1-shiva`

**25 of 254 commits.** The highest-stakes design decision in the codebase.

### What changed

The price oracle started life as a **UUPS upgradeable proxy** — `Initializable`,
`UUPSUpgradeable`, `OwnableUpgradeable`, with an `initialize()` function and a
`PoolUpdated` event. It was made non-upgradeable, then made fully immutable:

```diff
-contract PancakeSwapV3TWAPOracle is Initializable, UUPSUpgradeable, OwnableUpgradeable {
-    function initialize(address _pool, uint32 _twapPeriod) external initializer {
+contract PancakeSwapV3TWAPOracle is Ownable {
+    constructor(address _pool, uint32 _twapPeriod) {
```

### Why remove upgradeability from an oracle specifically

Every other contract in the protocol stays upgradeable, deliberately — you need to
be able to fix a live protocol. The oracle is the exception, and the reasoning is
asymmetric:

- A bug in a normal contract means money is stuck or mispriced — bad, fixable.
- A bug in the *price* means every loan is sized wrong, right now, and the
  upgrade key is the obvious target. An upgradeable oracle is a standing invitation:
  "whoever can reach this key controls every user's collateral."

Deployed once, configured once, never touched. The trade is real and worth
stating: if the oracle is found to be wrong, it *cannot* be patched, and the
protocol must be paused instead. He took that trade deliberately.

### Worst-case price selection — the detail that matters most

When both a TWAP and a spot price are available, which one does the protocol use?

```solidity
// Return worst price for user (maximum) to prevent manipulation
// Higher price = less OVL borrowed = worse for user, safer for protocol
return MathUpgradeable.max(twapPrice, spotPrice);
```

It takes the **maximum**. If OVL is worth $0.06, a borrower collateralising OVL
borrows based on $0.06 — not the lower number. This makes it impossible to
manufacture a *favourable* price for yourself, and it means price manipulation
can only ever hurt the person doing it.

The same conservatism runs through the staleness guard (`maxPriceAge` — reject
rather than trust an old price) and the TWAP period, which was moved out of the
oracle's constructor into the collateral contract so a single immutable oracle can
serve more than one market configuration.

### Invariant testing

```
test: first invariant test
test: add staking_balance_matches_notional invariance
forge install: chimera
```

Ordinary tests check the cases you thought of. Invariant tests state a property
that must *always* hold and then fuzz thousands of random inputs trying to break
it. The property here: **a trader's staked balance must never exceed the notional
they can claim.** Plus Foundry mainnet-fork tests, so the oracle path runs against
real chain state.

---

## 3. The referral system — `Referral`

**33 of 235 commits.** `solc 0.8.19`.

### The problem

Affiliates refer traders. Two parties need to agree a referral happened: the
person who referred, and the person who was referred. Neither should have to trust
the other's database, and neither should be able to claim a referral that didn't
happen.

### The design: fast path, chain as source of truth

MongoDB holds affiliate records. But MongoDB can be wrong — the commit message
names the exact failure:

```
feat: add on-chain affiliate verification fallback

When a MongoDB affiliate record is missing (e.g. after cleanup),
verify affiliate status on-chain via userTier before rejecting.
Auto-creates the MongoDB record if on-chain tier > 0.
```

So: **check the database first, and only when it's missing or unhelpful, go to the
chain** and read the user's tier on-chain. If the chain says they're an affiliate,
recreate the database record. The chain is authoritative; the database is a cache.

This is the right shape for this problem, and it's the reason the fallback matters:
without it, a database cleanup permanently disqualifies a real affiliate. With it,
the cache can be rebuilt from the source of truth at any time.

Also: minimum trading volume enforced before a referral counts, alias
normalisation (so one person can't hold several aliases and claim multiple times),
and ownership transferred after deployment.

---

## 4. The multi-factory subgraph — `v1-subgraph`

**103 of 359 commits.** The largest single contribution by volume.

### The problem

The protocol doesn't have one market contract. It has several *factories*, each
issuing a different kind of market — and it deploys to several networks. The
subgraph's config previously hardcoded **one** `PERIPHERY_ADDRESS`.

The consequence: every time a new factory was deployed, or a new network
supported, someone had to hand-edit YAML. Miss one data source and that part of
the protocol silently stops indexing. Nobody notices until a product query returns
wrong data.

### The fix: generate the config instead of maintaining it

```javascript
// scripts/switchNetwork.js
const factoryContracts = Object.keys(networkConfig.contracts)
  .filter(key => key.startsWith('OverlayV1Factory'))
  .sort();

factoryContracts.forEach((contractKey, index) => {
  let factoryDS = factoryDataSources.find(ds => ds.name === contractKey);
  if (!factoryDS && factoryDataSources.length > 0) {
    // Clone the first factory dataSource as a template
    factoryDS = JSON.parse(JSON.stringify(factoryDataSources[0]));
    factoryDS.name = contractKey;
  }
  ...
});
```

Switching networks or adding a factory became a data change, not a code change —
and the template-clone means a new factory inherits correct handlers automatically.
Then it went further: dual-factory support per network, and three factories wired up
(`two new chapel factories`, `add the third factory`).

The three unit test files touched in the same commit are the tell that this was
done properly — the change to the config shape was treated as a behaviour change
and covered.

---

## 5. Portfolio PnL precision — `overlay-interface-v2`

**148 of 1572 commits.** The largest contribution overall, and it contains a bug
worth explaining.

### The bug

```typescript
-const WAD = 1e18;
-  totalValueLocked += (initialCollateralOvl * Number(oraclePrice)) / WAD;
+  totalValueLocked += initialCollateralOvl * oraclePriceFloat;
```

`oraclePrice` is a `bigint` — Ethereum integers are 256-bit, but JavaScript numbers
are 64-bit floats with only 53 bits of *precision*. An oracle price of 1.5e18 is a
number far beyond what a float can represent exactly, so `Number(oraclePrice)`
silently returned an approximation. Dividing it by 1e18 produced a "price" that
was off by a small fraction.

The fix:

```typescript
+const oraclePriceFloat = oraclePrice
+  ? parseFloat(formatUnits(oraclePrice, 18))
+  : 0;
```

`formatUnits` renders the bigint to its decimal *string* first; only then does it
become a float. The precision that matters is preserved.

**Why this mattered rather than being cosmetic:** the affected numbers are
`totalValueLocked` and `unrealizedPnL` — the portfolio value and profit/loss a
trader looks at. A rounding error in a displayed PnL is a financial bug, and this
is the class of defect that erodes trust in every other number on the screen.

### The same commit's other bug

```diff
-const previousOverviewData = usePrevious(overviewData);
+const previousOverviewDataRef = useRef<OverviewData | undefined>(undefined);
```

A `usePrevious` hook returns state that updates on the *next* render, but it was
being read inside a `useCallback` — which captured a stale copy. The callback
compared new data against old-old data, so its "has anything changed?" check could
be wrong and the polling refresh could silently fail to announce updates.

A ref fixes it because assigning to it is synchronous, with no render cycle in
between. Both bugs in one file, one commit, both in the money path.

---

## 6. Leaderboard and competitions — `overlay-leaderboard-backend`

**23 of 208 commits.**

Written as a **rule engine**, not hardcoded queries. Rules that exist as
configuration:

- `minUSDCollateral` — a market only counts for a competition above a collateral floor
- exempt markets — some markets are excluded from ranking entirely
- OVL fallback — if the OVL price feed is unavailable, ranking still works

The reasoning behind `minUSDCollateral` matters: without a floor, a trader could
open a dust position, multiply it by leverage, and top a leaderboard without
carrying meaningful risk. The rule makes ranking reflect real conviction.

Money maths goes through `decimal.js` rather than floats — same class of decision
as the bigint fix above, applied deliberately on the backend.

---

## 7. The published SDK — `overlay-sdk`

**49 of 474 commits.** Version 0.1.29 — a real package other teams import.

The interesting commits are all defensive:

- `getUnwindOvlAmount` without loan value — handle a position state the code
  didn't expect rather than throwing
- gracefully handle LBSC address lookup failure in `getMultiMarketPositionsPnL`
- USDT decimals — USDT is 6 decimals, most tokens are 18. Getting this wrong
  silently returns values 1e12 off.
- return deprecated factory / update factory — versioning, so a caller is never
  silently moved onto a contract that's being retired

That last cluster is the mark of a library rather than an internal script: it
assumes callers exist, callers break, and it degrades rather than failing.

---

## What to say on the site

The through-line across all of this is not "I worked on a DeFi protocol." It's:

> **Every one of these was a case where something external was not cooperating.**
> Safe's transaction service started rejecting whitelisted delegate calls. The
> price oracle was upgradeable, which is a standing invitation. MongoDB lost a
> record. A float quietly ate 12 digits of precision. He found each one, understood
> why it happened, and fixed it at the narrowest possible point.

That is a demonstrable engineering disposition and it is checkable — every claim
above points at a commit hash in a public repository.

### Supporting one-liners

- Built the off-chain system that automatically liquidates a protocol-sponsored
  trader when they exceed their loss limit, on a contract wallet the protocol
  controls. When Safe's transaction service began rejecting the delegate calls the
  system depended on, switched to the whitelisted call-only variant — the one that
  still executes as the trader's wallet but physically cannot make arbitrary
  delegate calls.
- Split the service in two so the public-facing API server holds read-only
  database credentials. If it were compromised, an attacker could not corrupt the
  baselines the risk system depends on.
- Made the price oracle immutable while leaving the rest of the protocol
  upgradeable, because an upgradeable oracle is a standing target. Prices resolve
  to the *worst* value available, so the price can never be manipulated in a
  borrower's favour.
- Replaced a single hardcoded market address in the subgraph with generated
  configuration, so a new factory or network is a data change rather than a code
  change that can silently fail to index.
- Found and fixed a float-precision bug in the portfolio PnL display where a
  256-bit on-chain price was being coerced to a JavaScript number — an error in
  the one figure traders trust most.
- Built the referral system so the chain is the source of truth and the database
  is a cache that can be rebuilt, rather than a database that can permanently
  disqualify a real affiliate.