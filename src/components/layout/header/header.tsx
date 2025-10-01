import { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { generateOAuthURL, standalone_routes } from '@/components/shared';
import Button from '@/components/shared_ui/button';
import useActiveAccount from '@/hooks/api/account/useActiveAccount';
import { useOauth2 } from '@/hooks/auth/useOauth2';
import { useApiBase } from '@/hooks/useApiBase';
import { useStore } from '@/hooks/useStore';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Header, useDevice, Wrapper } from '@deriv-com/ui';
import { AppLogo } from '../app-logo';
import AccountsInfoLoader from './account-info-loader';
import AccountSwitcher from './account-switcher';
import MenuItems from './menu-items';
import MobileMenu from './mobile-menu';
import './header.scss';

type TAppHeaderProps = {
    isAuthenticating?: boolean;
};

const AppHeader = observer(({ isAuthenticating }: TAppHeaderProps) => {
    const { isDesktop } = useDevice();
    const { isAuthorizing, isAuthorized, activeLoginid, setIsAuthorizing } = useApiBase();
    const { client } = useStore() ?? {};
    const [shouldShowLogin, setShouldShowLogin] = useState(false);

    const { data: activeAccount } = useActiveAccount({
        allBalanceData: client?.all_accounts_balance,
        directBalance: client?.balance,
    });
    const { getCurrency, is_virtual } = client ?? {};

    const currency = getCurrency?.();
    const { localize } = useTranslations();

    const { isSingleLoggingIn, oAuthLogout } = useOauth2({ handleLogout: async () => client?.logout(), client });

    const handleLogout = useCallback(async () => {
        try {
            await oAuthLogout();
        } catch (error) {
            console.error('Logout failed:', error);
            // Still try to logout even if there's an error
            await oAuthLogout();
        }
    }, [oAuthLogout]);

    // Handle direct URL access with token
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get('token');

        // If there's a token in the URL, set authorizing to true
        if (tokenFromUrl) {
            setIsAuthorizing(true);
        }
    }, [setIsAuthorizing]);

    // Conservative detection for when to show login button
    useEffect(() => {
        // Only show login button in very specific cases to avoid flash
        if (activeLoginid) {
            // User is authenticated - definitely hide login button
            setShouldShowLogin(false);
        } else if (!isAuthorizing && !activeLoginid) {
            // Only show login when explicitly not authorizing (like after logout)
            setShouldShowLogin(true);
        } else {
            // Keep login button hidden during any authorizing state
            setShouldShowLogin(false);
        }
    }, [isAuthorizing, activeLoginid]);

    const handleLogin = useCallback(() => {
        try {
            // Set authorizing state immediately when login is clicked
            setIsAuthorizing(true);
            // Redirect to OAuth URL
            window.location.replace(generateOAuthURL());
        } catch (error) {
            console.error('Login redirection failed:', error);
            // Reset authorizing state if redirection fails
            setIsAuthorizing(false);
        }
    }, [setIsAuthorizing]);

    const renderAccountSection = useCallback(() => {
        // Show account switcher and logout when user is fully authenticated
        if (activeLoginid) {
            return (
                <div className='auth-actions'>
                    <AccountSwitcher activeAccount={activeAccount} />
                    {isDesktop && (
                        <Button tertiary disabled={client?.is_logging_out} onClick={handleLogout}>
                            <Localize i18n_default_text='Log out' />
                        </Button>
                    )}
                </div>
            );
        }
        // Show login button when not authorizing, or when intelligent detection determines it should show
        else if ((!isAuthorizing && !activeLoginid) || shouldShowLogin) {
            return (
                <div className='auth-actions'>
                    <Button tertiary onClick={handleLogin}>
                        <Localize i18n_default_text='Log in' />
                    </Button>
                </div>
            );
        }
        // Default: Show loader during loading states or when authorizing
        else {
            return <AccountsInfoLoader isLoggedIn isMobile={!isDesktop} speed={3} />;
        }
    }, [
        isAuthenticating,
        isAuthorizing,
        isSingleLoggingIn,
        isDesktop,
        activeLoginid,
        isAuthorized,
        standalone_routes,
        client,
        currency,
        localize,
        activeAccount,
        is_virtual,
        handleLogout,
        shouldShowLogin,
    ]);

    if (client?.should_hide_header) return null;

    return (
        <>
            <Header
                className={clsx('app-header', {
                    'app-header--desktop': isDesktop,
                    'app-header--mobile': !isDesktop,
                })}
            >
                <Wrapper variant='left'>
                    <MobileMenu onLogout={handleLogout} />
                    <AppLogo />
                    {isDesktop && <MenuItems />}
                </Wrapper>
                <Wrapper variant='right'>{renderAccountSection()}</Wrapper>
            </Header>
        </>
    );
});

export default AppHeader;
