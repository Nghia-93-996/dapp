import { useState, useEffect, useCallback } from 'react';
import { Contract, formatEther } from 'ethers';
import type { BrowserProvider } from 'ethers';
import { COW_TOKEN_ABI, getCOWTokenAddress, isCOWChainSupported } from '../contracts/cowConfig';

export interface TokenTransaction {
    type: 'mint' | 'burn' | 'liquidation';
    user: string;
    bnbAmount: string;
    tokenAmount: string;
    fee: string;
    txHash: string;
    blockNumber: number;
    timestamp?: number;
}

export function useTransactionHistory(
    provider: BrowserProvider | null,
    chainId: string | null,
) {
    const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchHistory = useCallback(async () => {
        if (!provider || !isCOWChainSupported(chainId)) {
            setTransactions([]);
            return;
        }

        const address = getCOWTokenAddress(chainId);
        if (!address) return;

        setIsLoading(true);

        try {
            const contract = new Contract(address, COW_TOKEN_ABI, provider);

            // Query events from recent blocks
            const currentBlock = await provider.getBlockNumber();
            const fromBlock = Math.max(0, currentBlock - 4999);

            const [mintEvents, burnEvents, liquidationEvents] = await Promise.all([
                contract.queryFilter(contract.filters.Minted(), fromBlock, currentBlock),
                contract.queryFilter(contract.filters.Burned(), fromBlock, currentBlock),
                contract.queryFilter(contract.filters.Liquidated(), fromBlock, currentBlock),
            ]);

            const allTxs: TokenTransaction[] = [];

            // V2 Minted event: (user, bnbDeposited, tokensReceived, spreadFee, mintFee, bnbPriceUsd)
            for (const event of mintEvents) {
                const log = event as unknown as {
                    args: [string, bigint, bigint, bigint, bigint, bigint];
                    transactionHash: string;
                    blockNumber: number;
                };
                const spreadFee = log.args[3];
                const mintFee = log.args[4];
                allTxs.push({
                    type: 'mint',
                    user: log.args[0],
                    bnbAmount: formatEther(log.args[1]),
                    tokenAmount: formatEther(log.args[2]),
                    fee: formatEther(spreadFee + mintFee),
                    txHash: log.transactionHash,
                    blockNumber: log.blockNumber,
                });
            }

            // V2 Burned event: (user, tokensBurned, bnbReturned, spreadFee, burnFee, bnbPriceUsd)
            for (const event of burnEvents) {
                const log = event as unknown as {
                    args: [string, bigint, bigint, bigint, bigint, bigint];
                    transactionHash: string;
                    blockNumber: number;
                };
                const spreadFee = log.args[3];
                const burnFee = log.args[4];
                allTxs.push({
                    type: 'burn',
                    user: log.args[0],
                    bnbAmount: formatEther(log.args[2]),
                    tokenAmount: formatEther(log.args[1]),
                    fee: formatEther(spreadFee + burnFee),
                    txHash: log.transactionHash,
                    blockNumber: log.blockNumber,
                });
            }

            // V2 Liquidated event: (user, liquidator, collateralSeized, debtRepaid, penalty, bnbPriceUsd)
            for (const event of liquidationEvents) {
                const log = event as unknown as {
                    args: [string, string, bigint, bigint, bigint, bigint];
                    transactionHash: string;
                    blockNumber: number;
                };
                allTxs.push({
                    type: 'liquidation',
                    user: log.args[0],
                    bnbAmount: formatEther(log.args[2]),
                    tokenAmount: formatEther(log.args[3]),
                    fee: formatEther(log.args[4]),
                    txHash: log.transactionHash,
                    blockNumber: log.blockNumber,
                });
            }

            // Sort by block number descending (newest first)
            allTxs.sort((a, b) => b.blockNumber - a.blockNumber);

            // Fetch timestamps for each block (batch)
            const uniqueBlocks = [...new Set(allTxs.map(tx => tx.blockNumber))];
            const blockTimestamps: Record<number, number> = {};

            const blockPromises = uniqueBlocks.slice(0, 20).map(async (blockNum) => {
                try {
                    const block = await provider.getBlock(blockNum);
                    if (block) blockTimestamps[blockNum] = block.timestamp;
                } catch {
                    // skip
                }
            });
            await Promise.all(blockPromises);

            for (const tx of allTxs) {
                tx.timestamp = blockTimestamps[tx.blockNumber];
            }

            setTransactions(allTxs);
        } catch (err) {
            console.error('Failed to fetch transaction history:', err);
        } finally {
            setIsLoading(false);
        }
    }, [provider, chainId]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    return { transactions, isLoading, refresh: fetchHistory };
}
