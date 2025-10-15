import React, { createContext, ReactNode,useCallback, useContext, useState } from 'react';

// Trade type data interface
export interface TradeTypeData {
    displayName: string;
    tradeTypeCategory: string;
    tradeType: string;
    isValid: boolean;
    urlParam?: string;
    currentTradeType?: { tradeTypeCategory: string; tradeType: string } | null;
    currentTradeTypeDisplayName?: string;
}

// Modal state interface
export interface TradeTypeModalState {
    isVisible: boolean;
    tradeTypeData: TradeTypeData | null;
    onConfirm: (() => void) | null;
    onCancel: (() => void) | null;
}

// Context interface
interface TradeTypeModalContextType {
    modalState: TradeTypeModalState;
    showModal: (tradeTypeData: TradeTypeData, onConfirm: () => void, onCancel: () => void) => void;
    hideModal: () => void;
    updateTradeTypeData: (data: Partial<TradeTypeData>) => void;
    isUpdating: boolean;
}

// Create context
const TradeTypeModalContext = createContext<TradeTypeModalContextType | undefined>(undefined);

// Provider component
interface TradeTypeModalProviderProps {
    children: ReactNode;
}

export const TradeTypeModalProvider: React.FC<TradeTypeModalProviderProps> = ({ children }) => {
    const [modalState, setModalState] = useState<TradeTypeModalState>({
        isVisible: false,
        tradeTypeData: null,
        onConfirm: null,
        onCancel: null,
    });

    const [isUpdating, setIsUpdating] = useState(false);

    const showModal = useCallback(
        (tradeTypeData: TradeTypeData, onConfirm: () => void, onCancel: () => void) => {
            if (isUpdating) {
                console.warn('Modal state update skipped due to concurrent update in progress');
                return;
            }

            setModalState({
                isVisible: true,
                tradeTypeData,
                onConfirm,
                onCancel,
            });
        },
        [isUpdating]
    );

    const hideModal = useCallback(() => {
        if (isUpdating) {
            console.warn('Modal state update skipped due to concurrent update in progress');
            return;
        }

        setModalState({
            isVisible: false,
            tradeTypeData: null,
            onConfirm: null,
            onCancel: null,
        });
    }, [isUpdating]);

    const updateTradeTypeData = useCallback(
        (data: Partial<TradeTypeData>) => {
            if (isUpdating || !modalState.isVisible || !modalState.tradeTypeData) {
                return;
            }

            setIsUpdating(true);
            try {
                setModalState(prevState => ({
                    ...prevState,
                    tradeTypeData: prevState.tradeTypeData
                        ? {
                              ...prevState.tradeTypeData,
                              ...data,
                          }
                        : null,
                }));
            } finally {
                setIsUpdating(false);
            }
        },
        [modalState.isVisible, modalState.tradeTypeData, isUpdating]
    );

    const contextValue: TradeTypeModalContextType = {
        modalState,
        showModal,
        hideModal,
        updateTradeTypeData,
        isUpdating,
    };

    return <TradeTypeModalContext.Provider value={contextValue}>{children}</TradeTypeModalContext.Provider>;
};

// Custom hook to use the context
export const useTradeTypeModal = (): TradeTypeModalContextType => {
    const context = useContext(TradeTypeModalContext);
    if (context === undefined) {
        throw new Error('useTradeTypeModal must be used within a TradeTypeModalProvider');
    }
    return context;
};

// Hook for components that need to check if context is available
export const useTradeTypeModalOptional = (): TradeTypeModalContextType | null => {
    return useContext(TradeTypeModalContext) || null;
};
