import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import { Modal } from '@deriv-com/quill-ui-next';
import { useTranslations } from '@deriv-com/translations';

const LogoutSuccessModal: React.FC = observer(() => {
    const { localize } = useTranslations();
    const { client } = useStore();

    const handleClose = () => {
        client.setShowLogoutSuccessModal(false);
    };

    if (!client.show_logout_success_modal) return null;

    return (
        <Modal
            show={client.show_logout_success_modal}
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
});

export default LogoutSuccessModal;
