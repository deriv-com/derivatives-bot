import { generateDerivApiInstance } from './appId';

class ChartAPI {
    api;
    chart_active_symbols = null; // Separate variable for chart-specific symbols

    onsocketclose() {
        this.reconnectIfNotConnected();
    }

    init = async (force_create_connection = false) => {
        if (!this.api || force_create_connection) {
            if (this.api?.connection) {
                this.api.disconnect();
                this.api.connection.removeEventListener('close', this.onsocketclose.bind(this));
            }
            this.api = await generateDerivApiInstance();
            this.api?.connection.addEventListener('close', this.onsocketclose.bind(this));

            // Intercept the send method to filter active_symbols responses for chart
            // this.interceptApiCalls();

            // Force inject symbols after a short delay to ensure api_base is ready
            // this.forceInjectSymbols();
        }
        this.getTime();
    };

    getTime() {
        if (!this.time_interval) {
            this.time_interval = setInterval(() => {
                this.api.send({ time: 1 });
            }, 30000);
        }
    }

    reconnectIfNotConnected = () => {
        if (this.api?.connection?.readyState && this.api?.connection?.readyState > 1) {
            this.init(true);
        }
    };

    // /**
    //  * Intercept API calls to filter active_symbols responses specifically for chart
    //  */
    // interceptApiCalls = () => {
    //     if (!this.api || !this.api.send) {
    //         return;
    //     }

    //     // Store the original send method
    //     const originalSend = this.api.send.bind(this.api);

    //     // Override the send method
    //     this.api.send = async request => {
    //         const response = await originalSend(request);

    //         const hasActiveSymbolsResponse =
    //             response && response.active_symbols && Array.isArray(response.active_symbols);

    //         // If this is an active_symbols request, filter the response for chart
    //         if (hasActiveSymbolsResponse) {
    //             // Create chart-specific filtered symbols without modifying the original response
    //             this.chart_active_symbols = this.getFilteredActiveSymbolsForChart(response.active_symbols);

    //             const modified_response = {
    //                 ...response,
    //                 active_symbols: this.chart_active_symbols,
    //             };

    //             return modified_response;
    //         }

    //         return response;
    //     };
    // };

    // /**
    //  * Get filtered active symbols specifically for chart usage
    //  * Removes chart-specific exclusions and ensures new 1s volatility indices are included
    //  * @param {Array} original_symbols - Original active symbols from API
    //  * @returns {Array} Filtered active symbols for chart
    //  */
    // getFilteredActiveSymbolsForChart = original_symbols => {
    //     if (!original_symbols || !Array.isArray(original_symbols)) {
    //         return [];
    //     }

    //     // Chart-specific symbol exclusions
    //     const CHART_EXCLUDED_SYMBOLS = ['OTC_IBEX35']; // Spain 35

    //     // Create a copy of symbols to avoid modifying the original
    //     let filtered_symbols = [...original_symbols];

    //     // Filter out excluded symbols for chart
    //     filtered_symbols = filtered_symbols.filter(symbol => {
    //         const symbol_code = symbol.underlying_symbol || symbol.symbol;
    //         const should_exclude = CHART_EXCLUDED_SYMBOLS.includes(symbol_code);
    //         return !should_exclude;
    //     });

    //     // Force add our 1s volatility indices
    //     const required_1s_symbols = [
    //         {
    //             symbol: '1HZ15V',
    //             underlying_symbol: '1HZ15V',
    //             display_name: 'Volatility 15 (1s) Index',
    //             market: 'synthetic_index',
    //             market_display_name: 'Derived',
    //             submarket: 'random_index',
    //             submarket_display_name: 'Continuous Indices',
    //             pip: 0.001,
    //             pip_size: 0.001,
    //             exchange_is_open: true,
    //             is_trading_suspended: false,
    //         },
    //         {
    //             symbol: '1HZ30V',
    //             underlying_symbol: '1HZ30V',
    //             display_name: 'Volatility 30 (1s) Index',
    //             market: 'synthetic_index',
    //             market_display_name: 'Derived',
    //             submarket: 'random_index',
    //             submarket_display_name: 'Continuous Indices',
    //             pip: 0.001,
    //             pip_size: 0.001,
    //             exchange_is_open: true,
    //             is_trading_suspended: false,
    //         },
    //         {
    //             symbol: '1HZ90V',
    //             underlying_symbol: '1HZ90V',
    //             display_name: 'Volatility 90 (1s) Index',
    //             market: 'synthetic_index',
    //             market_display_name: 'Derived',
    //             submarket: 'random_index',
    //             submarket_display_name: 'Continuous Indices',
    //             pip: 0.001,
    //             pip_size: 0.001,
    //             exchange_is_open: true,
    //             is_trading_suspended: false,
    //         },
    //     ];

