import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import './ContractInfo.css';

interface ContractItem {
    name: string;
    address: string;
    explorerUrl: string;
    icon: React.ReactNode;
}

const CONTRACTS: ContractItem[] = [
    {
        name: 'COWToken',
        address: '0x049CE6FeBaE5746c0A43F88A4328073E4f49e55F',
        explorerUrl: 'https://testnet.bscscan.com/address/0x049CE6FeBaE5746c0A43F88A4328073E4f49e55F',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v12M6 12h12" />
            </svg>
        ),
    },
    {
        name: 'COWTimelock',
        address: '0x705Ea1c77335f736e796361f0D9c5E7d55f1E02c',
        explorerUrl: 'https://testnet.bscscan.com/address/0x705Ea1c77335f736e796361f0D9c5E7d55f1E02c',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
            </svg>
        ),
    },
    {
        name: 'Fee Collector',
        address: '0x65E8c1434E348EE409A0d6488b9e293C3fFdd998',
        explorerUrl: 'https://testnet.bscscan.com/address/0x65E8c1434E348EE409A0d6488b9e293C3fFdd998',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="22" height="18" rx="3" ry="3" />
                <line x1="1" y1="9" x2="23" y2="9" />
            </svg>
        ),
    },
];

export function ContractInfo() {
    const { t } = useTranslation();
    const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

    const handleCopy = useCallback((address: string, idx: number) => {
        navigator.clipboard.writeText(address).then(() => {
            setCopiedIdx(idx);
            setTimeout(() => setCopiedIdx(null), 2000);
        });
    }, []);

    const shortenAddress = (addr: string) =>
        `${addr.slice(0, 6)}…${addr.slice(-4)}`;

    return (
        <section className="contract-info" id="contracts">
            <div className="section-header">
                <span className="section-badge contract-badge">📜 BSC Testnet</span>
                <h2 className="section-title">{t('contracts.title', 'Smart Contracts')}</h2>
                <p className="section-desc">
                    {t('contracts.description', 'Verified smart contracts deployed on BSC Testnet')}
                </p>
            </div>

            <div className="contract-cards">
                {CONTRACTS.map((c, idx) => (
                    <div className="contract-card" key={c.address}>
                        <div className="contract-card-header">
                            <div className={`contract-icon contract-icon-${idx + 1}`}>
                                {c.icon}
                            </div>
                            <span className="contract-name">{c.name}</span>
                        </div>

                        <div className="contract-address-row">
                            <code className="contract-address" title={c.address}>
                                {shortenAddress(c.address)}
                            </code>
                            <button
                                className={`copy-btn${copiedIdx === idx ? ' copied' : ''}`}
                                onClick={() => handleCopy(c.address, idx)}
                                title={copiedIdx === idx ? 'Copied!' : 'Copy address'}
                            >
                                {copiedIdx === idx ? (
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

                        <a
                            href={c.explorerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="contract-explorer-link"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                <polyline points="15 3 21 3 21 9" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                            {t('contracts.viewOnBscScan', 'View on BscScan')}
                        </a>
                    </div>
                ))}
            </div>
        </section>
    );
}
