import { useState, useEffect, useCallback } from 'react';

const DEFAULT_PRICE = 1.0;
const REFRESH_INTERVAL_MS = 60_000; // 60 seconds

/**
 * Hook to fetch COW/USD price from external API.
 * API URL is configured via VITE_COW_PRICE_API in .env.
 * Auto-refreshes every 60 seconds. Falls back to $1.00 on error.
 *
 * Supported response formats:
 *   - CoinGecko tether: { "tether": { "usd": 1.0 } }
 *   - CoinGecko cow-protocol: { "cow-protocol": { "usd": 0.42 } }
 *   - Binance ticker: { "symbol": "XRPUSDT", "price": "0.6123" }
 *   - Plain number: 1.0012
 */
export function useCOWPrice() {
    const [price, setPrice] = useState<number>(DEFAULT_PRICE);
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchPrice = useCallback(async () => {
        const apiUrl = import.meta.env.VITE_COW_PRICE_API;
        if (!apiUrl) {
            setIsLoading(false);
            setError('VITE_COW_PRICE_API not configured');
            return;
        }

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`API returned ${response.status}`);
            }

            const data = await response.json();
            let newPrice = DEFAULT_PRICE;

            // Parse response based on API format
            if (data?.tether?.usd) {
                // CoinGecko tether format
                newPrice = data.tether.usd;
            } else if (data?.['cow-protocol']?.usd) {
                // CoinGecko cow-protocol format
                newPrice = data['cow-protocol'].usd;
            } else if (data?.price) {
                // Binance ticker format: { "symbol": "...", "price": "0.6123" }
                newPrice = parseFloat(data.price);
            } else if (typeof data === 'number') {
                // Plain number
                newPrice = data;
            }

            if (!isNaN(newPrice) && newPrice > 0) {
                setPrice(newPrice);
                setLastUpdated(new Date());
                setError(null);
            } else {
                throw new Error('Invalid price data from API');
            }
        } catch (err) {
            console.warn('[COW Price] Failed to fetch, using fallback:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
            // Keep previous price on failure
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPrice();
        const interval = setInterval(fetchPrice, REFRESH_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [fetchPrice]);

    return {
        cowPriceUsd: price,
        isLoading,
        lastUpdated,
        error,
        refresh: fetchPrice,
    };
}
