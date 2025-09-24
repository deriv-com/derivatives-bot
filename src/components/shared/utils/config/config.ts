import brandConfig from '../../../../../brand.config.json';
import { isStaging } from '../url/helpers';

// Simple environment detection based on hostname
const getCurrentEnvironment = (): 'staging' | 'production' => {
    try {
        const hostname = window.location.hostname;
        if (hostname.includes('localhost') || hostname.includes('staging')) {
            return 'staging';
        }
        return 'production';
    } catch (error) {
        console.error('Error detecting environment:', error);
        return 'production'; // Safe fallback
    }
};

export const APP_IDS = {
    LOCALHOST: 36300,
    TMP_STAGING: 64584,
    STAGING: 29934,
    STAGING_BE: 29934,
    STAGING_ME: 29934,
    PRODUCTION: 65555,
    PRODUCTION_BE: 65556,
    PRODUCTION_ME: 65557,
};

export const livechat_license_id = 12049137;
export const livechat_client_id = '66aa088aad5a414484c1fd1fa8a5ace7';

export const domain_app_ids = {
    'master.bot-standalone.pages.dev': APP_IDS.TMP_STAGING,
    'staging-dbot.deriv.com': APP_IDS.STAGING,
    'staging-dbot.deriv.be': APP_IDS.STAGING_BE,
    'staging-dbot.deriv.me': APP_IDS.STAGING_ME,
    'dbot.deriv.com': APP_IDS.PRODUCTION,
    'dbot.deriv.be': APP_IDS.PRODUCTION_BE,
    'dbot.deriv.me': APP_IDS.PRODUCTION_ME,
};

export const getCurrentProductionDomain = () =>
    !/^staging\./.test(window.location.hostname) &&
    Object.keys(domain_app_ids).find(domain => window.location.hostname === domain);

export const isProduction = () => {
    const all_domains = Object.keys(domain_app_ids).map(domain => `(www\\.)?${domain.replace('.', '\\.')}`);
    return new RegExp(`^(${all_domains.join('|')})$`, 'i').test(window.location.hostname);
};

export const isTestLink = () => {
    return (
        window.location.origin?.includes('.binary.sx') ||
        window.location.origin?.includes('bot-65f.pages.dev') ||
        isLocal()
    );
};

export const isLocal = () => /localhost(:\d+)?$/i.test(window.location.hostname);

const getDefaultServerURL = () => {
    try {
        // Check for account_type in URL params first (this overrides everything)
        const urlParams = new URLSearchParams(window.location.search);
        const urlAccountType = urlParams.get('account_type');

        if (urlAccountType) {
            // Use realv2 for real accounts, demov2 for demo accounts
            return urlAccountType === 'demo' ? 'demov2.derivws.com' : 'realv2.derivws.com';
        }

        // Check localStorage for saved account type
        const savedAccountType = localStorage.getItem('account_type');
        if (savedAccountType) {
            return savedAccountType === 'demo' ? 'demov2.derivws.com' : 'realv2.derivws.com';
        }
    } catch (error) {
        console.error('Error in getDefaultServerURL:', error);
    }

    // Always default to demo server if no account_type is specified or if there's an error
    return 'demov2.derivws.com';
};

export const getDefaultAppIdAndUrl = () => {
    const server_url = getDefaultServerURL();

    if (isTestLink()) {
        return { app_id: APP_IDS.LOCALHOST, server_url };
    }

    const current_domain = getCurrentProductionDomain() ?? '';
    const app_id = domain_app_ids[current_domain as keyof typeof domain_app_ids] ?? APP_IDS.PRODUCTION;

    return { app_id, server_url };
};

export const getAppId = () => {
    let app_id = null;
    const config_app_id = window.localStorage.getItem('config.app_id');
    const current_domain = getCurrentProductionDomain() ?? '';

    if (config_app_id) {
        app_id = config_app_id;
    } else if (isStaging()) {
        app_id = APP_IDS.STAGING;
    } else if (isTestLink()) {
        app_id = APP_IDS.LOCALHOST;
    } else {
        app_id = domain_app_ids[current_domain as keyof typeof domain_app_ids] ?? APP_IDS.PRODUCTION;
    }

    return app_id;
};

export const getSocketURL = () => {
    const local_storage_server_url = window.localStorage.getItem('config.server_url');

    if (local_storage_server_url) {
        return local_storage_server_url;
    }

    const server_url = getDefaultServerURL();

    return server_url;
};

export const checkAndSetEndpointFromUrl = () => {
    if (isTestLink()) {
        const url_params = new URLSearchParams(location.search.slice(1));

        if (url_params.has('qa_server') && url_params.has('app_id')) {
            const qa_server = url_params.get('qa_server') || '';
            const app_id = url_params.get('app_id') || '';

            url_params.delete('qa_server');
            url_params.delete('app_id');

            if (/^(^(www\.)?qa[0-9]{1,4}\.deriv.dev|(.*)\.derivws\.com)$/.test(qa_server) && /^[0-9]+$/.test(app_id)) {
                localStorage.setItem('config.app_id', app_id);
                localStorage.setItem('config.server_url', qa_server.replace(/"/g, ''));
            }

            const params = url_params.toString();
            const hash = location.hash;

            location.href = `${location.protocol}//${location.hostname}${location.pathname}${
                params ? `?${params}` : ''
            }${hash || ''}`;

            return true;
        }
    }

    return false;
};

export const getDebugServiceWorker = () => {
    const debug_service_worker_flag = window.localStorage.getItem('debug_service_worker');
    if (debug_service_worker_flag) return !!parseInt(debug_service_worker_flag);

    return false;
};

export const generateOAuthURL = () => {
    try {
        // Use brand config for login URLs
        const environment = getCurrentEnvironment();
        const hostname = brandConfig?.brand_hostname?.[environment];

        if (hostname) {
            // Use the current host as redirect URL (no replacement needed)
            const currentHost = window.location.host; // includes port
            const redirectUrl = currentHost;

            return `https://${hostname}/login?redirect=${redirectUrl}`;
        }
    } catch (error) {
        console.error('Error accessing brand config:', error);
    }

    // Fallback to hardcoded URLs if brand config fails
    const currentHost = window.location.host; // includes port
    const redirectUrl = currentHost;

    if (currentHost.includes('staging')) {
        return `https://staging-home.deriv.com/dashboard/login?redirect=${redirectUrl}`;
    } else {
        return `https://home.deriv.com/dashboard/login?redirect=${redirectUrl}`;
    }
};

export const generateSignupURL = () => {
    try {
        // Use brand config for signup URLs
        const environment = getCurrentEnvironment();
        const hostname = brandConfig?.brand_hostname?.[environment];

        if (hostname) {
            return `https://${hostname}/signup`;
        }
    } catch (error) {
        console.error('Error accessing brand config:', error);
    }

    // Fallback to hardcoded URLs if brand config fails
    const currentHost = window.location.host; // includes port

    if (currentHost.includes('staging')) {
        return 'https://staging-home.deriv.com/dashboard/signup';
    } else {
        return 'https://home.deriv.com/dashboard/signup';
    }
};
