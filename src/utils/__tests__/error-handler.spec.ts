import { handleBackendError, isBackendError } from '../error-handler';

// Mock the backend error messages
jest.mock('../../constants/backend-error-messages', () => ({
    getLocalizedErrorMessage: jest.fn((errorCode, details) => {
        if (errorCode === 'InsufficientBalance') {
            return 'Your account balance is insufficient to buy this contract.';
        }
        if (errorCode === 'RateLimit' && details) {
            return `You are rate limited for: ${details.message_type}, retrying in ${details.delay}s`;
        }
        return 'An error occurred. Please try again.';
    }),
}));

describe('Error Handler', () => {
    describe('isBackendError', () => {
        it('should identify backend errors correctly', () => {
            const backendError = {
                code: 'InsufficientBalance',
                message: 'Insufficient balance',
            };
            expect(isBackendError(backendError)).toBe(true);
        });

        it('should identify non-backend errors correctly', () => {
            const genericError = new Error('Generic error');
            expect(isBackendError(genericError)).toBe(false);
        });

        it('should handle errors with just code property', () => {
            const errorWithCode = { code: 'RateLimit' };
            expect(isBackendError(errorWithCode)).toBe(true);
        });

        it('should reject objects without code property', () => {
            const invalidError = { message: 'Some error' };
            expect(isBackendError(invalidError)).toBe(false);
        });
    });

    describe('handleBackendError', () => {
        it('should handle backend errors with InsufficientBalance code', () => {
            const backendError = {
                code: 'InsufficientBalance',
                message: 'Insufficient balance',
            };
            const result = handleBackendError(backendError);
            expect(result).toBe('Your account balance is insufficient to buy this contract.');
        });

        it('should handle backend errors with RateLimit code and details', () => {
            const backendError = {
                code: 'RateLimit',
                details: {
                    message_type: 'buy',
                    delay: '5',
                },
            };
            const result = handleBackendError(backendError);
            expect(result).toBe('You are rate limited for: buy, retrying in 5s');
        });

        it('should return fallback message for unknown error codes', () => {
            const unknownError = {
                code: 'UnknownErrorCode123',
            };
            const result = handleBackendError(unknownError);
            expect(result).toBe('An error occurred. Please try again.');
        });

        it('should handle errors without code property', () => {
            const invalidError = {
                message: 'Generic error message',
            } as any;
            const result = handleBackendError(invalidError);
            expect(result).toBe('An error occurred. Please try again.');
        });
    });
});
