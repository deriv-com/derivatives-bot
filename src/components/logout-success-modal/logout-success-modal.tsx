import React, { useEffect, useState } from 'react';
import { Modal } from '@deriv-com/quill-ui-next';
import { useTranslations } from '@deriv-com/translations';

const LogoutSuccessModal: React.FC = () => {
    const { localize } = useTranslations();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Check localStorage for logout success flag
        const shouldShowModal = localStorage.getItem('show_logout_success_modal');
        if (shouldShowModal === 'true') {
            setIsOpen(true);
        }
        // Always clean up the flag, even if modal doesn't show
        // This prevents stale flags from interfering with future logins
        localStorage.removeItem('show_logout_success_modal');
    }, []);

    const handleClose = () => {
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <Modal
            show={isOpen}
            type='auto'
            title={localize('Log out successful')}
            description={localize('To sign out everywhere, log out from Home and your other active platforms.')}
            showCloseButton={false}
            showHandleBar={false}
            buttonPrimary={{
                label: localize('Got it'),
                style: 'primary',
                size: 'lg',
                color: 'coral',
                onClick: handleClose,
            }}
            onClose={handleClose}
        />
    );
};

export default LogoutSuccessModal;
