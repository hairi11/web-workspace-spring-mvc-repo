const createStore = require('unistore');
const FormValues = require('../form/FormValues');

class FormState {
    constructor(form) {
        this.form = form;
        this.store = createStore({
            initial: FormValues.serialize(form)
        });
    }

    snapshot() {
        return FormValues.serialize(this.form);
    }

    isDirty() {
        return JSON.stringify(this.snapshot()) !== JSON.stringify(this.store.getState().initial);
    }

    resetBaseline() {
        this.store.setState({
            initial: this.snapshot()
        });
        return this;
    }
}

module.exports = FormState;
