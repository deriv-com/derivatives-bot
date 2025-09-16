import React from 'react';
import Cookies from 'js-cookie';
import ErrorModal from '@/components/error-modal';
import ChunkLoader from '@/components/loader/chunk-loader';
import PageError from '@/components/page-error';
import { getAuthError, getDefaultError } from '@/components/shared/utils/constants/error';
import { generateDerivApiInstance } from '@/external/bot-skeleton/services/api/appId';
import { observer as globalObserver } from '@/external/bot-skeleton/utils/observer';
import { clearAuthData } from '@/utils/auth-utils';
import { localize } from '@deriv-com/translations';
import { URLUtils } from '@deriv-com/utils';
import App from './App';

const setLocalStorageToken = async (
    loginInfo: URLUtils.LoginInfo[],
    paramsToDelete: string[],
    setIsAuthComplete: React.Dispatch<React.SetStateAction<boolean>>,
    setTokenError: React.Dispatch<React.SetStateAction<string | null>>,
    setIsAuthError: React.Dispatch<React.SetStateAction<boolean>>
) => {
    // Extract token and account_type from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const accountType = urlParams.get('account_type');

    // Only save account_type when BOTH token and account_type are present
    if (token && accountType) {
        localStorage.setItem('account_type', accountType);
    }
    // If no token or account_type, don't save anything - will fallback to demo server

    if (loginInfo.length) {
        URLUtils.filterSearchParams(paramsToDelete);

        try {
            const api = await generateDerivApiInstance();

            if (api) {
                const { authorize, error } = await api.authorize(loginInfo[0].token);
                api.disconnect();
                if (error) {
                    // Check if the error is due to an invalid token
                    if (error.code === 'InvalidToken') {
                        // Set error message to show PageError for auth errors
                        setTokenError(getAuthError().description);
                        setIsAuthError(true);
                        setIsAuthComplete(true);

                        // Don't emit InvalidToken event to prevent automatic reloads from other handlers
                        // Only clear auth data if user is logged out
                        if (Cookies.get('logged_state') === 'false') {
                            // If the user is not logged out, we need to clear the local storage
                            clearAuthData();
                        }
                        return; // Don't proceed with token storage
                    } else {
                        // Handle other API errors - use existing modal behavior
                        setTokenError(getDefaultError().description);
                        setIsAuthError(false);
                        setIsAuthComplete(true);
                        return;
                    }
                } else {
                    localStorage.setItem('client.country', authorize.country);
                    const firstId = authorize?.account_list[0]?.loginid;
                    const filteredTokens = loginInfo.filter(token => token.loginid === firstId);
                    if (filteredTokens.length) {
                        localStorage.setItem('authToken', filteredTokens[0].token);
                        localStorage.setItem('active_loginid', filteredTokens[0].loginid);
                        return;
                    }
                }
            }

            localStorage.setItem('authToken', loginInfo[0].token);
        } catch (error) {
            console.error('Error during token exchange:', error);
            setTokenError(getDefaultError().description);
            setIsAuthError(false);
        }
    }
};

export const AuthWrapper = () => {
    const [isAuthComplete, setIsAuthComplete] = React.useState(false);
    const [tokenError, setTokenError] = React.useState<string | null>(null);
    const [isAuthError, setIsAuthError] = React.useState(false);
    const { loginInfo, paramsToDelete } = URLUtils.getLoginInfoFromURL();

    React.useEffect(() => {
        const initializeAuth = async () => {
            await setLocalStorageToken(loginInfo, paramsToDelete, setIsAuthComplete, setTokenError, setIsAuthError);
            URLUtils.filterSearchParams(['lang']);
            setIsAuthComplete(true);
        };

        initializeAuth();
    }, [loginInfo, paramsToDelete]);

    // Listen for InvalidToken events from URL parameter token exchange
    React.useEffect(() => {
        const handleInvalidToken = () => {
            // Show error page for invalid URL parameter tokens
            setTokenError(getAuthError().description);
            setIsAuthError(true);
            setIsAuthComplete(true);
        };

        globalObserver.register('InvalidToken', handleInvalidToken);

        return () => {
            globalObserver.unregister('InvalidToken', handleInvalidToken);
        };
    }, []);

    if (!isAuthComplete) {
        return <ChunkLoader message={localize('Initializing...')} />;
    }

    // Show error page if there's an authentication error
    if (tokenError && isAuthError) {
        const authError = getAuthError();
        return (
            <PageError
                header={authError.header}
                messages={[authError.description]}
                redirect_labels={[authError.cta_label]}
                redirect_urls={[window.location.origin]}
                should_redirect={false}
                buttonOnClick={() => {
                    // Clear auth data and redirect to login only when user clicks the button
                    clearAuthData();
                    window.location.href = window.location.origin;
                }}
            />
        );
    }

    // Show error modal for other types of errors (keep existing behavior for non-auth errors)
    if (tokenError) {
        return <ErrorModal messages={[tokenError]} />;
    }

    return <App />;
};
