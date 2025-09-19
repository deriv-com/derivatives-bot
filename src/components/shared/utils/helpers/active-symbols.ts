import { ActiveSymbols } from '@deriv/api-types';
import { WS } from '../../services';
import { LocalStore } from '../storage';

type TIsSymbolOpen = {
    exchange_is_open: 0 | 1;
};

// eslint-disable-next-line default-param-last
export const isMarketClosed = (active_symbols: ActiveSymbols = [], symbol: string) => {
    if (!active_symbols.length) return false;
    // Handle both old and new field names for backward compatibility
    const getSymbolField = (item: any) => item.underlying_symbol || item.symbol;
    return active_symbols.filter(x => getSymbolField(x) === symbol)[0]
        ? !active_symbols.filter(symbol_info => getSymbolField(symbol_info) === symbol)[0].exchange_is_open
        : false;
};

export const pickDefaultSymbol = async (active_symbols: ActiveSymbols = []) => {
    if (!active_symbols.length) return '';
    const fav_open_symbol = await getFavoriteOpenSymbol(active_symbols);
    if (fav_open_symbol) return fav_open_symbol;
    const default_open_symbol = await getDefaultOpenSymbol(active_symbols);
    return default_open_symbol;
};

const getFavoriteOpenSymbol = async (active_symbols: ActiveSymbols) => {
    try {
        const chart_favorites = LocalStore.get('cq-favorites');
        if (!chart_favorites) return undefined;
        const client_favorite_markets: string[] = JSON.parse(chart_favorites)['chartTitle&Comparison'];

        const client_favorite_list = client_favorite_markets.map(client_fav_symbol =>
            active_symbols.find(
                symbol_info =>
                    (symbol_info as any).underlying_symbol === client_fav_symbol ||
                    symbol_info.symbol === client_fav_symbol
            )
        );
        if (client_favorite_list) {
            const client_first_open_symbol = client_favorite_list.filter(symbol => symbol).find(isSymbolOpen);
            if (client_first_open_symbol) {
                const symbolField =
                    (client_first_open_symbol as any).underlying_symbol || client_first_open_symbol.symbol;
                const is_symbol_offered = await isSymbolOffered(symbolField);
                if (is_symbol_offered) return symbolField;
            }
        }
        return undefined;
    } catch (error) {
        return undefined;
    }
};

const getDefaultOpenSymbol = async (active_symbols: ActiveSymbols) => {
    const default_open_symbol =
        (await findSymbol(active_symbols, '1HZ100V')) ||
        (await findFirstSymbol(active_symbols, /random_index/)) ||
        (await findFirstSymbol(active_symbols, /major_pairs/));
    if (default_open_symbol) {
        return (default_open_symbol as any).underlying_symbol || default_open_symbol.symbol;
    }
    const majorPairsSymbol = active_symbols.find(symbol_info => symbol_info.submarket === 'major_pairs');
    return majorPairsSymbol ? (majorPairsSymbol as any).underlying_symbol || majorPairsSymbol.symbol : undefined;
};

const findSymbol = async (active_symbols: ActiveSymbols, symbol: string) => {
    const first_symbol = active_symbols.find(
        symbol_info =>
            ((symbol_info as any).underlying_symbol === symbol || symbol_info.symbol === symbol) &&
            isSymbolOpen(symbol_info)
    );
    if (first_symbol) {
        const symbolField = (first_symbol as any).underlying_symbol || first_symbol.symbol;
        const is_symbol_offered = await isSymbolOffered(symbolField);
        if (is_symbol_offered) return first_symbol;
    }
    return undefined;
};

const findFirstSymbol = async (active_symbols: ActiveSymbols, pattern: RegExp) => {
    const first_symbol = active_symbols.find(
        symbol_info => pattern.test(symbol_info.submarket) && isSymbolOpen(symbol_info)
    );
    if (first_symbol) {
        const symbolField = (first_symbol as any).underlying_symbol || first_symbol.symbol;
        const is_symbol_offered = await isSymbolOffered(symbolField);
        if (is_symbol_offered) return first_symbol;
    }
    return undefined;
};

type TFindFirstOpenMarket = { category?: string; subcategory?: string } | undefined;

export const findFirstOpenMarket = async (
    active_symbols: ActiveSymbols,
    markets: string[]
): Promise<TFindFirstOpenMarket> => {
    const market = markets.shift();
    const first_symbol = active_symbols.find(symbol_info => market === symbol_info.market && isSymbolOpen(symbol_info));
    if (first_symbol) {
        const symbolField = (first_symbol as any).underlying_symbol || first_symbol.symbol;
        const is_symbol_offered = await isSymbolOffered(symbolField);
        if (is_symbol_offered) return { category: first_symbol?.market, subcategory: first_symbol?.submarket };
    }
    if (markets.length > 0) return findFirstOpenMarket(active_symbols, markets);
    return undefined;
};

const isSymbolOpen = (symbol?: TIsSymbolOpen) => symbol?.exchange_is_open === 1;

const isSymbolOffered = async (symbol?: string) => {
    const r = await WS.storage.contractsFor(symbol);
    return !['InvalidSymbol', 'InputValidationFailed'].includes(r.error?.code);
};

export type TActiveSymbols = {
    symbol?: string; // Keep for backward compatibility
    underlying_symbol?: string; // New field name
    display_name: string;
}[];

// eslint-disable-next-line default-param-last
export const getSymbolDisplayName = (active_symbols: TActiveSymbols = [], symbol: string) =>
    (
        active_symbols.find(
            symbol_info =>
                symbol_info.underlying_symbol?.toUpperCase() === symbol.toUpperCase() ||
                symbol_info.symbol?.toUpperCase() === symbol.toUpperCase()
        ) || {
            display_name: '',
        }
    ).display_name;
