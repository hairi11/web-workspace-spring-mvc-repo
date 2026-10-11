import Common from '@company/common-js-web';
import { initEnquiry } from './action/EnquiryAction.js';
import FcTransactionController from './controller/FcTransactionController.js';
import { initView } from './action/ViewAction.js';

const { NavigationState, Router } = Common;

new Router({
    resolveRoute: () => document.body?.dataset?.page
})
    .route('enquiry', initEnquiry)
    .route('transaction', () => new FcTransactionController().init())
    .route('view', initView, {
        context: () => NavigationState.get(),
        guard: (state) => state != null
            && state.action === 'view'
            && state.path != null
            && state.id != null,
        warning: 'Invalid FC view navigation state.'
    })
    .start();
