import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWalletContext } from '../hooks/WalletContext';
import { useCOWContract } from '../hooks/useCOWContract';
import { useAdminContract } from '../hooks/useAdminContract';
import { useCOWPrice } from '../hooks/useCOWPrice';
import type { TimelockOp } from '../hooks/useAdminContract';
import { toast } from 'react-toastify';
import { WalletButton } from '../components/WalletButton';
import { NetworkSwitcher } from '../components/NetworkSwitcher';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { ParticleBackground } from '../components/ParticleBackground';
import { Footer } from '../components/Footer';
import '../App.css';
import './AdminPage.css';

/* ─── Helper: shorten address ──────────────────────── */
function shortenAddr(addr: string): string {
  if (!addr) return '—';
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

/* ─── Helper: format countdown ─────────────────────── */
function formatCountdown(executeAfter: number): string {
  const remaining = executeAfter - Date.now();
  if (remaining <= 0) return 'Ready!';
  const hours = Math.floor(remaining / 3_600_000);
  const mins = Math.floor((remaining % 3_600_000) / 60_000);
  const secs = Math.floor((remaining % 60_000) / 1_000);
  if (hours > 0) return `${hours}h ${mins}m`;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
}

/* ─── Helper: friendly function name ───────────────── */
function friendlyName(fn: string): string {
  const map: Record<string, string> = {
    setMintFee: 'Set Mint Fee',
    setBurnFee: 'Set Burn Fee',
    setSpreadBps: 'Set Spread Fee',
    setLtv: 'Set LTV',
    setLiquidationThreshold: 'Set Liquidation Threshold',
    setFeeCollector: 'Set Fee Collector',
    setTreasury2: 'Set Treasury 2',
    setPriceFeed: 'Set Price Feed',
    setCOWPrice: 'Set COW Price',
    pause: 'Pause Contract',
    unpause: 'Unpause Contract',
  };
  return map[fn] || fn;
}

/* ─── Sub-component: BPS Field Card ────────────────── */
function BpsCard({
  title, desc, current, max, onSubmit, disabled,
}: {
  title: string; desc: string; current: number; max: number;
  onSubmit: (val: number) => Promise<string>; disabled: boolean;
}) {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const v = parseInt(value, 10);
    if (isNaN(v) || v < 0 || v > max) {
      toast.error(`Value must be 0–${max} bps`);
      return;
    }
    setLoading(true);
    try {
      const hash = await onSubmit(v);
      toast.success(`⏳ Scheduled via Timelock! TX: ${hash.slice(0, 10)}…`);
      setValue('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Transaction failed';
      toast.error(`❌ ${msg.length > 80 ? msg.slice(0, 80) + '…' : msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <span className="admin-card-title">{title}</span>
        <span className="admin-card-current">{current} bps ({(current / 100).toFixed(2)}%)</span>
      </div>
      <p className="admin-card-desc">{desc}</p>
      <div className="admin-input-group">
        <input
          type="number"
          className="admin-input"
          placeholder={`0–${max}`}
          value={value}
          onChange={e => setValue(e.target.value)}
          min={0}
          max={max}
          disabled={disabled || loading}
        />
        <span className="admin-input-suffix">bps</span>
        <button
          className="admin-btn"
          onClick={handleSubmit}
          disabled={disabled || loading || !value}
        >
          {loading ? <span className="spinner" /> : '⏳ Schedule'}
        </button>
      </div>
    </div>
  );
}

/* ─── Sub-component: COW Price Card ────────────────── */
function PriceCard({
  title, desc, currentOnChain, onSubmit, disabled,
}: {
  title: string; desc: string; currentOnChain: string;
  onSubmit: (priceRaw: bigint) => Promise<string>; disabled: boolean;
}) {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const { cowPriceUsd: apiPrice, isLoading: apiLoading, error: apiError, lastUpdated, refresh: refreshApiPrice } = useCOWPrice();

  const handleUseApiPrice = () => {
    setValue(apiPrice.toFixed(4));
  };

  const handleSubmit = async () => {
    const v = parseFloat(value);
    if (isNaN(v) || v <= 0) {
      toast.error('Price must be a positive number (e.g., 1.0012)');
      return;
    }
    setLoading(true);
    try {
      const price8Decimals = BigInt(Math.round(v * 1e8));
      const hash = await onSubmit(price8Decimals);
      toast.success(`✅ Price updated! TX: ${hash.slice(0, 10)}…`);
      setValue('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Transaction failed';
      toast.error(`❌ ${msg.length > 80 ? msg.slice(0, 80) + '…' : msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <span className="admin-card-title">{title}</span>
        <span className="admin-card-current" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ color: '#60a5fa' }}>🔗 On-chain: <strong>${parseFloat(currentOnChain).toFixed(4)}</strong></span>
          <span style={{ color: '#a78bfa' }}>
            API: {apiLoading ? '…' : apiError ? '❌ Error' : `$${apiPrice.toFixed(4)}`}
          </span>
        </span>
      </div>
      <p className="admin-card-desc">{desc}</p>

      {/* Live API Price Info */}
      <div className="price-api-info" style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 12px', borderRadius: 8,
        background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.15)',
        marginBottom: 12, fontSize: '0.82rem',
      }}>
        <span style={{ color: '#a78bfa' }}>📡</span>
        <span style={{ color: 'rgba(255,255,255,0.7)', flex: 1 }}>
          Live from API: <strong style={{ color: apiError ? '#f87171' : '#34d399' }}>
            {apiLoading ? 'Loading…' : apiError ? apiError : `$${apiPrice.toFixed(4)}`}
          </strong>
          {lastUpdated && (
            <span style={{ marginLeft: 8, color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
              ({lastUpdated.toLocaleTimeString()})
            </span>
          )}
        </span>
        <button
          className="admin-btn small"
          onClick={refreshApiPrice}
          disabled={apiLoading}
          style={{ padding: '4px 10px', fontSize: '0.75rem' }}
        >
          🔄 Refresh
        </button>
        <button
          className="admin-btn small"
          onClick={handleUseApiPrice}
          disabled={apiLoading || !!apiError}
          style={{ padding: '4px 10px', fontSize: '0.75rem', background: 'rgba(52, 211, 153, 0.2)', borderColor: 'rgba(52, 211, 153, 0.3)' }}
        >
          ⬇ Use This Price
        </button>
      </div>

      <div className="admin-input-group">
        <span className="admin-input-prefix">$</span>
        <input
          type="number"
          className="admin-input"
          placeholder="1.0012"
          value={value}
          onChange={e => setValue(e.target.value)}
          step="0.0001"
          min={0}
          disabled={disabled || loading}
        />
        <span className="admin-input-suffix">USD</span>
        <button
          className="admin-btn"
          onClick={handleSubmit}
          disabled={disabled || loading || !value}
        >
          {loading ? <span className="spinner" /> : '🚀 Update Now'}
        </button>
      </div>
    </div>
  );
}

/* ─── Sub-component: Address Field Card ────────────── */
function AddressCard({
  title, desc, current, onSubmit, disabled,
}: {
  title: string; desc: string; current: string;
  onSubmit: (addr: string) => Promise<string>; disabled: boolean;
}) {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!value || !/^0x[0-9a-fA-F]{40}$/.test(value)) {
      toast.error('Invalid Ethereum address');
      return;
    }
    setLoading(true);
    try {
      const hash = await onSubmit(value);
      toast.success(`⏳ Scheduled via Timelock! TX: ${hash.slice(0, 10)}…`);
      setValue('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Transaction failed';
      toast.error(`❌ ${msg.length > 80 ? msg.slice(0, 80) + '…' : msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <span className="admin-card-title">{title}</span>
      </div>
      <p className="admin-card-desc">{desc}</p>
      <div className="status-value address" style={{ fontSize: '0.72rem', marginBottom: 4 }}>
        Current: {shortenAddr(current)}
      </div>
      <div className="admin-input-group">
        <input
          type="text"
          className="admin-input address-input"
          placeholder="0x..."
          value={value}
          onChange={e => setValue(e.target.value)}
          disabled={disabled || loading}
        />
        <button
          className="admin-btn"
          onClick={handleSubmit}
          disabled={disabled || loading || !value}
        >
          {loading ? <span className="spinner" /> : '⏳ Schedule'}
        </button>
      </div>
    </div>
  );
}

/* ─── Sub-component: Pending Op Row ────────────────── */
function PendingOpRow({
  op, onExecute, onCancel, disabled,
}: {
  op: TimelockOp;
  onExecute: (op: TimelockOp) => Promise<void>;
  onCancel: (op: TimelockOp) => Promise<void>;
  disabled: boolean;
}) {
  const [loading, setLoading] = useState<'execute' | 'cancel' | null>(null);
  const [countdown, setCountdown] = useState(formatCountdown(op.executeAfter));
  const isReady = op.status === 'ready' || Date.now() >= op.executeAfter;

  useEffect(() => {
    const t = setInterval(() => setCountdown(formatCountdown(op.executeAfter)), 1000);
    return () => clearInterval(t);
  }, [op.executeAfter]);

  const handleExec = async () => {
    setLoading('execute');
    try {
      await onExecute(op);
      toast.success('✅ Operation executed successfully!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Execute failed';
      toast.error(`❌ ${msg.length > 80 ? msg.slice(0, 80) + '…' : msg}`);
    } finally {
      setLoading(null);
    }
  };

  const handleCancel = async () => {
    setLoading('cancel');
    try {
      await onCancel(op);
      toast.success('🗑 Operation cancelled!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Cancel failed';
      toast.error(`❌ ${msg.length > 80 ? msg.slice(0, 80) + '…' : msg}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="pending-op-row">
      <div className="pending-op-info">
        <span className="pending-op-name">{friendlyName(op.functionName)}</span>
        {op.args.length > 0 && (
          <span className="pending-op-args">
            ({op.args.join(', ')})
          </span>
        )}
        <span className="pending-op-date">
          Scheduled: {new Date(op.scheduledAt).toLocaleString()}
        </span>
      </div>
      <div className="pending-op-timer">
        <span className={`countdown ${isReady ? 'ready' : ''}`}>
          {isReady ? '✅ Ready' : `⏳ ${countdown}`}
        </span>
      </div>
      <div className="pending-op-actions">
        <button
          className="admin-btn success small"
          onClick={handleExec}
          disabled={disabled || !isReady || loading !== null}
        >
          {loading === 'execute' ? <span className="spinner" /> : '▶ Execute'}
        </button>
        <button
          className="admin-btn danger small"
          onClick={handleCancel}
          disabled={disabled || loading !== null}
        >
          {loading === 'cancel' ? <span className="spinner" /> : '✕ Cancel'}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Admin Page Component
   ═══════════════════════════════════════════════════ */
export default function AdminPage() {
  const {
    wallet, isConnecting, connectWallet, disconnectWallet,
    switchNetwork, shortenAddress, getNetworkName,
  } = useWalletContext();

  const cowContract = useCOWContract(
    wallet.provider, wallet.chainId ?? null, wallet.address,
  );

  const admin = useAdminContract(
    wallet.provider, wallet.chainId ?? null, wallet.address,
  );

  const [selectedChainId, setSelectedChainId] = useState<string>('0x61');
  const [scrolled, setScrolled] = useState(false);

  const effectiveChainId = wallet.isConnected
    ? (wallet.chainId ?? selectedChainId) : selectedChainId;

  const handleNetworkSelect = useCallback((chainId: string) => {
    setSelectedChainId(chainId);
    if (wallet.isConnected) switchNetwork(chainId);
  }, [wallet.isConnected, switchNetwork]);

  const handleConnect = useCallback(async () => {
    try {
      await connectWallet();
      toast.success('🦊 Wallet connected!');
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

  // ── Pause / Unpause handler (now through Timelock) ──
  const [pauseLoading, setPauseLoading] = useState(false);
  const handleTogglePause = async () => {
    setPauseLoading(true);
    try {
      const hash = admin.isPaused
        ? await admin.unpause()
        : await admin.pause();
      toast.success(`⏳ ${admin.isPaused ? 'Unpause' : 'Pause'} scheduled via Timelock! TX: ${hash.slice(0, 10)}…`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Transaction failed';
      toast.error(`❌ ${msg.length > 80 ? msg.slice(0, 80) + '…' : msg}`);
    } finally {
      setPauseLoading(false);
    }
  };

  // ── Execute / Cancel pending ops ──
  const handleExecuteOp = useCallback(async (op: TimelockOp) => {
    await admin.executeOp(op);
    await admin.refreshOps();
  }, [admin]);

  const handleCancelOp = useCallback(async (op: TimelockOp) => {
    await admin.cancelOp(op);
    await admin.refreshOps();
  }, [admin]);

  const isDisabled = !admin.isOwner || admin.isLoading;

  return (
    <div className="admin-page">
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
          <Link to="/" className="logo">
            <div className="logo-icon-wrapper">
              <img src="/logo.png" alt="COW Stablecoin Logo" className="logo-img" />
            </div>
            <span className="logo-text">COW <span className="logo-accent">Stablecoin</span></span>
          </Link>
          <nav className="header-nav desktop-nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/wallet" className="nav-link">Wallet</Link>
            <Link to="/docs" className="nav-link">Docs</Link>

          </nav>
          <div className="header-actions">
            <NetworkSwitcher currentChainId={effectiveChainId} onSwitchNetwork={handleNetworkSelect} />
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="admin-main">
        {/* Page Header */}
        <div className="admin-page-header">
          <Link to="/" className="admin-back-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Home
          </Link>
          <div className="admin-badge">
            <span className="badge-dot" />
            Admin Dashboard
          </div>
          <h1 className="admin-page-title">
            Smart Contract <span className="title-gradient">Management</span>
          </h1>
          <p className="admin-page-desc">
            ⏳ All changes go through a <strong>48-hour Timelock</strong>. Schedule a change → wait 48h → execute.
            This ensures transparency and prevents sudden parameter changes.
          </p>
        </div>

        {/* Access Gate: Not Connected */}
        {!wallet.isConnected && (
          <div className="admin-access-gate">
            <div className="gate-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="m7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h2 className="gate-title">Connect Your Wallet</h2>
            <p className="gate-desc">
              Connect your MetaMask wallet to access admin functions. Only the contract owner / proposer can schedule changes.
            </p>
            <button className="gate-connect-btn" onClick={handleConnect} disabled={isConnecting}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="22" height="18" rx="3" ry="3" />
                <line x1="1" y1="9" x2="23" y2="9" />
              </svg>
              {isConnecting ? 'Connecting…' : 'Connect MetaMask'}
            </button>
          </div>
        )}

        {/* Connected Content */}
        {wallet.isConnected && (
          <>
            {/* Not-Authorized Warning */}
            {!admin.isLoading && !admin.isOwner && !admin.isPriceUpdater && (
              <div className="not-owner-warning">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span>
                  Your wallet ({shortenAddress(wallet.address ?? '')}) is <strong>not authorized</strong> for admin actions.
                  Owner: <code>{shortenAddr(admin.ownerAddress)}</code>.
                </span>
              </div>
            )}

            {/* Price-Updater-Only Warning (if they are updater but not owner) */}
            {!admin.isLoading && !admin.isOwner && admin.isPriceUpdater && (
              <div className="not-owner-warning" style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', color: '#60a5fa' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>
                  You are the <strong>Price Updater</strong>. You can update the COW price directly, but other admin functions require the Owner role.
                </span>
              </div>
            )}

            {/* ── Pending Timelock Operations ─────────── */}
            {admin.pendingOps.length > 0 && (
              <section className="admin-section timelock-section">
                <div className="admin-section-header">
                  <div className="admin-section-icon timelock">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <h2 className="admin-section-title">⏳ Pending Timelock Operations ({admin.pendingOps.length})</h2>
                </div>
                <div className="admin-note">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  Operations require a 48-hour waiting period before execution. Click "Execute" when ready.
                </div>
                <div className="pending-ops-list">
                  {admin.pendingOps.map(op => (
                    <PendingOpRow
                      key={op.id}
                      op={op}
                      onExecute={handleExecuteOp}
                      onCancel={handleCancelOp}
                      disabled={isDisabled}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* ── Contract Status ─────────────────────── */}
            <section className="admin-section">
              <div className="admin-section-header">
                <div className="admin-section-icon fees">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h2 className="admin-section-title">Contract Status</h2>
              </div>
              <div className="admin-status-grid">
                <div className="status-item">
                  <span className="status-label">Contract</span>
                  <span className="status-value address">{shortenAddr(cowContract.contractAddress ?? '')}</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Owner (Timelock)</span>
                  <span className="status-value address">{shortenAddr(admin.ownerAddress)}</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Status</span>
                  <span className={`status-value ${admin.isPaused ? 'paused' : 'active'}`}>
                    {admin.isPaused ? '⏸ Paused' : '▶ Active'}
                  </span>
                </div>
                <div className="status-item">
                  <span className="status-label">You are Proposer</span>
                  <span className={`status-value ${admin.isOwner ? 'active' : 'paused'}`}>
                    {admin.isOwner ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
                <div className="status-item">
                  <span className="status-label">Price Updater</span>
                  <span className="status-value address">{shortenAddr(admin.priceUpdater)}</span>
                </div>
                <div className="status-item">
                  <span className="status-label">You are Price Updater</span>
                  <span className={`status-value ${admin.isPriceUpdater ? 'active' : 'paused'}`}>
                    {admin.isPriceUpdater ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
                <div className="status-item">
                  <span className="status-label">Mint Fee</span>
                  <span className="status-value">{cowContract.mintFeeBps} bps ({(cowContract.mintFeeBps / 100).toFixed(2)}%)</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Burn Fee</span>
                  <span className="status-value">{cowContract.burnFeeBps} bps ({(cowContract.burnFeeBps / 100).toFixed(2)}%)</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Spread</span>
                  <span className="status-value">{cowContract.spreadBps} bps ({(cowContract.spreadBps / 100).toFixed(2)}%)</span>
                </div>
                <div className="status-item">
                  <span className="status-label">LTV</span>
                  <span className="status-value">{cowContract.ltvBps} bps ({(cowContract.ltvBps / 100).toFixed(2)}%)</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Liquidation Threshold</span>
                  <span className="status-value">{cowContract.liquidationThreshold} bps ({(cowContract.liquidationThreshold / 100).toFixed(2)}%)</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Fee Collector</span>
                  <span className="status-value address">{shortenAddr(admin.feeCollector)}</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Treasury 2</span>
                  <span className="status-value address">{shortenAddr(admin.treasury2)}</span>
                </div>
                <div className="status-item">
                  <span className="status-label">BNB Price</span>
                  <span className="status-value">${parseFloat(cowContract.bnbPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="status-item">
                  <span className="status-label">COW Price (On-chain)</span>
                  <span className="status-value" style={{ color: '#60a5fa', fontWeight: 600 }}>
                    ${parseFloat(cowContract.cowPriceUsd).toFixed(4)}
                  </span>
                </div>
              </div>
            </section>

            {/* ── Fee Management ──────────────────────── */}
            <section className="admin-section">
              <div className="admin-section-header">
                <div className="admin-section-icon fees">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <h2 className="admin-section-title">Fee Management</h2>
              </div>
              <div className="admin-note">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                Maximum fee: 500 bps (5%). Changes are scheduled through 48h Timelock.
              </div>
              <div className="admin-cards-grid">
                <BpsCard
                  title="Mint Fee" desc="Fee charged on minting COW tokens, sent to feeCollector."
                  current={cowContract.mintFeeBps} max={500}
                  onSubmit={admin.setMintFee} disabled={isDisabled}
                />
                <BpsCard
                  title="Burn Fee" desc="Fee charged on burning COW tokens, sent to feeCollector."
                  current={cowContract.burnFeeBps} max={500}
                  onSubmit={admin.setBurnFee} disabled={isDisabled}
                />
                <BpsCard
                  title="Spread Fee" desc="Spread fee charged on both operations, sent to treasury2."
                  current={cowContract.spreadBps} max={500}
                  onSubmit={admin.setSpreadBps} disabled={isDisabled}
                />
              </div>
            </section>

            {/* ── LTV & Liquidation ───────────────────── */}
            <section className="admin-section">
              <div className="admin-section-header">
                <div className="admin-section-icon ltv">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <h2 className="admin-section-title">LTV & Liquidation</h2>
              </div>
              <div className="admin-cards-grid">
                <BpsCard
                  title="LTV Ratio" desc="Loan-to-Value ratio. Determines how many COW tokens users can mint per $ of BNB collateral."
                  current={cowContract.ltvBps} max={9000}
                  onSubmit={admin.setLtv} disabled={isDisabled}
                />
                <BpsCard
                  title="Liquidation Threshold" desc="Collateral ratio below which positions can be liquidated. Must be > 10000 bps (100%)."
                  current={cowContract.liquidationThreshold} max={30000}
                  onSubmit={admin.setLiquidationThreshold} disabled={isDisabled}
                />
              </div>
            </section>

            {/* ── COW Price Management ──────────────────── */}
            <section className="admin-section">
              <div className="admin-section-header">
                <div className="admin-section-icon fees">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                    <path d="M12 18V6" />
                  </svg>
                </div>
                <h2 className="admin-section-title">COW Price Management</h2>
              </div>
              <div className="admin-note">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                COW price is fetched from CoinGecko (tether) API. Use this to manually override the on-chain price.
                Value is stored in 8 decimals (e.g., $1.0012 = 100120000 raw).
              </div>
              <div className="admin-cards-grid">
                <PriceCard
                  title="COW/USD Price"
                  desc="Set the COW token price in USD. This updates instantly without Timelock delay."
                  currentOnChain={cowContract.cowPriceUsd}
                  onSubmit={admin.setCOWPrice}
                  disabled={!admin.isOwner && !admin.isPriceUpdater || admin.isLoading}
                />
              </div>
            </section>

            {/* ── Address Management ──────────────────── */}
            <section className="admin-section">
              <div className="admin-section-header">
                <div className="admin-section-icon addresses">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <h2 className="admin-section-title">Address Management</h2>
              </div>
              <div className="admin-cards-grid">
                <AddressCard
                  title="Fee Collector" desc="Address that receives mint and burn fees. Cannot be zero address."
                  current={admin.feeCollector}
                  onSubmit={admin.setFeeCollector} disabled={isDisabled}
                />
                <AddressCard
                  title="Treasury 2" desc="Address that receives spread fees for development & reserves."
                  current={admin.treasury2}
                  onSubmit={admin.setTreasury2} disabled={isDisabled}
                />
                <AddressCard
                  title="Price Feed" desc="Chainlink BNB/USD oracle address. Critical for all price calculations."
                  current="—"
                  onSubmit={admin.setPriceFeed} disabled={isDisabled}
                />
              </div>
            </section>

            {/* ── Emergency Controls ──────────────────── */}
            <section className="admin-section">
              <div className="admin-section-header">
                <div className="admin-section-icon emergency">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <h2 className="admin-section-title">Emergency Controls</h2>
              </div>
              <div className="emergency-grid">
                {/* Pause/Unpause (through Timelock) */}
                <div className="emergency-card">
                  <span className="emergency-card-title">
                    {admin.isPaused ? '⏸ Contract is Paused' : '▶ Contract is Active'}
                  </span>
                  <p className="emergency-card-desc">
                    {admin.isPaused
                      ? 'All operations are suspended. Schedule an unpause via Timelock (48h delay).'
                      : 'Schedule a pause via Timelock. This will suspend all operations after a 48h delay.'
                    }
                  </p>
                  <button
                    className={`admin-btn ${admin.isPaused ? 'success' : 'danger'}`}
                    onClick={handleTogglePause}
                    disabled={isDisabled || pauseLoading}
                  >
                    {pauseLoading
                      ? <span className="spinner" />
                      : admin.isPaused ? '⏳ Schedule Unpause' : '⏳ Schedule Pause'
                    }
                  </button>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
