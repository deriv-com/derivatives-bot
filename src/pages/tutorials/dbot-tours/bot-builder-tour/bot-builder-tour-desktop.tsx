import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import { getSetting } from '@/utils/settings';
import ReactJoyrideWrapper from '../common/react-joyride-wrapper';
import TourEndDialog from '../common/tour-end-dialog';
import TourStartDialog from '../common/tour-start-dialog';
import { BOT_BUILDER_TOUR } from '../tour-content';
import { useTourHandler } from '../useTourHandler';

const BotBuilderTourDesktop = observer(() => {
    const { is_close_tour, is_finished, handleJoyrideCallback, setIsCloseTour } = useTourHandler();
    const { dashboard, load_modal } = useStore();
    const { active_tab, active_tour, setActiveTour, setTourDialogVisibility, is_tour_dialog_visible } = dashboard;
    const { is_load_modal_open } = load_modal;
    const hasCheckedTour = React.useRef(false);
    // Check if we're on bot builder tab (either by active_tab state or URL hash)
    const isBotBuilderTab = React.useMemo(() => {
        const urlHash = window.location.hash?.split('#')[1];
        return active_tab === 1 || urlHash === 'bot_builder';
    }, [active_tab]);

    // Check if tour should be shown only once per session
    React.useEffect(() => {
        if (!hasCheckedTour.current && isBotBuilderTab) {
            const token = getSetting('bot_builder_token');
            if (!token && !is_tour_dialog_visible) {
                setTourDialogVisibility(true);
            }
            hasCheckedTour.current = true;
        }
    }, [isBotBuilderTab, is_tour_dialog_visible, setTourDialogVisibility]);

    React.useEffect(() => {
        if (is_finished) {
            setTourDialogVisibility(true);
            setActiveTour('');
        } else if (is_close_tour) {
            setActiveTour('');
            setIsCloseTour(false);
        }
    }, [is_close_tour, is_finished, setActiveTour, setIsCloseTour, setTourDialogVisibility]);

    return (
        <>
            {is_finished ? <TourEndDialog /> : !is_load_modal_open ? <TourStartDialog /> : null}
            {active_tour && (
                <ReactJoyrideWrapper
                    handleCallback={handleJoyrideCallback}
                    steps={BOT_BUILDER_TOUR}
                    disableCloseOnEsc
                    disableOverlay={false}
                    disableOverlayClose={true}
                    styles={{
                        options: {
                            arrowColor: 'transparent',
                            backgroundColor: 'var(--general-main-2)',
                            primaryColor: 'var(--brand-red-coral)',
                            textColor: 'var(--text-general)',
                        },
                    }}
                />
            )}
        </>
    );
});

export default BotBuilderTourDesktop;
