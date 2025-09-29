import Cookies from 'js-cookie';
import CommonStore from '@/stores/common-store';
import { TAuthData } from '@/types/api-types';
import { clearAuthData } from '@/utils/auth-utils';
import { setSessionToken } from '@/utils/session-token-utils';
import { clearInvalidTokenParams } from '@/utils/url-utils';
import { tradingTimesService } from '../../../../components/shared/services/trading-times-service';
import { ACTIVE_SYMBOLS, generateDisplayName, MARKET_MAPPINGS } from '../../../../components/shared/utils/common-data';
import { observer as globalObserver } from '../../utils/observer';
import { doUntilDone, socket_state } from '../tradeEngine/utils/helpers';
import {
    CONNECTION_STATUS,
    setAccountList,
    setAuthData,
    setConnectionStatus,
    setIsAuthorized,
    setIsAuthorizing,
} from './observables/connection-status-stream';
import ApiHelpers from './api-helpers';
import { generateDerivApiInstance, V2GetActiveClientId, V2GetActiveToken } from './appId';
import chart_api from './chart-api';

type CurrentSubscription = {
    id: string;
    unsubscribe: () => void;
};

type SubscriptionPromise = Promise<{
    subscription: CurrentSubscription;
}>;

type TApiBaseApi = {
    connection: {
        readyState: keyof typeof socket_state;
        addEventListener: (event: string, callback: () => void) => void;
        removeEventListener: (event: string, callback: () => void) => void;
    };
    send: (data: unknown) => void;
    disconnect: () => void;
    authorize: (token: string) => Promise<{ authorize: TAuthData; error: unknown }>;

    onMessage: () => {
        subscribe: (callback: (message: unknown) => void) => {
            unsubscribe: () => void;
        };
    };
} & ReturnType<typeof generateDerivApiInstance>;

class APIBase {
    api: TApiBaseApi | null = null;
    token: string = '';
    account_id: string = '';
    pip_sizes = {};
    account_info = {};
    is_running = false;
    subscriptions: CurrentSubscription[] = [];
    time_interval: ReturnType<typeof setInterval> | null = null;
    has_active_symbols = false;
    is_stopping = false;
    active_symbols: any[] = [];
    current_auth_subscriptions: SubscriptionPromise[] = [];
    is_authorized = false;
    active_symbols_promise: Promise<any[] | undefined> | null = null;
    common_store: CommonStore | undefined;

    unsubscribeAllSubscriptions = () => {
        this.current_auth_subscriptions?.forEach(subscription_promise => {
            subscription_promise.then(({ subscription }) => {
                if (subscription?.id) {
                    this.api?.send({
                        forget: subscription.id,
                    });
                }
            });
        });
        this.current_auth_subscriptions = [];
    };

    onsocketopen() {
        setConnectionStatus(CONNECTION_STATUS.OPENED);

        this.handleTokenExchangeIfNeeded();
    }

    private async handleTokenExchangeIfNeeded() {
        // Check URL directly for one-time token (no localStorage needed)
        const urlParams = new URLSearchParams(window.location.search);
        const oneTimeToken = urlParams.get('token');
        const accountType = urlParams.get('account_type');

        // Only save account_type when BOTH token and account_type are present
        if (oneTimeToken && accountType) {
            localStorage.setItem('account_type', accountType);
        }
        // If no token or account_type, don't save anything - will fallback to demo server

        if (oneTimeToken) {
            // Remove token from URL immediately for security
            const url = new URL(window.location.href);
            url.searchParams.delete('token');
            // Also remove account_type from URL after processing
            if (accountType) {
                url.searchParams.delete('account_type');
            }
            window.history.replaceState({}, document.title, url.toString());

            // Exchange the token
            setIsAuthorizing(true);

            try {
                const response = await this.getSessionToken(oneTimeToken);

                if (response?.error) {
                    console.error('Token exchange failed:', response.error);
                    // Clear URL query parameters and emit InvalidToken event for invalid URL parameter tokens
                    clearInvalidTokenParams();
                    globalObserver.emit('InvalidToken', { error: response.error });
                    setIsAuthorizing(false);
                    return;
                }

                if (response?.get_session_token?.token) {
                    const sessionToken = response.get_session_token.token;
                    const expires = response.get_session_token.expires;
                    setSessionToken(sessionToken, expires);
                }
            } catch (error) {
                console.error('Error exchanging token:', error);
                // Clear URL query parameters and emit InvalidToken event for any token exchange errors
                clearInvalidTokenParams();
                globalObserver.emit('InvalidToken', { error });
                setIsAuthorizing(false);
                return;
            }
        }

        // Now proceed with normal authorization if we have a token
        if (V2GetActiveToken()) {
            setIsAuthorizing(true);
            await this.authorizeAndSubscribe();
        }
    }

