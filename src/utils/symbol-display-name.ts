import { tradingTimesService } from '@/components/shared/services/trading-times-service';

/**
 * Get display name for a symbol from underlying_symbol
 * @param underlying_symbol - The underlying symbol code (e.g., "1HZ100V", "frxEURUSD")
 * @returns Promise<string> - The display name (e.g., "Volatility 100 (1s) Index", "EUR/USD")
 */
export const getSymbolDisplayName = async (underlying_symbol: string): Promise<string> => {
    if (!underlying_symbol) {
        return '';
    }

    try {
        const trading_times = await tradingTimesService.getTradingTimes();

        // Search through all markets and submarkets to find the symbol
        for (const market of trading_times.markets || []) {
            for (const submarket of market.submarkets || []) {
                for (const symbol of submarket.symbols || []) {
                    if (symbol.underlying_symbol === underlying_symbol || symbol.symbol === underlying_symbol) {
                        return symbol.display_name || underlying_symbol;
                    }
                }
            }
        }
    } catch (error) {
        console.warn('Failed to get symbol display name:', error);
    }

    // Fallback: return the underlying symbol as-is if not found
    return underlying_symbol;
};

/**
 * Synchronous version that uses a static mapping for common symbols
 * This is useful when async calls are not feasible
 */
export const getSymbolDisplayNameSync = (underlying_symbol: string): string => {
    if (!underlying_symbol) {
        return '';
    }

    // Static mapping for common symbols
    const symbolMap: Record<string, string> = {
        // Volatility Indices (both formats)
        R_10: 'Volatility 10 Index',
        R_25: 'Volatility 25 Index',
        R_50: 'Volatility 50 Index',
        R_75: 'Volatility 75 Index',
        R_100: 'Volatility 100 Index',
        '1HZ10V': 'Volatility 10 (1s) Index',
        '1HZ15V': 'Volatility 15 (1s) Index',
        '1HZ25V': 'Volatility 25 (1s) Index',
        '1HZ30V': 'Volatility 30 (1s) Index',
        '1HZ50V': 'Volatility 50 (1s) Index',
        '1HZ75V': 'Volatility 75 (1s) Index',
        '1HZ90V': 'Volatility 90 (1s) Index',
        '1HZ100V': 'Volatility 100 (1s) Index',

        // Step Indices
        STEPINDICES: 'Step Index',

        // Crash/Boom
        CRASH500: 'Crash 500 Index',
        CRASH1000: 'Crash 1000 Index',
        BOOM500: 'Boom 500 Index',
        BOOM1000: 'Boom 1000 Index',

        // Jump Indices
        JD10: 'Jump 10 Index',
        JD25: 'Jump 25 Index',
        JD50: 'Jump 50 Index',
        JD75: 'Jump 75 Index',
        JD100: 'Jump 100 Index',

        // Forex Major Pairs
        frxEURUSD: 'EUR/USD',
        frxGBPUSD: 'GBP/USD',
        frxUSDJPY: 'USD/JPY',
        frxAUDUSD: 'AUD/USD',
        frxAUDCAD: 'AUD/CAD',
        frxEURGBP: 'EUR/GBP',
        frxEURJPY: 'EUR/JPY',
        frxGBPJPY: 'GBP/JPY',

        // Forex Baskets
        WLDAUD: 'AUD Basket',
        WLDEUR: 'EUR Basket',
        WLDGBP: 'GBP Basket',
        WLDUSD: 'USD Basket',

        // Stock Indices
        OTC_DJI: 'Wall Street 30',
        OTC_SPC: 'US 500',
        OTC_NDX: 'US Tech 100',
        OTC_FTSE: 'UK 100',
        OTC_GDAXI: 'Germany 40',
        OTC_SX5E: 'Euro 50',
        OTC_AS51: 'Australia 200',
        OTC_N225: 'Japan 225',

        // Cryptocurrencies
        cryBTCUSD: 'BTC/USD',
        cryETHUSD: 'ETH/USD',

        // Commodities
        frxXAUUSD: 'Gold/USD',
        frxXAGUSD: 'Silver/USD',
        FRXXPDUSD: 'Palladium/USD',
        FRXXPTUSD: 'Platinum/USD',
        WLDXAU: 'Gold Basket',
    };

    return symbolMap[underlying_symbol] || underlying_symbol;
};
