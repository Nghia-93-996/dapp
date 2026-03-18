import { createContext, useContext, type ReactNode } from 'react';
import { useWallet } from './useWallet';

type WalletContextType = ReturnType<typeof useWallet>;

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
    const walletData = useWallet();
    return (
        <WalletContext.Provider value={walletData}>
            {children}
        </WalletContext.Provider>
    );
}

export function useWalletContext(): WalletContextType {
    const ctx = useContext(WalletContext);
    if (!ctx) {
        throw new Error('useWalletContext must be used within a WalletProvider');
    }
    return ctx;
}
