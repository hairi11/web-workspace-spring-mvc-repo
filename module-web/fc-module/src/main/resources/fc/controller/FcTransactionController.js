import Common from '@company/common-js-web';
import FcRows from '../FcRows.js';
import FcService from '../FcService.js';
import FcTransactionAction from '../action/FcTransactionAction.js';
import FcTransactionForm from '../form/FcTransactionForm.js';

const {
    NavigationState,
    PageControls,
    Toast
} = Common;

class FcTransactionController {
    async init() {
        const state = NavigationState.get() || {};
        const page = new PageControls(document).build();

        try {
            const context = await this.load(state);

            const form = new FcTransactionForm(
                page.component('transaction-form'),
                {
                    rowsKey: context.rowsKey
                }
            );

            await form.loadParameters();
            form.build();
            form.populate(context.row);

            new FcTransactionAction({
                form: form,
                state: state,
                rowsKey: context.rowsKey,
                key: context.key,
                seed: context.seed,
                returnTo: state.returnTo,
                page: page
            })
                .build()
                .saveState();
        } catch (error) {
            Toast.error(
                state.action === 'edit'
                    ? 'Failed to load FC transaction.'
                    : 'Failed to load transaction parameters.'
            );
            console.error(error);
        }
    }

    async load(state) {
        if (state.rowsKey) {
            const rows = FcRows.get(state.rowsKey);

            if (rows) {
                const key = Number.isInteger(state.key)
                    ? state.key
                    : 0;

                return {
                    rowsKey: state.rowsKey,
                    key: key,
                    row: rows.rows[key] || {},
                    seed: state.values || {}
                };
            }
        }

        if (state.action === 'edit') {
            return this.loadEdit(state);
        }

        const seed = state.values || {};
        const rows = FcRows.create(seed);

        return {
            rowsKey: rows.rowsKey,
            key: 0,
            row: rows.rows[0] || {},
            seed: seed
        };
    }

    async loadEdit(state) {
        const loaded = FcRows.load(
            await FcService.findDetail(state.path, state.id)
        );

        const index = FcRows.findIndex(
            loaded.rowsKey,
            state.path,
            state.id
        );

        const selected = FcRows.row(
            loaded.rowsKey,
            index
        ) || {};

        FcRows.clear(loaded.rowsKey);

        const rows = FcRows.create(selected);

        return {
            rowsKey: rows.rowsKey,
            key: 0,
            row: rows.rows[0] || {},
            seed: {}
        };
    }
}

export default FcTransactionController;
