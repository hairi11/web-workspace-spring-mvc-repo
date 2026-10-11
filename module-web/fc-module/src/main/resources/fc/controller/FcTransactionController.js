import Common from '@company/common-js-web';
import { TransactionMode } from '../FcConstants.js';
import FcRows from '../FcRows.js';
import FcService from '../FcService.js';
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
            const data = await this.load(context);
            if (!data) return;

            const form = new FcTransactionForm(
                '#transactionForm',
                {
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

            form.populate(data.transaction);
            action.configure();

            NavigationState.set({
                page: 'form',
                action: context.mode,
                key: context.key,
                rowsKey: context.rowsKey,
                values: context.values,
                returnTo: context.returnTo
            });
        } catch (error) {
            Toast.error('Failed to load FC transaction.');
            console.error(error);
        }
    }

    loadContext() {
        const state = NavigationState.get() || {};

        return {
            mode: state.action || TransactionMode.CREATE,
            key: Number.isInteger(state.key) ? state.key : null,
            rowsKey: state.rowsKey || null,
            values: state.values || {},
            path: state.path || null,
            id: state.id || null,
            returnTo: state.returnTo || {page: 'enquiry'}
        };
    }

    async load(context) {
        let rows = context.rowsKey
            ? FcRows.get(context.rowsKey)
            : null;

        if (TransactionMode.isEdit(context.mode) && !rows) {
            rows = await this.loadEdit(context);
        }

        if (TransactionMode.isCreate(context.mode)) {
            rows = this.loadCreate(context, rows);
        }

        if (!rows) {
            window.location.href = '../enquiry';
            return null;
        }

        if (!Number.isInteger(context.key)) {
            context.key = 0;
        }

        const transaction = rows.rows[context.key];

        if (!transaction) {
            throw new Error('FC transaction not found.');
        }

        context.rowsKey = rows.rowsKey;

        return {
            rows: rows,
            transaction: transaction,
            pageConfig: {
                title: TransactionMode.isCreate(context.mode)
                    ? 'Create FC Transaction'
                    : 'Edit FC Transaction',
                seed: context.values
            }
        };
    }

    loadCreate(context, rows) {
        if (!rows) {
            const created = FcRows.create(context.values);
            context.rowsKey = created.rowsKey;
            context.key = 0;
            return created;
        }

        if (
            Number.isInteger(context.key)
            && context.key >= rows.rows.length
        ) {
            rows = FcRows.upsertRow(
                rows.rowsKey,
                null,
                context.values
            );
        }

        return rows;
    }

    async loadEdit(context) {
        if (context.path == null || context.id == null) {
            return null;
        }

        const loaded = FcRows.load(
            await FcService.findDetail(context.path, context.id)
        );

        const index = FcRows.findIndex(
            loaded.rowsKey,
            context.path,
            context.id
        );

        const selected = FcRows.row(
            loaded.rowsKey,
            index
        ) || {};

        FcRows.clear(loaded.rowsKey);

        const rows = FcRows.create(selected);

        context.rowsKey = rows.rowsKey;
        context.key = 0;
        return rows;
    }
}

export default FcTransactionController;
