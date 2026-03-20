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
  isPriceUpdater: boolean; // New
  ownerAddress: string;
  priceUpdater: string;    // New
  isPaused: boolean;
  feeCollector: string;
  treasury2: string;
  isLoading: boolean;
}

// ─── Constants ─────────────────────────────────────────────────────

/** Timelock address (owner of COWToken after deployment) */
const KNOWN_OWNER = '0x01487E36Ec2Bd4b34885F3DF31d59D8451A86413';

/** Deployer / priceUpdater — authorized to call setCOWPrice directly */
const CONTRACT_CREATOR = '0x65E8c1434E348EE409A0d6488b9e293C3fFdd998';

const STORAGE_KEY = 'cow-timelock-ops';

const DEFAULT_ADMIN_STATE: AdminState = {
  isOwner: false,
  isPriceUpdater: false,
  ownerAddress: KNOWN_OWNER,
  priceUpdater: '',
  isPaused: false,
  feeCollector: '',
  treasury2: '',
  isLoading: false,
};

const OPS_REFRESH_INTERVAL_MS = 30_000;

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

// ─── Helpers ───────────────────────────────────────────────────────

/** Check if a user address matches the contract owner or deployer/creator */
function isAuthorizedAdmin(userAddress: string, ownerAddress: string): boolean {
  const user = userAddress.toLowerCase();
  return (
    (!!ownerAddress && user === ownerAddress.toLowerCase()) ||
    user === CONTRACT_CREATOR.toLowerCase()
  );
}

/** Extract value from a settled promise result with fallback */
function settledValue<T>(settled: PromiseSettledResult<T>[], index: number, fallback: T): T {
  const result = settled[index];
  return result.status === 'fulfilled' ? result.value : fallback;
}

// ─── Hook ──────────────────────────────────────────────────────────

