import { useState, useEffect, useCallback } from 'react';
import { BrowserProvider, formatEther } from 'ethers';
import type { WalletState } from '../types/ethereum';
import { getNetworkName as getNetworkNameFromConfig, NETWORKS } from '../config/networks';

const initialState: WalletState = {
    isConnected: false,
    address: null,
    chainId: null,
    balance: null,
    provider: null,
};

export function useWallet() {
    const [wallet, setWallet] = useState<WalletState>(initialState);
    const [isConnecting, setIsConnecting] = useState(false);

    const getBalance = useCallback(async (provider: BrowserProvider, address: string) => {
        try {
            const balance = await provider.getBalance(address);
            return formatEther(balance);
        } catch {
            return '0';
        }
    }, []);

    const connectWallet = useCallback(async () => {
        if (!window.ethereum) {
            window.open('https://metamask.io/download/', '_blank');
            return;
        }

        setIsConnecting(true);
        try {
            const accounts = (await window.ethereum.request({
                method: 'eth_requestAccounts',
            })) as string[];

            const chainId = (await window.ethereum.request({
                method: 'eth_chainId',
            })) as string;

            const provider = new BrowserProvider(window.ethereum);
            const balance = await getBalance(provider, accounts[0]);

            setWallet({
                isConnected: true,
                address: accounts[0],
                chainId,
                balance,
                provider,
            });
        } catch (error: unknown) {
            const err = error as { code?: number; message?: string };
            if (err.code === 4001) {
                console.log('User rejected the connection request');
            } else {
                console.error('Failed to connect wallet:', err.message);
            }
        } finally {
            setIsConnecting(false);
        }
    }, [getBalance]);

    const disconnectWallet = useCallback(() => {
        setWallet(initialState);
    }, []);

    const switchNetwork = useCallback(async (chainId: string) => {
        if (!window.ethereum) return;

        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId }],
            });
        } catch (error: unknown) {
            const err = error as { code?: number };
            // Error 4902 = chain not added to MetaMask yet
            if (err.code === 4902) {
                const network = NETWORKS[chainId];
                if (!network) return;

                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: network.chainId,
                                chainName: network.name,
                                nativeCurrency: network.currency,
                                rpcUrls: [network.rpcUrl],
                                blockExplorerUrls: [network.blockExplorerUrl],
                            },
                        ],
                    });
                } catch (addError) {
                    console.error('Failed to add network:', addError);
                }
            } else {
                console.error('Failed to switch network:', error);
            }
        }
    }, []);

    // Auto-reconnect: silently check if MetaMask already has authorized accounts
    useEffect(() => {
        if (!window.ethereum) return;

        const tryReconnect = async () => {
            try {
                // eth_accounts does NOT trigger a popup — it only returns
                // accounts that the user has already authorized
                const accounts = (await window.ethereum!.request({
                    method: 'eth_accounts',
                })) as string[];

                if (accounts.length > 0) {
                    const chainId = (await window.ethereum!.request({
                        method: 'eth_chainId',
                    })) as string;

                    const provider = new BrowserProvider(window.ethereum!);
                    const balance = await getBalance(provider, accounts[0]);

                    setWallet({
                        isConnected: true,
                        address: accounts[0],
                        chainId,
                        balance,
                        provider,
                    });
                }
            } catch (err) {
                console.error('Auto-reconnect failed:', err);
            }
        };

        tryReconnect();
    }, [getBalance]);

    // Listen for account changes
    useEffect(() => {
        if (!window.ethereum) return;

        const handleAccountsChanged = async (...args: unknown[]) => {
            const accounts = args[0] as string[];
            if (accounts.length === 0) {
                setWallet(initialState);
            } else if (wallet.isConnected) {
                const provider = new BrowserProvider(window.ethereum!);
                const balance = await getBalance(provider, accounts[0]);
                setWallet((prev) => ({
                    ...prev,
                    address: accounts[0],
                    balance,
                    provider,
                }));
            }
        };

        const handleChainChanged = (...args: unknown[]) => {
            const chainId = args[0] as string;
            const provider = new BrowserProvider(window.ethereum!);
            setWallet((prev) => ({
                ...prev,
                chainId,
                provider,
            }));
            // Refresh balance on chain change
            if (wallet.address) {
                getBalance(provider, wallet.address).then((balance) => {
                    setWallet((prev) => ({ ...prev, balance }));
                });
            }
        };

        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);

        return () => {
            window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
            window.ethereum?.removeListener('chainChanged', handleChainChanged);
        };
    }, [wallet.isConnected, wallet.address, wallet.provider, getBalance]);

    const shortenAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const getNetworkName = (chainId: string | null): string => {
        return getNetworkNameFromConfig(chainId);
    };

    return {
        wallet,
        isConnecting,
        connectWallet,
        disconnectWallet,
        switchNetwork,
        shortenAddress,
        getNetworkName,
    };
}
