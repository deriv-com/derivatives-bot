export type TBlocklyEvents = {
    type: string;
    element: string;
    group: string;
    oldValue: string;
    blockId: string;
};

// Define Blockly types for consistent usage across the application
export interface BlocklyBlock {
    type: string;
    getFieldValue: (fieldName: string) => string;
    setFieldValue: (value: string, fieldName: string) => void;
    getChildByType: (type: string) => BlocklyBlock | null;
}

export interface BlocklyWorkspace {
    getAllBlocks: () => BlocklyBlock[];
    addChangeListener: (listener: (event: BlocklyEvent) => void) => void;
    removeChangeListener: (listener: (event: BlocklyEvent) => void) => void;
    render: () => void;
}

export interface BlocklyEvent {
    type: string;
    element?: string;
    name?: string;
    oldValue?: string;
    newValue?: string;
}

export interface BlocklyEvents {
    BlockChange: new (
        block: BlocklyBlock,
        element: string,
        name: string,
        oldValue: string,
        newValue: string
    ) => BlocklyEvent;
    fire: (event: BlocklyEvent) => void;
    setGroup: (group: string) => void;
    getGroup: () => string;
}

// Extend the Window interface to include Blockly types
declare global {
    interface Window {
        Blockly: {
            derivWorkspace?: BlocklyWorkspace;
            Events: BlocklyEvents;
        };
    }
}
