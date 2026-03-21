import { useTranslation } from 'react-i18next';
import { useWallet } from '../hooks/useWallet';
import { ChainLogo } from './ChainLogo';
import './WalletButton.css';

interface WalletButtonProps {
    wallet: ReturnType<typeof useWallet>['wallet'];
    isConnecting: boolean;
    onConnect: () => void;
    onDisconnect: () => void;
    shortenAddress: (address: string) => string;
    getNetworkName: (chainId: string | null) => string;
}

export function WalletButton({
    wallet,
    isConnecting,
    onConnect,
    onDisconnect,
    shortenAddress,
    getNetworkName,
}: WalletButtonProps) {
    const { t } = useTranslation();

    if (wallet.isConnected && wallet.address) {
        const displayBalance = wallet.balance
            ? `${parseFloat(wallet.balance).toFixed(4)}`
            : '0.0000';

        return (
            <div className="wallet-connected">
                <div className="wallet-info">
                    <div className="network-badge">
                        <ChainLogo chainId={wallet.chainId} size={18} />
                        <span className="network-name">{getNetworkName(wallet.chainId)}</span>
                    </div>
                    <button className="wallet-address-container" onClick={onDisconnect} title="Click to disconnect">
                        <div className="wallet-avatar">
                            <img src="/media/cow-log.png" alt="avatar" className="wallet-avatar-img" />
                        </div>
                        <div className="wallet-details">
                            <span className="wallet-address">{shortenAddress(wallet.address)}</span>
                            <span className="wallet-balance">{displayBalance}</span>
                        </div>
                        <div className="wallet-disconnect-icon">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                        </div>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <button className="connect-wallet-btn" onClick={onConnect} disabled={isConnecting}>
            {isConnecting ? (
                <>
                    <span className="spinner" />
                    {t('wallet.connecting')}
                </>
            ) : (
                <>
                    <svg className="connect-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1" y="3" width="22" height="18" rx="3" ry="3" />
                        <line x1="1" y1="9" x2="23" y2="9" />
                    </svg>
                    {t('wallet.connectWallet')}
                </>
            )}
        </button>
    );
}
