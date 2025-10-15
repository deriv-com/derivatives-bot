import { getCurrentTradeTypeFromWorkspace } from './blockly-url-param-handler';
import { getTradeTypeFromCurrentUrl } from './url-trade-type-handler';

// Import types from blockly-url-param-handler to avoid conflicts
type BlocklyBlock = {
    type: string;
    getFieldValue: (fieldName: string) => string;
    setFieldValue: (value: string, fieldName: string) => void;
    getChildByType: (type: string) => BlocklyBlock | null;
};

// Modal state management
interface TradeTypeData {
    displayName: string;
    tradeTypeCategory: string;
    tradeType: string;
    isValid: boolean;
    urlParam?: string;
    currentTradeType?: { tradeTypeCategory: string; tradeType: string } | null;
    currentTradeTypeDisplayName?: string;
}

interface TradeTypeModalState {
    isVisible: boolean;
    tradeTypeData: TradeTypeData | null;
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
 * Updates the current trade type data in the modal if it's currently visible
 */
export const updateModalTradeTypeData = () => {
    if (!modalState.isVisible || !modalState.tradeTypeData) {
        return;
    }

    // Get fresh current trade type from workspace
    const currentTradeType = getCurrentTradeTypeFromWorkspace();

    if (currentTradeType) {
        const currentTradeTypeDisplayName = getInternalTradeTypeDisplayName(
            currentTradeType.tradeTypeCategory,
            currentTradeType.tradeType
        );

        // Update the modal data with the fresh current trade type
        const updatedTradeTypeData = {
            ...modalState.tradeTypeData,
            currentTradeType: currentTradeType,
            currentTradeTypeDisplayName: currentTradeTypeDisplayName,
        };

        updateModalState({
            tradeTypeData: updatedTradeTypeData,
        });
    }
};

/**
 * Shows the trade type confirmation modal
 */
export const showTradeTypeConfirmationModal = (
    tradeTypeData: TradeTypeData,
    onConfirm: () => void,
    onCancel: () => void
) => {
    // Function to show modal with current workspace data
    const showModalWithCurrentData = () => {
        const currentTradeType = getCurrentTradeTypeFromWorkspace();

        const finalTradeTypeData = currentTradeType
            ? {
                  ...tradeTypeData,
                  currentTradeType: currentTradeType,
                  currentTradeTypeDisplayName: getInternalTradeTypeDisplayName(
                      currentTradeType.tradeTypeCategory,
                      currentTradeType.tradeType
                  ),
              }
            : tradeTypeData;

        updateModalState({
            isVisible: true,
            tradeTypeData: finalTradeTypeData,
            onConfirm,
            onCancel,
        });
    };

    // Try to get current trade type immediately
    const currentTradeType = getCurrentTradeTypeFromWorkspace();

    if (currentTradeType) {
        // If we have the data immediately, show modal
        showModalWithCurrentData();
    } else {
        // If we don't have the data yet, poll until we do or timeout
        let attempts = 0;
        const maxAttempts = 20; // 2 seconds max wait

        const pollForData = () => {
            const currentTradeType = getCurrentTradeTypeFromWorkspace();

            if (currentTradeType || attempts >= maxAttempts) {
                showModalWithCurrentData();
            } else {
                attempts++;
                setTimeout(pollForData, 100);
            }
        };

        pollForData();
    }
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
    // Apply the trade type changes directly to the Blockly workspace
    if (modalState.tradeTypeData) {
        const { tradeTypeCategory, tradeType } = modalState.tradeTypeData;

        // Apply the changes to the workspace
        const success = applyTradeTypeDropdownChanges(tradeTypeCategory, tradeType);

        if (success) {
            console.log(`Successfully applied trade type: ${tradeTypeCategory}/${tradeType}`);
        } else {
            console.warn(`Failed to apply trade type: ${tradeTypeCategory}/${tradeType}`);
        }
    }

    // Remove the URL parameter after applying changes
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('trade_type')) {
        const url = new URL(window.location.href);
        url.searchParams.delete('trade_type');
        window.history.replaceState({}, '', url.toString());
    }

    // Call the original onConfirm callback if it exists
    if (modalState.onConfirm) {
        modalState.onConfirm();
    }

    hideTradeTypeConfirmationModal();
};

/**
 * Handles the user canceling the trade type change
 */
export const handleTradeTypeCancel = () => {
    // Remove the URL parameter when user cancels
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('trade_type')) {
        const url = new URL(window.location.href);
        url.searchParams.delete('trade_type');
        window.history.replaceState({}, '', url.toString());
    }

    // Call the original onCancel callback if it exists
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

        // New mappings from external application identifiers matching your specifications
        match_diff: 'Matches/Differs',
        even_odd: 'Even/Odd',
        over_under: 'Over/Under',
        rise_fall: 'Rise/Fall',
        high_low: 'Higher/Lower', // This is for Higher/Lower (updown category)
        high_tick: 'High Tick/Low Tick', // This is for High Tick/Low Tick (separate from high_low)
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
/**
 * Gets the dropdown mapping for a URL trade type parameter
 * @returns Object with trade type category and type, or null if invalid
 * @example
 * const mapping = getDropdownMappingForUrlTradeType();
 * // Returns: { tradeTypeCategory: 'multiplier', tradeType: 'multiplier' }
 */
