import Common from '@company/common-js-web';
import FcFields from '../FcFields.js';
import FcRows from '../FcRows.js';
import FcService from '../FcService.js';

const {
    ButtonBar,
    FieldTranslator,
    FormControls,
    Toast
} = Common;

export async function initView(state) {
    try {
        const rowsKey = FcRows.load(
            await FcService.findDetail(state.path, state.id)
        ).rowsKey;

        let currentIndex = FcRows.findIndex(
            rowsKey,
            state.path,
            state.id
        );

        const form = new FormControls(
            document,
            FcFields.view
        )
            .build()
            .labels((key) => FieldTranslator.label(key));

        const populateCurrentRow = () => {
            const row = FcRows.row(rowsKey, currentIndex);
            if (!row) return;

            form.populate(
                Object.keys(FcFields.view).reduce((values, key) => {
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

        new ButtonBar('#viewButtonBar')
            .navigator({
                previous: '#previousButton',
                next: '#nextButton',
                index: currentIndex,
                count: count,
                hidden: count <= 1,
                onNavigate: (index) => {
                    currentIndex = index;
                    populateCurrentRow();
                }
            })
            .secondary({
                target: '#backButton',
                text: 'Back',
                placement: ButtonBar.Placement.END
            })
            .build();

        populateCurrentRow();
    } catch (error) {
        Toast.error('Failed to load FC detail.');
        console.error(error);
    }
}
