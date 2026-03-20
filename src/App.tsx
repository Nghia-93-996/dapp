import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useWalletContext } from './hooks/WalletContext';
import { useCOWContract } from './hooks/useCOWContract';
import { useCOWPrice } from './hooks/useCOWPrice';
import { useTransactionHistory } from './hooks/useTransactionHistory';
import { toast } from 'react-toastify';
import { WalletButton } from './components/WalletButton';
import { WalletStats } from './components/WalletStats';
import { ActionPanel } from './components/ActionPanel';
import { NetworkSwitcher } from './components/NetworkSwitcher';
import { ParticleBackground } from './components/ParticleBackground';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { TreasuryDashboard } from './components/TreasuryDashboard';
import { TransactionHistory } from './components/TransactionHistory';
import { ContractInfo } from './components/ContractInfo';
import { Footer } from './components/Footer';
import './App.css';

function App() {
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

  const { cowPriceUsd } = useCOWPrice();

  const txHistory = useTransactionHistory(
    wallet.provider,
    wallet.chainId ?? null,
  );

  // Track the user-selected network (default BSC Testnet for COW)
  const [selectedChainId, setSelectedChainId] = useState<string>('0x61');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Effective chain: use wallet chain when connected, selected chain otherwise
  const effectiveChainId = wallet.isConnected ? (wallet.chainId ?? selectedChainId) : selectedChainId;

  // Handle network selection from the dropdown
  const handleNetworkSelect = useCallback((chainId: string) => {
    setSelectedChainId(chainId);
    if (wallet.isConnected) {
      switchNetwork(chainId);
      toast.info(`🔄 Switching to ${getNetworkName(chainId)}...`);
    }
  }, [wallet.isConnected, switchNetwork, getNetworkName]);

  // Connect wallet and automatically switch to selected network
  const handleConnect = useCallback(async () => {
    try {
      await connectWallet();
      toast.success('🦊 Wallet connected successfully!');
    } catch {
      toast.error('❌ Failed to connect wallet');
    }
  }, [connectWallet]);

  // Disconnect wallet with toast
  const handleDisconnect = useCallback(() => {
    disconnectWallet();
    toast.info('👋 Wallet disconnected');
  }, [disconnectWallet]);

  // Auto-switch to selected network after wallet connects
  useEffect(() => {
    if (wallet.isConnected && wallet.chainId && wallet.chainId !== selectedChainId) {
      switchNetwork(selectedChainId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet.isConnected]);

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
    <div className="app">
      {/* Animated Backgrounds */}
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
              <img src="/media/cow_sp.gif" alt="COW Logo" className="logo-img" />
            </div>
            <span className="logo-text">COW <span className="logo-accent">Stablecoin</span></span>
          </Link>

          {/* Desktop Nav */}
          <nav className="header-nav desktop-nav">
            <a href="#features" className="nav-link">{t('header.features')}</a>
            <Link to="/wallet" className="nav-link">{t('header.wallet', 'Wallet')}</Link>
            <Link to="/docs" className="nav-link">{t('header.docs')}</Link>
            <Link to="/admin" className="nav-link">{t('header.admin')}</Link>
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

            {/* Mobile Hamburger */}
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

        {/* Mobile Menu Overlay */}
        <div
          className={`mobile-overlay${mobileMenuOpen ? ' is-open' : ''}`}
          onClick={() => setMobileMenuOpen(false)}
        />
        <nav className={`mobile-nav${mobileMenuOpen ? ' is-open' : ''}`}>
          <div className="mobile-nav-links">
            <a href="#features" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
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
      <main className="app-main">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-badge">
            <span className="badge-dot" />
            <span>{t('hero.badge')}</span>
            <span className="badge-version">{t('hero.badgeVersion')}</span>
          </div>

          <h1 className="hero-title">
            <span className="title-line">{t('hero.titleLine1')}</span>
            <span className="title-gradient">{t('hero.titleLine2')}</span>
          </h1>

          <p className="hero-description">
            {t('hero.description')}
          </p>

          {!wallet.isConnected && (
            <div className="hero-actions">
              <button className="hero-cta" onClick={handleConnect} disabled={isConnecting}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="22" height="18" rx="3" ry="3" />
                  <line x1="1" y1="9" x2="23" y2="9" />
                </svg>
                {isConnecting ? t('hero.connecting') : t('hero.connectMetaMask')}
              </button>
              <Link to="/docs" className="hero-secondary">
                {t('hero.learnMore')}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          )}

          {/* Exchange Rates Bar */}
          {(() => {
            const price = parseFloat(cowContract.bnbPrice || '0');
            const ltv = cowContract.ltvBps || 0;
            const spread = cowContract.spreadBps || 0;
            const mintFee = cowContract.mintFeeBps || 0;
            const burnFee = cowContract.burnFeeBps || 0;
            const hasRates = price > 0 && ltv > 0;

            // Mint: 1 BNB → X COW (net after spread + mint fee)
            const cowPerBnb = hasRates
              ? price * ltv / 10000 * (1 - spread / 10000) * (1 - mintFee / 10000)
              : 0;
            // Burn: 1 COW → Y BNB (net after spread + burn fee)
            const bnbPerCow = hasRates
              ? (1 / (price * ltv / 10000)) * (1 - spread / 10000) * (1 - burnFee / 10000)
              : 0;

            return (
              <div className="hero-rates">
                <div className="hero-rate mint-rate">
                  <div className="rate-icon mint-rate-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="16" />
                      <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                  </div>
                  <div className="rate-info">
                    <span className="rate-label">{t('hero.mintRate', 'Mint Rate')}</span>
                    <span className="rate-value">
                      1 BNB → <strong>{hasRates ? cowPerBnb.toFixed(2) : '—'}</strong> COW
                    </span>
                  </div>
                </div>

                <div className="rate-divider" />

                <div className="hero-rate burn-rate">
                  <div className="rate-icon burn-rate-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22c-4.97 0-9-2.69-9-6v-.5c0-2.49 2-4.5 4.5-4.5.88 0 1.7.25 2.39.68.42.26.85.54 1.11.82V8a4 4 0 0 1 8 0v2c0 .55-.45 1-1 1s-1-.45-1-1V8a2 2 0 0 0-4 0v4.5c.67-.53 1.51-.86 2.41-.86 2.21 0 4.09 1.63 4.59 3.86.5 2.23-.88 4.57-3 5.5H12z" />
                    </svg>
                  </div>
                  <div className="rate-info">
                    <span className="rate-label">{t('hero.burnRate', 'Burn Rate')}</span>
                    <span className="rate-value">
                      1 COW → <strong>{hasRates ? bnbPerCow.toFixed(6) : '—'}</strong> BNB
                    </span>
                  </div>
                </div>

                <div className="rate-divider" />

                <div className="hero-rate bnb-rate">
                  <div className="rate-icon bnb-rate-icon">
                    <span className="bnb-logo">🟡</span>
                  </div>
                  <div className="rate-info">
                    <span className="rate-label">BNB/USD</span>
                    <span className="rate-value">
                      <strong>{hasRates ? `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}</strong>
                    </span>
                  </div>
                </div>

                <div className="rate-divider" />

                <div className="hero-rate cow-rate">
                  <div className="rate-icon cow-rate-icon">
                    <span className="cow-logo">🐄</span>
                  </div>
                  <div className="rate-info">
                    <span className="rate-label">COW/USD</span>
                    <span className="rate-value">
                      <strong>${cowPriceUsd.toFixed(4)}</strong>
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}
        </section>

        {/* Wallet Stats */}
        {wallet.isConnected && (
          <WalletStats
            balance={wallet.balance}
            chainId={wallet.chainId}
            address={wallet.address}
            getNetworkName={getNetworkName}
            cowBalance={cowContract.cowBalance}
            cowPriceUsd={cowPriceUsd}
          />
        )}

        {/* Action Panel */}
        <ActionPanel
          provider={wallet.provider}
          isConnected={wallet.isConnected}
          chainId={wallet.chainId}
          mintCOW={cowContract.mintCOW}
          burnCOW={cowContract.burnCOW}
          previewMint={cowContract.previewMint}
          previewBurn={cowContract.previewBurn}
          cowBalance={cowContract.cowBalance}
          userPosition={cowContract.userPosition}
          bnbPrice={cowContract.bnbPrice}
          ltvBps={cowContract.ltvBps}
          spreadBps={cowContract.spreadBps}
          mintFeeBps={cowContract.mintFeeBps}
          burnFeeBps={cowContract.burnFeeBps}
          bnbBalance={wallet.balance}
          cowPriceUsd={cowPriceUsd}
          onTransactionComplete={() => { cowContract.refresh(); txHistory.refresh(); }}
        />

        {/* Treasury Dashboard */}
        {wallet.isConnected && (
          <TreasuryDashboard cowState={cowContract} chainId={wallet.chainId ?? null} cowPriceUsd={cowPriceUsd} />
        )}

        {/* Transaction History */}
        {wallet.isConnected && (
          <TransactionHistory
            transactions={txHistory.transactions}
            isLoading={txHistory.isLoading}
            chainId={wallet.chainId ?? null}
          />
        )}

        {/* How It Works */}
        <section className="how-it-works" id="features">
          <div className="section-header">
            <span className="section-badge">{t('howItWorks.badge')}</span>
            <h2 className="section-title">{t('howItWorks.title')}</h2>
            <p className="section-desc">{t('howItWorks.description')}</p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <div className="step-icon step-icon-1">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="22" height="18" rx="3" ry="3" />
                  <line x1="1" y1="9" x2="23" y2="9" />
                </svg>
              </div>
              <h3>{t('howItWorks.step1Title')}</h3>
              <p>{t('howItWorks.step1Desc')}</p>
            </div>

            <div className="step-connector">
              <svg width="40" height="2" viewBox="0 0 40 2">
                <line x1="0" y1="1" x2="40" y2="1" stroke="rgba(139,92,246,0.3)" strokeWidth="2" strokeDasharray="4 4" />
              </svg>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <div className="step-icon step-icon-2">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              </div>
              <h3>{t('howItWorks.step2Title')}</h3>
              <p>{t('howItWorks.step2Desc')}</p>
            </div>

            <div className="step-connector">
              <svg width="40" height="2" viewBox="0 0 40 2">
                <line x1="0" y1="1" x2="40" y2="1" stroke="rgba(6,182,212,0.3)" strokeWidth="2" strokeDasharray="4 4" />
              </svg>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <div className="step-icon step-icon-3">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h3>{t('howItWorks.step3Title')}</h3>
              <p>{t('howItWorks.step3Desc')}</p>
            </div>
          </div>
        </section>

        {/* Smart Contracts */}
        <ContractInfo />

        {/* Token Info — Important Notes */}
        <section className="token-info-section" id="token-info">
          <div className="section-header">
            <span className="section-badge token-info-badge">{t('tokenInfo.badge')}</span>
            <h2 className="section-title">{t('tokenInfo.title')}</h2>
            <p className="section-desc">{t('tokenInfo.description')}</p>
          </div>

          <div className="token-info-grid">
            {/* Treasury 1 */}
            <div className="token-info-card token-info-treasury">
              <div className="token-info-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="m7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h3>{t('tokenInfo.treasury1Title')}</h3>
              <p>{t('tokenInfo.treasury1Desc')}</p>
            </div>

            {/* Spread */}
            <div className="token-info-card token-info-spread">
              <div className="token-info-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <h3>{t('tokenInfo.spreadTitle')}</h3>
              <p>{t('tokenInfo.spreadDesc')}</p>
            </div>

            {/* Mint Fee */}
            <div className="token-info-card token-info-mint">
              <div className="token-info-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              </div>
              <h3>{t('tokenInfo.mintFeeTitle')}</h3>
              <p>{t('tokenInfo.mintFeeDesc')}</p>
            </div>

            {/* Burn Fee */}
            <div className="token-info-card token-info-burn">
              <div className="token-info-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <h3>{t('tokenInfo.burnFeeTitle')}</h3>
              <p>{t('tokenInfo.burnFeeDesc')}</p>
            </div>

            {/* Fee Collection Note */}
            <div className="token-info-card token-info-fee-note">
              <div className="token-info-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <h3>{t('tokenInfo.feeNoteTitle')}</h3>
              <p>{t('tokenInfo.feeNoteDesc')}</p>
            </div>
          </div>

          {/* Anti-Rug-Pull Guarantees */}
          <div className="token-info-guarantees">
            <div className="guarantee-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>{t('tokenInfo.noAdminWithdraw')}</span>
            </div>
            <div className="guarantee-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>{t('tokenInfo.noAdminMint')}</span>
            </div>
            <div className="guarantee-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>{t('tokenInfo.publicSourceCode')}</span>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="features">
          <div className="feature">
            <div className="feature-icon feature-icon-1">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="m7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h3>{t('features.securityTitle')}</h3>
            <p>{t('features.securityDesc')}</p>
          </div>
          <div className="feature">
            <div className="feature-icon feature-icon-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <h3>{t('features.speedTitle')}</h3>
            <p>{t('features.speedDesc')}</p>
          </div>
          <div className="feature">
            <div className="feature-icon feature-icon-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <h3>{t('features.multiChainTitle')}</h3>
            <p>{t('features.multiChainDesc')}</p>
          </div>
          <div className="feature">
            <div className="feature-icon feature-icon-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <h3>{t('features.openTitle')}</h3>
            <p>{t('features.openDesc')}</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
