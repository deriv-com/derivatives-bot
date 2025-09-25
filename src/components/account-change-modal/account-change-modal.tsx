import React from 'react';
import { Modal } from '@deriv-com/quill-ui-next';
import { useTranslations } from '@deriv-com/translations';

type TAccountChangeModalProps = {
    isOpen: boolean;
    onReload: () => void;
    onClose: () => void;
};

const AccountChangeModal: React.FC<TAccountChangeModalProps> = ({ isOpen, onReload, onClose }) => {
    const { localize } = useTranslations();

    const handleClose = () => {
        // If user clicks outside or closes modal, reload anyway
        onClose();
        onReload();
    };

    const handleReload = () => {
        onReload();
    };

    if (!isOpen) {
        return null;
    }

    return (
        <Modal
            show={isOpen}
            title={''}
            description={localize(
                'Your account has changed in another tab. Reloading will switch to the new account and stop the running bot in this tab.'
            )}
            type='auto'
            height='hug-content'
            showCloseButton={false}
            showHandleBar={false}
            buttonPrimary={{
                label: localize('Reload'),
                style: 'primary',
                size: 'lg',
                color: 'coral',
                onClick: handleReload,
            }}
            onClose={handleClose}
        />
    );
};

export default AccountChangeModal;
