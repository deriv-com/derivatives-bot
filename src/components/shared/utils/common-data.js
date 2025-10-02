/**
 * Common Data Utilities
 *
 * This file contains centralized data constants and utility functions
 * to improve maintainability and provide consistent data across components.
 */

// Trading Times Data
export const TRADING_TIMES = {
    // Trading times for major symbols
    SYMBOLS: [
        // Forex - 24/5 markets
        'frxEURUSD',
        'frxGBPUSD',
        'frxUSDJPY',
        'frxAUDUSD',
        'frxUSDCAD',
        'frxUSDCHF',
        'frxNZDUSD',
        'frxEURGBP',
        // Indices - various hours
        'OTC_AS51',
        'OTC_AUS200',
        'OTC_DJI',
        'OTC_SPC',
        'OTC_NDX',
        'OTC_FTSE',
        'OTC_N225',
        'OTC_HSI',
        // Commodities
        'frxXAUUSD',
        'frxXAGUSD',
        'OTC_OIL_USD',
        'OTC_GAS_USD',
        // Volatility Indices - 24/7 (ordered to match dropdown structure)
        '1HZ100V',
        '1HZ10V',
        '1HZ25V',
        '1HZ50V',
        '1HZ75V',
        'R_10',
        'R_100',
        'R_25',
        'R_50',
        'R_75',
        'RDBEAR',
        'RDBULL',
    ],

    SYMBOL_DISPLAY_NAMES: {
        // Forex
        frxEURUSD: 'EUR/USD',
        frxGBPUSD: 'GBP/USD',
        frxUSDJPY: 'USD/JPY',
        frxAUDUSD: 'AUD/USD',
        frxUSDCAD: 'USD/CAD',
        frxUSDCHF: 'USD/CHF',
        frxNZDUSD: 'NZD/USD',
        frxEURGBP: 'EUR/GBP',
        frxXAUUSD: 'Gold/USD',
        frxXAGUSD: 'Silver/USD',

        // Indices
        OTC_AS51: 'Australia 200',
        OTC_AUS200: 'Australia 200',
        OTC_DJI: 'Wall Street 30',
        OTC_SPC: 'US 500',
        OTC_NDX: 'US Tech 100',
        OTC_FTSE: 'UK 100',
        OTC_N225: 'Japan 225',
        OTC_HSI: 'Hong Kong 50',

        // Commodities
        OTC_OIL_USD: 'Oil/USD',
        OTC_GAS_USD: 'Gas/USD',
        FRXXPDUSD: 'Palladium/USD',
        FRXXPTUSD: 'Platinum/USD',
        'XPD/USD': 'Palladium/USD',
        'XPT/USD': 'Platinum/USD',
        XPDUSD: 'Palladium/USD',
        XPTUSD: 'Platinum/USD',

        // Volatility Indices - ordered to match dropdown structure
        '1HZ100V': 'Volatility 100 (1s) Index',
        '1HZ10V': 'Volatility 10 (1s) Index',
        '1HZ25V': 'Volatility 25 (1s) Index',
        '1HZ50V': 'Volatility 50 (1s) Index',
        '1HZ75V': 'Volatility 75 (1s) Index',
        R_10: 'Volatility 10 Index',
        R_100: 'Volatility 100 Index',
        R_25: 'Volatility 25 Index',
        R_50: 'Volatility 50 Index',
        R_75: 'Volatility 75 Index',
        RDBEAR: 'Bear Market Index',
        RDBULL: 'Bull Market Index',
    },
};

