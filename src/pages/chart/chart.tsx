import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { buildSmartchartsChampionAdapter } from '@/adapters/smartcharts-champion';
import { createServices } from '@/adapters/smartcharts-champion/services';
import { createTransport } from '@/adapters/smartcharts-champion/transport';
import chart_api from '@/external/bot-skeleton/services/api/chart-api';
import { useStore } from '@/hooks/useStore';
import type { SmartchartsChampionAdapter } from '@/types/smartchart.types';
import {
    ActiveSymbols,
    ChartTitle,
    SmartChart,
    TGetQuotes,
    TGranularity,
    TradingTimesMap,
    TSubscribeQuotes,
    TUnsubscribeQuotes,
} from '@deriv-com/smartcharts-champion';
import { useDevice } from '@deriv-com/ui';
import ToolbarWidgets from './toolbar-widgets';
import '@deriv-com/smartcharts-champion/dist/smartcharts.css';

const Chart = observer(({ show_digits_stats }: { show_digits_stats: boolean }) => {
    const barriers: [] = [];
    const { common, ui } = useStore();
    const { chart_store, run_panel, dashboard } = useStore();
    const [isSafari, setIsSafari] = useState(false);

    // SmartCharts Champion Adapter
    const [adapter, setAdapter] = useState<SmartchartsChampionAdapter | null>(null);
    const [adapterInitialized, setAdapterInitialized] = useState(false);
    const [chartData, setChartData] = useState<
        { activeSymbols: ActiveSymbols; tradingTimes: TradingTimesMap } | undefined
    >(undefined);

    // Create wrapper functions for SmartCharts Champion API
    const getQuotes: TGetQuotes = async params => {
        if (!adapter) {
            throw new Error('Adapter not initialized');
        }

        const result = await adapter.getQuotes({
            symbol: params.symbol,
            granularity: params.granularity as any,
            count: params.count,
            start: params.start,
            end: params.end,
        });

        // Transform adapter result to SmartCharts Champion format
        if (params.granularity === 0) {
            // For ticks, return history format
            return {
                history: {
                    prices: result.quotes.map(q => q.Close),
                    times: result.quotes.map(q => parseInt(q.Date)),
                },
            };
        } else {
            // For candles, return candles format
            return {
                candles: result.quotes.map(q => ({
                    open: q.Open || q.Close,
                    high: q.High || q.Close,
                    low: q.Low || q.Close,
                    close: q.Close,
                    epoch: parseInt(q.Date),
                })),
            };
        }
    };

    const subscribeQuotes: TSubscribeQuotes = (params, callback) => {
        if (!adapter) {
            return () => {};
        }

        return adapter.subscribeQuotes(
            {
                symbol: params.symbol,
                granularity: params.granularity as any,
            },
            quote => {
                callback(quote);
            }
        );
    };

    const unsubscribeQuotes: TUnsubscribeQuotes = request => {
        if (adapter) {
            // If we have request details, use the adapter's unsubscribe method
            if (request?.symbol && typeof request.granularity !== 'undefined') {
                adapter.unsubscribeQuotes({
                    symbol: request.symbol,
                    granularity: request.granularity as any,
                });
            } else {
                // Fallback: unsubscribe all via transport
                adapter.transport.unsubscribeAll('ticks');
            }
        }
    };

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

    // Initialize SmartCharts Champion Adapter for verification
    useEffect(() => {
        if (!adapterInitialized && chart_api.api) {
            try {
                const transport = createTransport();
                const services = createServices();
                const championAdapter = buildSmartchartsChampionAdapter(transport, services, {
                    debug: true,
                    subscriptionTimeout: 30000,
                });

                setAdapter(championAdapter);
                setAdapterInitialized(true);
            } catch (error) {
                console.error('❌ [SmartCharts Champion Adapter] Failed to initialize:', error);
            }
        }
    }, [adapterInitialized]);

    // Load chart data when adapter is initialized
    useEffect(() => {
        if (adapter && adapterInitialized) {
            const loadChartData = async () => {
                try {
                    const data = await adapter.getChartData();
                    // TradingTimes: Use directly from adapter (already in correct format)
                    setChartData({
                        activeSymbols: data.activeSymbols,
                        tradingTimes: data.tradingTimes,
                    });
                } catch (error) {
                    console.error('❌ [SmartCharts Champion] Failed to load chart data:', error);
                    // Set fallback data to prevent undefined
                    setChartData({
                        activeSymbols: [] as ActiveSymbols,
                        tradingTimes: {} as TradingTimesMap,
                    });
                }
            };

            loadChartData();
        }
    }, [adapter, adapterInitialized]);

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
            {chartData && chartData.activeSymbols.length > 0 && (
                <SmartChart
                    id='dbot'
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
                    granularity={granularity as TGranularity}
                    getQuotes={getQuotes}
                    subscribeQuotes={subscribeQuotes}
                    unsubscribeQuotes={unsubscribeQuotes}
                    chartData={{ activeSymbols: chartData.activeSymbols, tradingTimes: chartData.tradingTimes }}
                    shouldFetchTradingTimes={false}
                    settings={settings}
                    symbol={symbol}
                    topWidgets={() => <ChartTitle onChange={onSymbolChange} />}
                    isConnectionOpened={is_connection_opened}
                    getMarketsOrder={getMarketsOrder}
                    isLive
                    leftMargin={80}
                />
            )}
        </div>
    );
});

export default Chart;
