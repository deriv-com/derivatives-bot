import { CONTRACT_TYPES } from '@/components/shared';

// Default barrier values
const DEFAULT_DIGIT_BARRIER = 5;

export const DEFAULT_OPTIONS_PROPOSAL_REQUEST = {
    amount: undefined,
    basis: 'stake',
    contract_type: undefined,
    currency: undefined,
    underlying_symbol: undefined,
    duration: undefined,
    duration_unit: undefined,
    proposal: 1,
};

export const requestOptionsProposalForQS = (input_values, ws) => {
    const { amount, currency, underlying_symbol, contract_type, duration, duration_unit, basis } = input_values;

    const proposal_request = {
        ...DEFAULT_OPTIONS_PROPOSAL_REQUEST,
        amount,
        currency,
        underlying_symbol,
        contract_type,
        duration,
        duration_unit,
        basis,
    };

    const digit_contracts = [
        CONTRACT_TYPES.MATCH_DIFF.MATCH, // DIGITMATCH
        CONTRACT_TYPES.MATCH_DIFF.DIFF, // DIGITDIFF
        CONTRACT_TYPES.OVER_UNDER.OVER, // DIGITOVER
        CONTRACT_TYPES.OVER_UNDER.UNDER, // DIGITUNDER
    ];

    if (digit_contracts.includes(contract_type)) {
        proposal_request.barrier = DEFAULT_DIGIT_BARRIER;
    }

    return ws
        ?.send(proposal_request)
        .then(response => {
            if (response.error) {
                return Promise.reject(response.error);
            }
            return response;
        })
        .catch(error => {
            throw error;
        });
};