export function useAdminContract(
  provider: BrowserProvider | null,
  chainId: string | null,
  userAddress: string | null
) {
  const [state, setState] = useState<AdminState>(DEFAULT_ADMIN_STATE);
  const [pendingOps, setPendingOps] = useState<TimelockOp[]>([]);
  const refreshInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Contract factories ──

  /** Read-only COWToken contract */
  const getCowContract = useCallback(() => {
    if (!provider || !chainId) return null;
    const address = getCOWTokenAddress(chainId);
    if (!address) return null;
    return new Contract(address, COW_TOKEN_ABI, provider);
  }, [provider, chainId]);

  /** Signed COWToken contract (for direct calls like setCOWPrice) */
  const getSignedCowContract = useCallback(async () => {
    if (!provider || !chainId) return null;
    const address = getCOWTokenAddress(chainId);
    if (!address) return null;
    const signer = await provider.getSigner();
    return new Contract(address, COW_TOKEN_ABI, signer);
  }, [provider, chainId]);

  /** Signed Timelock contract */
  const getSignedTimelock = useCallback(async () => {
    if (!provider || !chainId) return null;
    const address = getTimelockAddress(chainId);
    if (!address) return null;
    const signer = await provider.getSigner();
    return new Contract(address, TIMELOCK_ABI, signer);
  }, [provider, chainId]);

  /** Read-only Timelock contract */
  const getReadTimelock = useCallback(() => {
    if (!provider || !chainId) return null;
    const address = getTimelockAddress(chainId);
    if (!address) return null;
    return new Contract(address, TIMELOCK_ABI, provider);
  }, [provider, chainId]);

  // ── Fetch admin state ──

  const refresh = useCallback(async () => {
    if (!isCOWChainSupported(chainId) || !provider) {
      setState(DEFAULT_ADMIN_STATE);
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
        contract.priceUpdater(), // New
      ]);

      const ownerAddress  = settledValue<string>(settled, 0, '');
      const isPaused      = settledValue<boolean>(settled, 1, false);
      const feeCollector  = settledValue<string>(settled, 2, '');
      const treasury2     = settledValue<string>(settled, 3, '');
      const priceUpdater  = settledValue<string>(settled, 4, '');

      setState({
        isOwner: !!userAddress && isAuthorizedAdmin(userAddress, ownerAddress),
        isPriceUpdater: !!userAddress && userAddress.toLowerCase() === priceUpdater.toLowerCase(),
        ownerAddress,
        priceUpdater,
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

    const updated: TimelockOp[] = [];

    for (const op of ops) {
      try {
        const [isDone, isReady, isPending] = await Promise.all([
          timelock.isOperationDone(op.id),
          timelock.isOperationReady(op.id),
          timelock.isOperationPending(op.id),
        ]);

        if (isDone) op.status = 'done';
        else if (isReady) op.status = 'ready';
        else if (isPending) op.status = 'pending';
        else op.status = 'cancelled';
      } catch (err) {
        console.warn('[Timelock] Status check failed for', op.id, err);
      }

      // Keep active ops only
      if (op.status !== 'done' && op.status !== 'cancelled') {
        updated.push(op);
      }
    }

    saveOps(chainId, updated);
    setPendingOps(updated);
  }, [chainId, getReadTimelock]);

  useEffect(() => { refreshOps(); }, [refreshOps]);

  // Auto-refresh ops periodically
  useEffect(() => {
    if (refreshInterval.current) clearInterval(refreshInterval.current);
    refreshInterval.current = setInterval(refreshOps, OPS_REFRESH_INTERVAL_MS);
    return () => { if (refreshInterval.current) clearInterval(refreshInterval.current); };
  }, [refreshOps]);

  // ── Timelock: Schedule → Execute → Cancel ──

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

    const tx = await timelock.schedule(cowAddr, 0, calldata, ZeroHash, salt, TIMELOCK_MIN_DELAY);
    await tx.wait();

    // Persist to localStorage
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

    const ops = [...loadOps(chainId), newOp];
    saveOps(chainId, ops);
    setPendingOps(ops);

    return tx.hash;
  }, [chainId, getSignedTimelock]);

  const executeOp = useCallback(async (op: TimelockOp): Promise<string> => {
    if (!chainId) throw new Error('No chain connected');
    const cowAddr = getCOWTokenAddress(chainId);
    if (!cowAddr) throw new Error('COWToken not deployed on this chain');

    const timelock = await getSignedTimelock();
    if (!timelock) throw new Error('Timelock contract not available');

    const isReady = await timelock.isOperationReady(op.id);
    if (!isReady) throw new Error('Operation not ready yet. Please wait for the timelock delay.');

    const tx = await timelock.execute(cowAddr, 0, op.calldata, ZeroHash, op.salt);
    await tx.wait();

    const ops = loadOps(chainId).filter(o => o.id !== op.id);
    saveOps(chainId, ops);
    setPendingOps(ops);

    await refresh();
    return tx.hash;
  }, [chainId, getSignedTimelock, refresh]);

  const cancelOp = useCallback(async (op: TimelockOp): Promise<string> => {
    const timelock = await getSignedTimelock();
    if (!timelock || !chainId) throw new Error('Timelock not available');

    const tx = await timelock.cancel(op.id);
    await tx.wait();

    const ops = loadOps(chainId).filter(o => o.id !== op.id);
    saveOps(chainId, ops);
    setPendingOps(ops);

    return tx.hash;
  }, [chainId, getSignedTimelock]);

  // ── Timelocked admin actions (48h delay) ──

  const setMintFee              = useCallback((bps: number) => scheduleOp('setMintFee', [bps]), [scheduleOp]);
  const setBurnFee              = useCallback((bps: number) => scheduleOp('setBurnFee', [bps]), [scheduleOp]);
  const setSpreadBps            = useCallback((bps: number) => scheduleOp('setSpreadBps', [bps]), [scheduleOp]);
  const setLtv                  = useCallback((bps: number) => scheduleOp('setLtv', [bps]), [scheduleOp]);
  const setLiquidationThreshold = useCallback((bps: number) => scheduleOp('setLiquidationThreshold', [bps]), [scheduleOp]);
  const setFeeCollector         = useCallback((addr: string) => scheduleOp('setFeeCollector', [addr]), [scheduleOp]);
  const setTreasury2            = useCallback((addr: string) => scheduleOp('setTreasury2', [addr]), [scheduleOp]);
  const setPriceFeed            = useCallback((addr: string) => scheduleOp('setPriceFeed', [addr]), [scheduleOp]);
  const pause                   = useCallback(() => scheduleOp('pause', []), [scheduleOp]);
  const unpause                 = useCallback(() => scheduleOp('unpause', []), [scheduleOp]);

  // ── Direct admin actions (no Timelock delay) ──

  /** Update COW/USD price — calls contract directly via priceUpdater role (instant) */
  const setCOWPrice = useCallback(async (priceUsd8Decimals: bigint): Promise<string> => {
    const contract = await getSignedCowContract();
    if (!contract) throw new Error('COWToken contract not available');

    const tx = await contract.setCOWPrice(priceUsd8Decimals);
    await tx.wait();
    await refresh();
    return tx.hash;
  }, [getSignedCowContract, refresh]);

  // ── Return ──

  return {
    ...state,
    refresh,

    // Timelock ops management
    pendingOps,
    refreshOps,
    executeOp,
    cancelOp,

    // Timelocked admin actions (48h delay)
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

    // Direct admin actions (instant)
    setCOWPrice,
  };
}
