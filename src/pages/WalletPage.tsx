import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useWalletContext } from '../hooks/WalletContext';
import { useCOWContract } from '../hooks/useCOWContract';
import { WalletButton } from '../components/WalletButton';
import { NetworkSwitcher } from '../components/NetworkSwitcher';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { ParticleBackground } from '../components/ParticleBackground';
import { getNetworkConfig, getNativeCurrency } from '../config/networks';
import { ChainLogo } from '../components/ChainLogo';
import { Footer } from '../components/Footer';
import { toast } from 'react-toastify';
import './WalletPage.css';

interface TokenInfo {
    symbol: string;
    name: string;
    balance: string;
    icon: React.ReactNode;
    contractAddress: string | null;
    type: 'native' | 'erc20';
    explorerUrl: string | null;
}

function WalletPage() {
    const { t } = useTranslation();
    const {
        wallet,
        isConnecting,
        connectWallet,
        disconnectWallet,
        switchNetwork,
        shortenAddress,
        getNetworkName,
    } = useWalletContext();

    const cowContract = useCOWContract(
        wallet.provider,
        wallet.chainId ?? null,
        wallet.address,
    );

    const [selectedChainId, setSelectedChainId] = useState<string>('0x61');
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [copiedAddr, setCopiedAddr] = useState<string | null>(null);

    const effectiveChainId = wallet.isConnected ? (wallet.chainId ?? selectedChainId) : selectedChainId;

    const handleNetworkSelect = useCallback((chainId: string) => {
        setSelectedChainId(chainId);
        if (wallet.isConnected) {
            switchNetwork(chainId);
            toast.info(`🔄 Switching to ${getNetworkName(chainId)}...`);
        }
    }, [wallet.isConnected, switchNetwork, getNetworkName]);

    const handleConnect = useCallback(async () => {
        try {
            await connectWallet();
            toast.success('🦊 Wallet connected successfully!');
        } catch {
            toast.error('❌ Failed to connect wallet');
        }
    }, [connectWallet]);

    const handleDisconnect = useCallback(() => {
        disconnectWallet();
        toast.info('👋 Wallet disconnected');
    }, [disconnectWallet]);

    useEffect(() => {
        if (wallet.isConnected && wallet.chainId && wallet.chainId !== selectedChainId) {
            switchNetwork(selectedChainId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wallet.isConnected]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth > 768) setMobileMenuOpen(false);
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileMenuOpen]);

    const handleCopyAddress = useCallback((address: string) => {
        navigator.clipboard.writeText(address).then(() => {
            setCopiedAddr(address);
            toast.success('📋 Address copied!');
            setTimeout(() => setCopiedAddr(null), 2000);
        });
    }, []);

    // Build token list
    const networkConfig = getNetworkConfig(wallet.chainId ?? null);
    const nativeCurrency = getNativeCurrency(wallet.chainId ?? null);

    const tokens: TokenInfo[] = [];

    if (wallet.isConnected) {
        // Native token
        tokens.push({
            symbol: nativeCurrency,
            name: networkConfig?.currency.name ?? 'Native Token',
            balance: wallet.balance ?? '0',
            icon: (
                <div className="token-icon-native">
                    <ChainLogo chainId={wallet.chainId ?? null} size={28} />
                </div>
            ),
            contractAddress: null,
            type: 'native',
            explorerUrl: networkConfig ? `${networkConfig.blockExplorerUrl}/address/${wallet.address}` : null,
        });

        // COW token (only if supported on current chain)
        if (cowContract.isSupported) {
            tokens.push({
                symbol: 'COW',
                name: 'COW Token',
                balance: cowContract.cowBalance,
                icon: (
                    <div className="token-icon-cow">
                        <span className="token-emoji">🐮</span>
                    </div>
                ),
                contractAddress: cowContract.contractAddress,
                type: 'erc20',
                explorerUrl: cowContract.contractAddress && networkConfig
                    ? `${networkConfig.blockExplorerUrl}/token/${cowContract.contractAddress}?a=${wallet.address}`
                    : null,
            });
        }
    }

    const formatBalance = (balance: string) => {
        const num = parseFloat(balance);
        if (num === 0) return '0.00';
        if (num < 0.0001) return '< 0.0001';
        if (num < 1) return num.toFixed(6);
        if (num < 1000) return num.toFixed(4);
        if (num < 1000000) return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
        return (num / 1000000).toFixed(2) + 'M';
    };

    return (
        <div className="app">
            <ParticleBackground />
            <div className="bg-effects">
                <div className="gradient-orb orb-1" />
                <div className="gradient-orb orb-2" />
                <div className="gradient-orb orb-3" />
                <div className="noise-overlay" />
            </div>

            {/* Header */}
            <header className={`app-header${scrolled ? ' header-scrolled' : ''}`}>
                <div className="header-content">
                    <Link to="/" className="logo" onClick={() => setMobileMenuOpen(false)}>
                        <div className="logo-icon-wrapper">
                            <img src="/logo.png" alt="COW Stablecoin Logo" className="logo-img" />
                        </div>
                        <span className="logo-text">COW <span className="logo-accent">Stablecoin</span></span>
                    </Link>

                    <nav className="header-nav desktop-nav">
                        <a href="/#features" className="nav-link">{t('header.features')}</a>
                        <Link to="/wallet" className="nav-link nav-link-active">{t('header.wallet', 'Wallet')}</Link>
                        <Link to="/docs" className="nav-link">{t('header.docs')}</Link>

                    </nav>

                    <div className="header-actions">
                        <NetworkSwitcher
                            currentChainId={effectiveChainId}
                            onSwitchNetwork={handleNetworkSelect}
                        />
                        <LanguageSwitcher />
                        <div className="desktop-wallet">
                            <WalletButton
                                wallet={wallet}
                                isConnecting={isConnecting}
                                onConnect={handleConnect}
                                onDisconnect={handleDisconnect}
                                shortenAddress={shortenAddress}
                                getNetworkName={getNetworkName}
                            />
                        </div>

                        <button
                            className={`hamburger${mobileMenuOpen ? ' is-active' : ''}`}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                            aria-expanded={mobileMenuOpen}
                        >
                            <span className="hamburger-line" />
                            <span className="hamburger-line" />
                            <span className="hamburger-line" />
                        </button>
                    </div>
                </div>

                <div
                    className={`mobile-overlay${mobileMenuOpen ? ' is-open' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                />
                <nav className={`mobile-nav${mobileMenuOpen ? ' is-open' : ''}`}>
                    <div className="mobile-nav-links">
                        <a href="/#features" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                            </svg>
                            {t('header.features')}
                        </a>
                        <Link to="/wallet" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="1" y="3" width="22" height="18" rx="3" ry="3" />
                                <line x1="1" y1="9" x2="23" y2="9" />
                            </svg>
                            {t('header.wallet', 'Wallet')}
                        </Link>
                        <Link to="/docs" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                            </svg>
                            {t('header.docs')}
                        </Link>
                    </div>
                    <div className="mobile-wallet">
                        <WalletButton
                            wallet={wallet}
                            isConnecting={isConnecting}
                            onConnect={() => { handleConnect(); setMobileMenuOpen(false); }}
                            onDisconnect={() => { handleDisconnect(); setMobileMenuOpen(false); }}
                            shortenAddress={shortenAddress}
                            getNetworkName={getNetworkName}
                        />
                    </div>
                </nav>
            </header>

            {/* Main Content */}
            <main className="wallet-main">
                {/* Page Header */}
                <div className="wallet-page-header">
                    <div className="wallet-page-badge">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="1" y="3" width="22" height="18" rx="3" ry="3" />
                            <line x1="1" y1="9" x2="23" y2="9" />
                        </svg>
                        <span>{t('wallet.badge', 'Portfolio')}</span>
                    </div>
                    <h1 className="wallet-page-title">{t('wallet.title', 'My Wallet')}</h1>
                    <p className="wallet-page-desc">
                        {t('wallet.description', 'View your token balances and manage your assets')}
                    </p>
                </div>

                {!wallet.isConnected ? (
                    /* Not Connected State */
                    <div className="wallet-connect-prompt">
                        <div className="connect-prompt-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="1" y="3" width="22" height="18" rx="3" ry="3" />
                                <line x1="1" y1="9" x2="23" y2="9" />
                                <circle cx="18" cy="15" r="2" />
                            </svg>
                        </div>
                        <h2>{t('wallet.connectTitle', 'Connect Your Wallet')}</h2>
                        <p>{t('wallet.connectDesc', 'Connect MetaMask to view your token balances and portfolio')}</p>
                        <button className="wallet-connect-btn" onClick={handleConnect} disabled={isConnecting}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="1" y="3" width="22" height="18" rx="3" ry="3" />
                                <line x1="1" y1="9" x2="23" y2="9" />
                            </svg>
                            {isConnecting ? t('wallet.connecting', 'Connecting...') : t('wallet.connectWallet', 'Connect MetaMask')}
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Wallet Overview Card */}
                        <div className="wallet-overview">
                            <div className="wallet-overview-header">
                                <div className="wallet-avatar">
                                    <img src="/media/cow_sp.gif" alt="avatar" className="wallet-avatar-img" />
                                </div>
                                <div className="wallet-meta">
                                    <div className="wallet-address-display">
                                        <code>{shortenAddress(wallet.address!)}</code>
                                        <button
                                            className={`wallet-copy-btn${copiedAddr === wallet.address ? ' copied' : ''}`}
                                            onClick={() => handleCopyAddress(wallet.address!)}
                                            title="Copy full address"
                                        >
                                            {copiedAddr === wallet.address ? (
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            ) : (
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    <span className="wallet-network-label">
                                        <ChainLogo chainId={wallet.chainId ?? null} size={14} />
                                        {getNetworkName(wallet.chainId)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Token List */}
                        <div className="token-list-section">
                            <div className="token-list-header">
                                <h2>{t('wallet.tokens', 'Tokens')}</h2>
                                <span className="token-count">{tokens.length} {t('wallet.assets', 'assets')}</span>
                            </div>

                            <div className="token-list">
                                {tokens.map((token) => (
                                    <div className="token-row" key={`${token.type}-${token.symbol}`}>
                                        <div className="token-row-left">
                                            {token.icon}
                                            <div className="token-info">
                                                <span className="token-symbol">{token.symbol}</span>
                                                <span className="token-name">{token.name}</span>
                                            </div>
                                        </div>
                                        <div className="token-row-right">
                                            <span className="token-balance">{formatBalance(token.balance)}</span>
                                            <div className="token-actions">
                                                {token.contractAddress && (
                                                    <button
                                                        className={`token-action-btn${copiedAddr === token.contractAddress ? ' copied' : ''}`}
                                                        onClick={() => handleCopyAddress(token.contractAddress!)}
                                                        title="Copy contract address"
                                                    >
                                                        {copiedAddr === token.contractAddress ? (
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                <polyline points="20 6 9 17 4 12" />
                                                            </svg>
                                                        ) : (
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                )}
                                                {token.explorerUrl && (
                                                    <a
                                                        href={token.explorerUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="token-action-btn"
                                                        title="View on Explorer"
                                                    >
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                                            <polyline points="15 3 21 3 21 9" />
                                                            <line x1="10" y1="14" x2="21" y2="3" />
                                                        </svg>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {tokens.length === 0 && (
                                    <div className="token-empty">
                                        <p>{t('wallet.noTokens', 'No tokens found on this network')}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* COW Contract Details (if supported) */}
                        {cowContract.isSupported && (
                            <div className="cow-details-section">
                                <div className="token-list-header">
                                    <h2>🐮 {t('wallet.cowDetails', 'COW Token Details')}</h2>
                                </div>
                                <div className="cow-stats-grid">
                                    <div className="cow-stat-card">
                                        <span className="cow-stat-label">{t('wallet.totalSupply', 'Total Supply')}</span>
                                        <span className="cow-stat-value">{formatBalance(cowContract.totalSupply)} COW</span>
                                    </div>
                                    <div className="cow-stat-card">
                                        <span className="cow-stat-label">{t('wallet.totalCollateral', 'Treasury')}</span>
                                        <span className="cow-stat-value">{formatBalance(cowContract.totalCollateral)} {nativeCurrency}</span>
                                    </div>
                                    <div className="cow-stat-card">
                                        <span className="cow-stat-label">{t('wallet.backingRatio', 'Backing Ratio')}</span>
                                        <span className="cow-stat-value">{cowContract.backingRatio}x</span>
                                    </div>
                                    <div className="cow-stat-card">
                                        <span className="cow-stat-label">{t('wallet.mintFee', 'Mint Fee')}</span>
                                        <span className="cow-stat-value">{(cowContract.mintFeeBps / 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="cow-stat-card">
                                        <span className="cow-stat-label">{t('wallet.burnFee', 'Burn Fee')}</span>
                                        <span className="cow-stat-value">{(cowContract.burnFeeBps / 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="cow-stat-card">
                                        <span className="cow-stat-label">{t('wallet.status', 'Status')}</span>
                                        <span className={`cow-stat-value ${cowContract.isPaused ? 'status-paused' : 'status-active'}`}>
                                            {cowContract.isPaused ? '⏸ Paused' : '✅ Active'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
}

export default WalletPage;
