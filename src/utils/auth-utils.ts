import { removeAccountType, removeSessionToken } from '@/utils/session-token-utils';

/**
 * Utility functions for authentication-related operations
 */

/**
 * Clears authentication data from local storage and reloads the page
 */
export const clearAuthData = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('active_loginid');
    localStorage.removeItem('client.country');
    removeSessionToken();
    removeAccountType(); // Clear account type from both localStorage and cookies
    localStorage.removeItem('accountsList');
    localStorage.removeItem('clientAccounts');
    localStorage.removeItem('callback_token');
};
