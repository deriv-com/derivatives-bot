import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { LocalStore } from '@/components/shared';
import { api_base } from '@/external/bot-skeleton';
import RootStore from './root-store';

type TSubscription = {
    id: string | null;
    subscriber: null | { unsubscribe: () => void };
};

export default class ChartStore {
    root_store: RootStore;
    constructor(root_store: RootStore) {
        makeObservable(this, {
            symbol: observable,
            is_chart_loading: observable,
            chart_type: observable,
            granularity: observable,
            is_contract_ended: computed,
            updateSymbol: action,
            onSymbolChange: action,
            updateGranularity: action,
            updateChartType: action,
            setChartStatus: action,
            restoreFromStorage: action,
            chart_subscription_id: observable,
            setChartSubscriptionId: action,
        });

        this.root_store = root_store;
        const { run_panel } = root_store;

        reaction(
            () => run_panel.is_running,
            () => (run_panel.is_running ? this.onStartBot() : this.onStopBot())
        );

        this.restoreFromStorage();
    }

    subscription: TSubscription = {
        id: null,
        subscriber: null,
    };
    chart_subscription_id = '';

    symbol: string | undefined;
    is_chart_loading: boolean | undefined;
    chart_type: string | undefined;
    granularity: number | undefined;

    get is_contract_ended() {
        const { transactions } = this.root_store;

        return transactions.contracts.length > 0 && transactions.contracts[0].is_ended;
    }

    onStartBot = () => {
        this.updateSymbol();
    };

    // eslint-disable-next-line
    onStopBot = () => {
        // const { main_content } = this.root_store;
        // main_content.setActiveTab(tabs_title.WORKSPACE);
    };

    updateSymbol = () => {
        const workspace = window.Blockly.derivWorkspace;
        const market_block = workspace?.getAllBlocks().find((block: window.Blockly.Block) => {
            return block.type === 'trade_definition_market';
        });

        const symbol =
            market_block?.getFieldValue('SYMBOL_LIST') ??
            (api_base?.active_symbols[0]
                ? (api_base.active_symbols[0] as any).underlying_symbol || (api_base.active_symbols[0] as any).symbol
                : undefined);
        this.symbol = symbol;
    };

    onSymbolChange = (symbol: string) => {
        this.symbol = symbol;
        this.saveToLocalStorage();
    };

    updateGranularity = (granularity: number) => {
        this.granularity = granularity;
        this.saveToLocalStorage();
    };

    updateChartType = (chart_type: string) => {
        this.chart_type = chart_type;
        this.saveToLocalStorage();
    };

    setChartStatus = (status: boolean) => {
        this.is_chart_loading = status;
    };

    saveToLocalStorage = () => {
        LocalStore.set(
            'bot.chart_props',
            JSON.stringify({
                symbol: this.symbol,
                granularity: this.granularity,
                chart_type: this.chart_type,
            })
        );
    };

    restoreFromStorage = () => {
        try {
            const props = LocalStore.get('bot.chart_props');

            if (props) {
                const { symbol, granularity, chart_type } = JSON.parse(props);
                this.symbol = symbol;
                this.granularity = granularity;
                this.chart_type = chart_type;
            } else {
                this.granularity = 0;
                this.chart_type = 'line';
            }
        } catch {
            LocalStore.remove('bot.chart_props');
        }
    };

