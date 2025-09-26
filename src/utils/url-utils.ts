/**
 * Removes specific query parameters from the current URL
 * @param paramsToRemove - Array of parameter names to remove
 */
export const clearUrlQueryParams = (paramsToRemove: string[]): void => {
    try {
        const url = new URL(window.location.href);
        const searchParams = new URLSearchParams(url.search);

        // Remove specified parameters
        paramsToRemove.forEach(param => {
            searchParams.delete(param);
        });

        // Update the URL without refreshing the page
        const newUrl = `${url.pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}${url.hash}`;
        window.history.replaceState({}, '', newUrl);
    } catch (error) {
        console.error('Error clearing URL query parameters:', error);
    }
};

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
