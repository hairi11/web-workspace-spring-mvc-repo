import Common from '@company/common-js-web';
import FcRows from '../FcRows.js';
import FcService from '../FcService.js';

const {
    ButtonBar,
    FieldTranslator,
    FormControls,
    NavigationState,
    PageControls,
    Toast
} = Common;

export async function initView(state) {
    const page = new PageControls(document).build();

    try {
        const detail = await FcService.findDetail(
            state.path,
            state.id
        );
        const transactions = resolveTransactions(detail);
        const rows = FcRows.load({}, transactions);

        let currentIndex = rows.transactions.findIndex(
            (transaction) => transaction
                && transaction.path === state.path
                && transaction.id === state.id
        );

        if (currentIndex < 0) currentIndex = 0;

        const form = new FormControls(document)
            .build()
            .labels((key) => FieldTranslator.label(key));

        const populateCurrentRow = () => {
            const row = rows.transactions[currentIndex];
            if (!row) return;

            form.populate(
                form.keys().reduce((values, key) => {
                    const field = FieldTranslator.field(key);

                    values[key] = row[field] !== undefined
                        ? row[field]
                        : row[key];

                    return values;
                }, {}),
                {target: 'text'}
            );
        };

        const count = rows.transactions.length;

        new ButtonBar(page.component('button-bar'))
            .navigator({
                previous: page.action('previous'),
                next: page.action('next'),
                index: currentIndex,
                count: count,
                hidden: count <= 1,
                onNavigate: (index) => {
                    currentIndex = index;
                    populateCurrentRow();
                }
            })
            .secondary({
                target: page.action('back'),
                text: 'Back',
                placement: ButtonBar.Placement.END,
                onClick: () => {
                    FcRows.clear(rows.rowsKey);
                    NavigationState.clear();
                }
            })
            .build();

        populateCurrentRow();
    } catch (error) {
        Toast.error('Failed to load FC detail.');
        console.error(error);
    }
}

function resolveTransactions(response) {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.rows)) return response.rows;
    if (Array.isArray(response?.data?.rows)) return response.data.rows;

    const detail = response && response.data
        ? response.data
        : response;

    return detail ? [detail] : [];
}
