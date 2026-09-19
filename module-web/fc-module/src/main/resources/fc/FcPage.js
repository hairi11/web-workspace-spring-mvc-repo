import Common from '@company/common-js-web';
import { initEnquiry } from './action/EnquiryAction.js';

const { PageRouter } = Common;

new PageRouter()
    .route('enquiry', initEnquiry)
    .start();