    //     // Remove any existing instances first to avoid duplicates
    //     filtered_symbols = filtered_symbols.filter(symbol => {
    //         const symbol_code = symbol.underlying_symbol || symbol.symbol;
    //         return !['1HZ15V', '1HZ30V', '1HZ90V'].includes(symbol_code);
    //     });

    //     // Force add our 1s volatility indices
    //     filtered_symbols.push(...required_1s_symbols);

    // Sort volatility indices to ensure proper order
    // filtered_symbols = this.sortVolatilityIndices(filtered_symbols);

    //     return filtered_symbols;
    // };

    // /**
    //  * Force inject symbols directly into the chart API
    //  */
    // forceInjectSymbols = () => {
    //     // Wait a bit for api_base to be available
    //     setTimeout(() => {
    //         if (api_base && api_base.active_symbols) {
    //             // Get filtered symbols for chart
    //             const filtered_symbols = this.getFilteredActiveSymbolsForChart(api_base.active_symbols);

    //             // Store the original symbols if not already stored
    //             if (!this.original_active_symbols) {
    //                 this.original_active_symbols = [...api_base.active_symbols];
    //             }

    //             // Replace api_base.active_symbols with filtered symbols for chart
    //             api_base.active_symbols = filtered_symbols;
    //             this.chart_active_symbols = filtered_symbols;
    //         } else {
    //             // Try again after a longer delay
    //             setTimeout(() => this.forceInjectSymbols(), 2000);
    //         }
    //     }, 1000);
    // };

    // /**
    //  * Get chart-specific active symbols (for external access if needed)
    //  * @returns {Array} Chart-specific filtered active symbols
    //  */
    // getActiveSymbolsForChart = () => {
    //     return this.chart_active_symbols || [];
    // };

    /**
     * Sort volatility indices to ensure proper display order
     * @param {Array} symbols - Array of symbols to sort
     * @returns {Array} Sorted symbols array
     */
    // sortVolatilityIndices = symbols => {
    //     // Define the exact order for volatility indices
    //     const VOLATILITY_ORDER = [
    //         '1HZ10V', // Volatility 10 (1s) Index
    //         'R_10', // Volatility 10 Index
    //         '1HZ15V', // Volatility 15 (1s) Index
    //         '1HZ25V', // Volatility 25 (1s) Index
    //         'R_25', // Volatility 25 Index
    //         '1HZ30V', // Volatility 30 (1s) Index
    //         '1HZ50V', // Volatility 50 (1s) Index
    //         'R_50', // Volatility 50 Index
    //         '1HZ75V', // Volatility 75 (1s) Index
    //         'R_75', // Volatility 75 Index
    //         '1HZ90V', // Volatility 90 (1s) Index
    //         '1HZ100V', // Volatility 100 (1s) Index
    //         'R_100', // Volatility 100 Index
    //     ];

    //     // Separate volatility and non-volatility symbols
    //     const volatility_symbols = [];
    //     const other_symbols = [];

    //     symbols.forEach(symbol => {
    //         const symbol_code = symbol.underlying_symbol || symbol.symbol;
    //         const display_name = (symbol.display_name || '').toLowerCase();

    //         if (VOLATILITY_ORDER.includes(symbol_code) || display_name.includes('volatility')) {
    //             volatility_symbols.push(symbol);
    //         } else {
    //             other_symbols.push(symbol);
    //         }
    //     });

    //     // Sort volatility symbols according to the predefined order
    //     volatility_symbols.sort((a, b) => {
    //         const symbol_a = a.underlying_symbol || a.symbol;
    //         const symbol_b = b.underlying_symbol || b.symbol;

    //         const index_a = VOLATILITY_ORDER.indexOf(symbol_a);
    //         const index_b = VOLATILITY_ORDER.indexOf(symbol_b);

    //         // If both symbols are in the order array, sort by their position
    //         if (index_a !== -1 && index_b !== -1) {
    //             return index_a - index_b;
    //         }

    //         // If only one is in the order array, prioritize it
    //         if (index_a !== -1) return -1;
    //         if (index_b !== -1) return 1;

    //         // If neither is in the order array, sort alphabetically
    //         return (a.display_name || '').localeCompare(b.display_name || '');
    //     });

    //     // Return symbols with volatility indices properly sorted
    //     return [...other_symbols, ...volatility_symbols];
    // };
}

const chart_api = new ChartAPI();

export default chart_api;
