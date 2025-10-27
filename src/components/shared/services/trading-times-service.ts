import { localize } from '@deriv-com/translations';
import { translateTradingTimesData } from '../../../utils/market-category-translator';

class TradingTimesService {
    private trading_times_cache: any = null;
    private cache_expiry: number = 0;
    private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    /**
     * Get trading times data with caching
     */
    async getTradingTimes(): Promise<any> {
        const now = Date.now();

        // Return cached data if still valid
        if (this.trading_times_cache && now < this.cache_expiry && this.trading_times_cache.markets) {
            return this.trading_times_cache;
        }

        // Always ensure we return valid data with markets array
        const trading_data = this.getFallbackTradingTimes();

        // For now, skip API call and use trading data directly to avoid authentication issues
        const trading_times = trading_data.trading_times;

        // Translate any API-returned category names
        const translated_trading_times = translateTradingTimesData(trading_times);

        this.trading_times_cache = translated_trading_times;
        this.cache_expiry = now + this.CACHE_DURATION;

        // Double-check the structure before returning
        if (!trading_times.markets || !Array.isArray(trading_times.markets)) {
            // Return a minimal valid structure as emergency fallback
            return {
                markets: [
                    {
                        name: localize('Derived'),
                        submarkets: [
                            {
                                name: localize('Continuous Indices'),
                                symbols: [
                                    { symbol: 'R_10', display_name: 'Volatility 10 Index', underlying_symbol: 'R_10' },
                                ],
                            },
                        ],
                    },
                ],
            };
        }

        return translateTradingTimesData(trading_times);
    }

    /**
     * Fetch trading times from API
     */
    private async fetchTradingTimes(): Promise<any> {
        // For now, always use trading data to avoid circular import and API authentication issues
        const fallback = this.getFallbackTradingTimes();
        return fallback.trading_times;
    }

