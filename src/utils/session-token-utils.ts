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
