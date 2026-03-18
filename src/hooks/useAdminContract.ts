import { useState, useCallback, useEffect, useRef } from 'react';
import { Contract, Interface, keccak256, AbiCoder, ZeroHash } from 'ethers';
import type { BrowserProvider } from 'ethers';
import {
  COW_TOKEN_ABI, getCOWTokenAddress, isCOWChainSupported,
  TIMELOCK_ABI, getTimelockAddress, TIMELOCK_MIN_DELAY,
} from '../contracts/cowConfig';

// ─── Types ─────────────────────────────────────────────────────────

export interface TimelockOp {
  id: string;           // operation hash (bytes32)
  functionName: string; // e.g. "setMintFee"
  args: string[];       // stringified args
  salt: string;         // bytes32 salt
  calldata: string;     // encoded calldata
  scheduledAt: number;  // unix timestamp (ms)
  executeAfter: number; // unix timestamp (ms) — when execution becomes possible
  status: 'pending' | 'ready' | 'done' | 'cancelled';
}

export interface AdminState {
  isOwner: boolean;
  ownerAddress: string;
  isPaused: boolean;
  feeCollector: string;
  treasury2: string;
  isLoading: boolean;
}

const KNOWN_OWNER = '0xE81ff03d5Da09eaa843B8E0ef60C7f357F858B58';
const CONTRACT_CREATOR = '0xb0a5A0b9bFf9433958006826372198a4e74c5802';
const STORAGE_KEY = 'cow-timelock-ops';

const defaultAdminState: AdminState = {
  isOwner: false,
  ownerAddress: KNOWN_OWNER,
  isPaused: false,
  feeCollector: '',
  treasury2: '',
  isLoading: false,
};

// ─── localStorage helpers ──────────────────────────────────────────

