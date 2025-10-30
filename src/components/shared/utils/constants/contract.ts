import React from 'react';
import { localizeAccumulators } from '@/utils/conditional-localize';
import { localize } from '@deriv-com/translations';
import { CONTRACT_TYPES, TRADE_TYPES } from '../contract';
import { TContractOptions } from '../contract/contract-types';

export const getLocalizedBasis = () =>
    ({
        accumulator: localizeAccumulators(),
        multiplier: localize('Multiplier'),
        payout_per_pip: localize('Payout per pip'),
        payout_per_point: localize('Payout per point'),
        payout: localize('Payout'),
        stake: localize('Stake'),
        turbos: localize('Turbos'),
    }) as const;

type TContractConfig = {
    button_name?: React.ReactNode;
    feature_flag?: string;
    name: React.ReactNode;
    position: string;
    main_title?: JSX.Element;
};

type TGetSupportedContracts = keyof ReturnType<typeof getSupportedContracts>;

export type TTextValueStrings = {
    text: string;
    value: string;
};

export type TTradeTypesCategories = {
    [key: string]: {
        name: string;
        categories: Array<string | TTextValueStrings>;
    };
};

export const getCardLabels = () =>
    ({
        APPLY: localize('Apply'),
        BARRIER: localize('Barrier:'),
        BUY_PRICE: localize('Buy price:'),
        CANCEL: localize('Cancel'),
        CLOSE: localize('Close'),
        CLOSED: localize('Closed'),
        CONTRACT_COST: localize('Contract cost:'),
        CONTRACT_VALUE: localize('Contract value:'),
        CURRENT_STAKE: localize('Current stake:'),
        DAY: localize('day'),
        DAYS: localize('days'),
        DEAL_CANCEL_FEE: localize('Deal cancel. fee:'),
        DECREMENT_VALUE: localize('Decrement value'),
        DONT_SHOW_THIS_AGAIN: localize("Don't show this again"),
        ENTRY_SPOT: localize('Entry spot:'),
        INCREMENT_VALUE: localize('Increment value'),
        INDICATIVE_PRICE: localize('Indicative price:'),
        INITIAL_STAKE: localize('Initial stake:'),
        LOST: localize('Lost'),
        MULTIPLIER: localize('Multiplier:'),
        NOT_AVAILABLE: localize('N/A'),
        PAYOUT: localize('Sell price:'),
        POTENTIAL_PAYOUT: localize('Potential payout:'),
        POTENTIAL_PROFIT_LOSS: localize('Potential profit/loss:'),
        PROFIT_LOSS: localize('Profit/Loss:'),
        PURCHASE_PRICE: localize('Buy price:'),
        RESALE_NOT_OFFERED: localize('Resale not offered'),
        SELL: localize('Sell'),
        STAKE: localize('Stake:'),
        STOP_LOSS: localize('Stop loss:'),
        STRIKE: localize('Strike:'),
        TAKE_PROFIT: localize('Take profit:'),
        TICK: localize('Tick '),
        TICKS: localize('Ticks'),
        TOTAL_PROFIT_LOSS: localize('Total profit/loss:'),
        TAKE_PROFIT_LOSS_NOT_AVAILABLE: localize(
            'Take profit and/or stop loss are not available while deal cancellation is active.'
        ),
        WON: localize('Won'),
    }) as const;