// Active Symbols Data
export const ACTIVE_SYMBOLS = [
    // Volatility Indices - ordered to match dropdown structure
    {
        symbol: '1HZ100V',
        underlying_symbol: '1HZ100V',
        display_name: 'Volatility 100 (1s) Index',
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
        symbol: '1HZ10V',
        underlying_symbol: '1HZ10V',
        display_name: 'Volatility 10 (1s) Index',
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
        symbol: '1HZ25V',
        underlying_symbol: '1HZ25V',
        display_name: 'Volatility 25 (1s) Index',
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
        symbol: '1HZ50V',
        underlying_symbol: '1HZ50V',
        display_name: 'Volatility 50 (1s) Index',
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
        symbol: '1HZ75V',
        underlying_symbol: '1HZ75V',
        display_name: 'Volatility 75 (1s) Index',
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
        symbol: 'R_10',
        underlying_symbol: 'R_10',
        display_name: 'Volatility 10 Index',
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
        symbol: 'R_100',
        underlying_symbol: 'R_100',
        display_name: 'Volatility 100 Index',
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
        symbol: 'R_25',
        underlying_symbol: 'R_25',
        display_name: 'Volatility 25 Index',
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
        symbol: 'R_50',
        underlying_symbol: 'R_50',
        display_name: 'Volatility 50 Index',
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
        symbol: 'R_75',
        underlying_symbol: 'R_75',
        display_name: 'Volatility 75 Index',
        market: 'synthetic_index',
        market_display_name: 'Derived',
        submarket: 'random_index',
        submarket_display_name: 'Continuous Indices',
        pip: 0.001,
        pip_size: 0.001,
        exchange_is_open: true,
        is_trading_suspended: false,
    },

    // Forex Major Pairs
    {
        symbol: 'frxEURUSD',
        underlying_symbol: 'frxEURUSD',
        display_name: 'EUR/USD',
        market: 'forex',
        submarket: 'major_pairs',
        pip: 0.00001,
    },
    {
        symbol: 'frxGBPUSD',
        underlying_symbol: 'frxGBPUSD',
        display_name: 'GBP/USD',
        market: 'forex',
        submarket: 'major_pairs',
        pip: 0.00001,
    },
    {
        symbol: 'frxUSDJPY',
        underlying_symbol: 'frxUSDJPY',
        display_name: 'USD/JPY',
        market: 'forex',
        submarket: 'major_pairs',
        pip: 0.001,
    },
    {
        symbol: 'frxAUDUSD',
        underlying_symbol: 'frxAUDUSD',
        display_name: 'AUD/USD',
        market: 'forex',
        submarket: 'major_pairs',
        pip: 0.00001,
    },

    // Stock Indices
    {
        symbol: 'OTC_DJI',
        underlying_symbol: 'OTC_DJI',
        display_name: 'Wall Street 30',
        market: 'indices',
        submarket: 'american_indices',
        pip: 0.01,
    },
    {
        symbol: 'OTC_SPC',
        underlying_symbol: 'OTC_SPC',
        display_name: 'US 500',
        market: 'indices',
        submarket: 'american_indices',
        pip: 0.01,
    },
    {
        symbol: 'OTC_FTSE',
        underlying_symbol: 'OTC_FTSE',
        display_name: 'UK 100',
        market: 'indices',
        submarket: 'european_indices',
        pip: 0.01,
    },
    {
        symbol: 'OTC_GDAXI',
        underlying_symbol: 'OTC_GDAXI',
        display_name: 'Germany 40',
        market: 'indices',
        submarket: 'european_indices',
        pip: 0.01,
    },

    // Cryptocurrencies
    {
        symbol: 'cryBTCUSD',
        underlying_symbol: 'cryBTCUSD',
        display_name: 'BTC/USD',
        market: 'cryptocurrency',
        submarket: 'non_stable_coin',
        pip: 0.01,
    },
    {
        symbol: 'cryETHUSD',
        underlying_symbol: 'cryETHUSD',
        display_name: 'ETH/USD',
        market: 'cryptocurrency',
        submarket: 'non_stable_coin',
        pip: 0.01,
    },

    // Commodities
    {
        symbol: 'frxXAUUSD',
        underlying_symbol: 'frxXAUUSD',
        display_name: 'Gold/USD',
        market: 'commodities',
        submarket: 'metals',
        pip: 0.01,
    },
    {
        symbol: 'frxXAGUSD',
        underlying_symbol: 'frxXAGUSD',
        display_name: 'Silver/USD',
        market: 'commodities',
        submarket: 'metals',
        pip: 0.001,
    },
];

