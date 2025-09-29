import Cookies from 'js-cookie';

/**
 * Get the wildcard domain for cookies (e.g., ".deriv.com" from "staging.deriv.com")
 * This allows cookies to be shared across subdomains
 */
const getWildcardDomain = (): string => {
    try {
        return '.' + window.location.hostname.split('.').slice(-2).join('.');
    } catch (error) {
        console.error('Error getting wildcard domain:', error);
        return '';
    }
};

/**
 * Set session token in both localStorage and cookies
 * @param token - The session token to store
 * @param expires - Optional ISO 8601 expiry date string from API
 */
export const setSessionToken = (token: string, expires?: string): void => {
    try {
        // Store in localStorage for backward compatibility and local tab sync
        localStorage.setItem('session_token', token);

        // Store in cookies for cross-app synchronization
        const domain = getWildcardDomain();
        const cookieOptions: Cookies.CookieAttributes = {
            domain: domain,
            secure: window.location.protocol === 'https:',
            sameSite: 'Lax',
        };

        // Use API expiry if provided, otherwise no expiration (like localStorage)
        if (expires) {
            cookieOptions.expires = new Date(expires);
        }

        Cookies.set('session_token', token, cookieOptions);
    } catch (error) {
        console.error('Error setting session token:', error);
    }
};

/**
 * Get session token from localStorage (primary) or cookies (fallback)
 * @returns The session token or null if not found
 */
export const getSessionToken = (): string | null => {
    try {
        // Try localStorage first for better performance
        const localToken = localStorage.getItem('session_token');
        if (localToken) {
            return localToken;
        }

        // Fallback to cookies if localStorage is empty
        const cookieToken = Cookies.get('session_token');
        return cookieToken || null;
    } catch (error) {
        console.error('Error getting session token:', error);
        return null;
    }
};

/**
 * Remove session token from both localStorage and cookies
 */
export const removeSessionToken = (): void => {
    try {
        // Remove from localStorage
        localStorage.removeItem('session_token');

        // Remove from cookies
        const domain = getWildcardDomain();
        Cookies.remove('session_token', { domain: domain });

        // Also try removing without domain for cleanup
        Cookies.remove('session_token');
    } catch (error) {
        console.error('Error removing session token:', error);
    }
};

/**
 * Set account type in both localStorage and cookies
 * @param accountType - The account type to store ('demo' or 'real')
 */
export const setAccountType = (accountType: string): void => {
    try {
        // Store in localStorage for backward compatibility and local tab sync
        localStorage.setItem('account_type', accountType);

        // Store in cookies for cross-app synchronization
        const domain = getWildcardDomain();
        const cookieOptions: Cookies.CookieAttributes = {
            domain: domain,
            secure: window.location.protocol === 'https:',
            sameSite: 'Lax',
            // No expiration for account_type - persist like localStorage
        };

        Cookies.set('account_type', accountType, cookieOptions);
    } catch (error) {
        console.error('Error setting account type:', error);
    }
};

/**
 * Get account type from localStorage (primary) or cookies (fallback)
 * @returns The account type or null if not found
 */
export const getAccountType = (): string | null => {
    try {
        // Try localStorage first for better performance
        const localAccountType = localStorage.getItem('account_type');
        if (localAccountType) {
            return localAccountType;
        }

        // Fallback to cookies if localStorage is empty
        const cookieAccountType = Cookies.get('account_type');
        return cookieAccountType || null;
    } catch (error) {
        console.error('Error getting account type:', error);
        return null;
    }
};

/**
 * Remove account type from both localStorage and cookies
 */
export const removeAccountType = (): void => {
    try {
        // Remove from localStorage
        localStorage.removeItem('account_type');

        // Remove from cookies
        const domain = getWildcardDomain();
        Cookies.remove('account_type', { domain: domain });

        // Also try removing without domain for cleanup
        Cookies.remove('account_type');
    } catch (error) {
        console.error('Error removing account type:', error);
    }
};