export const getMarketNamesMap = () =>
    ({
        FRXAUDCAD: 'AUD/CAD',
        FRXAUDCHF: 'AUD/CHF',
        FRXAUDJPY: 'AUD/JPY',
        FRXAUDNZD: 'AUD/NZD',
        FRXAUDPLN: 'AUD/PLN',
        FRXAUDUSD: 'AUD/USD',
        FRXBROUSD: 'Oil/USD',
        FRXEURAUD: 'EUR/AUD',
        FRXEURCAD: 'EUR/CAD',
        FRXEURCHF: 'EUR/CHF',
        FRXEURGBP: 'EUR/GBP',
        FRXEURJPY: 'EUR/JPY',
        FRXEURNZD: 'EUR/NZD',
        FRXEURUSD: 'EUR/USD',
        FRXGBPAUD: 'GBP/AUD',
        FRXGBPCAD: 'GBP/CAD',
        FRXGBPCHF: 'GBP/CHF',
        FRXGBPJPY: 'GBP/JPY',
        FRXGBPNOK: 'GBP/NOK',
        FRXGBPUSD: 'GBP/USD',
        FRXNZDJPY: 'NZD/JPY',
        FRXNZDUSD: 'NZD/USD',
        FRXUSDCAD: 'USD/CAD',
        FRXUSDCHF: 'USD/CHF',
        FRXUSDJPY: 'USD/JPY',
        FRXUSDNOK: 'USD/NOK',
        FRXUSDPLN: 'USD/PLN',
        FRXUSDSEK: 'USD/SEK',
        FRXXAGUSD: 'Silver/USD',
        FRXXAUUSD: 'Gold/USD',
        FRXXPDUSD: 'Palladium/USD',
        FRXXPTUSD: 'Platinum/USD',
        WLDXAU: 'Gold Basket',
        OTC_AEX: 'Netherlands 25',
        OTC_AS51: 'Australia 200',
        OTC_DJI: 'Wall Street 30',
        OTC_FCHI: 'France 40',
        OTC_FTSE: 'UK 100',
        OTC_GDAXI: 'Germany 40',
        OTC_HSI: 'Hong Kong 50',
        OTC_IBEX35: 'Spain 35',
        OTC_N225: 'Japan 225',
        OTC_NDX: 'US Tech 100',
        OTC_SPC: 'US 500',
        OTC_SPX500: 'US 500',
        OTC_SSMI: 'Swiss 20',
        OTC_SX5E: 'Euro 50',
        R_10: 'Volatility 10 Index',
        R_25: 'Volatility 25 Index',
        R_50: 'Volatility 50 Index',
        R_75: 'Volatility 75 Index',
        R_100: 'Volatility 100 Index',
        BOOM300N: 'Boom 300 Index',
        BOOM500: 'Boom 500 Index',
        BOOM1000: 'Boom 1000 Index',
        CRASH300N: 'Crash 300 Index',
        CRASH500: 'Crash 500 Index',
        CRASH1000: 'Crash 1000 Index',
        RDBEAR: 'Bear Market Index',
        RDBULL: 'Bull Market Index',
        STPRNG: 'Step Index',
        WLDAUD: 'AUD Basket',
        WLDEUR: 'EUR Basket',
        WLDGBP: 'GBP Basket',
        WLDUSD: 'USD Basket',
        '1HZ10V': 'Volatility 10 (1s) Index',
        '1HZ15V': 'Volatility 15 (1s) Index',
        '1HZ25V': 'Volatility 25 (1s) Index',
        '1HZ30V': 'Volatility 30 (1s) Index',
        '1HZ50V': 'Volatility 50 (1s) Index',
        '1HZ75V': 'Volatility 75 (1s) Index',
        '1HZ90V': 'Volatility 90 (1s) Index',
        '1HZ100V': 'Volatility 100 (1s) Index',
        '1HZ150V': 'Volatility 150 (1s) Index',
        '1HZ200V': 'Volatility 200 (1s) Index',
        '1HZ250V': 'Volatility 250 (1s) Index',
        '1HZ300V': 'Volatility 300 (1s) Index',
        JD10: 'Jump 10 Index',
        JD25: 'Jump 25 Index',
        JD50: 'Jump 50 Index',
        JD75: 'Jump 75 Index',
        JD100: 'Jump 100 Index',
        JD150: 'Jump 150 Index',
        JD200: 'Jump 200 Index',
        CRYBCHUSD: 'BCH/USD',
        CRYBNBUSD: 'BNB/USD',
        CRYBTCLTC: 'BTC/LTC',
        CRYIOTUSD: 'IOT/USD',
        CRYNEOUSD: 'NEO/USD',
        CRYOMGUSD: 'OMG/USD',
        CRYTRXUSD: 'TRX/USD',
        CRYBTCETH: 'BTC/ETH',
        CRYZECUSD: 'ZEC/USD',
        CRYXMRUSD: 'ZMR/USD',
        CRYXMLUSD: 'XLM/USD',
        CRYXRPUSD: 'XRP/USD',
        CRYBTCUSD: 'BTC/USD',
        CRYDSHUSD: 'DSH/USD',
        CRYETHUSD: 'ETH/USD',
        CRYEOSUSD: 'EOS/USD',
        CRYLTCUSD: 'LTC/USD',
    }) as const;

export const getUnsupportedContracts = () =>
    ({
        CALLSPREAD: {
            name: 'Spread Up',
            position: 'top',
        },
        PUTSPREAD: {
            name: 'Spread Down',
            position: 'bottom',
        },
    }) as const;

/**
 * // Config to display details such as trade buttons, their positions, and names of trade types
 *
 * @param {Boolean} is_high_low
 * @returns { object }
 */
