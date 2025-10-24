import { useMemo } from 'react';
import Text from '@/components/shared_ui/text';
import { FILTERED_LANGUAGES } from '@/utils/languages';
import { useTranslations } from '@deriv-com/translations';
import { Tooltip } from '@deriv-com/ui';

type TLanguageSettings = {
    openLanguageSettingModal: () => void;
};

const LanguageSettings = ({ openLanguageSettingModal }: TLanguageSettings) => {
    const { currentLang, localize } = useTranslations();

    const countryIcon = useMemo(
        () => FILTERED_LANGUAGES.find(({ code }: { code: string }) => code == currentLang)?.placeholderIcon,
        [currentLang]
    );

    return (
        <Tooltip
            as='button'
            className='app-footer__language'
            onClick={openLanguageSettingModal}
            tooltipContent={localize('Language')}
            aria-label={`${localize('Change language')} - ${localize('Current language')}: ${currentLang}`}
            aria-expanded='false'
            aria-haspopup='dialog'
        >
            {countryIcon}
            <Text size='xs' weight='bold'>
                {currentLang}
            </Text>
        </Tooltip>
    );
};

export default LanguageSettings;
