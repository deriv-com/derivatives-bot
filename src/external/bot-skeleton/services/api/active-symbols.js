/* eslint-disable no-confusing-arrow */
import { localize } from '@deriv-com/translations';
import {
    ACTIVE_SYMBOLS,
    MARKET_MAPPINGS,
    MARKET_OPTIONS,
    SUBMARKET_OPTIONS,
    SYMBOL_OPTIONS,
    TRADING_TIMES,
} from '../../../../components/shared/utils/common-data';
import { config } from '../../constants/config';
import PendingPromise from '../../utils/pending-promise';
import { api_base } from './api-base';

export default class ActiveSymbols {
    constructor(trading_times) {
        this.active_symbols = [];
        this.disabled_symbols = config().DISABLED_SYMBOLS;
        this.disabled_submarkets = config().DISABLED_SUBMARKETS;
        this.init_promise = new PendingPromise();
        this.is_initialised = false;
        this.processed_symbols = {};
        this.trading_times = trading_times;
    }

    clearCache() {
        this.active_symbols = [];
        this.processed_symbols = {};
        this.is_initialised = false;
        this.init_promise = new PendingPromise();
    }

    async retrieveActiveSymbols(is_forced_update = false) {
        await this.trading_times.initialise();

        if (!is_forced_update && this.is_initialised) {
            await this.init_promise;
            return this.active_symbols;
        }

        this.is_initialised = true;

        if (api_base.has_active_symbols) {
            this.active_symbols = api_base?.active_symbols ?? [];
        } else {
            await api_base.active_symbols_promise;
            this.active_symbols = api_base?.active_symbols ?? [];
        }

        // Fallback to static data if API fails completely
        if (this.active_symbols.length === 0) {
            this.active_symbols = ACTIVE_SYMBOLS;
        }

        this.processed_symbols = this.processActiveSymbols();

        // Also create chart-specific processed symbols
        // this.chart_processed_symbols = this.getProcessedSymbolsForChart();

        // TODO: fix need to look into it as the method is not present
        this.trading_times.onMarketOpenCloseChanged = changes => {
            Object.keys(changes).forEach(symbol_name => {
                const symbol_obj = this.active_symbols[symbol_name];

                if (symbol_obj) {
                    symbol_obj.exchange_is_open = changes[symbol_name];
                }
            });

            this.changes = changes;
            this.processActiveSymbols();
        };

        this.init_promise.resolve();
        return this.active_symbols;
    }

    processActiveSymbols() {
        if (this.active_symbols.length === 0) {
            return {};
        }

        return this.active_symbols.reduce((processed_symbols, symbol) => {
            // Handle both old and new field names for backward compatibility
            const symbol_code = symbol.underlying_symbol || symbol.symbol;
            const symbol_submarket = symbol.submarket;
            const symbol_market = symbol.market;

            if (
                config().DISABLED_SYMBOLS.includes(symbol_code) ||
                config().DISABLED_SUBMARKETS.includes(symbol_submarket)
            ) {
                return processed_symbols;
            }

            const isExistingValue = (object, prop_value) => Object.keys(object).includes(prop_value);

            if (!isExistingValue(processed_symbols, symbol_market)) {
                processed_symbols[symbol_market] = {
                    display_name: symbol.market_display_name || symbol_market,
                    submarkets: {},
                };
            }

            const { submarkets } = processed_symbols[symbol_market];

            if (!isExistingValue(submarkets, symbol_submarket)) {
                // Use our custom submarket display name mapping, fallback to API display name, then submarket code
                const custom_display_name = MARKET_MAPPINGS.SUBMARKET_DISPLAY_NAMES.get(symbol_submarket);
                const display_name = custom_display_name || symbol.submarket_display_name || symbol_submarket;

                submarkets[symbol_submarket] = {
                    display_name: display_name,
                    symbols: {},
                };
            }

            const { symbols } = submarkets[symbol_submarket];

            if (!isExistingValue(symbols, symbol_code)) {
                // Use custom display name mapping first, then API display name, then symbol code
                const custom_display_name =
                    TRADING_TIMES.SYMBOL_DISPLAY_NAMES[symbol_code] ||
                    TRADING_TIMES.SYMBOL_DISPLAY_NAMES[symbol.display_name];
                const display_name = custom_display_name || symbol.display_name || symbol_code;

                symbols[symbol_code] = {
                    display_name: display_name,
                    pip_size: `${symbol.pip || symbol.pip_size || 0}`.length - 2,
                    is_active: !symbol.is_trading_suspended && symbol.exchange_is_open,
                };
            }

            return processed_symbols;
        }, {});
    }

