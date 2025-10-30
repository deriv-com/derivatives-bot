import { getTotalProfit, TContractStore } from '@/components/shared';
import { TContractOptions } from '@/components/shared';
import { conditionalLocalize, localizeAccumulators } from '@/utils/conditional-localize';
import { localize } from '@deriv-com/translations';

export type TContract = {
    name: string;
    position: string;
};

export type TContractType =
    | 'ACCU'
    | 'ASIANU'
    | 'ASIAND'
    | 'CALL'
    | 'PUT'
    | 'CALLE'
    | 'PUTE'
    | 'CALLSPREAD'
    | 'PUTSPREAD'
    | 'DIGITMATCH'
    | 'DIGITDIFF'
    | 'DIGITEVEN'
    | 'DIGITODD'
    | 'DIGITOVER'
    | 'DIGITUNDER'
    | 'EXPIRYMISS'
    | 'EXPIRYRANGE'
    | 'LBFLOATCALL'
    | 'LBFLOATPUT'
    | 'LBHIGHLOW'
    | 'MULTUP'
    | 'MULTDOWN'
    | 'ONETOUCH'
    | 'NOTOUCH'
    | 'RANGE'
    | 'UPORDOWN'
    | 'RESETCALL'
    | 'RESETPUT'
    | 'RUNHIGH'
    | 'RUNLOW'
    | 'TICKHIGH'
    | 'TICKLOW';

type TSupportedContracts = {
    [key in TContractType]: TContract;
};

export const getSupportedContracts = (is_high_low: TContractOptions): TSupportedContracts => ({
    ACCU: {
        name: localizeAccumulators(),
        position: 'top',
    },
    ASIANU: {
        name: conditionalLocalize('Asian Up'),
        position: 'top',
    },
    ASIAND: {
        name: conditionalLocalize('Asian Down'),
        position: 'bottom',
    },
    CALL: {
        name: is_high_low.isHighLow ? conditionalLocalize('Higher') : conditionalLocalize('Rise'),
        position: 'top',
    },
    PUT: {
        name: is_high_low.isHighLow ? conditionalLocalize('Lower') : conditionalLocalize('Fall'),
        position: 'bottom',
    },
    CALLE: {
        name: conditionalLocalize('Rise'),
        position: 'top',
    },
    PUTE: {
        name: conditionalLocalize('Fall'),
        position: 'bottom',
    },
    CALLSPREAD: {
        name: conditionalLocalize('Spread Up'),
        position: 'top',
    },
    PUTSPREAD: {
        name: conditionalLocalize('Spread Down'),
        position: 'bottom',
    },
    DIGITMATCH: {
        name: conditionalLocalize('Matches'),
        position: 'top',
    },
    DIGITDIFF: {
        name: conditionalLocalize('Differs'),
        position: 'bottom',
    },
    DIGITEVEN: {
        name: conditionalLocalize('Even'),
        position: 'top',
    },
    DIGITODD: {
        name: conditionalLocalize('Odd'),
        position: 'bottom',
    },
    DIGITOVER: {
        name: conditionalLocalize('Over'),
        position: 'top',
    },
    DIGITUNDER: {
        name: conditionalLocalize('Under'),
        position: 'bottom',
    },
    EXPIRYMISS: {
        name: conditionalLocalize('Ends Outside'),
        position: 'top',
    },
    EXPIRYRANGE: {
        name: conditionalLocalize('Ends Between'),
        position: 'bottom',
    },
    LBFLOATCALL: {
        name: conditionalLocalize('Close-to-Low'),
        position: 'top',
    },
    LBFLOATPUT: {
        name: conditionalLocalize('High-to-Close'),
        position: 'top',
    },
    LBHIGHLOW: {
        name: conditionalLocalize('High-to-Low'),
        position: 'top',
    },
    MULTUP: {
        name: conditionalLocalize('Up'),
        position: 'top',
    },
    MULTDOWN: {
        name: conditionalLocalize('Down'),
        position: 'bottom',
    },
    ONETOUCH: {
        name: conditionalLocalize('Touch'),
        position: 'top',
    },
    NOTOUCH: {
        name: conditionalLocalize('No Touch'),
        position: 'bottom',
    },
    RANGE: {
        name: conditionalLocalize('Stays Between'),
        position: 'top',
    },
    UPORDOWN: {
        name: conditionalLocalize('Goes Outside'),
        position: 'bottom',
    },
    RESETCALL: {
        name: conditionalLocalize('Reset Call'),
        position: 'top',
    },
    RESETPUT: {
        name: conditionalLocalize('Reset Put'),
        position: 'bottom',
    },
    RUNHIGH: {
        name: conditionalLocalize('Only Ups'),
        position: 'top',
    },
    RUNLOW: {
        name: conditionalLocalize('Only Downs'),
        position: 'bottom',
    },
    TICKHIGH: {
        name: conditionalLocalize('High Tick'),
        position: 'top',
    },
    TICKLOW: {
        name: conditionalLocalize('Low Tick'),
        position: 'bottom',
    },
});

