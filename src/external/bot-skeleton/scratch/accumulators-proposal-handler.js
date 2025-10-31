import { getLocalizedErrorMessage } from '@/constants/backend-error-messages';
import { api_base } from '../services/api';
import DBotStore from './dbot-store';

export const DEFAULT_PROPOSAL_REQUEST = {
    amount: undefined,
    basis: 'stake',
    contract_type: 'ACCU',
    currency: undefined,
    underlying_symbol: undefined,
    growth_rate: undefined,
    proposal: 1,
    subscribe: 1,
};

export const forgetAccumulatorsProposalRequest = async instance => {
    if (instance && !instance.is_bot_running) {
        await api_base?.api?.send({ forget_all: 'proposal' });
        instance.subscription_id_for_accumulators = null;
        instance.is_proposal_requested_for_accumulators = false;
        window.Blockly.accumulators_request = {};
    }
};

export const handleProposalRequestForAccumulators = instance => {
    const top_parent_block = instance?.getTopParent();
    const market_block = top_parent_block?.getChildByType('trade_definition_market');
    const underlying_symbol = market_block?.getFieldValue('SYMBOL_LIST');
    const currency = DBotStore.instance.client.currency;
    const growth_rate = instance?.getFieldValue('GROWTHRATE_LIST') || 0.01;
    const amount = instance?.childBlocks_?.[0]?.getField('NUM')?.getValue() || 0;
    const proposal_request = {
        ...DEFAULT_PROPOSAL_REQUEST,
        amount,
        currency,
        underlying_symbol,
        growth_rate,
    };
    window.Blockly.accumulators_request = proposal_request;
};

export const requestProposalForQS = (input_values, ws) => {
    const { amount, currency, symbol, growth_rate, limit_order } = input_values;
    const { take_profit } = limit_order;

    const proposal_request = {
        ...DEFAULT_PROPOSAL_REQUEST,
        amount,
        currency,
        underlying_symbol: symbol,
        growth_rate,
        subscribe: undefined,
        limit_order: {
            take_profit,
        },
    };

    return ws
        ?.send(proposal_request)
        .then(response => {
            if (response.error) {
                // Process error through backend error message system
                const localizedError = {
                    ...response.error,
                    message: response.error.code
                        ? getLocalizedErrorMessage(response.error.code, response.error)
                        : response.error.message,
                };
                return Promise.reject(localizedError);
            }
            return response;
        })
        .catch(error => {
            // Ensure error is localized if it has an error code
            if (error.code) {
                const localizedError = {
                    ...error,
                    message: getLocalizedErrorMessage(error.code, error),
                };
                throw localizedError;
            }
            throw error;
        });
};
