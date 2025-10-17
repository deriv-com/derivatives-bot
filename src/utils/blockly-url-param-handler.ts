import { getModalState, resetUrlParamProcessing } from './trade-type-modal-handler';
import { getTradeTypeFromCurrentUrl } from './url-trade-type-handler';

// Named constants for timeouts
const FIELD_POPULATION_DELAY = 500;

// Store URL trade type to apply after field options are populated
let pendingUrlTradeType: { tradeTypeCategory: string; tradeType: string; isValid: boolean } | null = null;

// Flag to prevent automatic URL parameter application
let preventAutoUrlApplication = false;

/**
 * Enables automatic URL parameter application (called after user confirms)
 */
export const enableUrlParameterApplication = () => {
    preventAutoUrlApplication = false;
};

/**
 * Disables automatic URL parameter application (prevents auto-changes)
 */
export const disableUrlParameterApplication = () => {
    preventAutoUrlApplication = true;
};

/**
 * Sets the pending URL trade type to be applied when field options are available
 */
export const setTradeTypeFromUrl = () => {
    try {
        const tradeTypeFromUrl = getTradeTypeFromCurrentUrl();

        // Enhanced validation
        if (!tradeTypeFromUrl) {
            return false;
        }

        if (!tradeTypeFromUrl.isValid) {
            return false;
        }

        // Validate required properties
        if (!tradeTypeFromUrl.tradeTypeCategory || !tradeTypeFromUrl.tradeType) {
            return false;
        }

        pendingUrlTradeType = tradeTypeFromUrl;
        return true;
    } catch (error) {
        pendingUrlTradeType = null;
        return false;
    }
};

/**
 * Applies the pending URL trade type if available and field options are populated
 * This should be called from the field update callbacks in DBot
 */
export const applyPendingUrlTradeType = (tradeTypeBlock: any): boolean => {
    // Check if automatic URL application is disabled
    if (preventAutoUrlApplication) {
        return false;
    }

    // Enhanced validation checks
    if (!pendingUrlTradeType) {
        return false;
    }

    if (!tradeTypeBlock) {
        return false;
    }

    // Validate pendingUrlTradeType structure
    if (!pendingUrlTradeType.tradeTypeCategory || !pendingUrlTradeType.tradeType) {
        pendingUrlTradeType = null; // Clear invalid data
        return false;
    }
    try {
        // Disable events temporarily to prevent interference
        const originalGroup = window.Blockly.Events.getGroup();
        window.Blockly.Events.setGroup('URL_PARAM_UPDATE');

        // Get current category value
        const currentCategory = tradeTypeBlock.getFieldValue('TRADETYPECAT_LIST');

        // Set the category if it's different
        if (currentCategory !== pendingUrlTradeType.tradeTypeCategory) {
            tradeTypeBlock.setFieldValue(pendingUrlTradeType.tradeTypeCategory, 'TRADETYPECAT_LIST');

            // Fire change event for category to trigger trade type options update
            const categoryChangeEvent = new window.Blockly.Events.BlockChange(
                tradeTypeBlock,
                'field',
                'TRADETYPECAT_LIST',
                currentCategory,
                pendingUrlTradeType.tradeTypeCategory
            );
            window.Blockly.Events.fire(categoryChangeEvent);
        }

        // Set a timeout to apply the trade type after the category change has populated the trade type options
        setTimeout(() => {
            try {
                // Re-check if pendingUrlTradeType is still valid (might have been cleared)
                if (!pendingUrlTradeType) {
                    window.Blockly.Events.setGroup(originalGroup);
                    return;
                }

                // Get current trade type value
                const currentTradeType = tradeTypeBlock.getFieldValue('TRADETYPE_LIST');

                // Set the trade type if it's different
                if (currentTradeType !== pendingUrlTradeType.tradeType) {
                    tradeTypeBlock.setFieldValue(pendingUrlTradeType.tradeType, 'TRADETYPE_LIST');

                    // Fire change event for trade type
                    const tradeTypeChangeEvent = new window.Blockly.Events.BlockChange(
                        tradeTypeBlock,
                        'field',
                        'TRADETYPE_LIST',
                        currentTradeType,
                        pendingUrlTradeType.tradeType
                    );
                    window.Blockly.Events.fire(tradeTypeChangeEvent);

                    // Force workspace to re-render
                    const workspace = window.Blockly?.derivWorkspace;
                    if (workspace) {
                        workspace.render();
                    }
                }

                // Clear the pending trade type
                pendingUrlTradeType = null;

                // Restore original event group
                window.Blockly.Events.setGroup(originalGroup);
            } catch (error) {
                console.warn('Failed to apply trade type changes to Blockly workspace:', error);
                // Restore original event group on error
                window.Blockly.Events.setGroup(originalGroup);
            }
        }, FIELD_POPULATION_DELAY); // Delay to ensure field options are fully populated

        return true;
    } catch (error) {
        console.warn('Failed to apply pending URL trade type:', error);
        // Clear the pending trade type on error to prevent infinite retries
        pendingUrlTradeType = null;
        return false;
    }
};

/**
 * Updates the trade type blocks in the Blockly workspace based on URL parameters
 * This function should be called after the workspace is initialized and blocks are loaded
 */
