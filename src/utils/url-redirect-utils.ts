import { getInitialLanguage } from '@deriv-com/translations';

/**
 * Generate URL with redirect parameter back to current page, account_type, and language if available
 * @param baseUrl - The base URL to add parameters to
 * @returns URL with redirect parameter to current page, account_type, and lang parameters (excluding query params)
 */
export const generateUrlWithRedirect = (baseUrl: string): string => {
    try {
        // Use origin + pathname to exclude query parameters
        const currentUrl = window.location.origin + window.location.pathname;
        const url = new URL(baseUrl);

        // Always add redirect parameter
        url.searchParams.set('redirect', currentUrl);

        // Add account_type parameter if it exists in localStorage
        const accountType = localStorage.getItem('account_type');
        if (accountType) {
            url.searchParams.set('account_type', accountType);
        }

        // Add lang parameter with current language
        const currentLanguage = getInitialLanguage();
        if (currentLanguage) {
            url.searchParams.set('lang', currentLanguage);
        }

        return url.toString();
    } catch (error) {
        console.error('Error generating URL with redirect:', error);
        // Fallback to base URL
        return baseUrl;
    }
};
