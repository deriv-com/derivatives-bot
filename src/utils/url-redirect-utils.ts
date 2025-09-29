/**
 * Generate URL with redirect parameter back to current page
 * @param baseUrl - The base URL to add redirect parameter to
 * @returns URL with redirect parameter to current page (origin + pathname, excluding query params)
 */
export const generateUrlWithRedirect = (baseUrl: string): string => {
    try {
        // Use origin + pathname to exclude query parameters
        const currentUrl = window.location.origin + window.location.pathname;
        return `${baseUrl}?redirect=${encodeURIComponent(currentUrl)}`;
    } catch (error) {
        console.error('Error generating URL with redirect:', error);
        // Fallback to base URL
        return baseUrl;
    }
};
