import { getLocalizedErrorMessage } from '@/constants/backend-error-messages';

/**
 * Interface for backend error response
 */
export interface BackendError {
    code: string;
    message?: string;
    details?: Record<string, any>;
}

/**
 * Interface for API error response
 */
export interface ApiErrorResponse {
    error?: BackendError;
    msg_type?: string;
}

/**
 * Handles backend errors and returns localized error messages
 * @param error - The error object from backend
 * @returns Localized error message
 */
export const handleBackendError = (error: BackendError): string => {
    if (!error?.code) {
        return getLocalizedErrorMessage('GeneralError');
    }

    // Handle code_args format specifically for parameter replacement
    let details = error.details;
    if (error.details?.code_args && Array.isArray(error.details.code_args)) {
        // Convert code_args array to parameter object for easier processing
        const code_args = error.details.code_args;
        details = {
            ...error.details,
            param1: code_args[0],
            param2: code_args[1],
            param3: code_args[2],
            param4: code_args[3],
            param5: code_args[4],
        };
    }

    // Get localized message for the specific error code with details
    return getLocalizedErrorMessage(error.code, details);
};

/**
 * Handles API response errors
 * @param response - The API response object
 * @returns Localized error message or null if no error
 */
export const handleApiError = (response: ApiErrorResponse): string | null => {
    if (!response?.error) {
        return null;
    }

    return handleBackendError(response.error);
};

/**
 * Creates a standardized error object for display
 * @param error - The backend error
 * @returns Standardized error object
 */
export const createErrorObject = (error: BackendError) => ({
    code: error.code,
    message: handleBackendError(error),
    details: error.details,
});

/**
 * Utility function to check if an error code requires specific handling
 * @param errorCode - The error code to check
 * @returns Boolean indicating if special handling is needed
 */
export const requiresSpecialHandling = (errorCode: string): boolean => {
    const specialHandlingCodes = [
        'AuthorizationRequired',
        'InsufficientBalance',
        'MarketIsClosed',
        'AccountBalanceExceedsLimit',
        'DailyProfitLimitExceeded',
        'ClientUnwelcome',
    ];

    return specialHandlingCodes.includes(errorCode);
};

/**
 * Gets error severity level for UI styling
 * @param errorCode - The error code
 * @returns Severity level: 'critical', 'warning', or 'info'
 */
export const getErrorSeverity = (errorCode: string): 'critical' | 'warning' | 'info' => {
    const criticalErrors = [
        'InternalServerError',
        'GeneralError',
        'AuthorizationRequired',
        'ClientUnwelcome',
        'TradingDisabled',
    ];

    const warningErrors = [
        'InsufficientBalance',
        'StakeLimitExceeded',
        'MarketIsClosed',
        'DailyProfitLimitExceeded',
        'AccountBalanceExceedsLimit',
    ];

    if (criticalErrors.includes(errorCode)) {
        return 'critical';
    }

    if (warningErrors.includes(errorCode)) {
        return 'warning';
    }

    return 'info';
};

/**
 * Type guard to check if an object is a backend error
 * @param obj - Object to check
 * @returns Boolean indicating if object is a backend error
 */
export const isBackendError = (obj: any): obj is BackendError => {
    return obj && typeof obj === 'object' && typeof obj.code === 'string';
};

/**
 * Type guard to check if an object is an API error response
 * @param obj - Object to check
 * @returns Boolean indicating if object is an API error response
 */
export const isApiErrorResponse = (obj: any): obj is ApiErrorResponse => {
    return obj && typeof obj === 'object' && obj.error && isBackendError(obj.error);
};