// Market and Submarket Mappings
export const MARKET_MAPPINGS = {
    MARKET_DISPLAY_NAMES: new Map([
        ['synthetic_index', 'Derived'],
        ['forex', 'Forex'],
        ['indices', 'Stock Indices'],
        ['stocks', 'Stocks'],
        ['commodities', 'Commodities'],
        ['cryptocurrency', 'Cryptocurrencies'],
        ['basket_index', 'Basket Indices'],
        ['random_index', 'Derived'],
    ]),

    SUBMARKET_DISPLAY_NAMES: new Map([
        // Derived submarkets
        ['random_index', 'Continuous Indices'],
        ['random_daily', 'Daily Reset Indices'],
        ['crash_index', 'Crash/Boom'],
        ['jump_index', 'Jump Indices'],
        ['step_index', 'Step Indices'],
        ['range_break', 'Range Break Indices'],

        // Forex submarkets
        ['major_pairs', 'Major Pairs'],
        ['minor_pairs', 'Minor Pairs'],
        ['exotic_pairs', 'Exotic Pairs'],
        ['smart_fx', 'Smart FX'],
        ['micro_pairs', 'Micro Pairs'],

        // Basket indices
        ['forex_basket', 'Forex Basket'],
        ['commodity_basket', 'Commodity Basket'],
        ['stock_basket', 'Stock Basket'],

        // Commodities
        ['metals', 'Metals'],
        ['energy', 'Energy'],

        // Cryptocurrencies submarkets
        ['crypto_index', 'Crypto Index'],
        ['non_stable_coin', 'Non-Stable Coins'],
        ['stable_coin', 'Stable Coins'],
        ['crypto_basket', 'Crypto Basket'],

        // Stock indices submarkets
        ['asian_indices', 'Asian Indices'],
        ['american_indices', 'American Indices'],
        ['european_indices', 'European Indices'],
        ['otc_index', 'OTC Indices'],
        ['europe_OTC', 'European Indices'],
        ['asia_oceania_OTC', 'Asian Indices'],
        ['americas_OTC', 'American Indices'],
        ['european_OTC', 'European Indices'],
        ['asia_OTC', 'Asian Indices'],
        ['american_OTC', 'American Indices'],
        ['otc_indices', 'OTC Indices'],
        ['us_indices', 'US Indices'],
        ['stock_indices', 'Stock Indices'],
        ['indices', 'Indices'],
    ]),
};

// Market Dropdown Options
export const MARKET_OPTIONS = [
    ['Derived', 'synthetic_index'],
    ['Forex', 'forex'],
    ['Stock Indices', 'indices'],
    ['Commodities', 'commodities'],
    ['Cryptocurrencies', 'cryptocurrency'],
];

// Submarket Options by Market
export const SUBMARKET_OPTIONS = {
    synthetic_index: [
        ['Continuous Indices', 'random_index'],
        ['Daily Reset Indices', 'random_daily'],
        ['Crash/Boom', 'crash_index'],
        ['Jump Indices', 'jump_index'],
        ['Step Indices', 'step_index'],
    ],
    forex: [
        ['Major Pairs', 'major_pairs'],
        ['Minor Pairs', 'minor_pairs'],
        ['Exotic Pairs', 'exotic_pairs'],
        ['Smart FX', 'smart_fx'],
    ],
    indices: [
        ['Asian Indices', 'asian_indices'],
        ['American Indices', 'american_indices'],
        ['European Indices', 'european_indices'],
        ['OTC Indices', 'otc_index'],
    ],
    commodities: [
        ['Metals', 'metals'],
        ['Energy', 'energy'],
    ],
    cryptocurrency: [
        ['Crypto Index', 'crypto_index'],
        ['Non-Stable Coins', 'non_stable_coin'],
        ['Stable Coins', 'stable_coin'],
    ],
};