    onsocketclose() {
        setConnectionStatus(CONNECTION_STATUS.CLOSED);
        this.reconnectIfNotConnected();
    }

    async init(force_create_connection = false) {
        this.toggleRunButton(true);

        if (this.api) {
            this.unsubscribeAllSubscriptions();
        }

        if (!this.api || this.api?.connection.readyState !== 1 || force_create_connection) {
            if (this.api?.connection) {
                ApiHelpers.disposeInstance();
                setConnectionStatus(CONNECTION_STATUS.CLOSED);
                this.api.disconnect();
                this.api.connection.removeEventListener('open', this.onsocketopen.bind(this));
                this.api.connection.removeEventListener('close', this.onsocketclose.bind(this));
            }
            this.api = generateDerivApiInstance();
            this.api?.connection.addEventListener('open', this.onsocketopen.bind(this));
            this.api?.connection.addEventListener('close', this.onsocketclose.bind(this));
        }

        const hasToken = V2GetActiveToken();

        if (!this.has_active_symbols && !hasToken) {
            this.active_symbols_promise = this.getActiveSymbols().then(() => undefined);
        }

        this.initEventListeners();

        if (this.time_interval) clearInterval(this.time_interval);
        this.time_interval = null;

        chart_api.init(force_create_connection);
    }

    getConnectionStatus() {
        if (this.api?.connection) {
            const ready_state = this.api.connection.readyState;
            return socket_state[ready_state as keyof typeof socket_state] || 'Unknown';
        }
        return 'Socket not initialized';
    }

    terminate() {
        // eslint-disable-next-line no-console
        if (this.api) this.api.disconnect();
    }

    initEventListeners() {
        if (window) {
            window.addEventListener('online', this.reconnectIfNotConnected);
            window.addEventListener('focus', this.reconnectIfNotConnected);
        }
    }

    async createNewInstance(account_id: string) {
        if (this.account_id !== account_id) {
            await this.init();
        }
    }

    reconnectIfNotConnected = () => {
        // eslint-disable-next-line no-console
        console.log('connection state: ', this.api?.connection?.readyState);
        if (this.api?.connection?.readyState && this.api?.connection?.readyState > 1) {
            // eslint-disable-next-line no-console
            console.log('Info: Connection to the server was closed, trying to reconnect.');
            this.init(true);
        }
    };

