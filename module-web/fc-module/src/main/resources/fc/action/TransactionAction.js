import Common from '@company/common-js-web';
import { FormType } from '../FcConstants.js';
import FcFields from '../FcFields.js';
import FcRows from '../FcRows.js';
import FcService from '../FcService.js';

const {
    ButtonBar,
    ChoiceInput,
    CurrencyInput,
    DatePicker,
    FieldTranslator,
    FormValues,
    Toast
} = Common;

export async function initTransaction(state) {
    new ButtonBar('#transactionButtonBar')
        .secondary({
            target: '#cancelButton',
            text: 'Cancel',
            placement: ButtonBar.Placement.END
        })
        .build();

    applyLabels();

    try {
        const values = state.action === 'edit'
            ? await loadEditValues(state)
            : {};

        FormValues.populate(FcFields.transaction, values);

        document.querySelectorAll(
            '#transactionForm [data-field-key^="date_value_"] input'
        ).forEach((field) => {
            new DatePicker(field).build();
        });

        document.querySelectorAll(
            '#transactionForm [data-field-key^="amount_value"] input'
        ).forEach((field) => {
            new CurrencyInput(field, {
                precision: field.name === 'amount_value' ? 14 : 20,
                decimalScale: field.name === 'amount_value' ? 6 : 4,
                padFractionOnBlur: true
            }).build();
        });

        const parameters = await FcService.findParameters(
            FormType.PARAMETER
        );

        document.querySelectorAll(
            '#transactionForm select[data-field]'
        ).forEach((field) => {
            const key = field.dataset.field;

            new ChoiceInput(field, {
                data: parameters[FieldTranslator.field(key)] || []
            })
                .build()
                .setValue(values[key]);
        });
    } catch (error) {
        Toast.error(
            state.action === 'edit'
                ? 'Failed to load FC transaction.'
                : 'Failed to load transaction parameters.'
        );
        console.error(error);
    }
}

function applyLabels() {
    document.querySelectorAll(
        '#transactionForm [data-field-key]'
    ).forEach((container) => {
        const label = container.querySelector('label');

        if (label) {
            label.textContent = FieldTranslator.label(
                container.dataset.fieldKey
            );
        }
    });
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

    return Object.keys(FcFields.transaction).reduce((values, key) => {
        const field = FieldTranslator.field(key);

        values[key] = row[field] !== undefined
            ? row[field]
            : row[key];

        return values;
    }, {});
}
