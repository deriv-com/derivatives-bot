import { standalone_routes } from '@/components/shared';
import { useTranslations } from '@deriv-com/translations';
import { DerivLogo } from '@deriv-com/ui';
import './app-logo.scss';

export const AppLogo = () => {
    const { currentLang } = useTranslations();
    
    // Always go to the new home dashboard, regardless of login state
    // Logo now shows on both desktop and mobile
    // Add language parameter to the URL
    const logoUrl = currentLang ? `${standalone_routes.deriv_app}?lang=${currentLang.toLowerCase()}` : standalone_routes.deriv_app;
    
    return <DerivLogo className='app-header__logo' href={logoUrl} variant='wallets' />;
};