// Symbol Options by Submarket
export const SYMBOL_OPTIONS = {
    random_index: [
        ['Volatility 100 (1s) Index', '1HZ100V'],
        ['Volatility 10 (1s) Index', '1HZ10V'],
        ['Volatility 25 (1s) Index', '1HZ25V'],
        ['Volatility 50 (1s) Index', '1HZ50V'],
        ['Volatility 75 (1s) Index', '1HZ75V'],
        ['Volatility 10 Index', 'R_10'],
        ['Volatility 100 Index', 'R_100'],
        ['Volatility 25 Index', 'R_25'],
        ['Volatility 50 Index', 'R_50'],
        ['Volatility 75 Index', 'R_75'],
    ],
    major_pairs: [
        ['EUR/USD', 'frxEURUSD'],
        ['GBP/USD', 'frxGBPUSD'],
        ['USD/JPY', 'frxUSDJPY'],
        ['USD/CHF', 'frxUSDCHF'],
        ['AUD/USD', 'frxAUDUSD'],
    ],
    crash_index: [
        ['Crash 300 Index', 'CRASH300'],
        ['Crash 500 Index', 'CRASH500'],
        ['Crash 1000 Index', 'CRASH1000'],
        ['Boom 300 Index', 'BOOM300'],
        ['Boom 500 Index', 'BOOM500'],
        ['Boom 1000 Index', 'BOOM1000'],
    ],
    otc_index: [
        ['Wall Street 30', 'OTC_DJI'],
        ['US 500', 'OTC_SPC'],
        ['US Tech 100', 'OTC_NDX'],
        ['UK 100', 'OTC_FTSE'],
        ['Germany 40', 'OTC_GDAXI'],
        ['Euro 50', 'OTC_SX5E'],
        ['Australia 200', 'OTC_AS51'],
        ['Japan 225', 'OTC_N225'],
    ],
    american_indices: [
        ['Wall Street 30', 'OTC_DJI'],
        ['US 500', 'OTC_SPC'],
        ['US Tech 100', 'OTC_NDX'],
    ],
    european_indices: [
        ['UK 100', 'OTC_FTSE'],
        ['Germany 40', 'OTC_GDAXI'],
        ['Euro 50', 'OTC_SX5E'],
    ],
    asian_indices: [
        ['Australia 200', 'OTC_AS51'],
        ['Japan 225', 'OTC_N225'],
    ],
    metals: [
        ['Gold/USD', 'frxXAUUSD'],
        ['Silver/USD', 'frxXAGUSD'],
        ['Palladium/USD', 'FRXXPDUSD'],
        ['Platinum/USD', 'FRXXPTUSD'],
        ['Gold Basket', 'WLDXAU'],
    ],
};

// Account Limits Data
export const ACCOUNT_LIMITS = {
    commodities: {
        AUD: { max_payout: 77000, min_stake: 0.8 },
        BTC: { max_payout: 0.440255, min_stake: 0.000005 },
        ETH: { max_payout: 11, min_stake: 0.000117 },
        EUR: { max_payout: 42000, min_stake: 0.5 },
        GBP: { max_payout: 37000, min_stake: 0.4 },
        LTC: { max_payout: 430, min_stake: 0.004327 },
        USD: { max_payout: 50000, min_stake: 0.5 },
        USDC: { max_payout: 5000, min_stake: 0.6 },
        XRP: { max_payout: 17000, min_stake: 0.1723 },
        eUSDT: { max_payout: 4900, min_stake: 0.5 },
        tUSDT: { max_payout: 4900, min_stake: 0.5 },
    },
    cryptocurrency: {
        AUD: { max_payout: 77000, min_stake: 0.8 },
        BTC: { max_payout: 0.440255, min_stake: 0.000005 },
        ETH: { max_payout: 11, min_stake: 0.000117 },
        EUR: { max_payout: 42000, min_stake: 0.5 },
        GBP: { max_payout: 37000, min_stake: 0.4 },
        LTC: { max_payout: 430, min_stake: 0.004327 },
        USD: { max_payout: 50000, min_stake: 0.5 },
        USDC: { max_payout: 5000, min_stake: 0.6 },
        XRP: { max_payout: 17000, min_stake: 0.1723 },
        eUSDT: { max_payout: 4900, min_stake: 0.5 },
        tUSDT: { max_payout: 4900, min_stake: 0.5 },
    },
    forex: {
        AUD: { max_payout: 77000, min_stake: 0.8 },
        BTC: { max_payout: 0.440255, min_stake: 0.000005 },
        ETH: { max_payout: 11, min_stake: 0.000117 },
        EUR: { max_payout: 42000, min_stake: 0.5 },
        GBP: { max_payout: 37000, min_stake: 0.4 },
        LTC: { max_payout: 430, min_stake: 0.004327 },
        USD: { max_payout: 50000, min_stake: 0.5 },
        USDC: { max_payout: 5000, min_stake: 0.6 },
        XRP: { max_payout: 17000, min_stake: 0.1723 },
        eUSDT: { max_payout: 4900, min_stake: 0.5 },
        tUSDT: { max_payout: 4900, min_stake: 0.5 },
    },
    indices: {
        AUD: { max_payout: 77000, min_stake: 0.8 },
        BTC: { max_payout: 0.440255, min_stake: 0.000005 },
        ETH: { max_payout: 11, min_stake: 0.000117 },
        EUR: { max_payout: 42000, min_stake: 0.5 },
        GBP: { max_payout: 37000, min_stake: 0.4 },
        LTC: { max_payout: 430, min_stake: 0.004327 },
        USD: { max_payout: 50000, min_stake: 0.5 },
        USDC: { max_payout: 5000, min_stake: 0.6 },
        XRP: { max_payout: 17000, min_stake: 0.1723 },
        eUSDT: { max_payout: 4900, min_stake: 0.5 },
        tUSDT: { max_payout: 4900, min_stake: 0.5 },
    },
    synthetic_index: {
        AUD: { max_payout: 77000, min_stake: 0.6 },
        BTC: { max_payout: 0.440255, min_stake: 0.000004 },
        ETH: { max_payout: 11, min_stake: 0.000082 },
        EUR: { max_payout: 42000, min_stake: 0.4 },
        GBP: { max_payout: 37000, min_stake: 0.3 },
        LTC: { max_payout: 430, min_stake: 0.003029 },
        USD: { max_payout: 50000, min_stake: 0.35 },
        USDC: { max_payout: 5000, min_stake: 0.4 },
        XRP: { max_payout: 17000, min_stake: 0.1206 },
        eUSDT: { max_payout: 4900, min_stake: 0.4 },
        tUSDT: { max_payout: 4900, min_stake: 0.4 },
    },
};