    /**
     * Retrieves all symbols and returns an array of symbol objects consisting of symbol and their linked market + submarket.
     * @returns {Array} Symbols and their submarkets + markets.
     */
    getAllSymbols(should_be_open = false) {
        const all_symbols = [];

        Object.keys(this.processed_symbols).forEach(market_name => {
            if (should_be_open && this.isMarketClosed(market_name)) {
                return;
            }

            const market = this.processed_symbols[market_name];
            const { submarkets } = market;

            Object.keys(submarkets).forEach(submarket_name => {
                const submarket = submarkets[submarket_name];
                const { symbols } = submarket;

                Object.keys(symbols).forEach(symbol_name => {
                    const symbol = symbols[symbol_name];

                    all_symbols.push({
                        market: market_name,
                        market_display: market.display_name,
                        submarket: submarket_name,
                        submarket_display: submarket.display_name,
                        symbol: symbol_name,
                        symbol_display: symbol.display_name,
                    });
                });
            });
        });
        this.getSymbolsForBot();
        return all_symbols;
    }

    /**
     *
     * @returns {Array} Symbols and their submarkets + markets for deriv-bot
     */
    getSymbolsForBot() {
        const { DISABLED } = config().QUICK_STRATEGY;
        const symbols_for_bot = [];
        Object.keys(this.processed_symbols).forEach(market_name => {
            if (this.isMarketClosed(market_name)) return;

            const market = this.processed_symbols[market_name];
            const { submarkets } = market;

            Object.keys(submarkets).forEach(submarket_name => {
                if (DISABLED.SUBMARKETS.includes(submarket_name)) return;
                const submarket = submarkets[submarket_name];
                const { symbols } = submarket;

                // Get symbol keys and sort them properly for volatility indices
                const symbol_keys = Object.keys(symbols);

                // Custom sorting for volatility indices to ensure correct numerical order
                // const isVolatilitySubmarket =
                //     submarket_name === 'random_index' ||
                //     submarket.display_name === 'Continuous Indices' ||
                //     submarket.display_name?.includes('Volatility') ||
                //     submarket_name?.includes('volatility');

                // if (isVolatilitySubmarket) {
                //     symbol_keys.sort((a, b) => {
                //         // Extract numeric values from volatility indices (1HZ10V, 1HZ25V, etc.)
                //         const getVolatilityNumber = symbol => {
                //             // Check for 1HZ format (1HZ10V, 1HZ25V, 1HZ50V, etc.)
                //             const hzMatch = symbol.match(/1HZ(\d+)V/);
                //             if (hzMatch) return parseInt(hzMatch[1], 10);

                //             // Check for R_ format (R_10, R_25, etc.) as fallback
                //             const rMatch = symbol.match(/R_(\d+)/);
                //             if (rMatch) return parseInt(rMatch[1], 10);

                //             return 0;
                //         };

                //         const aNum = getVolatilityNumber(a);
                //         const bNum = getVolatilityNumber(b);

                //         // If both are volatility indices, sort by number
                //         if (aNum > 0 && bNum > 0) {
                //             return aNum - bNum;
                //         }

                //         // Otherwise, use alphabetical sorting
                //         return a.localeCompare(b);
                //     });
                // }

                symbol_keys.forEach(symbol_name => {
                    if (DISABLED.SYMBOLS.includes(symbol_name)) return;
                    const symbol = symbols[symbol_name];
                    symbols_for_bot.push({
                        group: submarket.display_name,
                        text: symbol.display_name,
                        value: symbol_name,
                    });
                });
            });
        });

        return symbols_for_bot;
    }

