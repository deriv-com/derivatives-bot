import { CONTRACT_TYPES } from '@/components/shared';

// Default barrier values
const DEFAULT_DIGIT_BARRIER = 5;

interface OptionsProposalRequest {
    amount?: number | string;
    basis: string;
    contract_type?: string;
    currency?: string | undefined;
    underlying_symbol?: string;
    duration?: number;
    duration_unit?: string;
    proposal: number;
    barrier?: number;
}

interface InputValues {
    amount: number | string;
    currency: string | undefined;
    underlying_symbol: string;
    contract_type: string;
    duration: number;
    duration_unit: string;
    basis: string;
}

interface WebSocket {
    send: (request: OptionsProposalRequest) => Promise<any> | any;
}

// This interface matches the structure of api_base.api
export interface ApiBaseType {
    connection: {
        readyState: number;
        addEventListener: (event: string, callback: () => void) => void;
        removeEventListener: (event: string, callback: () => void) => void;
    };
    send: (data: unknown) => Promise<any> | any;
    disconnect: () => void;
    authorize: (token: string) => Promise<{ authorize: any; error: unknown }>;
    onMessage: () => {
        subscribe: (callback: (message: unknown) => void) => {
            unsubscribe: () => void;
        };
    };
    [key: string]: any;
}

interface ProposalResponse {
    error?: {
        code: string;
        message: string;
    };
    proposal?: {
        id: string;
        ask_price: number;
        display_value: string;
        payout: number;
        spot: number;
        spot_time: number;
        [key: string]: any;
    };
}

export const DEFAULT_OPTIONS_PROPOSAL_REQUEST: OptionsProposalRequest = {
    amount: undefined,
    basis: 'stake',
    contract_type: undefined,
    currency: undefined,
    underlying_symbol: undefined,
    duration: undefined,
    duration_unit: undefined,
    proposal: 1,
};

export const requestOptionsProposalForQS = (
    input_values: InputValues,
    ws?: WebSocket | ApiBaseType
): Promise<ProposalResponse> => {
    const { amount, currency, underlying_symbol, contract_type, duration, duration_unit, basis } = input_values;

    const proposal_request: OptionsProposalRequest = {
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
    ] as const;

    // Type guard to check if the contract type is one of our digit contracts
    if (digit_contracts.includes(contract_type as any)) {
        proposal_request.barrier = DEFAULT_DIGIT_BARRIER;
    }

    // Handle undefined WebSocket case
    if (!ws) {
        return Promise.reject(new Error('WebSocket is not available'));
    }

    // Handle the response which might be a Promise or direct response
    const response = ws.send(proposal_request);

    // Normalize the response to always be a Promise
    return Promise.resolve(response)
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