    async authorizeAndSubscribe() {
        const token = V2GetActiveToken();
        if (!token || !this.api) return;

        this.token = token;
        this.account_id = V2GetActiveClientId() ?? '';
        setIsAuthorizing(true);

        try {
            const { authorize, error } = await this.api.authorize(this.token);
            if (error) {
                if (error.code === 'InvalidToken') {
                    // Clear URL query parameters for InvalidToken errors
                    clearInvalidTokenParams();
                    if (Cookies.get('logged_state') === 'true') {
                        globalObserver.emit('InvalidToken', { error });
                    } else {
                        clearAuthData();
                    }
                } else {
                    // Authorization error
                    console.error('Authorization error:', error);
                }
                setIsAuthorizing(false);
                return error;
            }

            this.account_info = authorize;

            const currentAccount = authorize?.loginid
                ? {
                      balance: authorize.balance,
                      currency: authorize.currency || 'USD',
                      is_virtual: authorize.is_virtual || 0,
                      loginid: authorize.loginid,
                  }
                : null;

            const accountList = currentAccount ? [currentAccount] : [];

            setAccountList(accountList); // Observable stream
            setAuthData(authorize);

            globalObserver.emit('api.authorize', {
                account_list: accountList,
                current_account: {
                    loginid: authorize?.loginid,
                    currency: authorize?.currency || 'USD',
                    is_virtual: authorize?.is_virtual || 0,
                    balance: typeof authorize?.balance === 'number' ? authorize.balance : undefined,
                },
            });

            setIsAuthorized(true);
            this.is_authorized = true;
            localStorage.setItem('client_account_details', JSON.stringify(accountList));
            localStorage.setItem('client.country', authorize?.country);

            if (authorize?.loginid && this.token) {
                const existingAccountsList = JSON.parse(localStorage.getItem('accountsList') || '{}');
                existingAccountsList[authorize.loginid] = this.token;
                localStorage.setItem('accountsList', JSON.stringify(existingAccountsList));
                localStorage.setItem('active_loginid', authorize.loginid);
            }

            if (this.has_active_symbols) {
                this.toggleRunButton(false);
            } else {
                this.active_symbols_promise = this.getActiveSymbols();
            }
            this.subscribe();
        } catch (e) {
            this.is_authorized = false;
            clearAuthData();
            setIsAuthorized(false);
            globalObserver.emit('Error', e);
        } finally {
            setIsAuthorizing(false);
        }
    }

    async getSessionToken(oneTimeToken: string) {
        if (!this.api) {
            throw new Error('API connection not available');
        }

        return this.api.send({
            get_session_token: oneTimeToken,
        });
    }

    async subscribe() {
        const subscribeToStream = (streamName: string) => {
            return doUntilDone(
                () => {
                    const subscription = this.api?.send({
                        [streamName]: 1,
                        subscribe: 1,
                    });

                    if (subscription) {
                        this.current_auth_subscriptions.push(subscription);
                    }
                    return subscription;
                },
                [],
                this
            );
        };

        const streamsToSubscribe = ['balance', 'transaction', 'proposal_open_contract'];

        await Promise.all(streamsToSubscribe.map(subscribeToStream));
    }

