const CRYPTO_CURRENCIES = ['BTC', 'ETH', 'LTC', 'BCH', 'UST'];

export const config = () => ({
    lists: {
        PAYOUTTYPE: [
            // ['Payout', 'payout'],
            ['Stake', 'stake'],
        ],
        CRYPTO_CURRENCIES,
        DETAILS: [
            ['deal reference id', '1'],
            ['purchase price', '2'],
            ['payout', '3'],
            ['profit', '4'],
            ['contract type', '5'],
            ['entry spot time', '6'],
            ['entry spot price', '7'],
            ['exit spot time', '8'],
            ['exit spot price', '9'],
            ['barrier', '10'],
            ['result', '11'],
        ],
        CHECK_RESULT: [
            ['Win', 'win'],
            ['Loss', 'loss'],
        ],
        CHECK_DIRECTION: [
            ['Rise', 'rise'],
            ['Fall', 'fall'],
            ['No Change', ''],
        ],
        BALANCE_TYPE: [
            ['string', 'STR'],
            ['number', 'NUM'],
        ],
        NOTIFICATION_TYPE: [
            ['green', 'success'],
            ['blue', 'info'],
            ['yellow', 'warn'],
            ['red', 'error'],
        ],
        NOTIFICATION_SOUND: [
            ['Silent', 'silent'],
            ['Announcement', 'announcement'],
            ['Earned money', 'earned-money'],
            ['Job done', 'job-done'],
            ['Error', 'error'],
            ['Severe error', 'severe-error'],
        ],
        CURRENCY: ['USD', 'EUR', 'GBP', 'AUD', ...CRYPTO_CURRENCIES],
    },
    opposites: {
        ACCUMULATOR: [
            {
                ACCU: 'Buy',
            },
        ],
        MULTIPLIER: [
            {
                MULTUP: 'Up',
            },
            {
                MULTDOWN: 'Down',
            },
        ],
        CALLPUT: [
            {
                CALL: 'Rise',
            },
            {
                PUT: 'Fall',
            },
        ],
        CALLPUTEQUAL: [
            {
                CALLE: 'Rise Equals',
            },
            {
                PUTE: 'Fall Equals',
            },
        ],
        HIGHERLOWER: [
            {
                CALL: 'Higher',
            },
            {
                PUT: 'Lower',
            },
        ],
        TOUCHNOTOUCH: [
            {
                ONETOUCH: 'Touch',
            },
            {
                NOTOUCH: 'No Touch',
            },
        ],
        ENDSINOUT: [
            {
                EXPIRYRANGE: 'Ends Between',
            },
            {
                EXPIRYMISS: 'Ends Outside',
            },
        ],
        STAYSINOUT: [
            {
                RANGE: 'Stays Between',
            },
            {
                UPORDOWN: 'Goes Outside',
            },
        ],
        ASIANS: [
            {
                ASIANU: 'Asian Up',
            },
            {
                ASIAND: 'Asian Down',
            },
        ],
        MATCHESDIFFERS: [
            {
                DIGITMATCH: 'Matches',
            },
            {
                DIGITDIFF: 'Differs',
            },
        ],
        EVENODD: [
            {
                DIGITEVEN: 'Even',
            },
            {
                DIGITODD: 'Odd',
            },
        ],
        OVERUNDER: [
            {
                DIGITOVER: 'Over',
            },
            {
                DIGITUNDER: 'Under',
            },
        ],
        HIGHLOWTICKS: [
            {
                TICKHIGH: 'High Tick',
            },
            {
                TICKLOW: 'Low Tick',
            },
        ],
        RESET: [
            {
                RESETCALL: 'Reset Call',
            },
            {
                RESETPUT: 'Reset Put',
            },
        ],
        RUNS: [
            {
                RUNHIGH: 'Only Ups',
            },
            {
                RUNLOW: 'Only Downs',
            },
        ],
        CALLPUTSPREAD: [
            {
                CALLSPREAD: 'Call Spread',
            },
            {
                PUTSPREAD: 'Put Spread',
            },
        ],
    },
    BARRIER_TYPES: [
        ['Offset +', '+'],
        ['Offset -', '-'],
    ],
    ohlcFields: [
        ['Open', 'open'],
        ['High', 'high'],
        ['Low', 'low'],
        ['Close', 'close'],
        ['Open Time', 'epoch'],
    ],
    candleIntervals: [
        ['Default', 'default'],
        ['1 minute', '60'],
        ['2 minutes', '120'],
        ['3 minutes', '180'],
        ['5 minutes', '300'],
        ['10 minutes', '600'],
        ['15 minutes', '900'],
        ['30 minutes', '1800'],
        ['1 hour', '3600'],
        ['2 hours', '7200'],
        ['4 hours', '14400'],
        ['8 hours', '28800'],
        ['1 day', '86400'],
    ],
    mainBlocks: ['trade_definition', 'before_purchase', 'during_purchase', 'after_purchase'],
    mandatoryMainBlocks: ['trade_definition', 'purchase', 'before_purchase'],
    procedureDefinitionBlocks: ['procedures_defnoreturn', 'procedures_defreturn'],
    single_instance_blocks: ['trade_definition', 'before_purchase', 'during_purchase', 'after_purchase'],
    TRADE_TYPE_TO_CONTRACT_CATEGORY_MAPPING: {
        callput: ['callput', 'higherlower'],
        asian: ['asians'],
        digits: ['matchesdiffers', 'evenodd', 'overunder'],
    },
    TRADE_TYPE_CATEGORIES: {
        multiplier: ['multiplier'],
        callput: ['callput', 'callputequal', 'higherlower'],
        touchnotouch: ['touchnotouch'],
        inout: ['endsinout', 'staysinout'],
        asian: ['asians'],
        digits: ['matchesdiffers', 'evenodd', 'overunder'],
        reset: ['reset'],
        callputspread: ['callputspread'],
        highlowticks: ['highlowticks'],
        runs: ['runs'],
        accumulator: ['accumulator'],
    },
    TRADE_TYPE_CATEGORY_NAMES: {
        callput: 'Up/Down',
        touchnotouch: 'Touch/No Touch',
        inout: 'In/Out',
        asian: 'Asians',
        digits: 'Digits',
        reset: 'Reset Call/Reset Put',
        callputspread: 'Call Spread/Put Spread',
        highlowticks: 'High/Low Ticks',
        runs: 'Only Ups/Only Downs',
        multiplier: 'Multipliers',
        accumulator: 'Accumulators',
    },
    BARRIER_CATEGORIES: {
        euro_atm: ['callput', 'callputequal'],
        euro_non_atm: ['endsinout', 'higherlower', 'callputspread'],
        american: ['staysinout', 'touchnotouch', 'highlowticks', 'runs', 'multiplier'],
        non_financial: ['digits', 'overunder', 'evenodd', 'matchesdiffers'],
        asian: ['asians'],
        reset: ['reset'],
        lookback: ['lookback'],
        accumulator: ['accumulator'],
    },
    DEFAULT_DURATION_DROPDOWN_OPTIONS: [
        ['Ticks', 't'],
        ['Seconds', 's'],
        ['Minutes', 'm'],
        ['Hours', 'h'],
        ['Days', 'd'],
    ],
    BARRIER_LABELS: ['High barrier', 'Low barrier'],
    ABSOLUTE_BARRIER_DROPDOWN_OPTION: [['Absolute', 'absolute']],
    NOT_AVAILABLE_DROPDOWN_OPTIONS: [['Not available', 'na']],
    NOT_AVAILABLE_DURATIONS: [{ display: 'Not available', unit: 'na', min: 0 }],
    BARRIER_TRADE_TYPES: ['higherlower', 'touchnotouch', 'endsinout', 'staysinout', 'callputspread'],
    PREDICTION_TRADE_TYPES: ['matchesdiffers', 'overunder', 'highlowticks'],
    DIGIT_CATEGORIES: ['digits', 'highlowticks'],
    INDEPEDENT_BLOCKS: ['block_holder', 'tick_analysis', 'loader', 'procedures_defreturn', 'procedures_defnoreturn'],
    bbResult: [
        ['upper', '1'],
        ['middle', '0'],
        ['lower', '2'],
    ],
    macdFields: [
        ['Histogram', '0'],
        ['MACD', '1'],
        ['Signal', '2'],
    ],
    GOOGLE_DRIVE: {
        SCOPE: 'https://www.googleapis.com/auth/drive.file',
        DISCOVERY_DOCS: 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
    },
    workspaces: {
        flyoutWorkspacesStartScale: 0.7,
        mainWorkspaceStartScale: 0.9,
        previewWorkspaceStartScale: 0.6,
        indentWorkspace: { x: 0, y: 60 },
    },
    strategies: {
        martingale: {
            index: 0,
            label: 'Martingale',
            description: 'The Martingale Strategy is a classic trading technique that has been used for more than a hundred years, popularised by the French mathematician Paul Pierre Levy in the 18th century.',
        },
        dalembert: {
            index: 1,
            label: "D'Alembert",
            description: "The concept of the D'Alembert Strategy is said to be similar to the Martingale Strategy where you will increase your contract size after a loss. With the D'Alembert Strategy, you will also decrease your contract size after a successful trade.",
        },
        oscars_grind: {
            index: 2,
            label: "Oscar's Grind",
            description: "The Oscar's Grind Strategy is a low-risk positive progression strategy that first appeared in 1965. By using this strategy, the size of your contract will increase after successful trades, but remains unchanged after unsuccessful trades.",
        },
    },
    default_file_name: 'Untitled Bot',
    DISABLED_SYMBOLS: ['frxGBPNOK', 'frxUSDNOK', 'frxUSDNEK', 'frxUSDSEK'],
    DISABLED_SUBMARKETS: ['energy'],
    QUICK_STRATEGY: {
        DISABLED: {
            SYMBOLS: ['1HZ150V', '1HZ250V'],
            SUBMARKETS: ['crash_index', 'non_stable_coin', 'step_index'],
            BARRIER_TRADE_TYPES: [
                'higherlower',
                'touchnotouch',
                'endsinout',
                'staysinout',
                'callputspread',
                'accumulator',
            ],
            PREDICTION_TRADE_TYPES: ['highlowticks'],
        },
        DEFAULT: {
            symbol: '1HZ100V',
            tradetype: 'callput',
            durationtype: 't',
            size: 1,
            unit: 1,
            prediction: 0,
        },
    },
});