    // /**
    //  * Get processed symbols specifically for chart usage
    //  * Removes chart-specific exclusions and ensures new 1s volatility indices are present
    //  * @returns {Object} Processed symbols for chart
    //  */
    // getProcessedSymbolsForChart() {
    //     // Start with the regular processed symbols
    //     const chart_processed_symbols = JSON.parse(JSON.stringify(this.processed_symbols));

    //     // Chart-specific symbol exclusions
    //     const CHART_EXCLUDED_SYMBOLS = ['OTC_IBEX35']; // Spain 35

    //     // Remove excluded symbols from chart processed symbols
    //     Object.keys(chart_processed_symbols).forEach(market_name => {
    //         const market = chart_processed_symbols[market_name];
    //         const { submarkets } = market;

    //         Object.keys(submarkets).forEach(submarket_name => {
    //             const submarket = submarkets[submarket_name];
    //             const { symbols } = submarket;

    //             // Remove excluded symbols
    //             CHART_EXCLUDED_SYMBOLS.forEach(excluded_symbol => {
    //                 if (symbols[excluded_symbol]) {
    //                     delete symbols[excluded_symbol];
    //                 }
    //             });
    //         });
    //     });

    //     // Ensure new 1s volatility indices are present in chart processed symbols
    //     const required_1s_symbols = ['1HZ15V', '1HZ30V', '1HZ90V'];

    //     const symbol_configs = {
    //         '1HZ15V': {
    //             display_name: 'Volatility 15 (1s) Index',
    //             pip_size: 3,
    //             is_active: true,
    //         },
    //         '1HZ30V': {
    //             display_name: 'Volatility 30 (1s) Index',
    //             pip_size: 3,
    //             is_active: true,
    //         },
    //         '1HZ90V': {
    //             display_name: 'Volatility 90 (1s) Index',
    //             pip_size: 3,
    //             is_active: true,
    //         },
    //     };

    //     // Ensure synthetic_index market exists
    //     if (!chart_processed_symbols['synthetic_index']) {
    //         chart_processed_symbols['synthetic_index'] = {
    //             display_name: 'Derived',
    //             submarkets: {},
    //         };
    //     }

    //     // Ensure random_index submarket exists
    //     if (!chart_processed_symbols['synthetic_index'].submarkets['random_index']) {
    //         chart_processed_symbols['synthetic_index'].submarkets['random_index'] = {
    //             display_name: 'Continuous Indices',
    //             symbols: {},
    //         };
    //     }

    //     // Add missing 1s volatility indices to chart processed symbols
    //     const random_index_symbols = chart_processed_symbols['synthetic_index'].submarkets['random_index'].symbols;

    //     required_1s_symbols.forEach(symbol_code => {
    //         if (!random_index_symbols[symbol_code]) {
    //             random_index_symbols[symbol_code] = symbol_configs[symbol_code];
    //         }
    //     });

    //     return chart_processed_symbols;
    // }

    getMarketDropdownOptions() {
        const market_options = [];

        Object.keys(this.processed_symbols).forEach(market_name => {
            const { display_name } = this.processed_symbols[market_name];
            const market_display_name =
                display_name + (this.isMarketClosed(market_name) ? ` ${localize('(Closed)')}` : '');
            market_options.push([market_display_name, market_name]);
        });

        // Fallback markets if no processed symbols available
        if (market_options.length === 0) {
            return MARKET_OPTIONS;
        }

        market_options.sort(a => (a[1] === 'synthetic_index' ? -1 : 1));

        const has_closed_markets = market_options.some(market_option => this.isMarketClosed(market_option[1]));

        if (has_closed_markets) {
            const sorted_options = this.sortDropdownOptions(market_options, this.isMarketClosed);

            if (this.isMarketClosed('forex')) {
                return sorted_options.sort(a => (a[1] === 'synthetic_index' ? -1 : 1));
            }

            return sorted_options;
        }

        return market_options;
    }

