import React from 'react';
import { observer } from 'mobx-react-lite';
import Dialog from '@/components/shared_ui/dialog';
import { Localize } from '@deriv-com/translations';
import './trade-type-confirmation-modal.scss';

interface TradeTypeConfirmationModalProps {
    is_visible: boolean;
    trade_type_display_name: string;
    current_trade_type: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const TradeTypeConfirmationModal: React.FC<TradeTypeConfirmationModalProps> = observer(
    ({ is_visible, trade_type_display_name, current_trade_type, onConfirm, onCancel }) => {
        return (
            <Dialog
                title={<Localize i18n_default_text='Change Trade Type?' />}
                is_visible={is_visible}
                confirm_button_text='Yes, Change'
                cancel_button_text='No, Keep Current'
                onConfirm={onConfirm}
                onCancel={onCancel}
                onClose={onCancel}
                has_close_icon
                is_mobile_full_width={false}
                portal_element_id='modal_root'
                className='trade-type-confirmation-modal'
                login={() => {}} // Not needed for this modal
            >
                <div className='trade-type-confirmation-modal__content'>
                    <p>
                        <Localize
                            i18n_default_text='You have selected a new trade type on the homepage: {{trade_type_name}}.'
                            values={{ trade_type_name: trade_type_display_name }}
                        />
                    </p>
                    <p>
                        <Localize
                            i18n_default_text='Your current selection is: {{current_trade_type}}.'
                            values={{ current_trade_type }}
                        />
                    </p>
                    <p>
                        <Localize i18n_default_text='Would you like to switch to the new trade type for this strategy?' />
                    </p>
                </div>
            </Dialog>
        );
    }
);

TradeTypeConfirmationModal.displayName = 'TradeTypeConfirmationModal';

export default TradeTypeConfirmationModal;