// Contract Types Data
export const CONTRACT_TYPES = {
    // Contract options based on common trade types
    callput: [
        ['Rise', 'CALL'],
        ['Fall', 'PUT'],
    ],
    callputequal: [
        ['Rise Equals', 'CALLE'],
        ['Fall Equals', 'PUTE'],
    ],
    higherlower: [
        ['Higher', 'CALL'],
        ['Lower', 'PUT'],
    ],
    touchnotouch: [
        ['Touch', 'ONETOUCH'],
        ['No Touch', 'NOTOUCH'],
    ],
    endsinout: [
        ['Ends Between', 'EXPIRYRANGE'],
        ['Ends Outside', 'EXPIRYMISS'],
    ],
    staysinout: [
        ['Stays Between', 'RANGE'],
        ['Goes Outside', 'UPORDOWN'],
    ],
    matchesdiffers: [
        ['Matches', 'DIGITMATCH'],
        ['Differs', 'DIGITDIFF'],
    ],
    evenodd: [
        ['Even', 'DIGITEVEN'],
        ['Odd', 'DIGITODD'],
    ],
    overunder: [
        ['Over', 'DIGITOVER'],
        ['Under', 'DIGITUNDER'],
    ],
    multiplier: [
        ['Up', 'MULTUP'],
        ['Down', 'MULTDOWN'],
    ],
    accumulator: [['Buy', 'ACCU']],
    asians: [
        ['Asian Up', 'ASIANU'],
        ['Asian Down', 'ASIAND'],
    ],
    reset: [
        ['Reset Call', 'RESETCALL'],
        ['Reset Put', 'RESETPUT'],
    ],
    highlowticks: [
        ['High Tick', 'TICKHIGH'],
        ['Low Tick', 'TICKLOW'],
    ],
    runs: [
        ['Only Ups', 'RUNHIGH'],
        ['Only Downs', 'RUNLOW'],
    ],
    callputspread: [
        ['Call Spread', 'CALLSPREAD'],
        ['Put Spread', 'PUTSPREAD'],
    ],

    // Default fallback when no trade type matches
    DEFAULT_FALLBACK: [
        ['Rise', 'CALL'],
        ['Fall', 'PUT'],
        ['Rise Equals', 'CALLE'],
        ['Fall Equals', 'PUTE'],
        ['Higher', 'CALLSPREAD'],
        ['Lower', 'PUTSPREAD'],
    ],
};

// Duration Options
export const DURATIONS = [
    { display: 'Ticks', unit: 't', min: 1, max: 10 },
    { display: 'Seconds', unit: 's', min: 15, max: 3600 },
    { display: 'Minutes', unit: 'm', min: 1, max: 1440 },
    { display: 'Hours', unit: 'h', min: 1, max: 24 },
    { display: 'Days', unit: 'd', min: 1, max: 365 },
];

// Trade Type Categories
export const TRADE_TYPE_CATEGORIES = [
    ['Up/Down', 'callput'],
    ['Touch/No Touch', 'touchnotouch'],
    ['In/Out', 'inout'],
    ['Digits', 'digits'],
    ['Multipliers', 'multiplier'],
];

