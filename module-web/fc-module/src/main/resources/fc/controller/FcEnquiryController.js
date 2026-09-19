import Common from '@company/common-js-web';
import FcEnquiryAction from '../action/FcEnquiryAction.js';
import FcEnquiryForm from '../form/FcEnquiryForm.js';

const { Toast } = Common;

export default class FcEnquiryController {

    async init() {
        const form = new FcEnquiryForm();
        const action = new FcEnquiryAction(form);

        try {
            await action.init();
        } catch (error) {
            Toast.error('Failed to load FC records.');
            console.error(error);
        }
    }
}
