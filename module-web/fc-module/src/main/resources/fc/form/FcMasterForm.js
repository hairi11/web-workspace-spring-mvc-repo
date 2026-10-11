import Common from '@company/common-js-web';

const { FormAction } = Common;

class FcMasterForm extends FormAction {
    constructor(selector, options) {
        super(selector);
        this.options = options || {};
        this.rows = Array.isArray(this.options.rows)
            ? this.options.rows
            : [];
    }

    setRows(rows) {
        this.rows = Array.isArray(rows) ? rows : [];
        return this;
    }

    buildRequestData() {
        return {
            rows: this.rows
        };
    }

    beforeSubmit() {
        return false;
    }
}

export default FcMasterForm;
