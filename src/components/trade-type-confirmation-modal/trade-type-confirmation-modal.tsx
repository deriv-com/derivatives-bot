import React from 'react';
import { observer } from 'mobx-react-lite';
import Dialog from '@/components/shared_ui/dialog';
import { useStore } from '@/hooks/useStore';
import { removeTradeTypeFromUrl } from '@/utils/blockly-url-param-handler';
import { getSetting } from '@/utils/settings';
import { applyTradeTypeDropdownChanges } from '@/utils/trade-type-modal-handler';
import { getTradeTypeFromCurrentUrl } from '@/utils/url-trade-type-handler';
import { Localize } from '@deriv-com/translations';
import './trade-type-confirmation-modal.scss';

interface TradeTypeConfirmationModalProps {
    is_visible: boolean;
    trade_type_display_name: string;
    current_trade_type: string;
    current_trade_type_display_name?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const TradeTypeConfirmationModal: React.FC<TradeTypeConfirmationModalProps> = observer(
    ({
        is_visible,
        trade_type_display_name,
        current_trade_type,
        current_trade_type_display_name,
        onConfirm,
        onCancel,
    }) => {
        const { dashboard } = useStore();
        const { is_tour_dialog_visible } = dashboard;
        const [display_name, setDisplayName] = React.useState(trade_type_display_name);

        // Check if user is seeing the tour (first time user)
        const isFirstTimeUser = React.useMemo(() => {
            const botBuilderToken = getSetting('bot_builder_token');
            return !botBuilderToken;
        }, []);
        // Force re-render when trade_type_display_name changes
        React.useEffect(() => {
            setDisplayName(trade_type_display_name);
        }, [trade_type_display_name, display_name]);

        // Handle first-time users - apply changes silently without showing modal
        React.useEffect(() => {
            if (is_visible && (isFirstTimeUser || is_tour_dialog_visible)) {
                const tradeTypeFromUrl = getTradeTypeFromCurrentUrl();

                if (tradeTypeFromUrl && tradeTypeFromUrl.isValid) {
                    // Remove URL parameter immediately for tour users - don't apply changes
                    removeTradeTypeFromUrl();

                    // Call onConfirm to indicate processing is complete
                    onConfirm();
                }
            }
        }, [is_visible, isFirstTimeUser, is_tour_dialog_visible, onConfirm]);

        // Don't show modal if tour is visible or if it's a first-time user
        if (is_tour_dialog_visible || isFirstTimeUser) return null;
        return (
            <Dialog
                title={<Localize i18n_default_text='Change Trade Type?' />}
                is_visible={is_visible}
                confirm_button_text='Yes, Change'
                cancel_button_text='No, Keep Current'
                onConfirm={() => {
                    // Apply the dropdown changes when user confirms
                    const tradeTypeFromUrl = getTradeTypeFromCurrentUrl();
                    if (tradeTypeFromUrl && tradeTypeFromUrl.isValid) {
                        applyTradeTypeDropdownChanges(tradeTypeFromUrl.tradeTypeCategory, tradeTypeFromUrl.tradeType);
                    }
                    // Remove URL parameter
                    removeTradeTypeFromUrl();

                    onConfirm();
                }}
                onCancel={() => {
                    // Remove URL parameter even when cancelled
                    removeTradeTypeFromUrl();

                    // Call the original onCancel callback
                    onCancel();
                }}
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
                            i18n_default_text='You have selected a new trade type on the homepage: <0>{{trade_type_name}}</0>.'
                            values={{ trade_type_name: display_name }}
                            components={[<strong key={0} />]}
                        />
                    </p>
                    <p>
                        <Localize
                            i18n_default_text='Your current selection is: <0>{{current_trade_type}}</0>.'
                            values={{ current_trade_type: current_trade_type_display_name || current_trade_type }}
                            components={[<strong key={0} />]}
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
