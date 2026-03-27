import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';
import { SWITCHABLE_NETWORKS, NETWORKS, type NetworkConfig } from '../config/networks';
import { ChainLogo } from './ChainLogo';
import './NetworkSwitcher.css';

interface NetworkSwitcherProps {
    currentChainId: string | null;
    onSwitchNetwork: (chainId: string) => void;
}

const NETWORK_COLORS: Record<string, string> = {
    '0x38': '#F0B90B',
    '0x61': '#F0B90B',
    '0x1': '#627EEA',
    '0xaa36a7': '#627EEA',
};

export function NetworkSwitcher({ currentChainId, onSwitchNetwork }: NetworkSwitcherProps) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const currentNet = currentChainId ? NETWORKS[currentChainId] : null;
    const currentColor = currentChainId ? (NETWORK_COLORS[currentChainId] || '#8B5CF6') : '#8B5CF6';

    // Close dropdown on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    return (
        <div className="network-switcher" ref={ref}>
            <button
                className="network-trigger"
                onClick={() => setOpen(!open)}
                style={{ '--net-color': currentColor } as React.CSSProperties}
            >
                <ChainLogo chainId={currentChainId} size={18} />
                <span className="trigger-name">{currentNet?.shortName || t('common.network')}</span>
                <svg className={`trigger-chevron${open ? ' open' : ''}`} width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            {open && (
                <div className="network-dropdown">
                    {SWITCHABLE_NETWORKS.map((chainId) => {
                        const net: NetworkConfig = NETWORKS[chainId];
                        const isActive = currentChainId === chainId;
                        const color = NETWORK_COLORS[chainId] || '#8B5CF6';

                        return (
                            <button
                                key={chainId}
                                className={`network-option${isActive ? ' active' : ''}`}
                                style={{ '--chip-color': color } as React.CSSProperties}
                                onClick={() => {
                                    onSwitchNetwork(chainId);
                                    setOpen(false);
                                }}
                                disabled={isActive}
                            >
                                <ChainLogo chainId={chainId} size={18} />
                                <span className="option-name">{net.shortName}</span>
                                {net.isTestnet && <span className="option-badge">{t('common.testnet')}</span>}
                                {isActive && (
                                    <svg className="option-check" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <path d="M3.5 7L6 9.5L10.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
