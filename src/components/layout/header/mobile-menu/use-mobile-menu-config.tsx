import { ComponentProps, ReactNode, useMemo } from 'react';
import { standalone_routes } from '@/components/shared';
import useThemeSwitcher from '@/hooks/useThemeSwitcher';
import RootStore from '@/stores/root-store';
import { BrandDerivLogoCoralIcon } from '@deriv/quill-icons';
import {
    LegacyHomeOldIcon,
    LegacyLogout1pxIcon,
    LegacyReportsIcon,
    LegacyTheme1pxIcon,
} from '@deriv/quill-icons/Legacy';
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

    // Get current account information for dependency tracking
    const is_virtual = client?.is_virtual;
    const currency = client?.getCurrency?.();
    const is_logged_in = client?.is_logged_in;
    const client_residence = client?.residence;

    const menuConfig = useMemo(
        (): TMenuConfig[] => [
            [
                {
                    as: 'a',
                    href: standalone_routes.deriv_com,
                    label: localize('Deriv.com'),
                    LeftComponent: BrandDerivLogoCoralIcon,
                },
                is_logged_in && {
                    as: 'a',
                    href: standalone_routes.deriv_app,
                    label: localize('Home'),
                    LeftComponent: LegacyHomeOldIcon,
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
        ],
        [is_virtual, currency, is_logged_in, client_residence, client, onLogout]
    );

    return {
        config: menuConfig,
    };
};

export default useMobileMenuConfig;
