import Common from '@company/common-js-web';
import { initEnquiry } from './action/EnquiryAction.js';
import { initTransaction } from './action/TransactionAction.js';
import { initView } from './action/ViewAction.js';
import FcRoute from './FcRoute.js';

const { PageRouter } = Common;

new PageRouter()
    .route('enquiry', initEnquiry)
    .route('transaction', FcRoute.transaction(initTransaction))
    .route('view', FcRoute.view(initView))
    .start();
