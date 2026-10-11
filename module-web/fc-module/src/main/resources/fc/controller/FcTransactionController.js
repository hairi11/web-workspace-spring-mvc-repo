import Common from '@company/common-js-web';
import { TransactionMode } from '../FcConstants.js';
import FcRows from '../FcRows.js';
import FcTransactionAction from '../action/FcTransactionAction.js';
import FcTransactionForm from '../form/FcTransactionForm.js';

const {
    NavigationState,
    Toast
} = Common;

class FcTransactionController {
    async init() {
        const context = this.loadContext();

        try {
            const data = this.load(context);
            if (!data) return;

            const form = new FcTransactionForm(
                '#transactionForm',
                {
                    mode: context.mode,
                    key: context.key,
                    rowsKey: context.rowsKey
                }
            );

            await form.loadParameters();
            form.build();

            const action = new FcTransactionAction({
                form: form,
                mode: context.mode,
                key: context.key,
                rowsKey: context.rowsKey,
                rows: data.rows,
                returnTo: context.returnTo,
                pageConfig: data.pageConfig
            }).build();

            if (data.transaction) {
                form.populate(data.transaction);
            }

            action.configure();
        } catch (error) {
            Toast.error('Failed to load FC transaction.');
            console.error(error);
        }
    }

    loadContext() {
        const state = NavigationState.get() || {};

        return {
            mode: state.action || TransactionMode.CREATE,
            key: state.key ?? null,
            rowsKey: state.rowsKey || null,
            returnTo: state.returnTo || {page: 'enquiry'}
        };
    }

    load(context) {
        const rows = FcRows.get(context.rowsKey);

        if (!rows) {
            window.location.href = '../enquiry';
            return null;
        }

        const transaction = TransactionMode.isCreate(context.mode)
            ? null
            : (
                Number.isInteger(context.key)
                    ? rows.transactions[context.key]
                    : null
            );

        if (
            TransactionMode.isEdit(context.mode)
            && !transaction
        ) {
            throw new Error('FC transaction not found.');
        }

        return {
            rows: rows,
            transaction: transaction,
            pageConfig: {
                title: TransactionMode.isCreate(context.mode)
                    ? 'Create FC Transaction'
                    : 'Edit FC Transaction'
            }
        };
    }
}

export default FcTransactionController;
