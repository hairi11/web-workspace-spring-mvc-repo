import FcHomeAction from '../action/FcHomeAction.js';
import FcForm from '../form/FcForm.js';

export default class FcHomeController {

    init() {
        const form = new FcForm();
        new FcHomeAction(form).init();
    }
}
