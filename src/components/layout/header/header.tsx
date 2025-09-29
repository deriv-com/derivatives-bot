import { useCallback } from 'react';
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
    const { isAuthorizing, isAuthorized, activeLoginid } = useApiBase();
    const { client } = useStore() ?? {};

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

    const renderAccountSection = useCallback(() => {
        if (isAuthenticating || isAuthorizing || isSingleLoggingIn || (activeLoginid && !isAuthorized)) {
            return <AccountsInfoLoader isLoggedIn isMobile={!isDesktop} speed={3} />;
        } else if (activeLoginid && isAuthorized) {
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
        } else {
            return (
                <div className='auth-actions'>
                    <Button
                        tertiary
                        onClick={() => {
                            window.location.replace(generateOAuthURL());
                        }}
                    >
                        <Localize i18n_default_text='Log in' />
                    </Button>
                </div>
            );
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
