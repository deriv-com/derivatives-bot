import { standalone_routes } from '@/components/shared';
import { DerivLogo } from '@deriv-com/ui';
import './app-logo.scss';

export const AppLogo = () => {
    // Always go to the new home dashboard, regardless of login state
    // Logo now shows on both desktop and mobile
    return <DerivLogo className='app-header__logo' href={standalone_routes.deriv_app} variant='wallets' />;
};
