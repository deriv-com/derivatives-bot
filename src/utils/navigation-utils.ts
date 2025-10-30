/**
 * Centralized navigation utilities to avoid redundant reload methods
 */

/**
 * Safely reloads the current page
 * Uses a single, consistent method across the application
 */
export const reloadPage = (): void => {
    try {
        window.location.reload();
    } catch (error) {
        console.error('Failed to reload page:', error);
    }
};

/**
 * Navigates to a URL with optional reload
 * @param url - The URL to navigate to
 * @param shouldReload - Whether to reload after navigation (default: false)
 */
export const navigateToUrl = (url: string, shouldReload = false): void => {
    try {
        if (shouldReload) {
            window.location.href = url;
        } else {
            window.location.assign(url);
        }
    } catch (error) {
        console.error('Failed to navigate to URL:', error, url);
        // Fallback
        window.location.href = url;
    }
};

/**
 * Replaces current URL without adding to history
 * @param url - The URL to replace with
 */
export const replaceUrl = (url: string): void => {
    try {
        window.location.replace(url);
    } catch (error) {
        console.error('Failed to replace URL:', error, url);
        // Fallback
        window.location.href = url;
    }
};
