import { ComponentProps, ReactNode, useEffect, useMemo, useState } from 'react';
import { standalone_routes } from '@/components/shared';
import { useFirebaseCountriesConfig } from '@/hooks/firebase/useFirebaseCountriesConfig';
import useThemeSwitcher from '@/hooks/useThemeSwitcher';
import RootStore from '@/stores/root-store';
import { handleTraderHubRedirect } from '@/utils/traders-hub-redirect';
import { BrandDerivLogoCoralIcon } from '@deriv/quill-icons';
import { LegacyLogout1pxIcon, LegacyReportsIcon, LegacyTheme1pxIcon } from '@deriv/quill-icons/Legacy';
import { useTranslations } from '@deriv-com/translations';
import { ToggleSwitch } from '@deriv-com/ui';

export type TSubmenuSection = 'accountSettings' | 'cashier' | 'reports';

//IconTypes
type TMenuConfig = {
    LeftComponent: React.ElementType;
    RightComponent?: ReactNode;
    as: 'a' | 'button';
    href?: string;
    label: ReactNode;
    onClick?: () => void;
    removeBorderBottom?: boolean;
    submenu?: TSubmenuSection;
    target?: ComponentProps<'a'>['target'];
    isActive?: boolean;
}[];

const useMobileMenuConfig = (client?: RootStore['client'], onLogout?: () => void) => {
    const { localize } = useTranslations();
    const { is_dark_mode_on, toggleTheme } = useThemeSwitcher();
    const { hubEnabledCountryList } = useFirebaseCountriesConfig();

    const [redirect_url_str, setRedirectUrlStr] = useState<null | string>(null);

    // Get current account information for dependency tracking
    const is_virtual = client?.is_virtual;
    const currency = client?.getCurrency?.();
    const is_logged_in = client?.is_logged_in;
    const client_residence = client?.residence;

    useEffect(() => {
        if (client?.is_logged_in) {
            const redirectParams = {
                product_type: 'tradershub' as const,
                has_wallet: false,
                is_virtual: client?.is_virtual,
                residence: client?.residence,
                hubEnabledCountryList,
            };
            setRedirectUrlStr(handleTraderHubRedirect(redirectParams));
        }
    }, [client?.is_virtual, client?.residence, hubEnabledCountryList, client?.is_logged_in]);

    const menuConfig = useMemo((): TMenuConfig[] => {
        // Calculate the href for the Deriv logo (same logic as desktop AppLogo)
        const getDerivLogoHref = () => {
            // For logged out users, keep the original Deriv.com link with target="_blank"
            if (!client?.is_logged_in) {
                return standalone_routes.deriv_com;
            }

            // For logged in users, use the same logic as TradershubLink
            const urlParams = new URLSearchParams(window.location.search);
            const account_param = urlParams.get('account');
            const is_virtual_account = client.is_virtual || account_param === 'demo' || false;

            let href = redirect_url_str;
            if (redirect_url_str) {
                try {
                    const redirect_url = new URL(redirect_url_str);
                    if (is_virtual_account) {
                        redirect_url.searchParams.set('account', 'demo');
                    } else if (currency) {
                        redirect_url.searchParams.set('account', currency);
                    }
                    href = redirect_url.toString();
                } catch (error) {
                    console.error('Error parsing redirect URL:', error);
                }
            }

            return href ?? standalone_routes.traders_hub;
        };

        return [
            [
                {
                    as: 'a',
                    href: getDerivLogoHref(),
                    label: localize('Deriv.com'),
                    LeftComponent: BrandDerivLogoCoralIcon,
                    target: !client?.is_logged_in ? '_blank' : undefined,
                },
                client?.is_logged_in && {
                    as: 'button',
                    label: localize('Reports'),
                    LeftComponent: LegacyReportsIcon,
                    submenu: 'reports',
                    onClick: () => {},
                },
                {
                    as: 'button',
                    label: localize('Dark theme'),
                    LeftComponent: LegacyTheme1pxIcon,
                    RightComponent: <ToggleSwitch value={is_dark_mode_on} onChange={toggleTheme} />,
                },
            ].filter(Boolean) as TMenuConfig,
            [],
            [
                client?.is_logged_in &&
                    onLogout && {
                        as: 'button',
                        label: localize('Log out'),
                        LeftComponent: LegacyLogout1pxIcon,
                        onClick: onLogout,
                        removeBorderBottom: true,
                    },
            ].filter(Boolean) as TMenuConfig,
        ];
    }, [
        is_virtual,
        currency,
        is_logged_in,
        client_residence,
        client,
        onLogout,
        is_dark_mode_on,
        toggleTheme,
        localize,
        redirect_url_str,
        hubEnabledCountryList,
    ]);

    return {
        config: menuConfig,
    };
};

export default useMobileMenuConfig;
