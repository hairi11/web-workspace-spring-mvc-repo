import Common from '@company/common-js-web';
import { initEnquiry } from './action/EnquiryAction.js';
import { initTransaction } from './action/TransactionAction.js';
import { initView } from './action/ViewAction.js';

const { NavigationState, Router } = Common;

const router = new Router({
    resolveRoute: () => document.body?.dataset?.page
});

router
    .route('enquiry', initEnquiry)
    .route('transaction', initTransaction, {
        context: () => NavigationState.consume(),
        guard: (state) => state != null
            && (
                state.action === 'create'
                || (
                    state.action === 'edit'
                    && state.key != null
                )
            ),
        warning: 'Invalid FC transaction navigation state.'
    })
    .route('view', initView, {
        context: () => NavigationState.consume(),
        guard: (state) => state != null
            && state.action === 'view'
            && state.path != null
            && state.id != null,
        warning: 'Invalid FC view navigation state.'
    })
    .start();