// Trade Types by Category
export const TRADE_TYPES = {
    callput: [
        ['Rise/Fall', 'callput'],
        ['Rise Equals/Fall Equals', 'callputequal'],
        ['Higher/Lower', 'higherlower'],
    ],
    touchnotouch: [['Touch/No Touch', 'touchnotouch']],
    inout: [
        ['Ends Between/Ends Outside', 'endsinout'],
        ['Stays Between/Goes Outside', 'staysinout'],
    ],
    digits: [
        ['Matches/Differs', 'matchesdiffers'],
        ['Even/Odd', 'evenodd'],
        ['Over/Under', 'overunder'],
    ],
    multiplier: [['Up/Down', 'multiplier']],
    asian: [['Asian Up/Asian Down', 'asians']],
    reset: [['Reset Call/Reset Put', 'reset']],
    highlowticks: [['High Tick/Low Tick', 'highlowticks']],
    runs: [['Only Ups/Only Downs', 'runs']],
};

// Chart Type and Interval Configurations
export const TRADE_URL_PARAMS_CONFIG = {
    chartType: [
        { text: 'area', value: 'line' },
        { text: 'candle', value: 'candles' },
        { text: 'hollow', value: 'hollow' },
        { text: 'ohlc', value: 'ohlc' },
    ],
    interval: [
        { text: '1t', value: '0' },
        { text: '1m', value: '60' },
        { text: '2m', value: '120' },
        { text: '3m', value: '180' },
        { text: '5m', value: '300' },
        { text: '10m', value: '600' },
        { text: '15m', value: '900' },
        { text: '30m', value: '1800' },
        { text: '1h', value: '3600' },
        { text: '2h', value: '7200' },
        { text: '4h', value: '14400' },
        { text: '8h', value: '28800' },
        { text: '1d', value: '86400' },
    ],
};

// Symbol Pattern Mappings for Display Names
export const SYMBOL_PATTERNS = new Map([
    // Step indices
    [/^STPRNG$/i, () => 'Step 100 Index'],
    [/^STPRNG(\d+)$/i, match => `Step ${match[1]}00 Index`],
    [/^stpRNG$/i, () => 'Step 100 Index'],
    [/^stpRNG(\d+)$/i, match => `Step ${match[1]}00 Index`],

    // Volatility indices
    [/^R_(\d+)$/i, match => `Volatility ${match[1]} Index`],
    [/^(\d+)HZ(\d+)V$/i, match => `Volatility ${match[2]} (${match[1]}s) Index`],

    // Crash/Boom indices
    [/^CRASH(\d+)N?$/i, match => `Crash ${match[1]} Index`],
    [/^BOOM(\d+)N?$/i, match => `Boom ${match[1]} Index`],

    // Jump indices
    [/^JD(\d+)$/i, match => `Jump ${match[1]} Index`],
    [/^JMP(\d+)$/i, match => `Jump ${match[1]} Index`],

    // Range Break indices
    [/^RB(\d+)$/i, match => `Range Break ${match[1]} Index`],

    // Bear/Bull indices
    [/^RDBEAR$/i, () => 'Bear Market Index'],
    [/^RDBULL$/i, () => 'Bull Market Index'],

    // Forex pairs
    [/^FRX([A-Z]{3})([A-Z]{3})$/i, match => `${match[1]}/${match[2]}`],
    [/^([A-Z]{3})([A-Z]{3})$/i, match => `${match[1]}/${match[2]}`],

    // Crypto
    [/^CRY([A-Z]+)USD$/i, match => `${match[1]}/USD`],
    [/^CRY([A-Z]{3})([A-Z]{3})$/i, match => `${match[1]}/${match[2]}`],

    // Stock indices
    [
        /^OTC_([A-Z]+)$/i,
        match => {
            const index_names = new Map([
                ['DJI', 'Wall Street 30'],
                ['SPX', 'US 500'],
                ['NDX', 'US Tech 100'],
                ['FTSE', 'UK 100'],
                ['GDAXI', 'Germany 40'],
                ['FCHI', 'France 40'],
                ['N225', 'Japan 225'],
                ['HSI', 'Hong Kong 50'],
                ['AS51', 'Australia 200'],
                ['AEX', 'Netherlands 25'],
                ['SSMI', 'Swiss 20'],
                ['SX5E', 'Euro 50'],
                ['IBEX35', 'Spain 35'],
            ]);
            return index_names.get(match[1]) || `${match[1]} Index`;
        },
    ],

    // Metals
    [
        /^FRX(XAU|XAG|XPT|XPD)USD$/i,
        match => {
            const metals = new Map([
                ['XAU', 'Gold'],
                ['XAG', 'Silver'],
                ['XPT', 'Platinum'],
                ['XPD', 'Palladium'],
            ]);
            return `${metals.get(match[1]) || match[1]}/USD`;
        },
    ],

    // Basket indices
    [/^WLD([A-Z]{3})$/i, match => `${match[1]} Basket`],
]);

