/**
 * Clears all query parameters from URL when invalid token is detected
 */
export const clearInvalidTokenParams = (): void => {
    try {
        const url = new URL(window.location.href);
        // Clear all query parameters by creating empty search params
        const newUrl = `${url.pathname}${url.hash}`;
        window.history.replaceState({}, '', newUrl);
    } catch (error) {
        console.error('Error clearing all URL query parameters:', error);
    }
};
