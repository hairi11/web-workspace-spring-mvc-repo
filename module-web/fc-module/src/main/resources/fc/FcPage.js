import Common from '@company/common-js-web';
import FcEnquiryController from './controller/FcEnquiryController.js';

const { PageRouter } = Common;

new PageRouter()
    .route('enquiry', () => new FcEnquiryController().init())
    .start();
