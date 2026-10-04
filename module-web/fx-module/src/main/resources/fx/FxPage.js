import Common from '@company/common-js-web';
import { initEnquiry } from './action/EnquiryAction.js';
import FxMasterController from './controller/FxMasterController.js';
import FxTransactionController from './controller/FxTransactionController.js';

const { Router } = Common;

new Router({
    resolveRoute: () => document.body?.dataset?.page
})
    .route('enquiry', initEnquiry)
    .route('master', () => new FxMasterController().init())
    .route('transaction', () => new FxTransactionController().init())
    .start();
