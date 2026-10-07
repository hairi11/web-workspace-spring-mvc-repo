import Common from '@company/common-js-web';
import { FormType } from '../FcConstants.js';
import FcService from '../FcService.js';

const {
    ChoiceInput,
    Toast
} = Common;

export async function initTransaction() {
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
                data: parameters[key] || []
            }).build();
        });
    } catch (error) {
        Toast.error('Failed to load transaction parameters.');
        console.error(error);
    }
}
