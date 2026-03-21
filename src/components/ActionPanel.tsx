import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { BrowserProvider } from 'ethers';
import { useTransaction } from '../hooks/useTransaction';
import { useSound } from '../hooks/useSound';
import { getNativeCurrency, getExplorerTxUrl } from '../config/networks';
import { isCOWChainSupported } from '../contracts/cowConfig';
import type { UserPosition } from '../hooks/useCOWContract';
import './ActionPanel.css';

interface ActionPanelProps {
    provider: BrowserProvider | null;
    isConnected: boolean;
    chainId?: string | null;
    mintCOW?: (amount: string) => Promise<string>;
    burnCOW?: (amount: string) => Promise<string>;
    previewMint?: (amount: string) => Promise<{ tokensOut: string; spreadFee: string; mintFee: string }>;
    previewBurn?: (amount: string) => Promise<{ bnbOut: string; spreadFee: string; burnFee: string }>;
    cowBalance?: string;
    userPosition?: UserPosition | null;
    bnbPrice?: string;
    ltvBps?: number;
    spreadBps?: number;
    mintFeeBps?: number;
    burnFeeBps?: number;
    bnbBalance?: string | null;
    cowPriceUsd?: number;
    onTransactionComplete?: () => void;
}

export function ActionPanel({
    provider,
    isConnected,
    chainId,
    mintCOW,
    burnCOW,
    previewMint,
    previewBurn,
    cowBalance,
    userPosition,
    bnbPrice,
    ltvBps,
    spreadBps,
    mintFeeBps,
    burnFeeBps,
    bnbBalance,
    cowPriceUsd,
    onTransactionComplete,
}: ActionPanelProps) {
    const { t } = useTranslation();
    const [mintAmount, setMintAmount] = useState('0.01');
    const [burnAmount, setBurnAmount] = useState('');
    const { txState, mint, burn, resetTransaction } = useTransaction();
    const { playMintSound, playBurnSound, playErrorSound } = useSound();

    // Preview state (V2: includes spread + fee breakdown)
    const [mintPreview, setMintPreview] = useState<{ tokensOut: string; spreadFee: string; mintFee: string } | null>(null);
    const [burnPreview, setBurnPreview] = useState<{ bnbOut: string; spreadFee: string; burnFee: string } | null>(null);

    const currencySymbol = getNativeCurrency(chainId ?? null);
    const explorerUrl = txState.hash ? getExplorerTxUrl(chainId ?? null, txState.hash) : null;
    const isCOWActive = isCOWChainSupported(chainId ?? null);

    // Client-side estimation: calculate COW output from BNB amount using on-chain params
    const estimateMint = (amount: string) => {
        const bnbSize = parseFloat(amount);
        const bnbP = parseFloat(bnbPrice ?? '0');
        const ltv = ltvBps ?? 0;
        const spread = spreadBps ?? 0;
        const mintFee = mintFeeBps ?? 0;
        const basePrice = cowPriceUsd ?? 1;

        if (bnbSize <= 0 || bnbP <= 0 || ltv <= 0 || basePrice <= 0) return null;

        // 1. Calculate Mint Price (Base + Spread)
        const mintPrice = basePrice * (1 + spread / 10000);
        
        // 2. COW gross = (BNB * BNB_price * LTV) / MintPrice
        const usdValue = bnbSize * bnbP * ltv / 10000;
        const cowGross = usdValue / mintPrice;
        
        // 3. Fees and Spread breakdown for UI
        const mintFeeAmt = cowGross * mintFee / 10000;
        const tokensOut = cowGross - mintFeeAmt;

        return {
            tokensOut: tokensOut.toString(),
            spreadFee: (usdValue / basePrice - cowGross).toString(), 
            mintFee: mintFeeAmt.toString(),
            mintPrice: mintPrice
        };
    };

    const estimateBurn = (amount: string) => {
        const cowSize = parseFloat(amount);
        const bnbP = parseFloat(bnbPrice ?? '0');
        const ltv = ltvBps ?? 0;
        const burnFee = burnFeeBps ?? 0;
        const basePrice = cowPriceUsd ?? 1;

        if (cowSize <= 0 || bnbP <= 0 || ltv <= 0 || basePrice <= 0) return null;

        const burnPrice = basePrice;
        const usdValue = cowSize * burnPrice;
        const bnbGross = usdValue / (bnbP * ltv / 10000);
        const burnFeeAmt = bnbGross * burnFee / 10000;
        const bnbOut = bnbGross - burnFeeAmt;

        return {
            bnbOut: bnbOut.toString(),
            spreadFee: '0', 
            burnFee: burnFeeAmt.toString(),
            burnPrice: burnPrice
        };
    };

    // Effective mint preview: contract preview first, fallback to client estimate
    const effectiveMintPreview = (() => {
        // If contract preview exists and has non-zero tokensOut, use it
        if (mintPreview && parseFloat(mintPreview.tokensOut) > 0) return mintPreview;
        // Otherwise fallback to client-side estimate
        if (isCOWActive && mintAmount && parseFloat(mintAmount) > 0) {
            return estimateMint(mintAmount);
        }
        return null;
    })();

    // Effective burn preview: contract preview first, fallback to client estimate
    const effectiveBurnPreview = (() => {
        if (burnPreview && parseFloat(burnPreview.bnbOut) > 0) return burnPreview;
        if (isCOWActive && burnAmount && parseFloat(burnAmount) > 0) {
            return estimateBurn(burnAmount);
        }
        return null;
    })();

    // Preview mint debounced
    useEffect(() => {
        if (!isCOWActive || !previewMint || !mintAmount || parseFloat(mintAmount) <= 0) {
            setMintPreview(null);
            return;
        }
        const timer = setTimeout(async () => {
            const result = await previewMint(mintAmount);
            setMintPreview(result);
        }, 300);
        return () => clearTimeout(timer);
    }, [mintAmount, isCOWActive, previewMint]);

    // Preview burn debounced
    useEffect(() => {
        if (!isCOWActive || !previewBurn || !burnAmount || parseFloat(burnAmount) <= 0) {
            setBurnPreview(null);
            return;
        }
        const timer = setTimeout(async () => {
            const result = await previewBurn(burnAmount);
            setBurnPreview(result);
        }, 300);
        return () => clearTimeout(timer);
    }, [burnAmount, isCOWActive, previewBurn]);

    const handleMint = async () => {
        if (!provider) return;
        const hash = await mint(provider, mintAmount, chainId, mintCOW);
        if (hash) {
            playMintSound();
            onTransactionComplete?.();
        } else {
            playErrorSound();
        }
    };

    const handleBurn = async () => {
        if (!provider) return;
        const hash = await burn(provider, burnAmount, chainId, burnCOW);
        if (hash) {
            playBurnSound();
            onTransactionComplete?.();
        } else {
            playErrorSound();
        }
    };

    const formatPreview = (val: string) => {
        const num = parseFloat(val);
        if (num === 0) return '0';
        if (num < 0.000001) return '< 0.000001';
        return num.toFixed(6);
    };

    const formatUsd = (val: string) => {
        const num = parseFloat(val);
        if (num === 0) return '$0.00';
        return `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <div className="action-panel">
            {/* User Position Summary (V2) */}
            {isCOWActive && userPosition && parseFloat(userPosition.cowMinted) > 0 && (
                <div className={`position-summary position-${userPosition.health}`}>
                    <div className="position-header">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                            <path d="m9 12 2 2 4-4" />
                        </svg>
                        <span>{t('action.yourPosition', 'Your Position')}</span>
                        <span className={`position-health-badge badge-${userPosition.health}`}>
                            {userPosition.health === 'healthy' ? '✅ Healthy' :
                             userPosition.health === 'warning' ? '⚠️ Warning' : '🚨 Danger'}
                        </span>
                    </div>
                    <div className="position-details">
                        <div className="position-row">
                            <span>{t('action.collateral', 'Collateral')}</span>
                            <span>{parseFloat(userPosition.collateral).toFixed(6)} {currencySymbol}</span>
                        </div>
                        <div className="position-row">
                            <span>{t('action.cowDebt', 'COW Minted')}</span>
                            <span>{parseFloat(userPosition.cowMinted).toFixed(4)} COW</span>
                        </div>
                        <div className="position-row">
                            <span>{t('action.collateralRatio', 'Collateral Ratio')}</span>
                            <span className={`ratio-value ratio-${userPosition.health}`}>
                                {(userPosition.collateralRatio / 100).toFixed(1)}%
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* BNB Price Display (V2) */}
            {isCOWActive && bnbPrice && parseFloat(bnbPrice) > 0 && (
                <div className="bnb-price-bar">
                    <span className="price-label">🟡 BNB/USD</span>
                    <span className="price-value">{formatUsd(bnbPrice)}</span>
                    {ltvBps && <span className="ltv-badge">LTV {(ltvBps / 100).toFixed(0)}%</span>}
                </div>
            )}

            {/* Mint Card */}
            <div className="action-card mint-card">
                <div className="card-glow mint-glow" />
                <div className="card-content">
                    <div className="card-header">
                        <div className="card-icon mint-icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="16" />
                                <line x1="8" y1="12" x2="16" y2="12" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="card-title">
                                {isCOWActive ? t('action.mintCOWTitle', 'Mint COW') : t('action.mintTitle')}
                            </h3>
                            <p className="card-subtitle">
                                {isCOWActive
                                    ? t('action.mintCOWSubtitleV2', 'Deposit BNB collateral → Receive COW tokens at LTV')
                                    : t('action.mintSubtitle')}
                            </p>
                        </div>
                    </div>

                    {/* BNB & COW Balance Display */}
                    {isConnected && bnbBalance && (
                        <div className="action-preview" style={{ marginBottom: '12px' }}>
                            <div className="preview-row">
                                <span>💰 {t('action.bnbBalance', 'Your BNB Balance')}</span>
                                <span className="preview-value" style={{ fontSize: '1.05rem', fontWeight: 600 }}>
                                    {parseFloat(bnbBalance).toFixed(4)} {currencySymbol}
                                </span>
                            </div>
                            {isCOWActive && (
                                <div className="preview-row">
                                    <span>🐄 {t('action.cowBalanceMint', 'Your COW Balance')}</span>
                                    <span className="preview-value" style={{ fontSize: '1.05rem', fontWeight: 600, color: '#8B5CF6' }}>
                                        {cowBalance ? parseFloat(cowBalance).toFixed(4) : '0.0000'} COW
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="input-group">
                        <label htmlFor="mint-amount" className="input-label">
                            {t('action.amountLabel')} ({currencySymbol})
                        </label>
                        <div className="input-wrapper">
                            <input
                                id="mint-amount"
                                type="number"
                                step="0.001"
                                min="0"
                                value={mintAmount}
                                onChange={(e) => setMintAmount(e.target.value)}
                                className="amount-input"
                                placeholder={t('action.amountPlaceholder')}
                                disabled={!isConnected || txState.isLoading}
                            />
                            <span className="input-suffix">{currencySymbol}</span>
                        </div>
                        {/* Inline COW conversion indicator */}
                        {isCOWActive && mintAmount && parseFloat(mintAmount) > 0 && effectiveMintPreview && (
                            <div className="conversion-indicator mint-conversion">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                                <span className="conversion-label">Bạn sẽ nhận được</span>
                                <span className="conversion-value">
                                    ≈ {parseFloat(effectiveMintPreview.tokensOut).toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })} COW
                                </span>
                            </div>
                        )}
                        {/* Percentage Quick-Set Buttons for Mint */}
                        {bnbBalance && parseFloat(bnbBalance) > 0 && (
                            <div className="percent-btns-row">
                                {[25, 50, 75].map(pct => (
                                    <button
                                        key={pct}
                                        className={`percent-btn${mintAmount === (parseFloat(bnbBalance) * pct / 100).toFixed(6) ? ' active' : ''}`}
                                        onClick={() => setMintAmount((parseFloat(bnbBalance) * pct / 100).toFixed(6))}
                                        disabled={txState.isLoading}
                                    >
                                        {pct}%
                                    </button>
                                ))}
                                <button
                                    className={`percent-btn percent-btn-max${mintAmount === parseFloat(bnbBalance).toFixed(6) ? ' active' : ''}`}
                                    onClick={() => setMintAmount(parseFloat(bnbBalance).toFixed(6))}
                                    disabled={txState.isLoading}
                                >
                                    MAX
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mint Preview (V2: spread + fee breakdown with client-side fallback) */}
                    {isCOWActive && effectiveMintPreview && (
                        <div className="action-preview">
                            <div className="preview-row">
                                <span style={{ color: '#34d399' }}>💰 Giá Mint: ${(effectiveMintPreview as any).mintPrice?.toFixed(4) || '0.0000'}</span>
                            </div>
                            <div className="preview-row">
                                <span>{t('action.youReceive', 'You receive')}</span>
                                <span className="preview-value">{formatPreview(effectiveMintPreview.tokensOut)} COW</span>
                            </div>
                            <div className="preview-row">
                                <span>{t('action.spreadFee', 'Spread (1%)')}</span>
                                <span className="preview-fee">{formatPreview(effectiveMintPreview.spreadFee)} COW</span>
                            </div>
                            <div className="preview-row">
                                <span>{t('action.mintFee', 'Mint Fee (0.3%)')}</span>
                                <span className="preview-fee">{formatPreview(effectiveMintPreview.mintFee)} COW</span>
                            </div>
                        </div>
                    )}

                    <button
                        id="mint-button"
                        className="action-btn mint-btn"
                        onClick={handleMint}
                        disabled={!isConnected || txState.isLoading}
                    >
                        {txState.loadingAction === 'mint' ? (
                            <span className="btn-loading">
                                <span className="btn-spinner" />
                                {t('action.processing')}
                            </span>
                        ) : (
                            <>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                                {isCOWActive ? t('action.mintCOWButton', 'Mint COW') : t('action.mintButton')}
                            </>
                        )}
                    </button>

                    {!isConnected && (
                        <p className="card-hint">{t('action.walletRequired')}</p>
                    )}
                </div>
            </div>

            {/* Burn Card */}
            <div className="action-card burn-card">
                <div className="card-glow burn-glow" />
                <div className="card-content">
                    <div className="card-header">
                        <div className="card-icon burn-icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22c-4.97 0-9-2.69-9-6v-.5c0-2.49 2-4.5 4.5-4.5.88 0 1.7.25 2.39.68.42.26.85.54 1.11.82V8a4 4 0 0 1 8 0v2c0 .55-.45 1-1 1s-1-.45-1-1V8a2 2 0 0 0-4 0v4.5c.67-.53 1.51-.86 2.41-.86 2.21 0 4.09 1.63 4.59 3.86.5 2.23-.88 4.57-3 5.5H12z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="card-title">
                                {isCOWActive ? t('action.burnCOWTitle', 'Burn COW') : t('action.burnTitle')}
                            </h3>
                            <p className="card-subtitle">
                                {isCOWActive
                                    ? t('action.burnCOWSubtitleV2', 'Burn COW tokens → Release BNB collateral')
                                    : t('action.burnSubtitle')}
                            </p>
                        </div>
                    </div>

                    {/* COW Balance Display */}
                    {isCOWActive && isConnected && (
                        <div className="action-preview" style={{ marginBottom: '12px' }}>
                            <div className="preview-row">
                                <span>💰 {t('action.currentBalance', 'Your COW Balance')}</span>
                                <span className="preview-value" style={{ fontSize: '1.05rem', fontWeight: 600 }}>
                                    {cowBalance ? parseFloat(cowBalance).toFixed(4) : '0.0000'} COW
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="input-group">
                        <label htmlFor="burn-amount" className="input-label">
                            {isCOWActive
                                ? t('action.cowAmountLabel', 'Amount (COW)')
                                : `${t('action.amountLabel')} (${currencySymbol})`}
                        </label>
                        <div className="input-wrapper">
                            <input
                                id="burn-amount"
                                type="number"
                                step="0.001"
                                min="0"
                                value={burnAmount}
                                onChange={(e) => setBurnAmount(e.target.value)}
                                className="amount-input"
                                placeholder={isCOWActive ? t('action.cowAmountPlaceholder', 'COW amount to burn') : t('action.amountPlaceholder')}
                                disabled={!isConnected || txState.isLoading}
                            />
                            <span className="input-suffix">{isCOWActive ? 'COW' : currencySymbol}</span>
                        </div>
                        {/* Percentage Quick-Set Buttons */}
                        {isCOWActive && cowBalance && parseFloat(cowBalance) > 0 && (
                            <div className="percent-btns-row">
                                {[25, 50, 75].map(pct => (
                                    <button
                                        key={pct}
                                        className={`percent-btn${burnAmount === (parseFloat(cowBalance) * pct / 100).toFixed(6) ? ' active' : ''}`}
                                        onClick={() => setBurnAmount((parseFloat(cowBalance) * pct / 100).toFixed(6))}
                                        disabled={txState.isLoading}
                                    >
                                        {pct}%
                                    </button>
                                ))}
                                <button
                                    className={`percent-btn percent-btn-max${burnAmount === cowBalance ? ' active' : ''}`}
                                    onClick={() => setBurnAmount(cowBalance)}
                                    disabled={txState.isLoading}
                                >
                                    MAX
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Burn Preview (V2: spread + fee breakdown with client-side fallback) */}
                    {isCOWActive && effectiveBurnPreview && (
                        <div className="action-preview">
                            <div className="preview-row">
                                <span style={{ color: '#fb923c' }}>💰 Giá Burn: ${(effectiveBurnPreview as any).burnPrice?.toFixed(4) || '0.0000'}</span>
                            </div>
                            <div className="preview-row">
                                <span>{t('action.youReceive', 'You receive')}</span>
                                <span className="preview-value">{formatPreview(effectiveBurnPreview.bnbOut)} {currencySymbol}</span>
                            </div>
                            <div className="preview-row">
                                <span>{t('action.burnFee', 'Burn Fee (0.3%)')}</span>
                                <span className="preview-fee">{formatPreview(effectiveBurnPreview.burnFee)} {currencySymbol}</span>
                            </div>
                        </div>
                    )}

                    <button
                        id="burn-button"
                        className="action-btn burn-btn"
                        onClick={handleBurn}
                        disabled={!isConnected || txState.isLoading}
                    >
                        {txState.loadingAction === 'burn' ? (
                            <span className="btn-loading">
                                <span className="btn-spinner" />
                                {t('action.processing')}
                            </span>
                        ) : (
                            <>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 12c-2-2.67-6-2.67-6 2 0 3.13 2.69 6 6 9 3.31-3 6-5.88 6-9 0-4.67-4-4.67-6-2z" />
                                </svg>
                                {isCOWActive ? t('action.burnCOWButton', 'Burn COW') : t('action.burnButton')}
                            </>
                        )}
                    </button>

                    {!isConnected && (
                        <p className="card-hint">{t('action.walletRequired')}</p>
                    )}
                </div>
            </div>

            {/* Transaction Status */}
            {(txState.hash || txState.error || txState.success) && (
                <div className={`tx-status ${txState.error ? 'tx-error' : ''} ${txState.success ? 'tx-success' : ''}`}>
                    <div className="tx-status-content">
                        {txState.success && (
                            <div className="tx-success-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                        )}
                        {txState.error && (
                            <div className="tx-error-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </div>
                        )}
                        <div className="tx-details">
                            {txState.success && <p className="tx-message">{t('action.txSuccess')}</p>}
                            {txState.error && <p className="tx-message">{txState.error}</p>}
                            {txState.hash && (
                                <p className="tx-hash">
                                    {t('action.txHash')}: {explorerUrl ? (
                                        <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="tx-explorer-link">
                                            <code>{txState.hash.slice(0, 10)}...{txState.hash.slice(-8)}</code>
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                                <polyline points="15 3 21 3 21 9" />
                                                <line x1="10" y1="14" x2="21" y2="3" />
                                            </svg>
                                        </a>
                                    ) : (
                                        <code>{txState.hash.slice(0, 10)}...{txState.hash.slice(-8)}</code>
                                    )}
                                </p>
                            )}
                        </div>
                        <button className="tx-close" onClick={resetTransaction}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