// Utility Functions
export const getTradingTimes = symbol => {
    if (symbol.startsWith('R_') || symbol.startsWith('RDB')) {
        // Volatility indices - 24/7
        return {
            is_open_all_day: true,
            is_closed_all_day: false,
            times: null,
            is_opened: true,
        };
    } else if (symbol.startsWith('frx')) {
        // Forex - 24/5 (closed weekends)
        const now = new Date();
        const dayOfWeek = now.getUTCDay(); // 0 = Sunday, 6 = Saturday
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        return {
            is_open_all_day: !isWeekend,
            is_closed_all_day: isWeekend,
            times: null,
            is_opened: !isWeekend,
        };
    } else {
        // Indices and commodities - assume open during business hours
        const now = new Date();
        const hour = now.getUTCHours();
        const isBusinessHours = hour >= 6 && hour <= 22; // 6 AM to 10 PM UTC

        return {
            is_open_all_day: false,
            is_closed_all_day: false,
            times: [
                {
                    open: new Date(now.toISOString().substring(0, 11) + '06:00:00Z'),
                    close: new Date(now.toISOString().substring(0, 11) + '22:00:00Z'),
                },
            ],
            is_opened: isBusinessHours,
        };
    }
};

export const getContractTypeOptions = (contract_type, trade_type) => {
    // Handle 'na' or invalid trade types with default options
    if (!trade_type || trade_type === 'na' || trade_type === '') {
        if (contract_type !== 'both') {
            return CONTRACT_TYPES.DEFAULT_FALLBACK.filter(option => option[1] === contract_type);
        }
        return CONTRACT_TYPES.DEFAULT_FALLBACK;
    }

    const options = CONTRACT_TYPES[trade_type.toLowerCase()] || CONTRACT_TYPES['callput'];

    if (contract_type !== 'both') {
        return options.filter(option => option[1] === contract_type);
    }
    return options;
};

export const generateDisplayName = (symbol_code, symbol) => {
    // Try to match against known patterns
    for (const [pattern, generator] of SYMBOL_PATTERNS) {
        const match = symbol_code.match(pattern);
        if (match) {
            return generator(match);
        }
    }

    // If no pattern matches, create a basic display name
    // Convert underscores to spaces and capitalize
    let display_name = symbol_code.replace(/_/g, ' ');
    display_name = display_name.replace(/\b\w/g, l => l.toUpperCase());

    // Add context from submarket if available
    if (symbol?.submarket) {
        const submarket_display = MARKET_MAPPINGS.SUBMARKET_DISPLAY_NAMES.get(symbol.submarket);
        if (submarket_display && !display_name.includes(submarket_display)) {
            display_name = `${display_name} (${submarket_display})`;
        }
    }

    return display_name;
};

export const getParamTextByValue = (value, key) => {
    return TRADE_URL_PARAMS_CONFIG[key].find(interval => interval.value === value.toString())?.text ?? '';
};

export const getSymbolDisplayName = (active_symbols = [], symbol) => {
    return (
        active_symbols.find(
            symbol_info =>
                symbol_info.underlying_symbol?.toUpperCase() === symbol.toUpperCase() ||
                symbol_info.symbol?.toUpperCase() === symbol.toUpperCase()
        ) || {
            display_name: '',
        }
    ).display_name;
};

export const isMarketClosed = (active_symbols = [], symbol) => {
    if (!active_symbols.length) return false;
    // Handle both old and new field names for backward compatibility
    const getSymbolField = item => item.underlying_symbol || item.symbol;
    return active_symbols.filter(x => getSymbolField(x) === symbol)[0]
        ? !active_symbols.filter(symbol_info => getSymbolField(symbol_info) === symbol)[0].exchange_is_open
        : false;
};

export const getAccountLimits = (currency = 'AUD', selected_market) => {
    // Return the currency config for the selected market
    const currency_config = ACCOUNT_LIMITS[selected_market];
    return Promise.resolve(currency_config ? currency_config[currency] : {});
};
