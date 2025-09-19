import { useEffect, useRef } from 'react';
import { useStore } from './useStore';

/**
 * Custom hook to sync localStorage changes across tabs
 * Specifically monitors 'session_token' changes from other tabs and refreshes the page
 *
 * How it works:
 * - The 'storage' event only fires on other tabs/windows when localStorage is modified
 * - It does NOT fire on the tab that made the change
 * - This is perfect for detecting session token changes from other tabs
 * - Temporarily disables beforeunload prompt to avoid Chrome's native dialog
 *
 * Usage:
 * - Import and call this hook in your main App component
 * - When another tab changes the session_token, this tab will automatically refresh
 * - Changes made by the current tab will not trigger a refresh
 */
export const useLocalStorageSync = () => {
    const isOwnChange = useRef(false);
    const store = useStore();

    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            // Only handle session_token changes
            if (event.key !== 'session_token') {
                return;
            }

            // Log the change for debugging
            console.log('🔄 Session token changed in another tab:', {
                key: event.key,
                oldValue: event.oldValue,
                newValue: event.newValue,
                storageArea: event.storageArea,
                url: event.url,
            });

            // Check if bot is running and temporarily disable prompt handler to prevent Chrome's native dialog
            const isBotRunning = store?.run_panel?.is_running;

            console.log('🔍 Bot running status:', isBotRunning);
            console.log('🔍 UI show_prompt status:', store?.ui?.show_prompt);

            // Temporarily disable prompt handler during refresh to prevent Chrome's native dialog
            if (store?.ui?.setPromptHandler) {
                console.log('🔇 Temporarily disabling prompt handler for refresh');
                store.ui.setPromptHandler(false);
            }

            // Add a small delay to ensure localStorage is fully updated
            setTimeout(() => {
                console.log('🔃 Refreshing page due to session token change from another tab...');
                window.location.reload();
            }, 100);
        };

        // Listen for localStorage changes from other tabs
        window.addEventListener('storage', handleStorageChange);

        console.log('👂 LocalStorage sync hook initialized - listening for session_token changes from other tabs');

        return () => {
            console.log('🔇 LocalStorage sync hook cleanup');
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    /**
     * Wrapper function to set session_token in localStorage
     * This prevents the storage event from firing on the current tab
     *
     * @param token - The session token to store
     */
    const setSessionToken = (token: string) => {
        isOwnChange.current = true;
        console.log('💾 Setting session_token from current tab:', token.substring(0, 10) + '...');
        localStorage.setItem('session_token', token);

        // Reset the flag after a short delay
        setTimeout(() => {
            isOwnChange.current = false;
        }, 50);
    };

    /**
     * Wrapper function to remove session_token from localStorage
     */
    const removeSessionToken = () => {
        isOwnChange.current = true;
        console.log('🗑️  Removing session_token from current tab');
        localStorage.removeItem('session_token');

        // Reset the flag after a short delay
        setTimeout(() => {
            isOwnChange.current = false;
        }, 50);
    };

    return {
        setSessionToken,
        removeSessionToken,
    };
};
