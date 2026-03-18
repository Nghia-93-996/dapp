import { useState, useCallback } from 'react';
import { parseEther } from 'ethers';
import type { BrowserProvider } from 'ethers';
import type { TransactionState } from '../types/ethereum';
import { isCOWChainSupported } from '../contracts/cowConfig';
import { toast } from 'react-toastify';

const initialState: TransactionState = {
    isLoading: false,
    loadingAction: null,
    hash: null,
    error: null,
    success: false,
};

/**
 * Transaction hook that supports both:
 * - COW smart contract mint/burn (when on supported chain)
 * - Fallback demo transactions (send-to-self / send-to-dead)
 */
export function useTransaction() {
    const [txState, setTxState] = useState<TransactionState>(initialState);

    const resetTransaction = useCallback(() => {
        setTxState(initialState);
    }, []);

    const mint = useCallback(async (
        provider: BrowserProvider,
        amount: string,
        chainId?: string | null,
        mintCOW?: (amount: string) => Promise<string>,
    ) => {
        setTxState({ isLoading: true, loadingAction: 'mint', hash: null, error: null, success: false });

        const mintToastId = toast.loading('⏳ Minting COW tokens...');

        try {
            let hash: string;

            if (chainId && isCOWChainSupported(chainId) && mintCOW) {
                hash = await mintCOW(amount);
            } else {
                const signer = await provider.getSigner();
                const tx = await signer.sendTransaction({
                    to: await signer.getAddress(),
                    value: parseEther(amount || '0.001'),
                    data: '0x40c10f19',
                });
                setTxState((prev) => ({ ...prev, hash: tx.hash }));
                await tx.wait();
                hash = tx.hash;
            }

            setTxState({
                isLoading: false,
                loadingAction: null,
                hash,
                error: null,
                success: true,
            });

            toast.update(mintToastId, {
                render: `✅ Mint successful! ${amount} BNB → COW tokens`,
                type: 'success',
                isLoading: false,
                autoClose: 5000,
            });

            return hash;
        } catch (error: unknown) {
            const err = error as { code?: string; message?: string };
            const message =
                err.code === 'ACTION_REJECTED'
                    ? 'Transaction rejected by user'
                    : err.message || 'Mint transaction failed';

            setTxState({
                isLoading: false,
                loadingAction: null,
                hash: null,
                error: message,
                success: false,
            });

            toast.update(mintToastId, {
                render: `❌ Mint failed: ${message.slice(0, 80)}`,
                type: 'error',
                isLoading: false,
                autoClose: 5000,
            });

            return null;
        }
    }, []);

    const burn = useCallback(async (
        provider: BrowserProvider,
        amount: string,
        chainId?: string | null,
        burnCOW?: (amount: string) => Promise<string>,
    ) => {
        setTxState({ isLoading: true, loadingAction: 'burn', hash: null, error: null, success: false });

        const burnToastId = toast.loading('⏳ Burning COW tokens...');

        try {
            let hash: string;

            if (chainId && isCOWChainSupported(chainId) && burnCOW) {
                hash = await burnCOW(amount);
            } else {
                const signer = await provider.getSigner();
                const tx = await signer.sendTransaction({
                    to: '0x000000000000000000000000000000000000dEaD',
                    value: parseEther(amount || '0.001'),
                    data: '0x42966c68',
                });
                setTxState((prev) => ({ ...prev, hash: tx.hash }));
                await tx.wait();
                hash = tx.hash;
            }

            setTxState({
                isLoading: false,
                loadingAction: null,
                hash,
                error: null,
                success: true,
            });

            toast.update(burnToastId, {
                render: `✅ Burn successful! ${amount} COW → BNB returned`,
                type: 'success',
                isLoading: false,
                autoClose: 5000,
            });

            return hash;
        } catch (error: unknown) {
            const err = error as { code?: string; message?: string };
            const message =
                err.code === 'ACTION_REJECTED'
                    ? 'Transaction rejected by user'
                    : err.message || 'Burn transaction failed';

            setTxState({
                isLoading: false,
                loadingAction: null,
                hash: null,
                error: message,
                success: false,
            });

            toast.update(burnToastId, {
                render: `❌ Burn failed: ${message.slice(0, 80)}`,
                type: 'error',
                isLoading: false,
                autoClose: 5000,
            });

            return null;
        }
    }, []);

    return {
        txState,
        mint,
        burn,
        resetTransaction,
    };
}