    getSubmarketDropdownOptions(market) {
        const submarket_options = [];
        const market_obj = this.processed_symbols[market];
        if (market_obj) {
            const { submarkets } = market_obj;

            Object.keys(submarkets).forEach(submarket_name => {
                const { display_name } = submarkets[submarket_name];
                const submarket_display_name =
                    display_name + (this.isSubmarketClosed(submarket_name) ? ` ${localize('(Closed)')}` : '');
                submarket_options.push([submarket_display_name, submarket_name]);
            });
        }

        // Fallback submarkets based on market
        if (submarket_options.length === 0) {
            return SUBMARKET_OPTIONS[market] || [['Default', 'default']];
        }

        if (market === 'synthetic_index') {
            submarket_options.sort(a => (a[1] === 'random_index' ? -1 : 1));
        }

        return this.sortDropdownOptions(submarket_options, this.isSubmarketClosed);
    }

    getSymbolDropdownOptions(submarket) {
        const symbol_options = Object.keys(this.processed_symbols).reduce((accumulator, market_name) => {
            const { submarkets } = this.processed_symbols[market_name];

            Object.keys(submarkets).forEach(submarket_name => {
                if (submarket_name === submarket) {
                    const submarket_obj = submarkets[submarket_name];
                    const { symbols } = submarket_obj;

                    // Get symbol keys and sort them properly for volatility indices
                    const symbol_keys = Object.keys(symbols);

                    // Custom sorting for volatility indices to ensure correct numerical order
                    // const isVolatilitySubmarket =
                    //     submarket_name === 'random_index' ||
                    //     submarket_obj.display_name === 'Continuous Indices' ||
                    //     submarket_obj.display_name?.includes('Volatility') ||
                    //     submarket_name?.includes('volatility');

                    // if (isVolatilitySubmarket) {
                    //     symbol_keys.sort((a, b) => {
                    //         // Extract numeric values from volatility indices (1HZ10V, 1HZ25V, etc.)
                    //         const getVolatilityNumber = symbol => {
                    //             // Check for 1HZ format (1HZ10V, 1HZ25V, 1HZ50V, etc.)
                    //             const hzMatch = symbol.match(/1HZ(\d+)V/);
                    //             if (hzMatch) return parseInt(hzMatch[1], 10);

                    //             // Check for R_ format (R_10, R_25, etc.) as fallback
                    //             const rMatch = symbol.match(/R_(\d+)/);
                    //             if (rMatch) return parseInt(rMatch[1], 10);

                    //             return 0;
                    //         };

                    //         const aNum = getVolatilityNumber(a);
                    //         const bNum = getVolatilityNumber(b);

                    //         // If both are volatility indices, sort by number
                    //         if (aNum > 0 && bNum > 0) {
                    //             return aNum - bNum;
                    //         }

                    //         // Otherwise, use alphabetical sorting
                    //         return a.localeCompare(b);
                    //     });
                    // }

                    symbol_keys.forEach(symbol_name => {
                        const { display_name } = symbols[symbol_name];
                        const symbol_display_name =
                            display_name + (this.isSymbolClosed(symbol_name) ? ` ${localize('(Closed)')}` : '');
                        accumulator.push([symbol_display_name, symbol_name]);
                    });
                }
            });

            return accumulator;
        }, []);

        // Fallback symbols based on submarket
        if (symbol_options.length === 0) {
            const fallback_options = SYMBOL_OPTIONS[submarket] || [['Default Symbol', 'DEFAULT']];

            // Apply the same sorting logic to fallback options for volatility indices
            // if (submarket === 'random_index') {
            //     return fallback_options.sort((a, b) => {
            //         const getVolatilityNumber = symbol => {
            //             // Check for 1HZ format (1HZ10V, 1HZ25V, 1HZ50V, etc.)
            //             const hzMatch = symbol[1].match(/1HZ(\d+)V/);
            //             if (hzMatch) return parseInt(hzMatch[1], 10);

            //             // Check for R_ format (R_10, R_25, etc.) as fallback
            //             const rMatch = symbol[1].match(/R_(\d+)/);
            //             if (rMatch) return parseInt(rMatch[1], 10);

            //             return 0;
            //         };

            //         const aNum = getVolatilityNumber(a);
            //         const bNum = getVolatilityNumber(b);

            //         // If both are volatility indices, sort by number
            //         if (aNum > 0 && bNum > 0) {
            //             return aNum - bNum;
            //         }

            //         // Otherwise, use alphabetical sorting
            //         return a[0].localeCompare(b[0]);
            //     });
            // }

            return fallback_options;
        }

        // Apply custom sorting to the final symbol_options for volatility indices
        // if (submarket === 'random_index') {
        //     symbol_options.sort((a, b) => {
        //         const getVolatilityNumber = symbol => {
        //             // Check for 1HZ format (1HZ10V, 1HZ25V, 1HZ50V, etc.)
        //             const hzMatch = symbol[1].match(/1HZ(\d+)V/);
        //             if (hzMatch) return parseInt(hzMatch[1], 10);

        //             // Check for R_ format (R_10, R_25, etc.) as fallback
        //             const rMatch = symbol[1].match(/R_(\d+)/);
        //             if (rMatch) return parseInt(rMatch[1], 10);

        //             return 0;
        //         };

        //         const aNum = getVolatilityNumber(a);
        //         const bNum = getVolatilityNumber(b);

        //         // If both are volatility indices, sort by number
        //         if (aNum > 0 && bNum > 0) {
        //             return aNum - bNum;
        //         }

        //         // Otherwise, use alphabetical sorting
        //         return a[0].localeCompare(b[0]);
        //     });
        // }

        return this.sortDropdownOptions(symbol_options, this.isSymbolClosed);
    }

