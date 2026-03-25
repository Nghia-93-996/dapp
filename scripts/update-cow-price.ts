import { ethers } from 'ethers';
// import 'dotenv/config'; // Removed to avoid dependency errors in CI. Use --env-file locally if needed.

// --- Configuration ---
// Minimal ABI for the price update function
const COW_TOKEN_ABI = [
    "function setCOWPrice(uint256 _cowPriceUsd) external"
];

// Load from environment variables (GitHub Secrets when running in CI)
const COW_TOKEN_ADDRESS = process.env.COW_TOKEN_ADDRESS || "0xA381f67E1c448d18569A2397B7e8BbD9D4DcD332";
const RPC_URL = process.env.RPC_URL || "https://data-seed-prebsc-1-s1.binance.org:8545/";
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// API source for COW price
const PRICE_API_URL = "https://www.coinofworld.com/api/price?time=30d&pair=COW%2FUSD";

async function updatePrice() {
    console.log("------------------------------------------");
    console.log(`[${new Date().toISOString()}] Starting Price Update Bot`);

    if (!PRIVATE_KEY) {
        console.error("❌ ERROR: PRIVATE_KEY is missing in environment variables.");
        process.exit(1);
    }

    try {
        // 1. Fetch Price from API
        console.log(`1. Fetching price from: ${PRICE_API_URL}`);
        const response = await fetch(PRICE_API_URL);
        if (!response.ok) throw new Error(`API error: ${response.status}`);

        const data = await response.json();

        // Smart parser (handles multiple API formats)
        let price: number | null = null;
        if (typeof data.endRate === 'number') price = data.endRate;
        else if (data.price) price = parseFloat(data.price);
        else if (typeof data === 'number') price = data;

        if (price === null || isNaN(price) || price <= 0) {
            throw new Error(`Invalid price data: ${JSON.stringify(data)}`);
        }

        console.log(`   Fetched Price: $${price}`);

        // 2. Setup Ethers Provider & Wallet
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        console.log(`2. Wallet address: ${wallet.address}`);

        // Check balance (optional but helpful for debugging)
        const balance = await provider.getBalance(wallet.address);
        console.log(`   Balance: ${ethers.formatEther(balance)} BNB`);
        if (balance === 0n) {
            console.warn("⚠️ Warning: Wallet has 0 BNB. Transaction might fail if gas is needed.");
        }

        const contract = new ethers.Contract(COW_TOKEN_ADDRESS, COW_TOKEN_ABI, wallet);

        // 3. Convert to 8 Decimals (Contract requirement: $1.00 = 100,000,000)
        // Using BigInt to prevent precision loss
        const price8Decimals = BigInt(Math.round(price * 1e8));
        console.log(`3. Target Value (8 decimals): ${price8Decimals}`);

        // 4. Send Transaction
        console.log("4. Sending transaction to setCOWPrice...");

        // Estimate gas to be safe
        try {
            const gasLimit = await contract.setCOWPrice.estimateGas(price8Decimals);
            console.log(`   Estimated Gas: ${gasLimit.toString()}`);
        } catch (e) {
            console.warn("   Could not estimate gas, using default. (Role check failed?)");
        }

        const tx = await contract.setCOWPrice(price8Decimals);
        console.log(`   Transaction Sent! Hash: ${tx.hash}`);
        console.log(`   Waiting for confirmation...`);

        const receipt = await tx.wait();
        if (receipt.status === 1) {
            console.log("✅ SUCCESS: Price updated on-chain.");
        } else {
            console.error("❌ FAILURE: Transaction reverted.");
            process.exit(1);
        }

    } catch (error) {
        console.error("❌ ERROR during update:");
        console.error(error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
    console.log("------------------------------------------");
}

updatePrice();
