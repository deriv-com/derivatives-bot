import { useState } from 'react';
import { useTranslations } from '@deriv-com/translations';
import { Drawer, useDevice } from '@deriv-com/ui';
import NetworkStatus from './../../footer/NetworkStatus';
import ServerTime from './../../footer/ServerTime';
import BackButton from './back-button';
import MenuContent from './menu-content';
import MenuHeader from './menu-header';
import ReportsSubmenu from './reports-submenu';
import ToggleButton from './toggle-button';
import './mobile-menu.scss';

type TMobileMenuProps = {
    onLogout?: () => void;
};

const MobileMenu = ({ onLogout }: TMobileMenuProps) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
    const { localize } = useTranslations();
    const { isDesktop } = useDevice();

    const openDrawer = () => setIsDrawerOpen(true);
    const closeDrawer = () => {
        setIsDrawerOpen(false);
        setActiveSubmenu(null);
    };

    const openSubmenu = (submenu: string) => setActiveSubmenu(submenu);
    const closeSubmenu = () => setActiveSubmenu(null);

    if (isDesktop) return null;
    return (
        <div className='mobile-menu'>
            <div className='mobile-menu__toggle'>
                <ToggleButton onClick={openDrawer} />
            </div>

            <Drawer isOpen={isDrawerOpen} onCloseDrawer={closeDrawer} width='29.5rem'>
                <Drawer.Header onCloseDrawer={closeDrawer}>
                    <MenuHeader hideLanguageSetting={true} openLanguageSetting={() => {}} />
                </Drawer.Header>

                <Drawer.Content>
                    {activeSubmenu === 'reports' ? (
                        <>
                            <div className='mobile-menu__back-btn'>
                                <BackButton buttonText={localize('Reports')} onClick={closeSubmenu} />
                            </div>
                            <ReportsSubmenu />
                        </>
                    ) : (
                        <MenuContent
                            onOpenSubmenu={openSubmenu}
                            onLogout={() => {
                                closeDrawer();
                                onLogout?.();
                            }}
                        />
                    )}
                </Drawer.Content>

                <Drawer.Footer className='mobile-menu__footer'>
                    <ServerTime />
                    <NetworkStatus />
                </Drawer.Footer>
            </Drawer>
        </div>
    );
};

export default MobileMenu;
