import { useState, useEffect, useCallback } from 'react';
import { Contract, formatEther, parseEther, formatUnits, JsonRpcProvider } from 'ethers';
import type { BrowserProvider } from 'ethers';
import { COW_TOKEN_ABI, getCOWTokenAddress, isCOWChainSupported } from '../contracts/cowConfig';
import { getNetworkConfig } from '../config/networks';

export interface UserPosition {
    /** BNB collateral deposited (formatted) */
    collateral: string;
    /** COW tokens minted against the collateral (formatted) */
    cowMinted: string;
    /** Current collateral ratio in basis points */
    collateralRatio: number;
    /** Health status: 'healthy' | 'warning' | 'danger' */
    health: 'healthy' | 'warning' | 'danger';
}

export interface COWContractState {
    /** Whether the contract is available on the current chain */
    isSupported: boolean;
    /** User's COW token balance (formatted) */
    cowBalance: string;
    /** Total BNB collateral in treasury (formatted) */
    totalCollateral: string;
    /** Total COW supply (formatted) */
    totalSupply: string;
    /** Mint fee in basis points */
    mintFeeBps: number;
    /** Burn fee in basis points */
    burnFeeBps: number;
    /** Spread fee in basis points */
    spreadBps: number;
    /** LTV ratio in basis points */
    ltvBps: number;
    /** Liquidation threshold in basis points */
    liquidationThreshold: number;
    /** Current BNB/USD price (formatted, 8 decimals) */
    bnbPrice: string;
    /** Backing ratio (collateral USD / supply, formatted) */
    backingRatio: string;
    /** Whether contract is paused */
    isPaused: boolean;
    /** COW/USD on-chain price (formatted, 8 decimals → human-readable USD) */
    cowPriceUsd: string;
    /** Contract address */
    contractAddress: string | null;
    /** Loading state */
    isLoading: boolean;
    /** User's collateral position */
    userPosition: UserPosition | null;
}

const defaultState: COWContractState = {
    isSupported: false,
    cowBalance: '0',
    totalCollateral: '0',
    totalSupply: '0',
    mintFeeBps: 0,
    burnFeeBps: 0,
    spreadBps: 0,
    ltvBps: 0,
    liquidationThreshold: 0,
    bnbPrice: '0',
    backingRatio: '1.000',
    isPaused: false,
    cowPriceUsd: '0',
    contractAddress: null,
    isLoading: false,
    userPosition: null,
};

function getHealthStatus(ratio: number, threshold: number): 'healthy' | 'warning' | 'danger' {
    if (ratio === 0) return 'healthy'; // No position
    if (ratio > threshold * 1.5) return 'healthy';   // Well above threshold
    if (ratio > threshold) return 'warning';          // Above but close
    return 'danger';                                   // Below threshold
}

