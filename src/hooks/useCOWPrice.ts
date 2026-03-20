import { useState, useEffect, useCallback } from 'react';

const DEFAULT_PRICE = 1.0;
const REFRESH_INTERVAL_MS = 60_000; // 60 seconds

/**
 * Hook to fetch COW/USD price from external API.
 * API URL is configured via VITE_COW_PRICE_API in .env.
 * Auto-refreshes every 60 seconds. Falls back to $1.00 on error.
 *
 * Supported response formats:
 *   - CoinOfWorld: { "status": true, "endRate": 0.2619 }
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
        // Lấy URL cấu hình từ biến môi trường
        let apiUrl = import.meta.env.VITE_COW_PRICE_API || '/api/cow-price';
        
        // Nếu người dùng nhập URL đầy đủ (ví dụ: https://...), 
        // hãy tự động chuyển hướng qua proxy nội bộ để tránh lỗi CORS.
        if (apiUrl.startsWith('http')) {
            apiUrl = '/api/cow-price';
        }
        
        if (!apiUrl) {
            setIsLoading(false);
            setError('API URL không được cấu hình');
            return;
        }

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`API returned ${response.status}`);
            }

            const data = await response.json();
            
            // --- BỘ PHÂN TÁCH GIÁ THÔNG MINH (SMART PARSER) ---
            const tryExtractPrice = (obj: any): number | null => {
                if (!obj) return null;
                // 1. Các định dạng đã biết
                if (typeof obj.endRate === 'number') return obj.endRate;
                if (obj.tether?.usd) return obj.tether.usd;
                if (obj['cow-protocol']?.usd) return obj['cow-protocol'].usd;
                if (obj.price) return parseFloat(obj.price);
                if (typeof obj === 'number') return obj;

                // 2. Tìm kiếm các trường phổ biến
                const commonKeys = ['price', 'usd', 'rate', 'value', 'last', 'priceUsd'];
                for (const key of commonKeys) {
                    if (typeof obj[key] === 'number') return obj[key];
                    if (typeof obj[key] === 'string' && !isNaN(parseFloat(obj[key]))) {
                        return parseFloat(obj[key]);
                    }
                }
                return null;
            };

            const newPrice = tryExtractPrice(data);

            if (newPrice !== null && !isNaN(newPrice) && newPrice > 0) {
                setPrice(newPrice);
                setLastUpdated(new Date());
                setError(null);
            } else {
                throw new Error('Không thể tìm thấy giá trị giá trong dữ liệu API');
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
