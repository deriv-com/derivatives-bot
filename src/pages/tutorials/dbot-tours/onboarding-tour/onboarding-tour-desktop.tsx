import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import { getSetting } from '@/utils/settings';
import ReactJoyrideWrapper from '../common/react-joyride-wrapper';
import TourStartDialog from '../common/tour-start-dialog';
import { DBOT_ONBOARDING } from '../tour-content';
import { useTourHandler } from '../useTourHandler';

const OnboardingTourDesktop = observer(() => {
    const { dashboard } = useStore();
    const { active_tab, active_tour, setActiveTour, setTourDialogVisibility, is_tour_dialog_visible } = dashboard;
    const { is_close_tour, is_finished, handleJoyrideCallback, setIsCloseTour } = useTourHandler();
    const hasCheckedTour = React.useRef(false);

    // Check if we're on dashboard tab (either by active_tab state or URL hash)
    const isDashboardTab = React.useMemo(() => {
        const urlHash = window.location.hash?.split('#')[1];
        return active_tab === 0 || urlHash === 'dashboard' || !urlHash; // Default to dashboard if no hash
    }, [active_tab]);

    React.useEffect(() => {
        if (is_close_tour || is_finished) {
            setIsCloseTour(false);
            setActiveTour('');
        }
    }, [is_close_tour, is_finished, setActiveTour, setIsCloseTour]);

    // Check if tour should be shown only once per session
    React.useEffect(() => {
        if (!hasCheckedTour.current && isDashboardTab) {
            const token = getSetting('onboard_tour_token');
            if (!token && !is_tour_dialog_visible) {
                setTourDialogVisibility(true);
            }
            hasCheckedTour.current = true;
        }
    }, [isDashboardTab, is_tour_dialog_visible, setTourDialogVisibility, active_tab]);

    return (
        <>
            <TourStartDialog />
            {active_tour && (
                <ReactJoyrideWrapper
                    handleCallback={handleJoyrideCallback}
                    steps={DBOT_ONBOARDING}
                    spotlightClicks
                    disableCloseOnEsc
                    disableOverlay={false}
                    disableOverlayClose={true}
                />
            )}
        </>
    );
});

export default OnboardingTourDesktop;
