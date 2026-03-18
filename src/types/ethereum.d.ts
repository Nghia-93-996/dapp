import { BrowserProvider } from 'ethers';

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
      selectedAddress: string | null;
    };
  }
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: string | null;
  balance: string | null;
  provider: BrowserProvider | null;
}

export interface TransactionState {
  isLoading: boolean;
  loadingAction: 'mint' | 'burn' | null;
  hash: string | null;
  error: string | null;
  success: boolean;
}
