/**
 * Bot version configuration
 * This version is used to determine if localStorage and cookies need to be cleared
 */
export const BOT_VERSION_CONFIG = {
    REQUIRED_VERSION: 2,
    STORAGE_KEY: 'bot_version',
} as const;

export type TBotVersionConfig = typeof BOT_VERSION_CONFIG;