export const updateTradeTypeFromUrlParams = (): boolean => {
    try {
        const workspace = window.Blockly?.derivWorkspace;
        if (!workspace) {
            return false;
        }

        // Find the trade definition block
        const tradeDefinitionBlocks = workspace
            .getAllBlocks()
            .filter((block: any) => block.type === 'trade_definition');

        if (tradeDefinitionBlocks.length === 0) {
            return false;
        }

        // Get the first trade definition block (there should only be one)
        const tradeDefinitionBlock = tradeDefinitionBlocks[0];

        // Find the trade type block within the trade definition
        const tradeTypeBlock = tradeDefinitionBlock.getChildByType('trade_definition_tradetype');

        if (!tradeTypeBlock) {
            return false;
        }

        // Try to apply pending URL trade type if available
        return applyPendingUrlTradeType(tradeTypeBlock);
    } catch (error) {
        console.warn('Failed to update trade type from URL params:', error);
        return false;
    }
};

/**
 * Checks if URL parameters should override the current trade type
 * This can be used to determine if we should apply URL parameters over saved workspace data
 */
export const shouldApplyUrlTradeType = (): boolean => {
    const tradeTypeFromUrl = getTradeTypeFromCurrentUrl();
    return Boolean(tradeTypeFromUrl && tradeTypeFromUrl.isValid);
};

/**
 * Gets the trade type information from URL for logging/debugging purposes
 */
export const getUrlTradeTypeInfo = () => {
    return getTradeTypeFromCurrentUrl();
};

/**
 * Gets the current trade type from the Blockly workspace
 * @returns Object with current trade type category and trade type, or null if not found
 */
export const getCurrentTradeTypeFromWorkspace = (): { tradeTypeCategory: string; tradeType: string } | null => {
    try {
        const workspace = window.Blockly?.derivWorkspace;
        if (!workspace) {
            return null;
        }

        // Find the trade definition block
        const tradeDefinitionBlocks = workspace
            .getAllBlocks()
            .filter((block: any) => block.type === 'trade_definition');

        if (tradeDefinitionBlocks.length === 0) {
            return null;
        }

        // Get the first trade definition block
        const tradeDefinitionBlock = tradeDefinitionBlocks[0];

        // Find the trade type block within the trade definition
        const tradeTypeBlock = tradeDefinitionBlock.getChildByType('trade_definition_tradetype');

        if (!tradeTypeBlock) {
            return null;
        }

        // Get current values from the fields using the correct Blockly API
        const currentCategory = tradeTypeBlock.getFieldValue('TRADETYPECAT_LIST');
        const currentTradeType = tradeTypeBlock.getFieldValue('TRADETYPE_LIST');

        // Validate field values
        if (
            typeof currentCategory !== 'string' ||
            typeof currentTradeType !== 'string' ||
            currentCategory.trim() === '' ||
            currentTradeType.trim() === ''
        ) {
            return null;
        }

        return {
            tradeTypeCategory: currentCategory.trim(),
            tradeType: currentTradeType.trim(),
        };
    } catch (error) {
        console.warn('Failed to get current trade type from workspace:', error);
        return null;
    }
};

/**
 * Removes the trade_type parameter from the current URL
 */
export const removeTradeTypeFromUrl = (): void => {
    try {
        const url = new URL(window.location.href);
        url.searchParams.delete('trade_type');

        // Update the URL without reloading the page
        window.history.replaceState({}, '', url.toString());

        // Reset URL parameter processing flag when URL parameter is removed
        resetUrlParamProcessing();

        // Re-enable URL parameter application for future parameters
        enableUrlParameterApplication();
    } catch (error) {
        console.warn('Failed to remove trade type from URL:', error);
    }
};

// Store the listener function reference for cleanup
let tradeTypeChangeListener: ((event: any) => void) | null = null;

/**
 * Sets up a listener for manual trade type changes to remove URL parameters
 * This should be called after the workspace is initialized
 * @returns cleanup function to remove the listener
 */
export const setupTradeTypeChangeListener = (): (() => void) | null => {
    try {
        const workspace = window.Blockly?.derivWorkspace;
        if (!workspace) {
            return null;
        }

        // Remove existing listener if any
        if (tradeTypeChangeListener) {
            workspace.removeChangeListener(tradeTypeChangeListener);
        }

        // Create new listener function
        tradeTypeChangeListener = (event: any) => {
            // Check if this is a field change event for trade type fields
            if (
                event.type === 'change' &&
                event.element === 'field' &&
                (event.name === 'TRADETYPECAT_LIST' || event.name === 'TRADETYPE_LIST')
            ) {
                // Check if there's a trade_type parameter in the URL
                const urlParams = new URLSearchParams(window.location.search);
                const tradeTypeParam = urlParams.get('trade_type');

                // Only remove URL parameter if it exists AND the modal is not currently open
                // (i.e., it's a genuine manual user change, not when modal is pending)
                const modalState = getModalState();
                if (tradeTypeParam && !modalState.isVisible) return;
            }
        };

        // Add the listener
        workspace.addChangeListener(tradeTypeChangeListener);

        // Return cleanup function
        return () => {
            if (workspace && tradeTypeChangeListener) {
                workspace.removeChangeListener(tradeTypeChangeListener);
                tradeTypeChangeListener = null;
            }
        };
    } catch (error) {
        console.warn('Failed to setup trade type change listener:', error);
        return null;
    }
};

/**
 * Removes the trade type change listener (cleanup function)
 */
export const cleanupTradeTypeChangeListener = (): void => {
    try {
        const workspace = window.Blockly?.derivWorkspace;
        if (workspace && tradeTypeChangeListener) {
            workspace.removeChangeListener(tradeTypeChangeListener);
            tradeTypeChangeListener = null;
        }
    } catch (error) {
        console.warn('Failed to cleanup trade type change listener:', error);
    }
};