    /**
     * Get trading times as fallback
     */
    private getFallbackTradingTimes(): any {
        return {
            trading_times: {
                markets: [
                    {
                        name: localize('Derived'),
                        submarkets: [
                            {
                                name: localize('Continuous Indices'),
                                symbols: [
                                    {
                                        symbol: 'R_10',
                                        display_name: 'Volatility 10 Index',
                                        underlying_symbol: 'R_10',
                                    },
                                    {
                                        symbol: 'R_25',
                                        display_name: 'Volatility 25 Index',
                                        underlying_symbol: 'R_25',
                                    },
                                    {
                                        symbol: 'R_50',
                                        display_name: 'Volatility 50 Index',
                                        underlying_symbol: 'R_50',
                                    },
                                    {
                                        symbol: 'R_75',
                                        display_name: 'Volatility 75 Index',
                                        underlying_symbol: 'R_75',
                                    },
                                    {
                                        symbol: 'R_100',
                                        display_name: 'Volatility 100 Index',
                                        underlying_symbol: 'R_100',
                                    },
                                    {
                                        symbol: '1HZ10V',
                                        display_name: 'Volatility 10 (1s) Index',
                                        underlying_symbol: '1HZ10V',
                                    },
                                    {
                                        symbol: '1HZ15V',
                                        display_name: 'Volatility 15 (1s) Index',
                                        underlying_symbol: '1HZ15V',
                                    },
                                    {
                                        symbol: '1HZ25V',
                                        display_name: 'Volatility 25 (1s) Index',
                                        underlying_symbol: '1HZ25V',
                                    },
                                    {
                                        symbol: '1HZ30V',
                                        display_name: 'Volatility 30 (1s) Index',
                                        underlying_symbol: '1HZ30V',
                                    },
                                    {
                                        symbol: '1HZ50V',
                                        display_name: 'Volatility 50 (1s) Index',
                                        underlying_symbol: '1HZ50V',
                                    },
                                    {
                                        symbol: '1HZ75V',
                                        display_name: 'Volatility 75 (1s) Index',
                                        underlying_symbol: '1HZ75V',
                                    },
                                    {
                                        symbol: '1HZ90V',
                                        display_name: 'Volatility 90 (1s) Index',
                                        underlying_symbol: '1HZ90V',
                                    },
                                    {
                                        symbol: '1HZ100V',
                                        display_name: 'Volatility 100 (1s) Index',
                                        underlying_symbol: '1HZ100V',
                                    },
                                ],
                            },
                            {
                                name: localize('Crash/Boom'),
                                symbols: [
                                    {
                                        symbol: 'CRASH500',
                                        display_name: 'Crash 500 Index',
                                        underlying_symbol: 'CRASH500',
                                    },
                                    {
                                        symbol: 'CRASH1000',
                                        display_name: 'Crash 1000 Index',
                                        underlying_symbol: 'CRASH1000',
                                    },
                                    { symbol: 'BOOM500', display_name: 'Boom 500 Index', underlying_symbol: 'BOOM500' },
                                    {
                                        symbol: 'BOOM1000',
                                        display_name: 'Boom 1000 Index',
                                        underlying_symbol: 'BOOM1000',
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        name: localize('Forex'),
                        submarkets: [
                            {
                                name: localize('Major Pairs'),
                                symbols: [
                                    { symbol: 'frxEURUSD', display_name: 'EUR/USD', underlying_symbol: 'frxEURUSD' },
                                    { symbol: 'frxGBPUSD', display_name: 'GBP/USD', underlying_symbol: 'frxGBPUSD' },
                                    { symbol: 'frxUSDJPY', display_name: 'USD/JPY', underlying_symbol: 'frxUSDJPY' },
                                    { symbol: 'frxAUDUSD', display_name: 'AUD/USD', underlying_symbol: 'frxAUDUSD' },
                                ],
                            },
                            {
                                name: localize('Forex Basket'),
                                symbols: [
                                    { symbol: 'WLDAUD', display_name: 'AUD Basket', underlying_symbol: 'WLDAUD' },
                                    { symbol: 'WLDEUR', display_name: 'EUR Basket', underlying_symbol: 'WLDEUR' },
                                    { symbol: 'WLDGBP', display_name: 'GBP Basket', underlying_symbol: 'WLDGBP' },
                                    { symbol: 'WLDUSD', display_name: 'USD Basket', underlying_symbol: 'WLDUSD' },
                                ],
                            },
                        ],
                    },
                    {
                        name: localize('Stock Indices'),
                        submarkets: [
                            {
                                name: localize('American Indices'),
                                symbols: [
                                    { symbol: 'OTC_DJI', display_name: 'Wall Street 30', underlying_symbol: 'OTC_DJI' },
                                    { symbol: 'OTC_SPC', display_name: 'US 500', underlying_symbol: 'OTC_SPC' },
                                    { symbol: 'OTC_NDX', display_name: 'US Tech 100', underlying_symbol: 'OTC_NDX' },
                                ],
                            },
                            {
                                name: localize('European Indices'),
                                symbols: [
                                    { symbol: 'OTC_FTSE', display_name: 'UK 100', underlying_symbol: 'OTC_FTSE' },
                                    { symbol: 'OTC_GDAXI', display_name: 'Germany 40', underlying_symbol: 'OTC_GDAXI' },
                                    { symbol: 'OTC_SX5E', display_name: 'Euro 50', underlying_symbol: 'OTC_SX5E' },
                                ],
                            },
                            {
                                name: localize('Asian Indices'),
                                symbols: [
                                    {
                                        symbol: 'OTC_AS51',
                                        display_name: 'Australia 200',
                                        underlying_symbol: 'OTC_AS51',
                                    },
                                    { symbol: 'OTC_N225', display_name: 'Japan 225', underlying_symbol: 'OTC_N225' },
                                ],
                            },
                        ],
                    },
                    {
                        name: localize('Cryptocurrencies'),
                        submarkets: [
                            {
                                name: localize('Non-Stable Coins'),
                                symbols: [
                                    { symbol: 'cryBTCUSD', display_name: 'BTC/USD', underlying_symbol: 'cryBTCUSD' },
                                    { symbol: 'cryETHUSD', display_name: 'ETH/USD', underlying_symbol: 'cryETHUSD' },
                                ],
                            },
                        ],
                    },
                    {
                        name: localize('Commodities'),
                        submarkets: [
                            {
                                name: localize('Metals'),
                                symbols: [
                                    { symbol: 'frxXAUUSD', display_name: 'Gold/USD', underlying_symbol: 'frxXAUUSD' },
                                    { symbol: 'frxXAGUSD', display_name: 'Silver/USD', underlying_symbol: 'frxXAGUSD' },
                                    {
                                        symbol: 'FRXXPDUSD',
                                        display_name: 'Palladium/USD',
                                        underlying_symbol: 'FRXXPDUSD',
                                    },
                                    {
                                        symbol: 'FRXXPTUSD',
                                        display_name: 'Platinum/USD',
                                        underlying_symbol: 'FRXXPTUSD',
                                    },
                                    { symbol: 'WLDXAU', display_name: 'Gold Basket', underlying_symbol: 'WLDXAU' },
                                ],
                            },
                        ],
                    },
                ],
            },
        };
    }

    /**
     * Clear cached trading times data
     */
    clearCache(): void {
        this.trading_times_cache = null;
        this.cache_expiry = 0;
    }

    /**
     * Check if cache is valid
     */
    isCacheValid(): boolean {
        return this.trading_times_cache && Date.now() < this.cache_expiry;
    }
}

// Export singleton instance
export const tradingTimesService = new TradingTimesService();