    isMarketClosed(market_name) {
        const market = this.processed_symbols[market_name];

        if (!market) {
            return true;
        }

        return Object.keys(market.submarkets).every(submarket_name => this.isSubmarketClosed(submarket_name));
    }

    isSubmarketClosed(submarket_name) {
        const market_name = Object.keys(this.processed_symbols).find(name => {
            const market = this.processed_symbols[name];
            return Object.keys(market.submarkets).includes(submarket_name);
        });

        if (!market_name) {
            return true;
        }

        const market = this.processed_symbols[market_name];
        const submarket = market.submarkets[submarket_name];

        if (!submarket) {
            return true;
        }

        const { symbols } = submarket;
        return Object.keys(symbols).every(symbol_name => this.isSymbolClosed(symbol_name));
    }

    isSymbolClosed(symbol_name) {
        return this.active_symbols.some(active_symbol => {
            const symbol_code = active_symbol.underlying_symbol || active_symbol.symbol;
            return (
                symbol_code === symbol_name && (!active_symbol.exchange_is_open || active_symbol.is_trading_suspended)
            );
        });
    }

    sortDropdownOptions = (dropdown_options, closedFunc) => {
        const options = [...dropdown_options];

        options.sort((a, b) => {
            const is_a_closed = closedFunc.call(this, a[1]);
            const is_b_closed = closedFunc.call(this, b[1]);

            if (is_a_closed && !is_b_closed) {
                return 1;
            } else if (is_a_closed === is_b_closed) {
                return 0;
            }
            return -1;
        });

        return options;
    };
}
