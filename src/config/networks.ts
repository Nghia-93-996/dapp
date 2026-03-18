export interface NetworkConfig {
    chainId: string;
    chainIdDecimal: number;
    name: string;
    shortName: string;
    currency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    rpcUrl: string;
    blockExplorerUrl: string;
    isTestnet: boolean;
}

export const NETWORKS: Record<string, NetworkConfig> = {
    '0x1': {
        chainId: '0x1',
        chainIdDecimal: 1,
        name: 'Ethereum Mainnet',
        shortName: 'Ethereum',
        currency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        rpcUrl: 'https://eth.llamarpc.com',
        blockExplorerUrl: 'https://etherscan.io',
        isTestnet: false,
    },
    '0xaa36a7': {
        chainId: '0xaa36a7',
        chainIdDecimal: 11155111,
        name: 'Sepolia Testnet',
        shortName: 'Sepolia',
        currency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
        rpcUrl: 'https://rpc.sepolia.org',
        blockExplorerUrl: 'https://sepolia.etherscan.io',
        isTestnet: true,
    },
    '0x38': {
        chainId: '0x38',
        chainIdDecimal: 56,
        name: 'BNB Smart Chain',
        shortName: 'BSC',
        currency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
        rpcUrl: 'https://bsc-dataseed.binance.org',
        blockExplorerUrl: 'https://bscscan.com',
        isTestnet: false,
    },
    '0x61': {
        chainId: '0x61',
        chainIdDecimal: 97,
        name: 'BSC Testnet',
        shortName: 'BSC Testnet',
        currency: { name: 'Test BNB', symbol: 'tBNB', decimals: 18 },
        rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
        blockExplorerUrl: 'https://testnet.bscscan.com',
        isTestnet: true,
    },
    '0x89': {
        chainId: '0x89',
        chainIdDecimal: 137,
        name: 'Polygon',
        shortName: 'Polygon',
        currency: { name: 'POL', symbol: 'POL', decimals: 18 },
        rpcUrl: 'https://polygon-rpc.com',
        blockExplorerUrl: 'https://polygonscan.com',
        isTestnet: false,
    },
    '0xa4b1': {
        chainId: '0xa4b1',
        chainIdDecimal: 42161,
        name: 'Arbitrum One',
        shortName: 'Arbitrum',
        currency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        rpcUrl: 'https://arb1.arbitrum.io/rpc',
        blockExplorerUrl: 'https://arbiscan.io',
        isTestnet: false,
    },
    '0xa': {
        chainId: '0xa',
        chainIdDecimal: 10,
        name: 'Optimism',
        shortName: 'Optimism',
        currency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        rpcUrl: 'https://mainnet.optimism.io',
        blockExplorerUrl: 'https://optimistic.etherscan.io',
        isTestnet: false,
    },
    '0xa86a': {
        chainId: '0xa86a',
        chainIdDecimal: 43114,
        name: 'Avalanche C-Chain',
        shortName: 'Avalanche',
        currency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
        rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
        blockExplorerUrl: 'https://snowtrace.io',
        isTestnet: false,
    },
};

/** Primary networks shown in the network switcher */
export const SWITCHABLE_NETWORKS = ['0x38', '0x61'];

export function getNetworkConfig(chainId: string | null): NetworkConfig | null {
    if (!chainId) return null;
    return NETWORKS[chainId] || null;
}

export function getNetworkName(chainId: string | null): string {
    if (!chainId) return 'Unknown';
    const network = NETWORKS[chainId];
    return network ? network.shortName : `Chain ${parseInt(chainId, 16)}`;
}

export function getNativeCurrency(chainId: string | null): string {
    if (!chainId) return 'ETH';
    const network = NETWORKS[chainId];
    return network ? network.currency.symbol : 'ETH';
}

export function getExplorerTxUrl(chainId: string | null, txHash: string): string | null {
    if (!chainId) return null;
    const network = NETWORKS[chainId];
    if (!network) return null;
    return `${network.blockExplorerUrl}/tx/${txHash}`;
}

export function getExplorerAddressUrl(chainId: string | null, address: string): string | null {
    if (!chainId) return null;
    const network = NETWORKS[chainId];
    if (!network) return null;
    return `${network.blockExplorerUrl}/address/${address}`;
}
