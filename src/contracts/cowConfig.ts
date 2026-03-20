/**
 * COW Token V2 — Contract configuration for the DApp frontend.
 *
 * ABI includes only the functions needed by the frontend.
 * Add new chain addresses after deployment.
 */

// Minimal ABI for frontend interaction (V2 — collateral-backed model)
export const COW_TOKEN_ABI = [
    // ── Read functions ──
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address account) view returns (uint256)",
    "function totalCollateral() view returns (uint256)",
    "function mintFeeBps() view returns (uint256)",
    "function burnFeeBps() view returns (uint256)",
    "function spreadBps() view returns (uint256)",
    "function ltvBps() view returns (uint256)",
    "function liquidationThreshold() view returns (uint256)",
    "function feeCollector() view returns (address)",
    "function treasury2() view returns (address)",
    "function backingRatio() view returns (uint256)",
    "function paused() view returns (bool)",
    "function owner() view returns (address)",
    "function cowPriceUsd() view returns (uint256)",
    "function priceUpdater() view returns (address)",

    // ── V2: Oracle & Positions ──
    "function getBNBPrice() view returns (uint256)",
    "function getPosition(address user) view returns (uint256 collateralAmount, uint256 cowMinted, uint256 collateralRatio)",
    "function getCollateralRatio(address user) view returns (uint256)",
    "function previewMint(uint256 bnbAmount) view returns (uint256 tokensOut, uint256 spreadFee, uint256 mintFee)",
    "function previewBurn(uint256 tokenAmount) view returns (uint256 bnbOut, uint256 spreadFee, uint256 burnFee)",

    // ── Write functions ──
    "function mint() payable",
    "function burn(uint256 amount)",
    "function liquidate(address user)",

    // ── Admin write functions (onlyOwner) ──
    "function setMintFee(uint256 _mintFeeBps)",
    "function setBurnFee(uint256 _burnFeeBps)",
    "function setSpreadBps(uint256 _spreadBps)",
    "function setLtv(uint256 _ltvBps)",
    "function setLiquidationThreshold(uint256 _threshold)",
    "function setFeeCollector(address _feeCollector)",
    "function setTreasury2(address _treasury2)",
    "function setPriceFeed(address _priceFeed)",
    "function setCOWPrice(uint256 _cowPriceUsd)",
    "function setPriceUpdater(address _priceUpdater)",
    "function pause()",
    "function unpause()",
    "function transferOwnership(address newOwner)",

    // ── Events ──
    "event Minted(address indexed user, uint256 bnbDeposited, uint256 tokensReceived, uint256 spreadFee, uint256 mintFee, uint256 bnbPriceUsd)",
    "event Burned(address indexed user, uint256 tokensBurned, uint256 bnbReturned, uint256 spreadFee, uint256 burnFee, uint256 bnbPriceUsd)",
    "event Liquidated(address indexed user, address indexed liquidator, uint256 collateralSeized, uint256 debtRepaid, uint256 penalty, uint256 bnbPriceUsd)",
    "event CowPriceUpdated(uint256 oldPrice, uint256 newPrice)",
] as const;

/**
 * Deployed contract addresses per chain.
 * Update these after deploying to each network.
 */
export const COW_TOKEN_ADDRESSES: Record<string, string> = {
    // BSC Testnet (chain 97 = 0x61)
    '0x61': '0xDAe2E7d409cfeAE97239F5661ca32E94436C5FDd',
    // BSC Mainnet (chain 56 = 0x38)
    // '0x38': '0x...',
};

/**
 * Get the COW token contract address for the current chain.
 */
export function getCOWTokenAddress(chainId: string | null): string | null {
    if (!chainId) return null;
    return COW_TOKEN_ADDRESSES[chainId] || null;
}

/**
 * Check if the COW contract is available on a given chain.
 */
export function isCOWChainSupported(chainId: string | null): boolean {
    if (!chainId) return false;
    const addr = COW_TOKEN_ADDRESSES[chainId];
    return !!addr && addr !== '0x0000000000000000000000000000000000000000';
}

// ─── Timelock Contract Configuration ───────────────────────────────

/** Minimum delay for Timelock operations (48 hours in seconds) */
export const TIMELOCK_MIN_DELAY = 172800;

/** Minimal ABI for Timelock interaction from frontend */
export const TIMELOCK_ABI = [
    // ── Write functions ──
    "function schedule(address target, uint256 value, bytes calldata data, bytes32 predecessor, bytes32 salt, uint256 delay)",
    "function execute(address target, uint256 value, bytes calldata payload, bytes32 predecessor, bytes32 salt)",
    "function cancel(bytes32 id)",
    // ── Read functions ──
    "function isOperationPending(bytes32 id) view returns (bool)",
    "function isOperationReady(bytes32 id) view returns (bool)",
    "function isOperationDone(bytes32 id) view returns (bool)",
    "function getTimestamp(bytes32 id) view returns (uint256)",
    "function getMinDelay() view returns (uint256)",
] as const;

/**
 * Deployed Timelock contract addresses per chain.
 */
export const TIMELOCK_ADDRESSES: Record<string, string> = {
    // BSC Testnet (chain 97 = 0x61)
    '0x61': '0xbb183061a7a88e08136611a7781cadBB3337212a',
    // BSC Mainnet (chain 56 = 0x38)
    // '0x38': '0x...',
};

/**
 * Get the Timelock contract address for the current chain.
 */
export function getTimelockAddress(chainId: string | null): string | null {
    if (!chainId) return null;
    return TIMELOCK_ADDRESSES[chainId] || null;
}
