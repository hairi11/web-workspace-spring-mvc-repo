import Common from '@company/common-js-web';
import { initEnquiry } from './action/EnquiryAction.js';
import { initForm } from './action/FormAction.js';
import { initView } from './action/ViewAction.js';

const { PageRouter } = Common;

new PageRouter()
    .route('enquiry', initEnquiry)
    .route('form', initForm)
    .route('view', initView)
    .start();
