import Common from '@company/common-js-web';
import { FormType } from '../FcConstants.js';
import FcComponentConfig from '../FcComponentConfig.js';
import FcRows from '../FcRows.js';
import FcService from '../FcService.js';

const {
    ButtonBar,
    FieldTranslator,
    FormControls,
    Toast
} = Common;

export async function initTransaction(state) {
    new ButtonBar(
        FcComponentConfig.transaction.buttonBar.selector
    )
        .primary(FcComponentConfig.transaction.buttons.save)
        .secondary([
            FcComponentConfig.transaction.buttons.add,
            FcComponentConfig.transaction.buttons.cancel
        ])
        .build();

    const form = new FormControls(
        FcComponentConfig.transaction.form.selector,
        FcComponentConfig.transaction.fields
    )
        .build()
        .labels((key) => FieldTranslator.label(key));

    try {
        const values = state.action === 'edit'
            ? await loadEditValues(state)
            : {};

        const parameters = await FcService.findParameters(
            FormType.PARAMETER
        );

        form
            .populate(values)
            .dates()
            .currencies()
            .choices(
                (key) => parameters[
                    FieldTranslator.field(key)
                ] || [],
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

async function loadEditValues(state) {
    const rowsKey = FcRows.load(
        await FcService.findDetail(state.path, state.id)
    ).rowsKey;

    const row = FcRows.row(
        rowsKey,
        FcRows.findIndex(rowsKey, state.path, state.id)
    );

    if (!row) return {};

    return Object.keys(
        FcComponentConfig.transaction.fields
    ).reduce((values, key) => {
        const field = FieldTranslator.field(key);

        values[key] = row[field] !== undefined
            ? row[field]
            : row[key];

        return values;
    }, {});
}
