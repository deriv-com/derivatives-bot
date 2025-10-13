import { getCurrentTradeTypeFromWorkspace } from './blockly-url-param-handler';
import { getTradeTypeFromCurrentUrl } from './url-trade-type-handler';

// Modal state management
interface TradeTypeModalState {
    isVisible: boolean;
    tradeTypeData: any;
    onConfirm: (() => void) | null;
    onCancel: (() => void) | null;
}

let modalState: TradeTypeModalState = {
    isVisible: false,
    tradeTypeData: null,
    onConfirm: null,
    onCancel: null,
};

// Callback to notify when modal state changes
let modalStateChangeCallback: ((state: TradeTypeModalState) => void) | null = null;

/**
 * Sets the callback function to be called when modal state changes
 */
export const setModalStateChangeCallback = (callback: (state: TradeTypeModalState) => void) => {
    modalStateChangeCallback = callback;
};

/**
 * Gets the current modal state
 */
export const getModalState = (): TradeTypeModalState => {
    return { ...modalState };
};

/**
 * Updates the modal state and notifies listeners
 */
const updateModalState = (newState: Partial<TradeTypeModalState>) => {
    modalState = { ...modalState, ...newState };
    if (modalStateChangeCallback) {
        modalStateChangeCallback(modalState);
    }
};

/**
 * Shows the trade type confirmation modal
 */
export const showTradeTypeConfirmationModal = (tradeTypeData: any, onConfirm: () => void, onCancel: () => void) => {
    updateModalState({
        isVisible: true,
        tradeTypeData,
        onConfirm,
        onCancel,
    });
};

/**
 * Hides the trade type confirmation modal
 */
export const hideTradeTypeConfirmationModal = () => {
    updateModalState({
        isVisible: false,
        tradeTypeData: null,
        onConfirm: null,
        onCancel: null,
    });
};

/**
 * Handles the user confirming the trade type change
 */
export const handleTradeTypeConfirm = () => {
    if (modalState.onConfirm) {
        modalState.onConfirm();
    }
    hideTradeTypeConfirmationModal();
};

/**
 * Handles the user canceling the trade type change
 */
export const handleTradeTypeCancel = () => {
    if (modalState.onCancel) {
        modalState.onCancel();
    }
    hideTradeTypeConfirmationModal();
};

/**
 * Gets display name for trade type from URL parameter
 */
export const getTradeTypeDisplayName = (urlParam: string): string => {
    const displayNames: Record<string, string> = {
        // Original mappings
        rise_fall: 'Rise/Fall',
        rise_equals_fall_equals: 'Rise Equals/Fall Equals',
        higher_lower: 'Higher/Lower',
        touch_no_touch: 'Touch/No Touch',
        in_out: 'In/Out',
        digits: 'Digits',
        multiplier: 'Multiplier',
        accumulator: 'Accumulator',
        asian: 'Asian',
        reset: 'Reset',
        high_low_ticks: 'High/Low Ticks',
        only_ups_downs: 'Only Ups/Downs',

        // New mappings from external application identifiers
        match_diff: 'Matches/Differs',
        even_odd: 'Even/Odd',
        over_under: 'Over/Under',
        high_low: 'Higher/Lower',
        accumulators: 'Accumulators',
        only_up_only_down: 'Only Ups/Only Downs',
        touch: 'Touch/No Touch',
        multipliers: 'Multipliers',
    };

    return displayNames[urlParam] || urlParam;
};

/**
 * Gets display name for internal trade type values
 */
export const getInternalTradeTypeDisplayName = (tradeTypeCategory: string, tradeType: string): string => {
    // Map internal trade type combinations to user-friendly names
    const tradeTypeDisplayNames: Record<string, Record<string, string>> = {
        callput: {
            callput: 'Rise/Fall',
            callputequal: 'Rise Equals/Fall Equals',
            higherlower: 'Higher/Lower',
        },
        touchnotouch: {
            touchnotouch: 'Touch/No Touch',
        },
        inout: {
            endsinout: 'Ends In/Out',
            staysinout: 'Stays In/Out',
        },
        digits: {
            matchesdiffers: 'Matches/Differs',
            evenodd: 'Even/Odd',
            overunder: 'Over/Under',
        },
        multiplier: {
            multiplier: 'Multiplier',
        },
        accumulator: {
            accumulator: 'Accumulator',
        },
        asian: {
            asians: 'Asian Up/Down',
        },
        reset: {
            reset: 'Reset Call/Put',
        },
        highlowticks: {
            highlowticks: 'High/Low Ticks',
        },
        runs: {
            runs: 'Only Ups/Downs',
        },
    };

    return tradeTypeDisplayNames[tradeTypeCategory]?.[tradeType] || `${tradeTypeCategory}/${tradeType}`;
};

// Track if we've already processed a URL parameter in this session
let hasProcessedUrlParam = false;

/**
 * Resets the URL parameter processing flag (useful for testing or when URL changes)
 */
export const resetUrlParamProcessing = () => {
    hasProcessedUrlParam = false;
};

/**
 * Checks if there's a valid URL trade type parameter and shows modal if needed
 * Enhanced logic: only shows modal when URL and current trade types differ
 */
export const checkAndShowTradeTypeModal = (onConfirm: () => void, onCancel: () => void) => {
    // 1. Check if there's a valid URL trade type parameter
    const tradeTypeFromUrl = getTradeTypeFromCurrentUrl();

    if (!tradeTypeFromUrl || !tradeTypeFromUrl.isValid) {
        return false;
    }

    // 2. Get the URL parameter to show user-friendly name
    const urlParams = new URLSearchParams(window.location.search);
    const tradeTypeParam = urlParams.get('trade_type');

    if (!tradeTypeParam) {
        return false;
    }

    // 3. Check if we've already processed this URL parameter in this session
    if (hasProcessedUrlParam) {
        return false;
    }

    // 4. Get current trade type from workspace
    const currentTradeType = getCurrentTradeTypeFromWorkspace();

    if (!currentTradeType) {
        // If we can't get current trade type, show modal to be safe
    } else {
        // 5. Compare URL trade type with current trade type
        const isSameCategory = currentTradeType.tradeTypeCategory === tradeTypeFromUrl.tradeTypeCategory;
        const isSameTradeType = currentTradeType.tradeType === tradeTypeFromUrl.tradeType;

        if (isSameCategory && isSameTradeType) {
            // Mark as processed even though we're not showing modal
            hasProcessedUrlParam = true;
            return false;
        }
    }

    // 6. Show modal since trade types differ or we couldn't determine current trade type
    const displayName = getTradeTypeDisplayName(tradeTypeParam);

    // Get current trade type display name for the modal
    const currentTradeTypeDisplayName = currentTradeType
        ? getInternalTradeTypeDisplayName(currentTradeType.tradeTypeCategory, currentTradeType.tradeType)
        : 'Current Trade Type';

    showTradeTypeConfirmationModal(
        {
            ...tradeTypeFromUrl,
            displayName,
            urlParam: tradeTypeParam,
            currentTradeType: currentTradeType,
            currentTradeTypeDisplayName: currentTradeTypeDisplayName,
        },
        () => {
            // Mark as processed when user confirms
            hasProcessedUrlParam = true;
            onConfirm();
        },
        () => {
            // Mark as processed when user cancels
            hasProcessedUrlParam = true;
            onCancel();
        }
    );

    return true;
};
