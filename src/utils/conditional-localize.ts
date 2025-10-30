import { localize } from '@deriv-com/translations';

// Terms that should NEVER be translated in any language
const UNTRANSLATABLE_TERMS = new Set([
    'Accumulators',
    'Reverse Martingale',
    'Martingale',
    "D'Alembert",
    "Oscar's Grind",
    "Reverse D'Alembert",
    '1-3-2-6',
    'Martingale on Stat Reset',
    'Reverse Martingale on Stat Reset',
    "D'Alembert on Stat Reset",
    "Reverse D'Alembert on Stat Reset",
    // Trade type names that should remain in English
    'Up',
    'Down',
    'Call',
    'Put',
    'Rise',
    'Fall',
    'Higher',
    'Lower',
    'Touch',
    'No Touch',
    'Matches',
    'Differs',
    'Even',
    'Odd',
    'Over',
    'Under',
    'Asian Up',
    'Asian Down',
    'Spread Up',
    'Spread Down',
    'Ends Outside',
    'Ends Between',
    'Close-to-Low',
    'High-to-Close',
    'High-to-Low',
    'Stays Between',
    'Goes Outside',
    'Reset Call',
    'Reset Put',
    'Only Ups',
    'Only Downs',
    'High Tick',
    'Low Tick',
]);

/**
 * Conditionally localizes text based on untranslatable terms rules
 * @param text - The text to potentially translate
 * @returns Either the original text (if untranslatable) or localized version
 */
export const conditionalLocalize = (text: string): string => {
    // Check if this term should remain untranslated
    if (UNTRANSLATABLE_TERMS.has(text)) {
        return text; // Return original English text without translation
    }

    // Otherwise, use normal localization
    return localize(text);
};

/**
 * Helper function specifically for "Accumulators" term
 * Always returns "Accumulators" without translation
 */
export const localizeAccumulators = (): string => {
    return 'Accumulators';
};

/**
 * Helper function specifically for "Reverse Martingale" term
 * Always returns "Reverse Martingale" without translation
 */
export const localizeReverseMartingale = (): string => {
    return 'Reverse Martingale';
};

/**
 * Helper function specifically for "Martingale" term
 * Always returns "Martingale" without translation
 */
export const localizeMartingale = (): string => {
    return 'Martingale';
};

/**
 * Helper function specifically for "D'Alembert" term
 * Always returns "D'Alembert" without translation
 */
export const localizeDAlembert = (): string => {
    return "D'Alembert";
};

/**
 * Helper function specifically for "Oscar's Grind" term
 * Always returns "Oscar's Grind" without translation
 */
export const localizeOscarsGrind = (): string => {
    return "Oscar's Grind";
};

/**
 * Helper function specifically for "Reverse D'Alembert" term
 * Always returns "Reverse D'Alembert" without translation
 */
export const localizeReverseDAlembert = (): string => {
    return "Reverse D'Alembert";
};

/**
 * Helper function specifically for "1-3-2-6" term
 * Always returns "1-3-2-6" without translation
 */
export const localize1326 = (): string => {
    return '1-3-2-6';
};

/**
 * Helper function specifically for "Martingale on Stat Reset" term
 * Always returns "Martingale on Stat Reset" without translation
 */
export const localizeMartingaleOnStatReset = (): string => {
    return 'Martingale on Stat Reset';
};

/**
 * Helper function specifically for "D'Alembert on Stat Reset" term
 * Always returns "D'Alembert on Stat Reset" without translation
 */
export const localizeDAlembergOnStatReset = (): string => {
    return "D'Alembert on Stat Reset";
};

/**
 * Helper function specifically for "Reverse D'Alembert on Stat Reset" term
 * Always returns "Reverse D'Alembert on Stat Reset" without translation
 */
export const localizeReverseDAlembergOnStatReset = (): string => {
    return "Reverse D'Alembert on Stat Reset";
};

/**
 * Helper function specifically for "Reverse Martingale on Stat Reset" term
 * Always returns "Reverse Martingale on Stat Reset" without translation
 */
export const localizeReverseMartingaleOnStatReset = (): string => {
    return 'Reverse Martingale on Stat Reset';
};
