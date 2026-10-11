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
        const rowsKey = FcRows.load(
            await FcService.findDetail(state.path, state.id)
        ).rowsKey;

        let currentIndex = FcRows.findIndex(
            rowsKey,
            state.path,
            state.id
        );

        const form = new FormControls(document)
            .build()
            .labels((key) => FieldTranslator.label(key));

        const populateCurrentRow = () => {
            const row = FcRows.row(rowsKey, currentIndex);
            if (!row) return;

            form.populate(
                form.keys().reduce((values, key) => {
                    const field = FieldTranslator.field(key);

                    values[key] = row[field] !== undefined
                        ? row[field]
                        : row[key];

                    return values;
                }, {}),
                { target: 'text' }
            );
        };

        const count = FcRows.count(rowsKey);

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
                onClick: () => NavigationState.clear()
            })
            .build();

        populateCurrentRow();
    } catch (error) {
        Toast.error('Failed to load FC detail.');
        console.error(error);
    }
}
