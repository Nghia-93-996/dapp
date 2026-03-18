# COW Stablecoin — COW Token Protocol

A decentralized application for the **COW (Collateralized Reserve) Token** on BNB Smart Chain. Built with React, TypeScript, ethers.js, and Solidity.

## 🐄 COW Token Overview

COW is a **collateralized reserve token** where every token is backed by BNB in the treasury. No admin can withdraw collateral — users can always burn COW to redeem their proportional BNB.

**Ratio**: `1 BNB = 1,000 COW`

### Key Features

- ✅ **Collateralized Mint/Burn** — Deposit BNB → receive COW, burn COW → receive BNB
- ✅ **No Admin Withdraw** — Collateral only exits via user burns
- ✅ **No Admin Mint** — Tokens only created with collateral deposit
- ✅ **Timelock Protection** — 48h delay on all admin changes (ragequit window)
- ✅ **ReentrancyGuard + Pausable** — Security best practices
- ✅ **Fee Cap** — Max 5%, currently 0.5% mint/burn fee

---

## 📜 Smart Contracts (BSC Testnet)

| Contract | Address | Explorer |
|----------|---------|----------|
| **COWToken** | `0x2A91d3351976140141aCCF5113334F824d8f8c11` | [View on BscScan](https://testnet.bscscan.com/address/0x2A91d3351976140141aCCF5113334F824d8f8c11) |
| **COWTimelock** | `0x83a678dFDB1EAA2eC6b2989E7201d957e5cC7B30` | [View on BscScan](https://testnet.bscscan.com/address/0x83a678dFDB1EAA2eC6b2989E7201d957e5cC7B30) |

**Fee Collector**: `0x65E8c1434E348EE409A0d6488b9e293C3fFdd998`

| Parameter | Value |
|-----------|-------|
| Mint Fee | 0.5% (50 bps) |
| Burn Fee | 0.5% (50 bps) |
| Timelock Delay | 48 hours |
| Token per BNB | 1,000 COW |
| Solidity | 0.8.24 |
| OpenZeppelin | v5.x |

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- MetaMask browser extension
- tBNB for BSC Testnet ([faucet](https://www.bnbchain.org/en/testnet-faucet))

### Install & Run

```bash
# Install dependencies
yarn install

# Start dev server
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Smart Contract Development

```bash
cd contracts

# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to BSC Testnet
DEPLOYER_PRIVATE_KEY=0x... npx hardhat run scripts/deploy.ts --network bscTestnet
```

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19 + TypeScript + Vite |
| **Web3** | ethers.js v6 |
| **Smart Contracts** | Solidity 0.8.24 + Hardhat |
| **Libraries** | OpenZeppelin v5 (ERC-20, Ownable, Pausable, ReentrancyGuard, TimelockController) |
| **i18n** | react-i18next (EN / VI / ZH) |
| **Notifications** | react-toastify |

---

## 📁 Project Structure

```
dapp-web3/
├── src/
│   ├── components/       # React UI components
│   ├── contracts/        # ABI & contract config
│   ├── hooks/            # useWallet, useCOWContract, useTransaction
│   ├── config/           # Network configs
│   ├── i18n/             # Translations (en, vi, zh)
│   └── pages/            # Document page
├── contracts/
│   ├── contracts/        # Solidity source
│   │   ├── COWToken.sol
│   │   └── COWTimelock.sol
│   ├── scripts/          # Deploy scripts
│   └── test/             # Hardhat tests
└── public/
```

---

## 🔐 Security Model

```
User deposits BNB
       ↓
  COWToken.mint()
       ↓
  Fee → Fee Collector (0.5%)
  Net BNB → Treasury (locked in contract)
  COW tokens → User (1000 per BNB)
       ↓
  User can burn COW anytime
       ↓
  COWToken.burn()
       ↓
  Proportional BNB returned (minus 0.5% fee)
```

> **No withdraw function exists.** The only way BNB leaves the contract is through user burns.

---

## 📄 License

MIT