export const getContractConfig = (is_high_low: boolean) => ({
    ...getSupportedContracts(is_high_low),
});

export const getContractTypeDisplay = (type: TContractType, is_high_low = false) =>
    getContractConfig(is_high_low)[type]
        ? getContractConfig(is_high_low)[type.toUpperCase() as TContractType].name
        : '';

export type TValidationRuleIndex =
    | 'has_contract_update_stop_loss'
    | 'contract_update_stop_loss'
    | 'has_contract_update_take_profit'
    | 'contract_update_take_profit';

type ValidationRuleFunc = (value: number, options: any, contract_store: TContractStore) => boolean;

type ValidationConditionFunc = (contract_store: TContractStore) => boolean;

type Rule =
    | [
          'req',
          {
              condition: ValidationConditionFunc;
              message: string;
          },
      ]
    | [
          'custom',
          {
              func: ValidationRuleFunc;
              message: string;
          },
      ];

type Rules = {
    rules: Rule[];
};

type Triggers = {
    trigger: string;
};

export type TValidationRules = {
    has_contract_update_stop_loss: Triggers;
    has_contract_update_take_profit: Triggers;
    contract_update_stop_loss: Rules;
    contract_update_take_profit: Rules;
};

export const getValidationRules = (): TValidationRules => ({
    has_contract_update_stop_loss: {
        trigger: 'contract_update_stop_loss',
    },
    has_contract_update_take_profit: {
        trigger: 'contract_update_take_profit',
    },
    contract_update_stop_loss: {
        rules: [
            [
                'req',
                {
                    condition: contract_store => !contract_store.contract_update_stop_loss,
                    message: localize('Please enter a stop loss amount.'),
                },
            ],
            [
                'custom',
                {
                    func: (value: number, options, contract_store) => {
                        const profit = getTotalProfit(contract_store.contract_info);
                        return !(profit < 0 && -value > profit);
                    },
                    message: localize("Please enter a stop loss amount that's higher than the current potential loss."),
                },
            ],
            [
                'custom',
                {
                    func: (value, options, contract_store) => {
                        const stake = contract_store?.contract_info?.buy_price || 0;
                        return value < stake + 1;
                    },
                    message: localize('Invalid stop loss. Stop loss cannot be more than stake.'),
                },
            ],
        ],
    },
    contract_update_take_profit: {
        rules: [
            [
                'req',
                {
                    condition: contract_store => !contract_store.contract_update_take_profit,
                    message: localize('Please enter a take profit amount.'),
                },
            ],
            [
                'custom',
                {
                    func: (value, options, contract_store) => {
                        const profit = getTotalProfit(contract_store.contract_info);
                        return !(profit > 0 && +value < profit);
                    },
                    message: localize(
                        "Please enter a take profit amount that's higher than the current potential profit."
                    ),
                },
            ],
        ],
    },
});