export const getSupportedContracts = (is_high_low?: boolean) =>
    ({
        [CONTRACT_TYPES.ACCUMULATOR]: {
            button_name: 'Buy',
            name: 'Accumulators',
            position: 'top',
        },
        [CONTRACT_TYPES.CALL]: {
            name: is_high_low ? 'Higher' : 'Rise',
            position: 'top',
        },
        [CONTRACT_TYPES.PUT]: {
            name: is_high_low ? 'Lower' : 'Fall',
            position: 'bottom',
        },
        [CONTRACT_TYPES.CALLE]: {
            name: 'Rise',
            position: 'top',
        },
        [CONTRACT_TYPES.PUTE]: {
            name: 'Fall',
            position: 'bottom',
        },
        [CONTRACT_TYPES.MATCH_DIFF.MATCH]: {
            name: 'Matches',
            position: 'top',
        },
        [CONTRACT_TYPES.MATCH_DIFF.DIFF]: {
            name: 'Differs',
            position: 'bottom',
        },
        [CONTRACT_TYPES.EVEN_ODD.EVEN]: {
            name: 'Even',
            position: 'top',
        },
        [CONTRACT_TYPES.EVEN_ODD.ODD]: {
            name: 'Odd',
            position: 'bottom',
        },
        [CONTRACT_TYPES.OVER_UNDER.OVER]: {
            name: 'Over',
            position: 'top',
        },
        [CONTRACT_TYPES.OVER_UNDER.UNDER]: {
            name: 'Under',
            position: 'bottom',
        },
        [CONTRACT_TYPES.TOUCH.ONE_TOUCH]: {
            name: 'Touch',
            position: 'top',
        },
        [CONTRACT_TYPES.TOUCH.NO_TOUCH]: {
            name: 'No Touch',
            position: 'bottom',
        },
        [CONTRACT_TYPES.MULTIPLIER.UP]: {
            name: 'Up',
            position: 'top',
            main_title: 'Multipliers',
        },
        [CONTRACT_TYPES.MULTIPLIER.DOWN]: {
            name: 'Down',
            position: 'bottom',
            main_title: 'Multipliers',
        },
        [CONTRACT_TYPES.TURBOS.LONG]: {
            name: 'Up',
            position: 'top',
            main_title: 'Turbos',
        },
        [CONTRACT_TYPES.TURBOS.SHORT]: {
            name: 'Down',
            position: 'bottom',
            main_title: 'Turbos',
        },
        [CONTRACT_TYPES.VANILLA.CALL]: {
            name: 'Call',
            position: 'top',
            main_title: 'Vanillas',
        },
        [CONTRACT_TYPES.VANILLA.PUT]: {
            name: 'Put',
            position: 'bottom',
            main_title: 'Vanillas',
        },
        [CONTRACT_TYPES.RUN_HIGH_LOW.HIGH]: {
            name: 'Only Ups',
            position: 'top',
        },
        [CONTRACT_TYPES.RUN_HIGH_LOW.LOW]: {
            name: 'Only Downs',
            position: 'bottom',
        },
        [CONTRACT_TYPES.END.OUT]: {
            name: 'Ends Outside',
            position: 'top',
        },
        [CONTRACT_TYPES.END.IN]: {
            name: 'Ends Between',
            position: 'bottom',
        },
        [CONTRACT_TYPES.STAY.IN]: {
            name: 'Stays Between',
            position: 'top',
        },
        [CONTRACT_TYPES.STAY.OUT]: {
            name: 'Goes Outside',
            position: 'bottom',
        },
        [CONTRACT_TYPES.ASIAN.UP]: {
            name: 'Asian Up',
            position: 'top',
        },
        [CONTRACT_TYPES.ASIAN.DOWN]: {
            name: 'Asian Down',
            position: 'bottom',
        },
        [CONTRACT_TYPES.TICK_HIGH_LOW.HIGH]: {
            name: 'High Tick',
            position: 'top',
        },
        [CONTRACT_TYPES.TICK_HIGH_LOW.LOW]: {
            name: 'Low Tick',
            position: 'bottom',
        },
        [CONTRACT_TYPES.RESET.CALL]: {
            name: 'Reset Call',
            position: 'top',
        },
        [CONTRACT_TYPES.RESET.PUT]: {
            name: 'Reset Put',
            position: 'bottom',
        },
        [CONTRACT_TYPES.LB_CALL]: {
            name: 'Close-Low',
            position: 'top',
        },
        [CONTRACT_TYPES.LB_PUT]: {
            name: 'High-Close',
            position: 'top',
        },
        [CONTRACT_TYPES.LB_HIGH_LOW]: {
            name: 'High-Low',
            position: 'top',
        },
    }) as const;

export const getContractConfig = (is_high_low?: boolean) => ({
    ...getSupportedContracts(is_high_low),
    ...getUnsupportedContracts(),
});

export const getContractTypeDisplay = (type: string, options: TContractOptions = {}) => {
    const { isHighLow = false, showButtonName = false, showMainTitle = false } = options;

    const contract_config = getContractConfig(isHighLow)[type as TGetSupportedContracts] as TContractConfig;
    if (showMainTitle) return contract_config?.main_title ?? '';
    return (showButtonName && contract_config?.button_name) || contract_config?.name || '';
};

export const getContractTypeFeatureFlag = (type: string, is_high_low = false) => {
    const contract_config = getContractConfig(is_high_low)[type as TGetSupportedContracts] as TContractConfig;
    return contract_config?.feature_flag ?? '';
};

export const getContractTypePosition = (type: TGetSupportedContracts, is_high_low = false) =>
    getContractConfig(is_high_low)?.[type]?.position || 'top';

export const isCallPut = (trade_type: 'rise_fall' | 'rise_fall_equal' | 'high_low'): boolean =>
    trade_type === TRADE_TYPES.RISE_FALL ||
    trade_type === TRADE_TYPES.RISE_FALL_EQUAL ||
    trade_type === TRADE_TYPES.HIGH_LOW;
