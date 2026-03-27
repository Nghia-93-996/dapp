import { useTranslation } from 'react-i18next';
import type { TokenTransaction } from '../hooks/useTransactionHistory';
import { getExplorerTxUrl } from '../config/networks';
import './TransactionHistory.css';

interface TransactionHistoryProps {
    transactions: TokenTransaction[];
    isLoading: boolean;
    chainId: string | null;
}

export function TransactionHistory({ transactions, isLoading, chainId }: TransactionHistoryProps) {
    const { t } = useTranslation();

    const shortenAddr = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    const shortenHash = (hash: string) => `${hash.slice(0, 8)}...${hash.slice(-6)}`;

    const formatTime = (timestamp?: number) => {
        if (!timestamp) return '—';
        const date = new Date(timestamp * 1000);
        const now = Date.now();
        const diff = now - date.getTime();

        if (diff < 60_000) return t('history.justNow');
        if (diff < 3600_000) return `${Math.floor(diff / 60_000)}${t('history.agoM')}`;
        if (diff < 86400_000) return `${Math.floor(diff / 3600_000)}${t('history.agoH')}`;
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const formatNum = (val: string) => {
        const n = parseFloat(val);
        if (n === 0) return '0';
        if (n < 0.0001) return '< 0.0001';
        if (n >= 1000) return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
        return n.toFixed(4);
    };

    return (
        <section className="tx-history">
            <div className="tx-history-header">
                <div className="tx-history-badge">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                    <h2>{t('history.title')}</h2>
                </div>
                <span className="tx-count">{transactions.length} {t('history.transactions')}</span>
            </div>

            {isLoading ? (
                <div className="tx-loading">
                    <div className="tx-loading-spinner" />
                    <p>{t('history.loading')}</p>
                </div>
            ) : transactions.length === 0 ? (
                <div className="tx-empty">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.3">
                        <rect x="2" y="3" width="20" height="18" rx="3" />
                        <line x1="2" y1="9" x2="22" y2="9" />
                        <line x1="10" y1="14" x2="18" y2="14" />
                    </svg>
                    <p>{t('history.empty')}</p>
                </div>
            ) : (
                <div className="tx-table-container">
                    <table className="tx-table">
                        <thead>
                            <tr>
                                <th>{t('history.type')}</th>
                                <th>{t('history.user')}</th>
                                <th>BNB</th>
                                <th>COW</th>
                                <th>{t('history.fee')}</th>
                                <th>{t('history.time')}</th>
                                <th>Tx</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx) => {
                                const explorerUrl = getExplorerTxUrl(chainId, tx.txHash);
                                return (
                                    <tr key={tx.txHash} className={`tx-row tx-row-${tx.type}`}>
                                        <td>
                                            <span className={`tx-type-badge tx-type-${tx.type}`}>
                                                {tx.type === 'mint' ? (
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <line x1="12" y1="5" x2="12" y2="19" />
                                                        <line x1="5" y1="12" x2="19" y2="12" />
                                                    </svg>
                                                ) : (
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M12 12c-2-2.67-6-2.67-6 2 0 3.13 2.69 6 6 9 3.31-3 6-5.88 6-9 0-4.67-4-4.67-6-2z" />
                                                    </svg>
                                                )}
                                                {tx.type === 'mint' ? t('history.mint') : t('history.burn')}
                                            </span>
                                        </td>
                                        <td className="tx-cell-addr">
                                            <code>{shortenAddr(tx.user)}</code>
                                        </td>
                                        <td className="tx-cell-num">{formatNum(tx.bnbAmount)}</td>
                                        <td className="tx-cell-num tx-cell-cow">{formatNum(tx.tokenAmount)}</td>
                                        <td className="tx-cell-fee">{formatNum(tx.fee)}</td>
                                        <td className="tx-cell-time">{formatTime(tx.timestamp)}</td>
                                        <td>
                                            {explorerUrl ? (
                                                <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="tx-link">
                                                    <code>{shortenHash(tx.txHash)}</code>
                                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                                        <polyline points="15 3 21 3 21 9" />
                                                        <line x1="10" y1="14" x2="21" y2="3" />
                                                    </svg>
                                                </a>
                                            ) : (
                                                <code className="tx-hash-text">{shortenHash(tx.txHash)}</code>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
