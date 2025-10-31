import { localize } from '@deriv-com/translations';

/**
 * Trade type names that should NOT be translated and remain in English
 */
const TRADE_TYPE_NAMES = [
    'Up/Down',
    'Touch/No Touch',
    'In/Out',
    'Asians',
    'Digits',
    'Reset Call/Reset Put',
    'Call Spread/Put Spread',
    'High/Low Ticks',
    'Only Ups/Only Downs',
    'Multipliers',
    'Accumulators',
    'Rise/Fall',
    'Higher/Lower',
    'Rise',
    'Fall',
    'Higher',
    'Lower',
    'Touch',
    'No Touch',
    'Matches',
    'Differs',
    'Even',
    'Odd',
    'Over',
    'Under',
    'Up',
    'Down',
    'Call',
    'Put',
    'Buy',
];

/**
 * Financial instrument names that should NOT be translated and remain in English
 * These are standardized international financial instrument names with specific numbers
 */
const FINANCIAL_INSTRUMENT_PATTERNS = [
    /^Volatility \d+( \(\d+s\))? Index$/i, // Volatility 100 Index, Volatility 100 (1s) Index
    /^Crash \d+ Index$/i, // Crash 500 Index, Crash 1000 Index
    /^Boom \d+ Index$/i, // Boom 500 Index, Boom 1000 Index
    /^Jump \d+ Index$/i, // Jump 10 Index, Jump 25 Index
    /^Step \d+ Index$/i, // Step 100 Index, Step 200 Index
    /^Bear Market Index$/i, // Bear Market Index
    /^Bull Market Index$/i, // Bull Market Index
    /^Range Break \d+ Index$/i, // Range Break 100 Index
];

/**
 * Checks if a given name is a financial instrument name that should remain in English
 */
const isFinancialInstrumentName = (name: string): boolean => {
    return FINANCIAL_INSTRUMENT_PATTERNS.some(pattern => pattern.test(name));
};

/**
 * Maps API-returned market category names to their translated versions
 * Excludes trade type names which should remain in English
 */
export const translateMarketCategory = (categoryName: string): string => {
    // Don't translate trade type names - keep them in English
    if (TRADE_TYPE_NAMES.includes(categoryName)) {
        return categoryName;
    }

    // Don't translate financial instrument names - keep them in English
    // These are standardized international financial instrument names
    if (isFinancialInstrumentName(categoryName)) {
        return categoryName;
    }

    const categoryTranslations: Record<string, string> = {
        // Main market categories
        Derived: localize('Derived'),
        Forex: localize('Forex'),
        'Stock Indices': localize('Stock Indices'),
        Cryptocurrencies: localize('Cryptocurrencies'),
        Commodities: localize('Commodities'),

        // Derived subcategories
        'Continuous Indices': localize('Continuous Indices'),
        'Crash/Boom': localize('Crash/Boom'),
        'Jump Indices': localize('Jump Indices'),
        'Daily Reset Indices': localize('Daily Reset Indices'),
        'Step Indices': localize('Step Indices'),

        // Forex subcategories
        'Major Pairs': localize('Major Pairs'),
        'Minor Pairs': localize('Minor Pairs'),
        'Exotic Pairs': localize('Exotic Pairs'),
        'Forex Basket': localize('Forex Basket'),

        // Stock Indices subcategories
        'American Indices': localize('American Indices'),
        'European Indices': localize('European Indices'),
        'Asian Indices': localize('Asian Indices'),
        'Australian Indices': localize('Australian Indices'),

        // Cryptocurrency subcategories
        'Non-Stable Coins': localize('Non-Stable Coins'),
        'Stable Coins': localize('Stable Coins'),

        // Commodities subcategories
        Metals: localize('Metals'),
        Energy: localize('Energy'),
        'Commodity Basket': localize('Commodity Basket'),

        // Additional categories that might come from API
        'Volatility Indices': localize('Volatility Indices'),
        'Basket Indices': localize('Basket Indices'),
        'Range Break Indices': localize('Range Break Indices'),
    };

    return categoryTranslations[categoryName] || categoryName;
};

/**
 * Translates market category names in trading times data
 */
export const translateTradingTimesData = (tradingTimesData: any): any => {
    if (!tradingTimesData?.markets) {
        return tradingTimesData;
    }

    const translatedData = { ...tradingTimesData };

    translatedData.markets = tradingTimesData.markets.map((market: any) => ({
        ...market,
        name: translateMarketCategory(market.name),
        submarkets:
            market.submarkets?.map((submarket: any) => ({
                ...submarket,
                name: translateMarketCategory(submarket.name),
            })) || [],
    }));

    return translatedData;
};
