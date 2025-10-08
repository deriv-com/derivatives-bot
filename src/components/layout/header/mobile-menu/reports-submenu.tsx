import { standalone_routes } from '@/components/shared';
import { generateUrlWithRedirect } from '@/utils/url-redirect-utils';
import { LegacyOpenPositionIcon, LegacyProfitTableIcon, LegacyStatementIcon } from '@deriv/quill-icons/Legacy';
import { useTranslations } from '@deriv-com/translations';
import { MenuItem, Text } from '@deriv-com/ui';

const ReportsSubmenu = () => {
    const { localize } = useTranslations();
    const textSize = 'sm';

    const reportItems = [
        {
            icon: LegacyOpenPositionIcon,
            label: localize('Open positions'),
            href: generateUrlWithRedirect(standalone_routes.positions),
        },
        {
            icon: LegacyProfitTableIcon,
            label: localize('Trade table'),
            href: generateUrlWithRedirect(standalone_routes.profit),
        },
        {
            icon: LegacyStatementIcon,
            label: localize('Statement'),
            href: generateUrlWithRedirect(standalone_routes.statement),
        },
    ];

    return (
        <div className='mobile-menu__content__items'>
            <div className='mobile-menu__content__items--padding'>
                {reportItems.map(({ icon: Icon, label, href }) => (
                    <MenuItem
                        as='a'
                        className='mobile-menu__content__items__item mobile-menu__content__items__icons'
                        disableHover
                        href={href}
                        key={label}
                        leftComponent={<Icon className='mobile-menu__content__items--right-margin' iconSize='xs' />}
                    >
                        <Text size={textSize}>{label}</Text>
                    </MenuItem>
                ))}
            </div>
        </div>
    );
};

export default ReportsSubmenu;