function loadOps(chainId: string): TimelockOp[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}-${chainId}`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveOps(chainId: string, ops: TimelockOp[]) {
  localStorage.setItem(`${STORAGE_KEY}-${chainId}`, JSON.stringify(ops));
}

// ─── Hook ──────────────────────────────────────────────────────────

export function useAdminContract(
  provider: BrowserProvider | null,
  chainId: string | null,
  userAddress: string | null
) {
  const [state, setState] = useState<AdminState>(defaultAdminState);
  const [pendingOps, setPendingOps] = useState<TimelockOp[]>([]);
  const refreshInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Contract getters ──

  const getCowContract = useCallback(() => {
    if (!provider || !chainId) return null;
    const address = getCOWTokenAddress(chainId);
    if (!address) return null;
    return new Contract(address, COW_TOKEN_ABI, provider);
  }, [provider, chainId]);

  const getSignedTimelock = useCallback(async () => {
    if (!provider || !chainId) return null;
    const address = getTimelockAddress(chainId);
    if (!address) return null;
    const signer = await provider.getSigner();
    return new Contract(address, TIMELOCK_ABI, signer);
  }, [provider, chainId]);

  const getReadTimelock = useCallback(() => {
    if (!provider || !chainId) return null;
    const address = getTimelockAddress(chainId);
    if (!address) return null;
    return new Contract(address, TIMELOCK_ABI, provider);
  }, [provider, chainId]);

  // ── Fetch admin state ──

  const refresh = useCallback(async () => {
    if (!isCOWChainSupported(chainId) || !provider) {
      setState(defaultAdminState);
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const contract = getCowContract();
      if (!contract) return;

      const settled = await Promise.allSettled([
        contract.owner(),
        contract.paused(),
        contract.feeCollector(),
        contract.treasury2(),
      ]);

      const val = <T,>(i: number, fallback: T): T =>
        settled[i].status === 'fulfilled' ? (settled[i] as PromiseFulfilledResult<T>).value : fallback;

      const ownerAddress = val<string>(0, '');
      const isPaused = val<boolean>(1, false);
      const feeCollector = val<string>(2, '');
      const treasury2 = val<string>(3, '');

      const isOwner = !!userAddress && (
        (!!ownerAddress && userAddress.toLowerCase() === ownerAddress.toLowerCase()) ||
        userAddress.toLowerCase() === CONTRACT_CREATOR.toLowerCase()
      );

      setState({
        isOwner,
        ownerAddress,
        isPaused,
        feeCollector,
        treasury2,
        isLoading: false,
      });
    } catch (err) {
      console.error('[Admin] Failed to fetch admin state:', err);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [provider, chainId, userAddress, getCowContract]);

  useEffect(() => { refresh(); }, [refresh]);

  // ── Sync pending ops from localStorage + check on-chain status ──

  const refreshOps = useCallback(async () => {
    if (!chainId) return;
    const ops = loadOps(chainId);
    if (ops.length === 0) { setPendingOps([]); return; }

    const timelock = getReadTimelock();
    if (!timelock) { setPendingOps(ops); return; }

    // Update statuses from chain
    const updated: TimelockOp[] = [];
    for (const op of ops) {
      try {
        const [isDone, isReady, isPending] = await Promise.all([
          timelock.isOperationDone(op.id),
          timelock.isOperationReady(op.id),
          timelock.isOperationPending(op.id),
        ]);
        if (isDone) { op.status = 'done'; }
        else if (isReady) { op.status = 'ready'; }
        else if (isPending) { op.status = 'pending'; }
        else { op.status = 'cancelled'; }
      } catch (err) {
        console.warn('[Timelock] Status check failed for', op.id, err);
      }
      // Keep non-done, non-cancelled ops
      if (op.status !== 'done' && op.status !== 'cancelled') {
        updated.push(op);
      }
    }

    saveOps(chainId, updated);
    setPendingOps(updated);
  }, [chainId, getReadTimelock]);

  useEffect(() => { refreshOps(); }, [refreshOps]);

  // Auto-refresh ops every 30s
  useEffect(() => {
    if (refreshInterval.current) clearInterval(refreshInterval.current);
    refreshInterval.current = setInterval(refreshOps, 30_000);
    return () => { if (refreshInterval.current) clearInterval(refreshInterval.current); };
  }, [refreshOps]);

  // ── Timelock: Schedule operation ──

  const scheduleOp = useCallback(async (functionName: string, args: unknown[]): Promise<string> => {
    if (!chainId) throw new Error('No chain connected');
    const cowAddr = getCOWTokenAddress(chainId);
    if (!cowAddr) throw new Error('COWToken not deployed on this chain');

    const timelock = await getSignedTimelock();
    if (!timelock) throw new Error('Timelock contract not available');

    // Encode calldata for COWToken function
    const iface = new Interface(COW_TOKEN_ABI);
    const calldata = iface.encodeFunctionData(functionName, args);

    // Generate unique salt
    const salt = keccak256(
      AbiCoder.defaultAbiCoder().encode(
        ['string', 'uint256'],
        [`${functionName}-${args.join('-')}`, Date.now()]
      )
    );

    // Calculate operation ID (matches TimelockController.hashOperation)
    const operationId = keccak256(
      AbiCoder.defaultAbiCoder().encode(
        ['address', 'uint256', 'bytes', 'bytes32', 'bytes32'],
        [cowAddr, 0, calldata, ZeroHash, salt]
      )
    );

    // Send schedule transaction
    const tx = await timelock.schedule(
      cowAddr,
      0,
      calldata,
      ZeroHash,
      salt,
      TIMELOCK_MIN_DELAY
    );
    await tx.wait();

    // Save to localStorage
    const now = Date.now();
    const newOp: TimelockOp = {
      id: operationId,
      functionName,
      args: args.map(String),
      salt,
      calldata,
      scheduledAt: now,
      executeAfter: now + TIMELOCK_MIN_DELAY * 1000,
      status: 'pending',
    };

    const ops = loadOps(chainId);
    ops.push(newOp);
    saveOps(chainId, ops);
    setPendingOps(ops);

    return tx.hash;
  }, [chainId, getSignedTimelock]);

  // ── Timelock: Execute operation ──

  const executeOp = useCallback(async (op: TimelockOp): Promise<string> => {
    if (!chainId) throw new Error('No chain connected');
    const cowAddr = getCOWTokenAddress(chainId);
    if (!cowAddr) throw new Error('COWToken not deployed on this chain');

    const timelock = await getSignedTimelock();
    if (!timelock) throw new Error('Timelock contract not available');

    // Verify operation is ready
    const isReady = await timelock.isOperationReady(op.id);
    if (!isReady) throw new Error('Operation not ready yet. Please wait for the timelock delay.');

    const tx = await timelock.execute(
      cowAddr,
      0,
      op.calldata,
      ZeroHash,
      op.salt
    );
    await tx.wait();

    // Remove from localStorage
    const ops = loadOps(chainId).filter(o => o.id !== op.id);
    saveOps(chainId, ops);
    setPendingOps(ops);

    await refresh();
    return tx.hash;
  }, [chainId, getSignedTimelock, refresh]);

  // ── Timelock: Cancel operation ──

  const cancelOp = useCallback(async (op: TimelockOp): Promise<string> => {
    const timelock = await getSignedTimelock();
    if (!timelock || !chainId) throw new Error('Timelock not available');

    const tx = await timelock.cancel(op.id);
    await tx.wait();

    // Remove from localStorage
    const ops = loadOps(chainId).filter(o => o.id !== op.id);
    saveOps(chainId, ops);
    setPendingOps(ops);

    return tx.hash;
  }, [chainId, getSignedTimelock]);

  // ── Convenience wrappers (schedule through Timelock) ──

  const setMintFee = useCallback((bps: number) =>
    scheduleOp('setMintFee', [bps]), [scheduleOp]);

  const setBurnFee = useCallback((bps: number) =>
    scheduleOp('setBurnFee', [bps]), [scheduleOp]);

  const setSpreadBps = useCallback((bps: number) =>
    scheduleOp('setSpreadBps', [bps]), [scheduleOp]);

  const setLtv = useCallback((bps: number) =>
    scheduleOp('setLtv', [bps]), [scheduleOp]);

  const setLiquidationThreshold = useCallback((bps: number) =>
    scheduleOp('setLiquidationThreshold', [bps]), [scheduleOp]);

  const setFeeCollector = useCallback((address: string) =>
    scheduleOp('setFeeCollector', [address]), [scheduleOp]);

  const setTreasury2 = useCallback((address: string) =>
    scheduleOp('setTreasury2', [address]), [scheduleOp]);

  const setPriceFeed = useCallback((address: string) =>
    scheduleOp('setPriceFeed', [address]), [scheduleOp]);

  const pause = useCallback(() =>
    scheduleOp('pause', []), [scheduleOp]);

  const unpause = useCallback(() =>
    scheduleOp('unpause', []), [scheduleOp]);

  return {
    ...state,
    refresh,
    // Timelock operations
    pendingOps,
    refreshOps,
    executeOp,
    cancelOp,
    // Schedule wrappers (same API names as before)
    setMintFee,
    setBurnFee,
    setSpreadBps,
    setLtv,
    setLiquidationThreshold,
    setFeeCollector,
    setTreasury2,
    setPriceFeed,
    pause,
    unpause,
  };
}
