import { getTradeTypeFromCurrentUrl } from './url-trade-type-handler';

// Extend the Window interface to include Blockly types
declare global {
    interface Window {
        Blockly: {
            derivWorkspace?: any;
            Events: {
                BlockChange: new (block: any, element: string, name: string, oldValue: any, newValue: any) => any;
                fire: (event: any) => void;
                setGroup: (group: string) => void;
                getGroup: () => string;
            };
        };
    }
}

// Store URL trade type to apply after field options are populated
let pendingUrlTradeType: any = null;

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
export const setPendingUrlTradeType = () => {
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
        // Check if the category field exists and has options
        const categoryField = tradeTypeBlock.getField('TRADETYPECAT_LIST');
        if (!categoryField) {
            return false;
        }

        // Get category options with null check
        const categoryOptions = categoryField.getOptions();
        if (!categoryOptions || !Array.isArray(categoryOptions) || categoryOptions.length === 0) {
            return false;
        }

        // Check if the category option exists
        const categoryExists = categoryOptions.some((option: any) => {
            return option && option.length >= 2 && option[1] === pendingUrlTradeType.tradeTypeCategory;
        });

        if (!categoryExists) {
            return false;
        }

        // Set the category
        const currentCategory = categoryField.getValue();
        if (currentCategory !== pendingUrlTradeType.tradeTypeCategory) {
            categoryField.setValue(pendingUrlTradeType.tradeTypeCategory);

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
                    return;
                }

                const tradeTypeField = tradeTypeBlock.getField('TRADETYPE_LIST');
                if (!tradeTypeField) {
                    return;
                }

                // Get trade type options with null check
                const tradeTypeOptions = tradeTypeField.getOptions();

                if (!tradeTypeOptions || !Array.isArray(tradeTypeOptions) || tradeTypeOptions.length === 0) {
                    return;
                }

                // Check if the trade type option exists
                const tradeTypeExists = tradeTypeOptions.some((option: any) => {
                    return option && option.length >= 2 && option[1] === pendingUrlTradeType.tradeType;
                });

                if (!tradeTypeExists) {
                    return;
                }

                // Set the trade type
                const currentTradeType = tradeTypeField.getValue();

                if (currentTradeType !== pendingUrlTradeType.tradeType) {
                    tradeTypeField.setValue(pendingUrlTradeType.tradeType);

                    // Fire change event for trade type
                    const tradeTypeChangeEvent = new window.Blockly.Events.BlockChange(
                        tradeTypeBlock,
                        'field',
                        'TRADETYPE_LIST',
                        currentTradeType,
                        pendingUrlTradeType.tradeType
                    );
                    window.Blockly.Events.fire(tradeTypeChangeEvent);

                    // Force the block to re-render to show the visual changes
                    if (tradeTypeBlock && typeof tradeTypeBlock.forceRerender === 'function') {
                        tradeTypeBlock.forceRerender();
                    }

                    // Also try to force render the field specifically
                    if (tradeTypeField && typeof tradeTypeField.forceRerender === 'function') {
                        tradeTypeField.forceRerender();
                    }

                    // Try additional rendering methods
                    if (tradeTypeField.render) {
                        tradeTypeField.render();
                    }

                    if (tradeTypeBlock.render) {
                        tradeTypeBlock.render();
                    }
                }

                // Clear the pending trade type
                pendingUrlTradeType = null;
            } catch (error) {
                // Silent error handling
            }
        }, 150); // Slightly increased delay to allow field options to be populated

        return true;
    } catch (error) {
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

        // Get current values from the fields
        const categoryField = tradeTypeBlock.getField('TRADETYPECAT_LIST');
        const tradeTypeField = tradeTypeBlock.getField('TRADETYPE_LIST');

        if (!categoryField || !tradeTypeField) {
            return null;
        }

        const currentCategory = categoryField.getValue();
        const currentTradeType = tradeTypeField.getValue();

        if (!currentCategory || !currentTradeType) {
            return null;
        }

        return {
            tradeTypeCategory: currentCategory,
            tradeType: currentTradeType,
        };
    } catch (error) {
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
        const { resetUrlParamProcessing } = require('./trade-type-modal-handler');
        resetUrlParamProcessing();

        // Re-enable URL parameter application for future parameters
        enableUrlParameterApplication();
    } catch (error) {
        // Silent error handling
    }
};

/**
 * Sets up a listener for manual trade type changes to remove URL parameters
 * This should be called after the workspace is initialized
 */
export const setupTradeTypeChangeListener = (): void => {
    try {
        const workspace = window.Blockly?.derivWorkspace;
        if (!workspace) {
            return;
        }

        // Listen for field change events
        workspace.addChangeListener((event: any) => {
            // Check if this is a field change event for trade type fields
            if (
                event.type === 'change' &&
                event.element === 'field' &&
                (event.name === 'TRADETYPECAT_LIST' || event.name === 'TRADETYPE_LIST')
            ) {
                // Check if there's a trade_type parameter in the URL
                const urlParams = new URLSearchParams(window.location.search);
                const tradeTypeParam = urlParams.get('trade_type');

                if (tradeTypeParam) {
                    removeTradeTypeFromUrl();
                }
            }
        });
    } catch (error) {
        // Silent error handling
    }
};