    getMarketsOrder = (active_symbols: any[]) => {
        const synthetic_index = 'synthetic_index';

        if (!active_symbols || !Array.isArray(active_symbols)) {
            return [synthetic_index];
        }

        const has_synthetic_index = !!active_symbols.find(s => s.market === synthetic_index);

        // Define the exact order we want for volatility indices (Bot Builder UI pattern)
        // const VOLATILITY_ORDER = [
        //     'Volatility 10 (1s) Index',
        //     'Volatility 10 Index',
        //     'Volatility 15 (1s) Index',
        //     'Volatility 25 (1s) Index',
        //     'Volatility 25 Index',
        //     'Volatility 30 (1s) Index',
        //     'Volatility 50 (1s) Index',
        //     'Volatility 50 Index',
        //     'Volatility 75 (1s) Index',
        //     'Volatility 75 Index',
        //     'Volatility 90 (1s) Index',
        //     'Volatility 100 (1s) Index',
        //     'Volatility 100 Index',
        // ];

        return (
            active_symbols
                // .slice()
                // .sort((a, b) => {
                //     const aDisplayName = a.display_name || '';
                //     const bDisplayName = b.display_name || '';

                //     // Check if both are volatility indices
                //     const aIsVolatility = VOLATILITY_ORDER.includes(aDisplayName);
                //     const bIsVolatility = VOLATILITY_ORDER.includes(bDisplayName);

                //     if (aIsVolatility && bIsVolatility) {
                //         // Both are volatility indices, sort by predefined order
                //         const aIndex = VOLATILITY_ORDER.indexOf(aDisplayName);
                //         const bIndex = VOLATILITY_ORDER.indexOf(bDisplayName);
                //         return aIndex - bIndex;
                //     } else if (aIsVolatility && !bIsVolatility) {
                //         // a is volatility, b is not - volatility indices come first in their section
                //         return -1;
                //     } else if (!aIsVolatility && bIsVolatility) {
                //         // b is volatility, a is not - volatility indices come first in their section
                //         return 1;
                //     } else {
                //         // Neither is volatility, use alphabetical sorting
                //         return aDisplayName.localeCompare(bDisplayName);
                //     }
                // })
                .map(s => s.market)
                .reduce(
                    (arr, market) => {
                        if (arr.indexOf(market) === -1) arr.push(market);
                        return arr;
                    },
                    has_synthetic_index ? [synthetic_index] : []
                )
        );
    };

    // /**
    //  * Apply chart-specific symbol filtering
    //  * @param {Array} symbols - Original active symbols
    //  * @returns {Array} Filtered symbols for chart
    //  */
    // getChartFilteredSymbols = (symbols: any[]) => {
    //     if (!symbols || !Array.isArray(symbols)) {
    //         return [];
    //     }

    //     // Chart-specific symbol exclusions
    //     const CHART_EXCLUDED_SYMBOLS = ['OTC_IBEX35']; // Spain 35

    //     // Create a copy and filter out excluded symbols
    //     const filtered_symbols = symbols.filter(symbol => {
    //         const symbol_code = symbol.underlying_symbol || symbol.symbol;
    //         return !CHART_EXCLUDED_SYMBOLS.includes(symbol_code);
    //     });

    //     // Ensure new 1s volatility indices are included for chart
    //     const required_1s_symbols = ['1HZ15V', '1HZ30V', '1HZ90V'];

    //     required_1s_symbols.forEach(required_symbol => {
    //         const exists = filtered_symbols.some(symbol => {
    //             const symbol_code = symbol.underlying_symbol || symbol.symbol;
    //             return symbol_code === required_symbol;
    //         });

    //         if (!exists) {
    //             // Add the missing 1s volatility index
    //             const symbol_config: Record<string, any> = {
    //                 '1HZ15V': {
    //                     symbol: '1HZ15V',
    //                     underlying_symbol: '1HZ15V',
    //                     display_name: 'Volatility 15 (1s) Index',
    //                     market: 'synthetic_index',
    //                     market_display_name: 'Derived',
    //                     submarket: 'random_index',
    //                     submarket_display_name: 'Continuous Indices',
    //                     pip: 0.001,
    //                     pip_size: 0.001,
    //                     exchange_is_open: true,
    //                     is_trading_suspended: false,
    //                 },
    //                 '1HZ30V': {
    //                     symbol: '1HZ30V',
    //                     underlying_symbol: '1HZ30V',
    //                     display_name: 'Volatility 30 (1s) Index',
    //                     market: 'synthetic_index',
    //                     market_display_name: 'Derived',
    //                     submarket: 'random_index',
    //                     submarket_display_name: 'Continuous Indices',
    //                     pip: 0.001,
    //                     pip_size: 0.001,
    //                     exchange_is_open: true,
    //                     is_trading_suspended: false,
    //                 },
    //                 '1HZ90V': {
    //                     symbol: '1HZ90V',
    //                     underlying_symbol: '1HZ90V',
    //                     display_name: 'Volatility 90 (1s) Index',
    //                     market: 'synthetic_index',
    //                     market_display_name: 'Derived',
    //                     submarket: 'random_index',
    //                     submarket_display_name: 'Continuous Indices',
    //                     pip: 0.001,
    //                     pip_size: 0.001,
    //                     exchange_is_open: true,
    //                     is_trading_suspended: false,
    //                 },
    //             };

    //             if (symbol_config[required_symbol]) {
    //                 filtered_symbols.push(symbol_config[required_symbol]);
    //             }
    //         }
    //     });

    //     return filtered_symbols;
    // };
    setChartSubscriptionId = (chartSubscriptionId: string) => {
        this.chart_subscription_id = chartSubscriptionId;
    };
}
