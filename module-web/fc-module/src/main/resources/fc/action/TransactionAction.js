import Common from '@company/common-js-web';
import { FormType } from '../FcConstants.js';
import FcService from '../FcService.js';

const {
    ButtonBar,
    ChoiceInput,
    CurrencyInput,
    DatePicker,
    FieldTranslator,
    Toast
} = Common;

export async function initTransaction() {
    new ButtonBar('#transactionButtonBar')
        .secondary({
            target: '#cancelButton',
            text: 'Cancel',
            placement: ButtonBar.Placement.END
        })
        .build();

    document.querySelectorAll(
        '#transactionForm [data-field-key]'
    ).forEach((container) => {
        const label = container.querySelector('label');
        if (label) label.textContent = FieldTranslator.label(
            container.dataset.fieldKey
        );
    });

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
            decimalScale: field.name === 'amount_value' ? 6 : 4
        }).build();
    });

    const fields = document.querySelectorAll(
        '#transactionForm select[data-field]'
    );

    if (!fields.length) return;

    try {
        const parameters = await FcService.findParameters(
            FormType.PARAMETER
        );

        fields.forEach((field) => {
            const key = field.dataset.field;

            new ChoiceInput(field, {
                data: parameters[FieldTranslator.field(key)] || []
            }).build();
        });
    } catch (error) {
        Toast.error('Failed to load transaction parameters.');
        console.error(error);
    }
}
