import { useState, useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { Footer } from '../components/Footer';
import './DocumentPage.css';

const networks = [
    { name: 'Ethereum Mainnet', chainId: '0x1', status: 'live', rpcUrl: 'https://eth.llamarpc.com', explorer: 'etherscan.io' },
    { name: 'BNB Smart Chain', chainId: '0x38', status: 'live', rpcUrl: 'https://bsc-dataseed.binance.org', explorer: 'bscscan.com' },
    { name: 'BSC Testnet', chainId: '0x61', status: 'testnet', rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545', explorer: 'testnet.bscscan.com' },
    { name: 'Polygon', chainId: '0x89', status: 'live', rpcUrl: 'https://polygon-rpc.com', explorer: 'polygonscan.com' },
    { name: 'Arbitrum One', chainId: '0xa4b1', status: 'live', rpcUrl: 'https://arb1.arbitrum.io/rpc', explorer: 'arbiscan.io' },
    { name: 'Optimism', chainId: '0xa', status: 'live', rpcUrl: 'https://mainnet.optimism.io', explorer: 'optimistic.etherscan.io' },
    { name: 'Avalanche C-Chain', chainId: '0xa86a', status: 'live', rpcUrl: 'https://api.avax.network/ext/bc/C/rpc', explorer: 'snowtrace.io' },
    { name: 'Sepolia (Testnet)', chainId: '0xaa36a7', status: 'testnet', rpcUrl: 'https://rpc.sepolia.org', explorer: 'sepolia.etherscan.io' },
];

const codeBlocks = {
    prerequisites: `// 1. Install MetaMask from https://metamask.io
// 2. Add BSC Testnet network:
//    RPC: https://data-seed-prebsc-1-s1.binance.org:8545
//    Chain ID: 97
//    Symbol: tBNB
// 3. Get test BNB from faucet:
//    https://www.bnbchain.org/en/testnet-faucet`,
    mint: `// COW Token V2: Collateral-based Minting
const cowToken = new ethers.Contract(COW_ADDRESS, ABI, signer);

// Step 1: Preview mint output
const bnbAmount = ethers.parseEther("1.0"); // 1 BNB
const [tokensOut, spreadFee, mintFee] = 
  await cowToken.previewMint(bnbAmount);
console.log('COW to receive:', ethers.formatEther(tokensOut));
console.log('Spread fee (1%):', ethers.formatEther(spreadFee));
console.log('Mint fee (0.3%):', ethers.formatEther(mintFee));

// Step 2: Execute mint (deposit BNB as collateral)
const tx = await cowToken.mint({ value: bnbAmount });
await tx.wait();
console.log('Minted! TX:', tx.hash);

// Step 3: Check your position
const [collateral, cowMinted, ratio] = 
  await cowToken.getPosition(address);
console.log('Collateral:', ethers.formatEther(collateral), 'BNB');
console.log('COW Minted:', ethers.formatEther(cowMinted));
console.log('Health Ratio:', ratio.toString(), 'bps');`,
    burn: `// COW Token V2: Burn & Redeem Collateral
const cowToken = new ethers.Contract(COW_ADDRESS, ABI, signer);
const balance = await cowToken.balanceOf(address);

// Step 1: Preview burn output
const [bnbOut, spreadFee, burnFee] = 
  await cowToken.previewBurn(balance);
console.log('BNB to receive:', ethers.formatEther(bnbOut));
console.log('Spread fee (1%):', ethers.formatEther(spreadFee));
console.log('Burn fee (0.3%):', ethers.formatEther(burnFee));

// Step 2: Execute burn (returns BNB collateral)
const tx = await cowToken.burn(balance);
await tx.wait();
console.log('Burned! BNB returned. TX:', tx.hash);

// Position is now cleared
const [col, cow] = await cowToken.getPosition(address);
console.log('Position cleared:', col === 0n && cow === 0n);`,
    contract: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@chainlink/contracts/src/v0.8/shared/
  interfaces/AggregatorV3Interface.sol";

contract COWToken is ERC20, Ownable, 
  ReentrancyGuard, Pausable {

  // Collateral-backed: 1 COW = $1 USD
  struct CollateralPosition {
    uint256 collateralBNB;  // BNB deposited
    uint256 cowMinted;      // COW tokens minted
  }

  AggregatorV3Interface public priceFeed; // Chainlink
  uint256 public ltvBps = 8000;           // 80% LTV
  uint256 public liquidationThreshold = 10500; // 105%
  uint256 public constant LIQUIDATION_PENALTY_BPS = 500;
  
  mapping(address => CollateralPosition) public positions;

  // Anti-rug-pull: NO withdraw() or admin mint()
  // Collateral only leaves via burn() or liquidate()

  function mint() external payable { /* ... */ }
  function burn(uint256 amount) external { /* ... */ }
  function liquidate(address user) external { /* ... */ }
  function getCollateralRatio(address) public view
    returns (uint256) { /* ... */ }
}`,
};

interface SectionConfig {
    id: string;
    titleKey: string;
    accent: string;
    icon: ReactNode;
}

const sectionConfigs: SectionConfig[] = [
    {
        id: 'getting-started',
        titleKey: 'doc.gettingStarted',
        accent: 'purple',
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
    },
    {
        id: 'minting-tokens',
        titleKey: 'doc.mintingTokens',
        accent: 'green',
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>,
    },
    {
        id: 'burning-tokens',
        titleKey: 'doc.burningTokens',
        accent: 'red',
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" /><line x1="8" y1="12" x2="16" y2="12" /></svg>,
    },
    {
        id: 'smart-contracts',
        titleKey: 'doc.smartContracts',
        accent: 'cyan',
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>,
    },
    {
        id: 'network-support',
        titleKey: 'doc.networkSupport',
        accent: 'amber',
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>,
    },
    {
        id: 'video-demo',
        titleKey: 'doc.videoDemo',
        accent: 'red',
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>,
    },
    {
        id: 'faq',
        titleKey: 'doc.faqTitle',
        accent: 'purple',
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
    },
];

export default function DocumentPage() {
    const { t } = useTranslation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const faqKeys = ['faq1', 'faq2', 'faq3', 'faq4', 'faq5', 'faq6', 'faq7'];

    // Track scroll for header style change
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Close mobile menu on resize to desktop
    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth > 768) setMobileMenuOpen(false);
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileMenuOpen]);

    return (
        <div className="doc-page">
            {/* Header */}
            <header className={`doc-header${scrolled ? ' doc-header-scrolled' : ''}`}>
                <div className="doc-header-content">
                    <Link to="/" className="logo" onClick={() => setMobileMenuOpen(false)}>
                        <div className="logo-icon-wrapper">
                            <img src="/media/cow-log.png" alt="COW Logo" className="logo-img" />
                        </div>
                        <span className="logo-text">COW <span className="logo-accent">Stablecoin</span></span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="doc-desktop-nav">
                        <Link to="/" className="doc-nav-item">{t('header.features')}</Link>
                        <Link to="/wallet" className="doc-nav-item">{t('header.wallet', 'Wallet')}</Link>
                        <Link to="/docs" className="doc-nav-item doc-nav-item--active">{t('header.docs')}</Link>

                    </nav>

                    <div className="doc-header-right">
                        <LanguageSwitcher />
                        <Link to="/" className="back-to-app">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="19" y1="12" x2="5" y2="12" />
                                <polyline points="12 19 5 12 12 5" />
                            </svg>
                            {t('doc.backToApp')}
                        </Link>

                        {/* Mobile Hamburger */}
                        <button
                            className={`doc-hamburger${mobileMenuOpen ? ' is-active' : ''}`}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                            aria-expanded={mobileMenuOpen}
                        >
                            <span className="doc-hamburger-line" />
                            <span className="doc-hamburger-line" />
                            <span className="doc-hamburger-line" />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                <div
                    className={`doc-mobile-overlay${mobileMenuOpen ? ' is-open' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                />
                <nav className={`doc-mobile-nav${mobileMenuOpen ? ' is-open' : ''}`}>
                    <div className="doc-mobile-nav-links">
                        <Link to="/" className="doc-mobile-link" onClick={() => setMobileMenuOpen(false)}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                            </svg>
                            {t('header.features')}
                        </Link>
                        <Link to="/wallet" className="doc-mobile-link" onClick={() => setMobileMenuOpen(false)}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="1" y="3" width="22" height="18" rx="3" ry="3" />
                                <line x1="1" y1="9" x2="23" y2="9" />
                            </svg>
                            {t('header.wallet', 'Wallet')}
                        </Link>
                        <Link to="/docs" className="doc-mobile-link doc-mobile-link--active" onClick={() => setMobileMenuOpen(false)}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                            </svg>
                            {t('header.docs')}
                        </Link>

                    </div>
                </nav>
            </header>


            <div className="doc-layout">
                {/* Sidebar */}
                <aside className="doc-sidebar">
                    <nav className="doc-nav">
                        <span className="doc-nav-label">{t('doc.docBadge')}</span>
                        {sectionConfigs.map((section) => (
                            <a key={section.id} href={`#${section.id}`} className="doc-nav-link">
                                <span className={`doc-nav-icon doc-nav-icon--${section.accent}`}>
                                    {section.icon}
                                </span>
                                {t(section.titleKey)}
                            </a>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="doc-main">
                    {/* Hero */}
                    <div className="doc-hero">
                        <div className="doc-hero-badge">
                            <span className="badge-dot" />
                            {t('doc.docBadge')}
                        </div>
                        <h1 className="doc-hero-title">
                            {t('doc.heroTitle')} <span className="gradient-text">COW Stablecoin</span>
                        </h1>
                        <p className="doc-hero-desc">{t('doc.heroDesc')}</p>
                    </div>

                    {/* Getting Started */}
                    <section id="getting-started" className="doc-section">
                        <div className="doc-section-header">
                            <span className="doc-section-icon doc-section-icon--purple">{sectionConfigs[0].icon}</span>
                            <h2>{t('doc.gettingStarted')}</h2>
                        </div>
                        <div className="doc-block">
                            <h3 className="doc-subtitle">{t('doc.prerequisites')}</h3>
                            <p className="doc-text">{t('doc.prerequisitesText')}</p>
                            <div className="doc-code-wrapper">
                                <div className="doc-code-header">
                                    <span className="doc-code-dots"><span /><span /><span /></span>
                                    <span className="doc-code-lang">typescript</span>
                                </div>
                                <pre className="doc-code"><code>{codeBlocks.prerequisites}</code></pre>
                            </div>
                        </div>
                        <div className="doc-block">
                            <h3 className="doc-subtitle">{t('doc.connectWallet')}</h3>
                            <p className="doc-text">{t('doc.connectWalletText')}</p>
                        </div>
                    </section>

                    {/* Minting Tokens */}
                    <section id="minting-tokens" className="doc-section">
                        <div className="doc-section-header">
                            <span className="doc-section-icon doc-section-icon--green">{sectionConfigs[1].icon}</span>
                            <h2>{t('doc.mintingTokens')}</h2>
                        </div>
                        <div className="doc-block">
                            <h3 className="doc-subtitle">{t('doc.howMintingWorks')}</h3>
                            <p className="doc-text">{t('doc.howMintingWorksText')}</p>
                        </div>
                        <div className="doc-block">
                            <h3 className="doc-subtitle">{t('doc.stepsToMint')}</h3>
                            <p className="doc-text">{t('doc.stepsToMintText')}</p>
                            <div className="doc-code-wrapper">
                                <div className="doc-code-header">
                                    <span className="doc-code-dots"><span /><span /><span /></span>
                                    <span className="doc-code-lang">typescript</span>
                                </div>
                                <pre className="doc-code"><code>{codeBlocks.mint}</code></pre>
                            </div>
                        </div>
                    </section>

                    {/* Burning Tokens */}
                    <section id="burning-tokens" className="doc-section">
                        <div className="doc-section-header">
                            <span className="doc-section-icon doc-section-icon--red">{sectionConfigs[2].icon}</span>
                            <h2>{t('doc.burningTokens')}</h2>
                        </div>
                        <div className="doc-block">
                            <h3 className="doc-subtitle">{t('doc.whatIsBurning')}</h3>
                            <p className="doc-text">{t('doc.whatIsBurningText')}</p>
                        </div>
                        <div className="doc-block">
                            <h3 className="doc-subtitle">{t('doc.stepsToBurn')}</h3>
                            <p className="doc-text">{t('doc.stepsToBurnText')}</p>
                            <div className="doc-code-wrapper">
                                <div className="doc-code-header">
                                    <span className="doc-code-dots"><span /><span /><span /></span>
                                    <span className="doc-code-lang">typescript</span>
                                </div>
                                <pre className="doc-code"><code>{codeBlocks.burn}</code></pre>
                            </div>
                        </div>
                    </section>

                    {/* Smart Contracts */}
                    <section id="smart-contracts" className="doc-section">
                        <div className="doc-section-header">
                            <span className="doc-section-icon doc-section-icon--cyan">{sectionConfigs[3].icon}</span>
                            <h2>{t('doc.smartContracts')}</h2>
                        </div>
                        <div className="doc-block">
                            <h3 className="doc-subtitle">{t('doc.contractArch')}</h3>
                            <p className="doc-text">{t('doc.contractArchText')}</p>
                            <div className="doc-code-wrapper">
                                <div className="doc-code-header">
                                    <span className="doc-code-dots"><span /><span /><span /></span>
                                    <span className="doc-code-lang">solidity</span>
                                </div>
                                <pre className="doc-code"><code>{codeBlocks.contract}</code></pre>
                            </div>
                        </div>
                        <div className="doc-block">
                            <h3 className="doc-subtitle">{t('doc.auditSecurity')}</h3>
                            <p className="doc-text">{t('doc.auditSecurityText')}</p>
                        </div>
                    </section>

                    {/* Network Support */}
                    <section id="network-support" className="doc-section">
                        <div className="doc-section-header">
                            <span className="doc-section-icon doc-section-icon--amber">{sectionConfigs[4].icon}</span>
                            <h2>{t('doc.networkSupport')}</h2>
                        </div>
                        <div className="doc-block">
                            <p className="doc-text">{t('doc.supportedNetworksText')}</p>
                        </div>
                        <div className="network-table-wrapper">
                            <table className="network-table">
                                <thead>
                                    <tr>
                                        <th>{t('doc.networkName')}</th>
                                        <th>{t('doc.chainId')}</th>
                                        <th>RPC URL</th>
                                        <th>Explorer</th>
                                        <th>{t('doc.statusLabel')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {networks.map((net) => (
                                        <tr key={net.chainId}>
                                            <td className="net-name">{net.name}</td>
                                            <td><code>{net.chainId}</code></td>
                                            <td><code className="rpc-url">{net.rpcUrl}</code></td>
                                            <td>
                                                <a href={`https://${net.explorer}`} target="_blank" rel="noopener noreferrer" className="explorer-link">
                                                    {net.explorer}
                                                </a>
                                            </td>
                                            <td>
                                                <span className={`net-status net-status--${net.status}`}>
                                                    <span className="status-dot" />
                                                    {net.status === 'live' ? t('doc.live') : t('doc.testnet')}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="doc-block">
                            <h3 className="doc-subtitle">{t('doc.bscFaucetTitle')}</h3>
                            <p className="doc-text">{t('doc.bscFaucetText')}</p>
                            <a href="https://www.bnbchain.org/en/testnet-faucet" target="_blank" rel="noopener noreferrer" className="doc-link-btn">
                                BSC Testnet Faucet →
                            </a>
                        </div>
                    </section>

                    {/* Video Demo */}
                    <section id="video-demo" className="doc-section">
                        <div className="doc-section-header">
                            <span className="doc-section-icon doc-section-icon--red">{sectionConfigs[5].icon}</span>
                            <h2>{t('doc.videoDemo', 'Video Demo')}</h2>
                        </div>
                        <div className="doc-block">
                            <h3 className="doc-subtitle">{t('doc.videoDemoTitle', 'Xem hướng dẫn sử dụng DApp')}</h3>
                            <p className="doc-text">{t('doc.videoDemoDesc', 'Video hướng dẫn chi tiết cách kết nối ví, đúc token, đốt token và quản lý tài sản trên COW Stablecoin.')}</p>
                        </div>
                        <div className="doc-video-container">
                            <iframe
                                src="https://drive.google.com/file/d/1qJiXEuo3suqJtf7nhc71kGgWeh82R5Dt/preview"
                                title={t('doc.videoDemo', 'Video Demo')}
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                                className="doc-video-iframe"
                            />
                        </div>
                    </section>

                    {/* FAQ */}
                    <section id="faq" className="doc-section">
                        <div className="doc-section-header">
                            <span className="doc-section-icon doc-section-icon--purple">{sectionConfigs[6].icon}</span>
                            <h2>{t('doc.faqTitle')}</h2>
                        </div>
                        <div className="faq-list">
                            {faqKeys.map((key) => (
                                <details key={key} className="faq-item">
                                    <summary className="faq-question">
                                        <span>{t(`doc.${key}Q`)}</span>
                                        <svg className="faq-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="6 9 12 15 18 9" />
                                        </svg>
                                    </summary>
                                    <p className="faq-answer">{t(`doc.${key}A`)}</p>
                                </details>
                            ))}
                        </div>
                    </section>
                </main>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}
