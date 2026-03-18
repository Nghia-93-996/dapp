import { useTranslation } from 'react-i18next';
import { getNativeCurrency } from '../config/networks';
import { isCOWChainSupported } from '../contracts/cowConfig';
import './WalletStats.css';

interface WalletStatsProps {
    balance: string | null;
    chainId: string | null;
    address: string | null;
    getNetworkName: (chainId: string | null) => string;
    cowBalance?: string;
}

export function WalletStats({ balance, chainId, address, getNetworkName, cowBalance }: WalletStatsProps) {
    const { t } = useTranslation();

    if (!address) return null;

    const currencySymbol = getNativeCurrency(chainId);
    const hasCOW = isCOWChainSupported(chainId);

    const stats = [
        {
            label: `${currencySymbol} ${t('wallet.balance', 'Balance')}`,
            value: balance ? `${parseFloat(balance).toFixed(4)} ${currencySymbol}` : '-.----',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
            ),
            color: '#F0B90B', // BNB gold
        },
        // COW balance — only shown on supported chains
        ...(hasCOW
            ? [
                {
                    label: 'COW Balance',
                    value: cowBalance
                        ? `${parseFloat(cowBalance).toFixed(4)} COW`
                        : '0.0000 COW',
                    icon: (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                            <path d="M12 18V6" />
                        </svg>
                    ),
                    color: '#8B5CF6', // Purple
                },
            ]
            : []),
        {
            label: t('wallet.network'),
            value: getNetworkName(chainId),
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
            ),
            color: '#06B6D4',
        },
        {
            label: t('wallet.status'),
            value: t('wallet.connected'),
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
            ),
            color: '#22C55E',
        },
    ];

    return (
        <div className="wallet-stats" data-cols={stats.length}>
            {stats.map((stat) => (
                <div key={stat.label} className="stat-card" style={{ '--accent': stat.color } as React.CSSProperties}>
                    <div className="stat-icon">{stat.icon}</div>
                    <div className="stat-info">
                        <span className="stat-label">{stat.label}</span>
                        <span className="stat-value">{stat.value}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
