import React from 'react';
import AccountChangeModal from '@/components/account-change-modal';
import { useLocalStorageSync } from '@/hooks/useLocalStorageSync';

const LocalStorageSyncWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { showAccountChangeModal, handleReload, handleModalClose } = useLocalStorageSync();

    return (
        <>
            <AccountChangeModal isOpen={showAccountChangeModal} onReload={handleReload} onClose={handleModalClose} />
            {children}
        </>
    );
};

export default LocalStorageSyncWrapper;
