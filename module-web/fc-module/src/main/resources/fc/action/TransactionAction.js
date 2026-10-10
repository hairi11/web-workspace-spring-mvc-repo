import Common from '@company/common-js-web';
import { FormType } from '../FcConstants.js';
import FcService from '../FcService.js';

const {
    ChoiceInput,
    FieldTranslator,
    Toast
} = Common;

export async function initTransaction() {
    document.querySelectorAll(
        '#transactionForm [data-field-key]'
    ).forEach((container) => {
        const label = container.querySelector('label');
        if (label) label.textContent = FieldTranslator.label(
            container.dataset.fieldKey
        );
    });

    const fields = document.querySelectorAll(
        '#transactionForm select[data-field]'
    );

    if (!fields.length) return;

    try {
        const parameters = await FcService.findParameters(
            FormType.TRANSACTION
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
