import { getDerivDomain } from '@/components/shared/utils/routes/routes';
import { DerivLogo } from '@deriv-com/ui';
import './app-logo.scss';

export const AppLogo = () => {
    // Always go to the new home dashboard, regardless of login state
    // Logo now shows on both desktop and mobile
    const homeUrl = `${getDerivDomain('derivHome')}/dashboard/`;
    return <DerivLogo className='app-header__logo' href={homeUrl} variant='wallets' />;
};
