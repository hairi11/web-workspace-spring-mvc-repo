import FcEnquiryAction from '../action/FcEnquiryAction.js';
import FcEnquiryForm from '../form/FcEnquiryForm.js';

export default class FcEnquiryController {

    init() {
        const form = new FcEnquiryForm();
        new FcEnquiryAction(form).init();
    }
}
