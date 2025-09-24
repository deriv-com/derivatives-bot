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
        '1HZ150V': 'Volatility 150 (1s) Index',
        '1HZ200V': 'Volatility 200 (1s) Index',
        '1HZ250V': 'Volatility 250 (1s) Index',
        '1HZ300V': 'Volatility 300 (1s) Index',

        // Daily Reset Indices
        RDBEAR: 'Bear Market Index',
        RDBULL: 'Bull Market Index',

        // Step Indices
        STPRNG: 'Step Index 100',
        STPRNG1: 'Step Index 100',
        STPRNG2: 'Step Index 200',
        STPRNG3: 'Step Index 300',
        STPRNG4: 'Step Index 400',
        STPRNG5: 'Step Index 500',

        // Step Indices (alternative format)
        stpRNG: 'Step Index 100',
        stpRNG1: 'Step Index 100',
        stpRNG2: 'Step Index 200',
        stpRNG3: 'Step Index 300',
        stpRNG4: 'Step Index 400',
        stpRNG5: 'Step Index 500',

        // Crash/Boom Indices
        BOOM300N: 'Boom 300 Index',
        BOOM500: 'Boom 500 Index',
        BOOM1000: 'Boom 1000 Index',
        CRASH300N: 'Crash 300 Index',
        CRASH500: 'Crash 500 Index',
        CRASH1000: 'Crash 1000 Index',

        // Jump Indices
        JD10: 'Jump 10 Index',
        JD25: 'Jump 25 Index',
        JD50: 'Jump 50 Index',
        JD75: 'Jump 75 Index',
        JD100: 'Jump 100 Index',
        JD150: 'Jump 150 Index',
        JD200: 'Jump 200 Index',

        // Forex Major Pairs
        FRXAUDCAD: 'AUD/CAD',
        FRXAUDCHF: 'AUD/CHF',
        FRXAUDJPY: 'AUD/JPY',
        FRXAUDNZD: 'AUD/NZD',
        FRXAUDPLN: 'AUD/PLN',
        FRXAUDUSD: 'AUD/USD',
        FRXBROUSD: 'Oil/USD',
        FRXEURAUD: 'EUR/AUD',
        FRXEURCAD: 'EUR/CAD',
        FRXEURCHF: 'EUR/CHF',
        FRXEURGBP: 'EUR/GBP',
        FRXEURJPY: 'EUR/JPY',
        FRXEURNZD: 'EUR/NZD',
        FRXEURUSD: 'EUR/USD',
        FRXGBPAUD: 'GBP/AUD',
        FRXGBPCAD: 'GBP/CAD',
        FRXGBPCHF: 'GBP/CHF',
        FRXGBPJPY: 'GBP/JPY',
        FRXGBPNOK: 'GBP/NOK',
        FRXGBPUSD: 'GBP/USD',
        FRXNZDJPY: 'NZD/JPY',
        FRXNZDUSD: 'NZD/USD',
        FRXUSDCAD: 'USD/CAD',
        FRXUSDCHF: 'USD/CHF',
        FRXUSDJPY: 'USD/JPY',
        FRXUSDNOK: 'USD/NOK',
        FRXUSDPLN: 'USD/PLN',
        FRXUSDSEK: 'USD/SEK',

        // Legacy format (lowercase)
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
        OTC_AEX: 'Netherlands 25',
        OTC_AS51: 'Australia 200',
        OTC_DJI: 'Wall Street 30',
        OTC_FCHI: 'France 40',
        OTC_FTSE: 'UK 100',
        OTC_GDAXI: 'Germany 40',
        OTC_HSI: 'Hong Kong 50',
        OTC_IBEX35: 'Spain 35',
        OTC_N225: 'Japan 225',
        OTC_NDX: 'US Tech 100',
        OTC_SPC: 'US 500',
        OTC_SPX500: 'US 500',
        OTC_SSMI: 'Swiss 20',
        OTC_SX5E: 'Euro 50',

        // Cryptocurrencies
        CRYBCHUSD: 'BCH/USD',
        CRYBNBUSD: 'BNB/USD',
        CRYBTCLTC: 'BTC/LTC',
        CRYIOTUSD: 'IOT/USD',
        CRYNEOUSD: 'NEO/USD',
        CRYOMGUSD: 'OMG/USD',
        CRYTRXUSD: 'TRX/USD',
        CRYBTCETH: 'BTC/ETH',
        CRYZECUSD: 'ZEC/USD',
        CRYXMRUSD: 'ZMR/USD',
        CRYXMLUSD: 'XLM/USD',
        CRYXRPUSD: 'XRP/USD',
        CRYBTCUSD: 'BTC/USD',
        CRYDSHUSD: 'DSH/USD',
        CRYETHUSD: 'ETH/USD',
        CRYEOSUSD: 'EOS/USD',
        CRYLTCUSD: 'LTC/USD',

        // Legacy format (lowercase)
        cryBTCUSD: 'BTC/USD',
        cryETHUSD: 'ETH/USD',

        // Commodities
        FRXXAGUSD: 'Silver/USD',
        FRXXAUUSD: 'Gold/USD',
        FRXXPDUSD: 'Palladium/USD',
        FRXXPTUSD: 'Platinum/USD',
        WLDXAU: 'Gold Basket',

        // Legacy format (lowercase)
        frxXAUUSD: 'Gold/USD',
        frxXAGUSD: 'Silver/USD',
    };

    return symbolMap[underlying_symbol] || underlying_symbol;
};
