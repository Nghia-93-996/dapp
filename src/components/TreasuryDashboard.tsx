import { useTranslation } from 'react-i18next';
import type { COWContractState } from '../hooks/useCOWContract';
import { getExplorerAddressUrl } from '../config/networks';
import './TreasuryDashboard.css';

interface TreasuryDashboardProps {
    cowState: COWContractState;
    chainId: string | null;
}

export function TreasuryDashboard({ cowState, chainId }: TreasuryDashboardProps) {
    const { t } = useTranslation();

    if (!cowState.isSupported) return null;

    const explorerUrl = cowState.contractAddress
        ? getExplorerAddressUrl(chainId, cowState.contractAddress)
        : null;

    const formatNumber = (val: string) => {
        const num = parseFloat(val);
        if (num === 0) return '0.0000';
        if (num < 0.0001) return '< 0.0001';
        return num.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 });
    };

    const formatUsd = (val: string) => {
        const num = parseFloat(val);
        if (num === 0) return '$0.00';
        return `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <section className="treasury-dashboard">
            <div className="treasury-header">
                <div className="treasury-badge">
                    <span className="treasury-badge-dot" />
                    <span>{t('treasury.badge', 'Live Treasury')}</span>
                </div>
                <h2 className="treasury-title">{t('treasury.title', 'COW Treasury')}</h2>
                <p className="treasury-desc">{t('treasury.descriptionV2', 'Real-time collateral reserve stats. Every COW token is backed by BNB collateral at LTV with Chainlink oracle pricing.')}</p>
            </div>

            <div className="treasury-grid">
                {/* Collateral Card */}
                <div className="treasury-card treasury-card-primary">
                    <div className="treasury-card-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="m7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                    </div>
                    <div className="treasury-card-value">{formatNumber(cowState.totalCollateral)}</div>
                    <div className="treasury-card-label">{t('treasury.totalCollateral', 'Total Collateral (BNB)')}</div>
                </div>

                {/* Total Supply Card */}
                <div className="treasury-card">
                    <div className="treasury-card-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                            <path d="M12 18V6" />
                        </svg>
                    </div>
                    <div className="treasury-card-value">{formatNumber(cowState.totalSupply)}</div>
                    <div className="treasury-card-label">{t('treasury.totalSupply', 'Total COW Supply')}</div>
                </div>

                {/* BNB Price Card (V2) */}
                <div className="treasury-card">
                    <div className="treasury-card-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                            <polyline points="16 7 22 7 22 13" />
                        </svg>
                    </div>
                    <div className="treasury-card-value">{formatUsd(cowState.bnbPrice)}</div>
                    <div className="treasury-card-label">{t('treasury.bnbPrice', 'BNB/USD (Chainlink)')}</div>
                </div>

                {/* Backing Ratio Card */}
                <div className="treasury-card">
                    <div className="treasury-card-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                            <path d="m9 12 2 2 4-4" />
                        </svg>
                    </div>
                    <div className="treasury-card-value">{cowState.backingRatio}x</div>
                    <div className="treasury-card-label">{t('treasury.backingRatio', 'Backing Ratio')}</div>
                </div>

                {/* LTV Card (V2) */}
                <div className="treasury-card">
                    <div className="treasury-card-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                            <line x1="8" y1="21" x2="16" y2="21" />
                            <line x1="12" y1="17" x2="12" y2="21" />
                        </svg>
                    </div>
                    <div className="treasury-card-value">{(cowState.ltvBps / 100).toFixed(0)}%</div>
                    <div className="treasury-card-label">{t('treasury.ltv', 'LTV Ratio')}</div>
                </div>

                {/* Fee Info Card */}
                <div className="treasury-card">
                    <div className="treasury-card-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="1" x2="12" y2="23" />
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    </div>
                    <div className="treasury-card-value">
                        {(cowState.spreadBps / 100).toFixed(1)}% / {(cowState.mintFeeBps / 100).toFixed(1)}% / {(cowState.burnFeeBps / 100).toFixed(1)}%
                    </div>
                    <div className="treasury-card-label">{t('treasury.feesV2', 'Spread / Mint / Burn Fee')}</div>
                </div>
            </div>

            {/* Your Balance */}
            {parseFloat(cowState.cowBalance) > 0 && (
                <div className="treasury-balance">
                    <span className="treasury-balance-label">{t('treasury.yourBalance', 'Your COW Balance')}</span>
                    <span className="treasury-balance-value">{formatNumber(cowState.cowBalance)} COW</span>
                </div>
            )}

            {/* Liquidation Threshold Info (V2) */}
            <div className="treasury-info-bar">
                <span>🛡️ {t('treasury.liquidationInfo', 'Auto-liquidation triggers below')} {(cowState.liquidationThreshold / 100).toFixed(0)}% {t('treasury.collateralRatio', 'collateral ratio')}</span>
            </div>

            {/* Contract Link */}
            {explorerUrl && (
                <div className="treasury-contract-link">
                    <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                        {t('treasury.viewContract', 'View Contract on Explorer')}
                    </a>
                </div>
            )}

            {cowState.isPaused && (
                <div className="treasury-paused-banner">
                    ⚠️ {t('treasury.paused', 'Contract is currently paused. Mint and Burn are disabled.')}
                </div>
            )}
        </section>
    );
}