    getActiveSymbols = async () => {
        if (!this.api) {
            this.useActiveSymbols();
            return;
        }

        try {
            // Add timeout to prevent hanging
            const timeout = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Active symbols fetch timeout')), 10000)
            );

            const activeSymbolsPromise = doUntilDone(() => this.api?.send({ active_symbols: 'brief' }), [], this);

            const result = await Promise.race([activeSymbolsPromise, timeout]);

            const { active_symbols = [], error = {} } = result as any;

            if (error && Object.keys(error).length > 0) {
                this.useActiveSymbols();
                return;
            }

            if (!active_symbols.length) {
                this.useActiveSymbols();
                return;
            }

            const pip_sizes = {};
            this.has_active_symbols = true;

            // Process pip sizes - handle both old and new field names
            active_symbols.forEach((symbol: any) => {
                const underlying_symbol = symbol.underlying_symbol || symbol.symbol;
                const pip_size = symbol.pip_size || symbol.pip;
                if (underlying_symbol && pip_size) {
                    (pip_sizes as Record<string, number>)[underlying_symbol] = +(+pip_size)
                        .toExponential()
                        .substring(3);
                }
            });
            this.pip_sizes = pip_sizes as Record<string, number>;

            // Enrich active symbols with trading times data with timeout
            try {
                const enrichmentTimeout = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Enrichment timeout')), 5000)
                );

                const enrichmentPromise = this.enrichActiveSymbolsWithTradingTimes(active_symbols);
                const enriched_symbols = await Promise.race([enrichmentPromise, enrichmentTimeout]);

                this.active_symbols = enriched_symbols as any[];
            } catch (enrichment_error) {
                // Fallback to original active symbols if enrichment fails
                this.active_symbols = active_symbols;
            }
            this.toggleRunButton(false);
            return this.active_symbols;
        } catch (fetch_error) {
            this.useActiveSymbols();
        }
    };

    private useActiveSymbols() {
        // Use common active symbols
        this.active_symbols = ACTIVE_SYMBOLS;

        // Set pip sizes
        const pip_sizes = {};
        this.active_symbols.forEach((symbol: any) => {
            const underlying_symbol = symbol.underlying_symbol || symbol.symbol;
            const pip_size = symbol.pip;
            if (underlying_symbol && pip_size) {
                (pip_sizes as Record<string, number>)[underlying_symbol] = +(+pip_size).toExponential().substring(3);
            }
        });
        this.pip_sizes = pip_sizes as Record<string, number>;

        this.has_active_symbols = true;
        this.toggleRunButton(false);
    }

    /**
     * Maps active symbols market codes to trading times market names
     */
    private getMarketMapping(): Map<string, string> {
        return MARKET_MAPPINGS.MARKET_DISPLAY_NAMES;
    }

    /**
     * Maps active symbols submarket codes to trading times submarket names
     */
    private getSubmarketMapping(): Map<string, string> {
        return MARKET_MAPPINGS.SUBMARKET_DISPLAY_NAMES;
    }

    /**
     * Enriches active symbols with market display names from trading times
     */
    private async enrichActiveSymbolsWithTradingTimes(active_symbols: any[]) {
        if (!active_symbols || !active_symbols.length) {
            return active_symbols;
        }

        try {
            // Get trading times data
            const trading_times = await tradingTimesService.getTradingTimes();

            if (!trading_times?.markets) {
                return active_symbols;
            }

            // Create lookup maps for efficient searching
            const market_display_names = new Map<string, string>();
            const submarket_display_names = new Map<string, string>();
            const market_mapping = this.getMarketMapping();
            const submarket_mapping = this.getSubmarketMapping();

            if (!trading_times.markets || !Array.isArray(trading_times.markets)) {
                return active_symbols;
            }

            try {
                trading_times.markets.forEach((market: any) => {
                    // Use the name property directly as the display name
                    if (market.name) {
                        market_display_names.set(market.name, market.name);

                        // Also create reverse mapping for market codes
                        for (const [code, name] of market_mapping.entries()) {
                            if (name === market.name) {
                                market_display_names.set(code, market.name);
                            }
                        }
                    }

                    if (market.submarkets) {
                        market.submarkets.forEach((submarket: any) => {
                            // Use the name property directly as the display name
                            if (submarket.name && market.name) {
                                const key = `${market.name}_${submarket.name}`;
                                submarket_display_names.set(key, submarket.name);

                                // Also create mapping for market codes and submarket codes
                                for (const [code, name] of market_mapping.entries()) {
                                    if (name === market.name) {
                                        const code_key = `${code}_${submarket.name}`;
                                        submarket_display_names.set(code_key, submarket.name);
                                    }
                                }
                            }
                        });
                    }
                });
            } catch (markets_error) {
                return active_symbols;
            }

            // Add direct submarket code mappings
            for (const [submarket_code, submarket_name] of submarket_mapping.entries()) {
                submarket_display_names.set(submarket_code, submarket_name);

                // Also add with market prefixes
                for (const [market_code] of market_mapping.entries()) {
                    const key = `${market_code}_${submarket_code}`;
                    submarket_display_names.set(key, submarket_name);
                }
            }

            // Create symbol display names lookup
            const symbol_display_names = new Map<string, string>();

            trading_times.markets.forEach((market: any) => {
                if (market.submarkets) {
                    market.submarkets.forEach((submarket: any) => {
                        if (submarket.symbols) {
                            submarket.symbols.forEach((symbol_info: any) => {
                                if (symbol_info.symbol && symbol_info.display_name) {
                                    symbol_display_names.set(symbol_info.symbol, symbol_info.display_name);
                                }
                                // Also handle underlying_symbol if present
                                if (symbol_info.underlying_symbol && symbol_info.display_name) {
                                    symbol_display_names.set(symbol_info.underlying_symbol, symbol_info.display_name);
                                }
                            });
                        }
                    });
                }
            });

            // Enrich each active symbol
            return active_symbols.map(symbol => {
                const enriched_symbol = { ...symbol };

                // Add market display name using the name property from trading times
                if (symbol.market) {
                    enriched_symbol.market_display_name = market_display_names.get(symbol.market) || symbol.market;
                }

                // Add submarket display name using the name property from trading times
                if (symbol.submarket) {
                    // Try multiple lookup strategies for submarket
                    let submarket_display_name = symbol.submarket;

                    // 1. Try with market prefix
                    if (symbol.market) {
                        const submarket_key = `${symbol.market}_${symbol.submarket}`;
                        submarket_display_name = submarket_display_names.get(submarket_key) || submarket_display_name;
                    }

                    // 2. Try direct submarket code lookup
                    submarket_display_name = submarket_display_names.get(symbol.submarket) || submarket_display_name;

                    enriched_symbol.submarket_display_name = submarket_display_name;
                }

                // Add subgroup display name if available using the name property from trading times
                if (symbol.subgroup) {
                    let subgroup_display_name = symbol.subgroup;

                    // Try with market prefix
                    if (symbol.market) {
                        const subgroup_key = `${symbol.market}_${symbol.subgroup}`;
                        subgroup_display_name = submarket_display_names.get(subgroup_key) || subgroup_display_name;
                    }

                    // Try direct subgroup code lookup
                    subgroup_display_name = submarket_display_names.get(symbol.subgroup) || subgroup_display_name;

                    enriched_symbol.subgroup_display_name = subgroup_display_name;
                }

                // Add symbol display name from trading times
                const symbol_code = symbol.underlying_symbol || symbol.symbol;
                if (symbol_code) {
                    const symbol_display_name = symbol_display_names.get(symbol_code);
                    if (symbol_display_name) {
                        enriched_symbol.display_name = symbol_display_name;
                    } else {
                        // Fallback: Generate a display name if not found in trading times
                        enriched_symbol.display_name = this.generateFallbackDisplayName(symbol_code, symbol);
                    }
                }

                // Add underlying_symbol display name from trading times
                if (symbol.underlying_symbol) {
                    const underlying_symbol_display_name = symbol_display_names.get(symbol.underlying_symbol);
                    if (underlying_symbol_display_name) {
                        enriched_symbol.underlying_symbol_display_name = underlying_symbol_display_name;
                    }
                }

                // Also add symbol display name if symbol field exists
                if (symbol.symbol) {
                    const symbol_field_display_name = symbol_display_names.get(symbol.symbol);
                    if (symbol_field_display_name) {
                        enriched_symbol.symbol_display_name = symbol_field_display_name;
                    }
                }

                // Handle new API field names - ensure backward compatibility
                if (symbol.symbol_type && !symbol.underlying_symbol_type) {
                    enriched_symbol.underlying_symbol_type = symbol.symbol_type;
                }

                // Ensure we have both symbol and underlying_symbol for backward compatibility
                if (symbol.underlying_symbol && !symbol.symbol) {
                    enriched_symbol.symbol = symbol.underlying_symbol;
                } else if (symbol.symbol && !symbol.underlying_symbol) {
                    enriched_symbol.underlying_symbol = symbol.symbol;
                }

                return enriched_symbol;
            });
        } catch (error) {
            return active_symbols;
        }
    }

    /**
     * Generates a fallback display name for symbols not found in trading times
     * Aligned with frontend getMarketNamesMap() configuration
     */
    private generateFallbackDisplayName(symbol_code: string, symbol: any): string {
        return generateDisplayName(symbol_code, symbol);
    }

    toggleRunButton = (toggle: boolean) => {
        const run_button = document.querySelector('#db-animation__run-button');
        if (!run_button) return;
        (run_button as HTMLButtonElement).disabled = toggle;
    };

    setIsRunning(toggle = false) {
        this.is_running = toggle;
    }

    pushSubscription(subscription: CurrentSubscription) {
        this.subscriptions.push(subscription);
    }

    clearSubscriptions() {
        this.subscriptions.forEach(s => s.unsubscribe());
        this.subscriptions = [];

        // Resetting timeout resolvers
        const global_timeouts = globalObserver.getState('global_timeouts') ?? [];

        global_timeouts.forEach((_: unknown, i: number) => {
            clearTimeout(i);
        });
    }
}

export const api_base = new APIBase();