export const getDropdownMappingForUrlTradeType = (): { tradeTypeCategory: string; tradeType: string } | null => {
    const tradeTypeFromUrl = getTradeTypeFromCurrentUrl();

    if (!tradeTypeFromUrl || !tradeTypeFromUrl.isValid) {
        return null;
    }

    return {
        tradeTypeCategory: tradeTypeFromUrl.tradeTypeCategory,
        tradeType: tradeTypeFromUrl.tradeType,
    };
};

/**
 * Applies trade type dropdown changes to the Blockly workspace
 * @param tradeTypeCategory - The trade type category (e.g., 'multiplier', 'digits')
 * @param tradeType - The specific trade type (e.g., 'multiplier', 'matchesdiffers')
 * @returns boolean indicating success or failure
 * @example
 * const success = applyTradeTypeDropdownChanges('multiplier', 'multiplier');
 * // Updates Blockly workspace to show "Multipliers" in dropdown
 */
export const applyTradeTypeDropdownChanges = (tradeTypeCategory: string, tradeType: string): boolean => {
    try {
        const workspace = window.Blockly?.derivWorkspace;
        if (!workspace) {
            return false;
        }

        // Find the trade definition block
        const tradeDefinitionBlocks = workspace
            .getAllBlocks()
            .filter((block: BlocklyBlock) => block.type === 'trade_definition');

        if (tradeDefinitionBlocks.length === 0) {
            return false;
        }

        // Get the first trade definition block
        const tradeDefinitionBlock = tradeDefinitionBlocks[0];

        // Find the trade type block within the trade definition
        const tradeTypeBlock = tradeDefinitionBlock.getChildByType('trade_definition_tradetype');

        if (!tradeTypeBlock) {
            return false;
        }

        // Disable events temporarily to prevent interference
        const originalGroup = window.Blockly.Events.getGroup();
        window.Blockly.Events.setGroup('TRADE_TYPE_MODAL_UPDATE');

        // Get current values
        const currentCategory = tradeTypeBlock.getFieldValue('TRADETYPECAT_LIST');

        // Set the category if it's different
        if (currentCategory !== tradeTypeCategory) {
            tradeTypeBlock.setFieldValue(tradeTypeCategory, 'TRADETYPECAT_LIST');

            // Fire change event for category to trigger trade type options update
            const categoryChangeEvent = new window.Blockly.Events.BlockChange(
                tradeTypeBlock,
                'field',
                'TRADETYPECAT_LIST',
                currentCategory,
                tradeTypeCategory
            );
            window.Blockly.Events.fire(categoryChangeEvent);
        }

        try {
            // Get current trade type value (might have changed after category update)
            const updatedCurrentTradeType = tradeTypeBlock.getFieldValue('TRADETYPE_LIST');

            // Set the trade type if it's different
            if (updatedCurrentTradeType !== tradeType) {
                tradeTypeBlock.setFieldValue(tradeType, 'TRADETYPE_LIST');

                // Fire change event for trade type
                const tradeTypeChangeEvent = new window.Blockly.Events.BlockChange(
                    tradeTypeBlock,
                    'field',
                    'TRADETYPE_LIST',
                    updatedCurrentTradeType,
                    tradeType
                );
                window.Blockly.Events.fire(tradeTypeChangeEvent);

                // Force workspace to re-render
                if (workspace) {
                    workspace.render();
                }
            }

            // Restore original event group
            window.Blockly.Events.setGroup(originalGroup);
        } catch (error) {
            console.warn('Failed to apply trade type changes to Blockly workspace:', error);
            // Restore original event group on error
            window.Blockly.Events.setGroup(originalGroup);
        }

        return true;
    } catch (error) {
        console.warn('Failed to apply trade type dropdown changes:', error);
        return false;
    }
};
// Track if we've already processed a URL parameter in this session
// Note: This could be moved to React state or context for better state management
let hasProcessedUrlParam = false;

/**
 * Resets the URL parameter processing flag (useful for testing or when URL changes)
 */
export const resetUrlParamProcessing = () => {
    hasProcessedUrlParam = false;
};

/**
 * Gets the current URL parameter processing state (for testing)
 */
export const getUrlParamProcessingState = () => {
    return hasProcessedUrlParam;
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
        : 'N/A';

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
            // Modal component now handles the Blockly changes and URL parameter removal
            onConfirm();
        },
        () => {
            // Mark as processed when user cancels
            hasProcessedUrlParam = true;
            // Modal component now handles the URL parameter removal
            onCancel();
        }
    );

    return true;
};
