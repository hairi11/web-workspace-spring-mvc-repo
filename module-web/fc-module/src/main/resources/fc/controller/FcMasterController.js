import Common from '@company/common-js-web';
import { MasterMode } from '../FcConstants.js';
import FcRows from '../FcRows.js';
import FcMasterAction from '../action/FcMasterAction.js';
import FcMasterForm from '../form/FcMasterForm.js';

const {
    NavigationState,
    Toast
} = Common;

class FcMasterController {
    async init() {
        const context = this.loadContext();

        try {
            const data = this.load(context);

            if (!data) {
                window.location.href = './enquiry';
                return;
            }

            const form = new FcMasterForm('#fcMasterForm', {
                master: data.master,
                transactions: data.transactions,
                rowsKey: context.rowsKey
            }).build();

            new FcMasterAction({
                form: form,
                mode: context.mode,
                rowsKey: context.rowsKey,
                master: data.master,
                transactions: data.transactions
            })
                .build()
                .configure();
        } catch (error) {
            Toast.error('Failed to load FC master.');
            console.error(error);
        }
    }

    loadContext() {
        const state = NavigationState.get() || {};

        return {
            mode: state.action || MasterMode.EDIT,
            rowsKey: state.rowsKey || null
        };
    }

    load(context) {
        if (!context.rowsKey) return null;
        return FcRows.get(context.rowsKey);
    }
}

export default FcMasterController;
