import React from 'react';
import { Modal } from '@deriv-com/quill-ui-next';
import { useTranslations } from '@deriv-com/translations';

type TLogoutSuccessModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const LogoutSuccessModal: React.FC<TLogoutSuccessModalProps> = ({ isOpen, onClose }) => {
    const { localize } = useTranslations();

    return (
        <Modal
            show={isOpen}
            title={localize('Log out successful')}
            description={localize('To sign out everywhere, log out from Home and your other active platforms.')}
            height='hug-content'
            type='auto'
            showCloseButton={false}
            showHandleBar={false}
            buttonPrimary={{
                label: localize('Got it'),
                style: 'primary',
                onClick: onClose,
            }}
            onClose={onClose}
        />
    );
};

export default LogoutSuccessModal;
