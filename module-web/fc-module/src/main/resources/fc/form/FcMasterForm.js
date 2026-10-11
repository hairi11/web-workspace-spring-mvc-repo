import Common from '@company/common-js-web';

const { FormAction } = Common;

class FcMasterForm extends FormAction {
    constructor(selector, options) {
        super(selector);
        this.options = options || {};
        this.master = this.options.master || {};
        this.transactions = Array.isArray(this.options.transactions)
            ? this.options.transactions
            : [];
    }

    setTransactions(transactions) {
        this.transactions = Array.isArray(transactions)
            ? transactions
            : [];
        return this;
    }

    buildRequestData() {
        return {
            master: this.master,
            transactions: this.transactions
        };
    }

    beforeSubmit() {
        return false;
    }
}

export default FcMasterForm;
