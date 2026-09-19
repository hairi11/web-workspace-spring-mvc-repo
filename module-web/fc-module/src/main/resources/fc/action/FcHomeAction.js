export default class FcHomeAction {

    constructor(form) {
        this.form = form;
    }

    init() {
        const status = this.form.getStatusElement();
        if (status) {
            status.textContent = 'FC module is ready.';
        }
    }
}