export function useCOWContract(
    provider: BrowserProvider | null,
    chainId: string | null,
    userAddress: string | null
) {
    const [state, setState] = useState<COWContractState>(defaultState);

    const getContract = useCallback(() => {
        let activeProvider = provider as any;
        
        // Fallback to public RPC if no wallet provider is connected
        if (!activeProvider && chainId) {
            const config = getNetworkConfig(chainId);
            if (config?.rpcUrl) {
                activeProvider = new JsonRpcProvider(config.rpcUrl);
            }
        }

        if (!activeProvider || !chainId) return null;
        const address = getCOWTokenAddress(chainId);
        if (!address) return null;
        return new Contract(address, COW_TOKEN_ABI, activeProvider);
    }, [provider, chainId]);

    const getSignedContract = useCallback(async () => {
        if (!provider || !chainId) return null;
        const address = getCOWTokenAddress(chainId);
        if (!address) return null;
        const signer = await provider.getSigner();
        return new Contract(address, COW_TOKEN_ABI, signer);
    }, [provider, chainId]);

    // Fetch contract state
    const refresh = useCallback(async () => {
        const supported = isCOWChainSupported(chainId);
        const contractAddress = getCOWTokenAddress(chainId);

        if (!supported || !provider || !contractAddress) {
            setState({ ...defaultState, isSupported: supported, contractAddress });
            return;
        }

        setState(prev => ({ ...prev, isLoading: true }));

        try {
            const contract = getContract();
            if (!contract) return;

            // 1) Always fetch user balance first (independent of V2 metadata)
            let cowBalance = 0n;
            let userPosition: UserPosition | null = null;

            if (userAddress) {
                try {
                    cowBalance = await contract.balanceOf(userAddress);
                } catch (err) {
                    console.warn('[COW] Failed to fetch balanceOf:', err);
                }

                try {
                    const [collateral, cowMinted, ratio] = await contract.getPosition(userAddress);
                    if (cowMinted > 0n) {
                        userPosition = {
                            collateral: formatEther(collateral),
                            cowMinted: formatEther(cowMinted),
                            collateralRatio: Number(ratio),
                            health: 'healthy',
                        };
                    }
                } catch {
                    // No position or function not available
                }
            }

            // 2) Fetch V2 contract metadata (each independent — one failure won't zero others)
            const FIELD_NAMES = [
                'totalCollateral', 'totalSupply', 'mintFeeBps', 'burnFeeBps',
                'spreadBps', 'ltvBps', 'liquidationThreshold', 'backingRatio',
                'paused', 'getBNBPrice', 'cowPriceUsd',
            ] as const;

            const settled = await Promise.allSettled([
                contract.totalCollateral(),       // 0
                contract.totalSupply(),            // 1
                contract.mintFeeBps(),             // 2
                contract.burnFeeBps(),             // 3
                contract.spreadBps(),              // 4
                contract.ltvBps(),                 // 5
                contract.liquidationThreshold(),   // 6
                contract.backingRatio(),           // 7
                contract.paused(),                 // 8
                contract.getBNBPrice(),            // 9
                contract.cowPriceUsd(),            // 10
            ]);

            const val = <T,>(i: number, fallback: T): T =>
                settled[i].status === 'fulfilled' ? (settled[i] as PromiseFulfilledResult<T>).value : fallback;

            const totalCollateral      = val<bigint>(0, 0n);
            const totalSupply          = val<bigint>(1, 0n);
            const mintFeeBps           = val<bigint>(2, 0n);
            const burnFeeBps           = val<bigint>(3, 0n);
            const spreadBps            = val<bigint>(4, 0n);
            const ltvBps               = val<bigint>(5, 0n);
            const liquidationThreshold = val<bigint>(6, 0n);
            const backingRatio         = val<bigint>(7, 0n);
            const isPaused             = val<boolean>(8, false);
            const bnbPrice             = val<bigint>(9, 0n);
            const cowPriceRaw          = val<bigint>(10, 0n);

            // Log any failed calls for debugging
            settled.forEach((r, i) => {
                if (r.status === 'rejected') {
                    console.warn(`[COW] Failed to fetch ${FIELD_NAMES[i]}:`, r.reason);
                }
            });

            // Update position health now that we have liquidationThreshold
            if (userPosition && liquidationThreshold > 0n) {
                userPosition.health = getHealthStatus(
                    userPosition.collateralRatio,
                    Number(liquidationThreshold)
                );
            }

            setState({
                isSupported: true,
                cowBalance: formatEther(cowBalance),
                totalCollateral: formatEther(totalCollateral),
                totalSupply: formatEther(totalSupply),
                mintFeeBps: Number(mintFeeBps),
                burnFeeBps: Number(burnFeeBps),
                spreadBps: Number(spreadBps),
                ltvBps: Number(ltvBps),
                liquidationThreshold: Number(liquidationThreshold),
                bnbPrice: formatUnits(bnbPrice, 8),
                backingRatio: bnbPrice > 0n ? Number(formatEther(backingRatio)).toFixed(4) : '1.000',
                isPaused,
                cowPriceUsd: formatUnits(cowPriceRaw, 8),
                contractAddress,
                isLoading: false,
                userPosition,
            });
        } catch (err) {
            console.error('Failed to fetch COW contract state:', err);
            setState(prev => ({ ...prev, isLoading: false }));
        }
    }, [provider, chainId, userAddress, getContract]);

    // Auto-refresh on mount and when deps change
    useEffect(() => {
        refresh();
    }, [refresh]);

    // Mint: send BNB to contract and receive COW tokens
    const mintCOW = useCallback(async (bnbAmount: string) => {
        const contract = await getSignedContract();
        if (!contract) throw new Error('Contract not available');

        const tx = await contract.mint({ value: parseEther(bnbAmount) });
        await tx.wait();
        await refresh();
        return tx.hash as string;
    }, [getSignedContract, refresh]);

    // Burn: send COW tokens back and receive BNB
    const burnCOW = useCallback(async (cowAmount: string) => {
        const contract = await getSignedContract();
        if (!contract) throw new Error('Contract not available');

        const tx = await contract.burn(parseEther(cowAmount));
        await tx.wait();
        await refresh();
        return tx.hash as string;
    }, [getSignedContract, refresh]);

    // Liquidate an undercollateralized position
    const liquidatePosition = useCallback(async (userAddr: string) => {
        const contract = await getSignedContract();
        if (!contract) throw new Error('Contract not available');

        const tx = await contract.liquidate(userAddr);
        await tx.wait();
        await refresh();
        return tx.hash as string;
    }, [getSignedContract, refresh]);

    // Preview mint (V2: returns tokensOut, spreadFee, mintFee)
    const previewMint = useCallback(async (bnbAmount: string) => {
        const contract = getContract();
        if (!contract) return { tokensOut: '0', spreadFee: '0', mintFee: '0' };

        try {
            const [tokensOut, spreadFee, mintFee] = await contract.previewMint(parseEther(bnbAmount));
            return {
                tokensOut: formatEther(tokensOut),
                spreadFee: formatEther(spreadFee),
                mintFee: formatEther(mintFee),
            };
        } catch {
            return { tokensOut: '0', spreadFee: '0', mintFee: '0' };
        }
    }, [getContract]);

    // Preview burn (V2: returns bnbOut, spreadFee, burnFee)
    const previewBurn = useCallback(async (cowAmount: string) => {
        const contract = getContract();
        if (!contract) return { bnbOut: '0', spreadFee: '0', burnFee: '0' };

        try {
            const [bnbOut, spreadFee, burnFee] = await contract.previewBurn(parseEther(cowAmount));
            return {
                bnbOut: formatEther(bnbOut),
                spreadFee: formatEther(spreadFee),
                burnFee: formatEther(burnFee),
            };
        } catch {
            return { bnbOut: '0', spreadFee: '0', burnFee: '0' };
        }
    }, [getContract]);

    return {
        ...state,
        mintCOW,
        burnCOW,
        liquidatePosition,
        previewMint,
        previewBurn,
        refresh,
    };
}
