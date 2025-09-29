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
 * Generic function to set a value in both localStorage and cookies
 * @param key - The key to store the value under
 * @param value - The value to store
 * @param expires - Optional ISO 8601 expiry date string
 */
export const setLocalStorageAndCookie = (key: string, value: string, expires?: string): void => {
    try {
        // Store in localStorage for backward compatibility and local tab sync
        localStorage.setItem(key, value);

        // Store in cookies for cross-app synchronization
        const domain = getWildcardDomain();
        const cookieOptions: Cookies.CookieAttributes = {
            domain: domain,
            secure: window.location.protocol === 'https:',
            sameSite: 'Lax',
        };

        // Use expiry if provided
        if (expires) {
            cookieOptions.expires = new Date(expires);
        }

        Cookies.set(key, value, cookieOptions);
    } catch (error) {
        console.error(`Error setting ${key}:`, error);
    }
};

/**
 * Generic function to get a value from localStorage (primary) or cookies (fallback)
 * @param key - The key to retrieve the value for
 * @returns The value or null if not found
 */
export const getFromLocalStorageOrCookie = (key: string): string | null => {
    try {
        // Try localStorage first for better performance
        const localValue = localStorage.getItem(key);
        if (localValue) {
            return localValue;
        }

        // Fallback to cookies if localStorage is empty
        const cookieValue = Cookies.get(key);
        return cookieValue || null;
    } catch (error) {
        console.error(`Error getting ${key}:`, error);
        return null;
    }
};

/**
 * Generic function to remove a value from both localStorage and cookies
 * @param key - The key to remove
 */
export const removeFromLocalStorageAndCookie = (key: string): void => {
    try {
        // Remove from localStorage
        localStorage.removeItem(key);

        // Remove from cookies
        const domain = getWildcardDomain();
        Cookies.remove(key, { domain: domain });

        // Also try removing without domain for cleanup
        Cookies.remove(key);
    } catch (error) {
        console.error(`Error removing ${key}:`, error);
    }
};
