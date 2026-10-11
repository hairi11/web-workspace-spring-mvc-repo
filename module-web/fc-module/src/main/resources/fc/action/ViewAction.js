import Common from '@company/common-js-web';
import FcComponentConfig from '../FcComponentConfig.js';
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
            FcComponentConfig.view.fields
        )
            .build()
            .labels((key) => FieldTranslator.label(key));

        const populateCurrentRow = () => {
            const row = FcRows.row(rowsKey, currentIndex);
            if (!row) return;

            form.populate(
                Object.keys(
                    FcComponentConfig.view.fields
                ).reduce((values, key) => {
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

        new ButtonBar(
            FcComponentConfig.view.buttonBar.selector
        )
            .navigator({
                previous:
                    FcComponentConfig.view.buttons.previous.selector,
                next:
                    FcComponentConfig.view.buttons.next.selector,
                index: currentIndex,
                count: count,
                hidden: count <= 1,
                onNavigate: (index) => {
                    currentIndex = index;
                    populateCurrentRow();
                }
            })
            .secondary(Object.assign(
                {},
                FcComponentConfig.view.buttons.back,
                { placement: ButtonBar.Placement.END }
            ))
            .build();

        populateCurrentRow();
    } catch (error) {
        Toast.error('Failed to load FC detail.');
        console.error(error);
    }
}
