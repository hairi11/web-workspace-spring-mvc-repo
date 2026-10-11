import Common from '@company/common-js-web';
import { FormType } from '../FcConstants.js';
import FcRows from '../FcRows.js';
import FcService from '../FcService.js';

const {
    ButtonBar,
    FieldTranslator,
    FormControls,
    PageControls,
    Toast
} = Common;

export async function initTransaction(state) {
    const page = new PageControls(document).build();

    new ButtonBar(page.component('button-bar'))
        .primary({
            name: 'save',
            text: 'Save'
        })
        .secondary([
            {
                name: 'add',
                text: 'Add'
            },
            {
                name: 'cancel',
                text: 'Cancel',
                onClick: () => {
                    window.location.href = '../enquiry';
                }
            }
        ])
        .build();

    const form = new FormControls(
        page.component('transaction-form')
    )
        .build()
        .labels((key) => FieldTranslator.label(key));

    try {
        const values = state.action === 'edit'
            ? await loadEditValues(form, state)
            : {};

        const parameters = await FcService.findParameters(
            FormType.PARAMETER
        );

        form
            .populate(values)
            .dates()
            .currencies()
            .choices(
                (key) => {
                    const parameter = key === 'string_value_11'
                        ? 'string_value_11_iso'
                        : FieldTranslator.field(key);

                    return parameters[parameter] || [];
                },
                values
            );
    } catch (error) {
        Toast.error(
            state.action === 'edit'
                ? 'Failed to load FC transaction.'
                : 'Failed to load transaction parameters.'
        );
        console.error(error);
    }
}

async function loadEditValues(form, state) {
    const rowsKey = FcRows.load(
        await FcService.findDetail(state.path, state.id)
    ).rowsKey;

    const row = FcRows.row(
        rowsKey,
        FcRows.findIndex(rowsKey, state.path, state.id)
    );

    if (!row) return {};

    return form.keys().reduce((values, key) => {
        const field = FieldTranslator.field(key);

        values[key] = row[field] !== undefined
            ? row[field]
            : row[key];

        return values;
    }, {});
}
