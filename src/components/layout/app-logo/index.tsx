import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { standalone_routes } from '@/components/shared';
import { useFirebaseCountriesConfig } from '@/hooks/firebase/useFirebaseCountriesConfig';
import { useStore } from '@/hooks/useStore';
import { handleTraderHubRedirect } from '@/utils/traders-hub-redirect';
import { DerivLogo, useDevice } from '@deriv-com/ui';
import './app-logo.scss';

export const AppLogo = observer(() => {
    const { isDesktop } = useDevice();
    const store = useStore();
    const { hubEnabledCountryList } = useFirebaseCountriesConfig();

    const [redirect_url_str, setRedirectUrlStr] = useState<null | string>(null);

    useEffect(() => {
        if (store?.client?.is_logged_in) {
            const redirectParams = {
                product_type: 'tradershub' as const,
                has_wallet: false,
                is_virtual: store?.client?.is_virtual,
                residence: store?.client?.residence,
                hubEnabledCountryList,
            };
            setRedirectUrlStr(handleTraderHubRedirect(redirectParams));
        }
    }, [store?.client?.is_virtual, store?.client?.residence, hubEnabledCountryList, store?.client?.is_logged_in]);

    if (!isDesktop) return null;

    // For logged out users, keep the original Deriv.com link
    if (!store?.client?.is_logged_in) {
        return (
            <DerivLogo
                className='app-header__logo'
                href={standalone_routes.deriv_com}
                target='_blank'
                variant='wallets'
            />
        );
    }

    // For logged in users, use the same logic as TradershubLink
    const client = store.client ?? {};
    const getCurrency = client.getCurrency;
    const currency = getCurrency?.();

    // Check if the account is a demo account
    const urlParams = new URLSearchParams(window.location.search);
    const account_param = urlParams.get('account');
    const is_virtual = client.is_virtual || account_param === 'demo' || false;

    // Use the handleTraderHubRedirect function with the is_virtual flag
    let href = redirect_url_str;
    if (redirect_url_str) {
        // If we have a redirect_url_str, we still need to add the account parameter
        try {
            const redirect_url = new URL(redirect_url_str);
            if (is_virtual) {
                // For demo accounts, set the account parameter to 'demo'
                redirect_url.searchParams.set('account', 'demo');
            } else if (currency) {
                // For real accounts, set the account parameter to the currency
                redirect_url.searchParams.set('account', currency);
            }
            href = redirect_url.toString();
        } catch (error) {
            console.error('Error parsing redirect URL:', error);
        }
    }

    return <DerivLogo className='app-header__logo' href={href ?? standalone_routes.traders_hub} variant='wallets' />;
});
