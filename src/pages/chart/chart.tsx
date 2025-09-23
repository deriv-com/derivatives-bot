import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { api_base } from '@/external/bot-skeleton';
import chart_api from '@/external/bot-skeleton/services/api/chart-api';
import { useStore } from '@/hooks/useStore';
import {
    ActiveSymbolsRequest,
    ServerTimeRequest,
    TicksHistoryResponse,
    TicksStreamRequest,
    TradingTimesRequest,
} from '@deriv/api-types';
import { ChartTitle, SmartChart } from '@deriv-com/derivatives-charts';
import { useDevice } from '@deriv-com/ui';
import ToolbarWidgets from './toolbar-widgets';
import '@deriv-com/derivatives-charts/dist/smartcharts.css';

type TSubscription = {
    [key: string]: null | {
        unsubscribe?: () => void;
    };
};

type TError = null | {
    error?: {
        code?: string;
        message?: string;
    };
};

const subscriptions: TSubscription = {};

const Chart = observer(({ show_digits_stats }: { show_digits_stats: boolean }) => {
    const barriers: [] = [];
    const { common, ui } = useStore();
    const { chart_store, run_panel, dashboard } = useStore();
    const [isSafari, setIsSafari] = useState(false);

    const {
        chart_type,
        getMarketsOrder,
        granularity,
        onSymbolChange,
        setChartStatus,
        symbol,
        updateChartType,
        updateGranularity,
        updateSymbol,
        setChartSubscriptionId,
        chart_subscription_id,
    } = chart_store;
    const chartSubscriptionIdRef = useRef(chart_subscription_id);
    const { isDesktop, isMobile } = useDevice();
    const { is_drawer_open } = run_panel;
    const { is_chart_modal_visible } = dashboard;
    const settings = {
        assetInformation: false, // ui.is_chart_asset_info_visible,
        countdown: true,
        isHighestLowestMarkerEnabled: false, // TODO: Pending UI,
        language: common.current_language.toLowerCase(),
        position: ui.is_chart_layout_default ? 'bottom' : 'left',
        theme: ui.is_dark_mode_on ? 'dark' : 'light',
    };

    useEffect(() => {
        // Safari browser detection
        const isSafariBrowser = () => {
            const ua = navigator.userAgent.toLowerCase();
            return ua.indexOf('safari') !== -1 && ua.indexOf('chrome') === -1 && ua.indexOf('android') === -1;
        };

        setIsSafari(isSafariBrowser());

        return () => {
            chart_api.api.forgetAll('ticks');
        };
    }, []);

    useEffect(() => {
        chartSubscriptionIdRef.current = chart_subscription_id;
    }, [chart_subscription_id]);

    useEffect(() => {
        if (!symbol) updateSymbol();
    }, [symbol, updateSymbol]);

    const [forceChartRefresh, setForceChartRefresh] = useState(0);

    useEffect(() => {
        // FORCE INJECT 1s volatility indices directly into api_base.active_symbols
        if (api_base.active_symbols && Array.isArray(api_base.active_symbols)) {
            let symbols = [...api_base.active_symbols];

            // Check if our symbols are already present
            const existing_1s_symbols = symbols.filter((s: any) =>
                ['1HZ15V', '1HZ30V', '1HZ90V'].includes(s.symbol || s.underlying_symbol)
            );

            if (existing_1s_symbols.length < 3) {
                // Remove Spain 35 and any existing instances of our symbols
                symbols = symbols.filter((symbol: any) => {
                    const symbol_code = symbol.symbol || symbol.underlying_symbol;
                    // symbol_code !== 'OTC_IBEX35' &&
                    return !['1HZ15V', '1HZ30V', '1HZ90V'].includes(symbol_code);
                });

                // Force add our 1s volatility indices
                const required_1s_symbols = [
                    {
                        symbol: '1HZ15V',
                        underlying_symbol: '1HZ15V',
                        display_name: 'Volatility 15 (1s) Index',
                        market: 'synthetic_index',
                        market_display_name: 'Derived',
                        submarket: 'random_index',
                        submarket_display_name: 'Continuous Indices',
                        pip: 0.001,
                        pip_size: 0.001,
                        exchange_is_open: true,
                        is_trading_suspended: false,
                    },
                    {
                        symbol: '1HZ30V',
                        underlying_symbol: '1HZ30V',
                        display_name: 'Volatility 30 (1s) Index',
                        market: 'synthetic_index',
                        market_display_name: 'Derived',
                        submarket: 'random_index',
                        submarket_display_name: 'Continuous Indices',
                        pip: 0.001,
                        pip_size: 0.001,
                        exchange_is_open: true,
                        is_trading_suspended: false,
                    },
                    {
                        symbol: '1HZ90V',
                        underlying_symbol: '1HZ90V',
                        display_name: 'Volatility 90 (1s) Index',
                        market: 'synthetic_index',
                        market_display_name: 'Derived',
                        submarket: 'random_index',
                        submarket_display_name: 'Continuous Indices',
                        pip: 0.001,
                        pip_size: 0.001,
                        exchange_is_open: true,
                        is_trading_suspended: false,
                    },
                ];

                // Add our symbols
                symbols.push(...required_1s_symbols);

                // Replace the global api_base.active_symbols
                api_base.active_symbols = symbols;

                // Force chart to refresh by triggering a re-render
                setTimeout(() => {
                    setForceChartRefresh(prev => prev + 1);
                }, 100);
            }
        }
    }, [symbol]);

    const requestAPI = async (req: ServerTimeRequest | ActiveSymbolsRequest | TradingTimesRequest) => {
        const response = await chart_api.api.send(req);

        // Only modify active_symbols responses to keep it simple and avoid breaking the chart
        if (req && (req as ActiveSymbolsRequest).active_symbols && response && response.active_symbols) {
            let symbols = [...response.active_symbols];

            // Remove Spain 35 from chart
            // symbols = symbols.filter(symbol => {
            //     const symbol_code = symbol.symbol || symbol.underlying_symbol;
            //     return symbol_code !== 'OTC_IBEX35';
            // });

            // Force add our 1s volatility indices with sorting prefixes
            const required_1s_symbols = [
                {
                    symbol: '1HZ15V',
                    underlying_symbol: '1HZ15V',
                    display_name: 'Volatility 15 (1s) Index',
                    market: 'synthetic_index',
                    market_display_name: 'Derived',
                    submarket: 'random_index',
                    submarket_display_name: 'Continuous Indices',
                    pip: 0.001,
                    pip_size: 0.001,
                    exchange_is_open: true,
                    is_trading_suspended: false,
                },
                {
                    symbol: '1HZ30V',
                    underlying_symbol: '1HZ30V',
                    display_name: 'Volatility 30 (1s) Index',
                    market: 'synthetic_index',
                    market_display_name: 'Derived',
                    submarket: 'random_index',
                    submarket_display_name: 'Continuous Indices',
                    pip: 0.001,
                    pip_size: 0.001,
                    exchange_is_open: true,
                    is_trading_suspended: false,
                },
                {
                    symbol: '1HZ90V',
                    underlying_symbol: '1HZ90V',
                    display_name: 'Volatility 90 (1s) Index',
                    market: 'synthetic_index',
                    market_display_name: 'Derived',
                    submarket: 'random_index',
                    submarket_display_name: 'Continuous Indices',
                    pip: 0.001,
                    pip_size: 0.001,
                    exchange_is_open: true,
                    is_trading_suspended: false,
                },
            ];

            // Apply alphabetical sorting prefixes to force correct order
            // Since SmartChart uses alphabetical sorting internally, we need to make our desired order alphabetical
            const volatilityOrderMap: Record<string, string> = {
                'Volatility 10 (1s) Index': '01a_Volatility 10 (1s) Index',
                'Volatility 10 Index': '01b_Volatility 10 Index',
                'Volatility 15 (1s) Index': '02a_Volatility 15 (1s) Index',
                'Volatility 25 (1s) Index': '03a_Volatility 25 (1s) Index',
                'Volatility 25 Index': '03b_Volatility 25 Index',
                'Volatility 30 (1s) Index': '04a_Volatility 30 (1s) Index',
                'Volatility 50 (1s) Index': '05a_Volatility 50 (1s) Index',
                'Volatility 50 Index': '05b_Volatility 50 Index',
                'Volatility 75 (1s) Index': '06a_Volatility 75 (1s) Index',
                'Volatility 75 Index': '06b_Volatility 75 Index',
                'Volatility 90 (1s) Index': '07a_Volatility 90 (1s) Index',
                'Volatility 100 (1s) Index': '08a_Volatility 100 (1s) Index',
                'Volatility 100 Index': '08b_Volatility 100 Index',
            };

            // Apply sorting prefixes to volatility indices
            symbols.forEach((symbol: any) => {
                if (symbol.display_name && volatilityOrderMap[symbol.display_name]) {
                    symbol.original_display_name = symbol.display_name;
                    symbol.display_name = volatilityOrderMap[symbol.display_name];
                }
            });

            // Remove any existing instances first to avoid duplicates
            symbols = symbols.filter(symbol => {
                const symbol_code = symbol.symbol || symbol.underlying_symbol;
                return !['1HZ15V', '1HZ30V', '1HZ90V'].includes(symbol_code);
            });

            // Add our 1s volatility indices
            symbols.push(...required_1s_symbols);

            const modified_response = {
                ...response,
                active_symbols: symbols,
            };

            // Force update the global api_base.active_symbols as well to ensure consistency
            if (api_base.active_symbols) {
                api_base.active_symbols = symbols;
            }

            return modified_response;
        }

        return response;
    };

    const requestForgetStream = (subscription_id: string) => {
        subscription_id && chart_api.api.forget(subscription_id);
    };

    const requestSubscribe = async (req: TicksStreamRequest, callback: (data: any) => void) => {
        try {
            requestForgetStream(chartSubscriptionIdRef.current);
            const history = await chart_api.api.send(req);
            setChartSubscriptionId(history?.subscription.id);
            if (history) callback(history);
            if (req.subscribe === 1) {
                subscriptions[history?.subscription.id] = chart_api.api
                    .onMessage()
                    ?.subscribe(({ data }: { data: TicksHistoryResponse }) => {
                        callback(data);
                    });
            }
        } catch (e) {
            // eslint-disable-next-line no-console
            (e as TError)?.error?.code === 'MarketIsClosed' && callback([]); //if market is closed sending a empty array  to resolve
            console.log((e as TError)?.error?.message);
        }
    };

    if (!symbol) return null;
    const is_connection_opened = !!chart_api?.api;
    return (
        <div
            className={classNames('dashboard__chart-wrapper', {
                'dashboard__chart-wrapper--expanded': is_drawer_open && isDesktop,
                'dashboard__chart-wrapper--modal': is_chart_modal_visible && isDesktop,
                'dashboard__chart-wrapper--safari': isSafari,
            })}
            dir='ltr'
        >
            <SmartChart
                id={`dbot-${forceChartRefresh}`}
                key={`chart-${forceChartRefresh}`}
                barriers={barriers}
                showLastDigitStats={show_digits_stats}
                chartControlsWidgets={null}
                enabledChartFooter={false}
                stateChangeListener={(state: string) => {
                    // Handle state changes: INITIAL, READY, SCROLL_TO_LEFT
                    if (state === 'READY') {
                        setChartStatus(true);
                    }
                }}
                toolbarWidget={() => (
                    <ToolbarWidgets
                        updateChartType={updateChartType}
                        updateGranularity={updateGranularity}
                        position={!isDesktop ? 'bottom' : 'top'}
                        isDesktop={isDesktop}
                    />
                )}
                chartType={chart_type}
                isMobile={isMobile}
                enabledNavigationWidget={isDesktop}
                granularity={granularity}
                requestAPI={requestAPI}
                requestForget={() => {}}
                requestForgetStream={() => {}}
                requestSubscribe={requestSubscribe}
                settings={settings}
                symbol={symbol}
                topWidgets={() => <ChartTitle onChange={onSymbolChange} />}
                isConnectionOpened={is_connection_opened}
                getMarketsOrder={active_symbols => {
                    // Check if our 1s volatility indices are present
                    const volatility_1s_present =
                        active_symbols?.filter((s: any) =>
                            ['1HZ15V', '1HZ30V', '1HZ90V'].includes(s.symbol || s.underlying_symbol)
                        ) || [];

                    // If our symbols are missing, force add them here
                    if (active_symbols && volatility_1s_present.length < 3) {
                        const required_1s_symbols = [
                            {
                                symbol: '1HZ15V',
                                underlying_symbol: '1HZ15V',
                                display_name: 'Volatility 15 (1s) Index',
                                market: 'synthetic_index',
                                market_display_name: 'Derived',
                                submarket: 'random_index',
                                submarket_display_name: 'Continuous Indices',
                                pip: 0.001,
                                pip_size: 0.001,
                                exchange_is_open: true,
                                is_trading_suspended: false,
                            },
                            {
                                symbol: '1HZ30V',
                                underlying_symbol: '1HZ30V',
                                display_name: 'Volatility 30 (1s) Index',
                                market: 'synthetic_index',
                                market_display_name: 'Derived',
                                submarket: 'random_index',
                                submarket_display_name: 'Continuous Indices',
                                pip: 0.001,
                                pip_size: 0.001,
                                exchange_is_open: true,
                                is_trading_suspended: false,
                            },
                            {
                                symbol: '1HZ90V',
                                underlying_symbol: '1HZ90V',
                                display_name: 'Volatility 90 (1s) Index',
                                market: 'synthetic_index',
                                market_display_name: 'Derived',
                                submarket: 'random_index',
                                submarket_display_name: 'Continuous Indices',
                                pip: 0.001,
                                pip_size: 0.001,
                                exchange_is_open: true,
                                is_trading_suspended: false,
                            },
                        ];

                        // Remove Spain 35 and any existing instances of our symbols
                        const modified_symbols = active_symbols.filter((symbol: any) => {
                            const symbol_code = symbol.symbol || symbol.underlying_symbol;
                            //symbol_code !== 'OTC_IBEX35' &&
                            return !['1HZ15V', '1HZ30V', '1HZ90V'].includes(symbol_code);
                        });

                        // Add our 1s volatility indices
                        modified_symbols.push(...required_1s_symbols);

                        return getMarketsOrder(modified_symbols);
                    }

                    return getMarketsOrder(active_symbols);
                }}
                isLive
                leftMargin={80}
            />
        </div>
    );
});

export default Chart;
