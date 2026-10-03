import Common from '@company/common-js-web';
import FcNavigationState from '../FcNavigationState.js';

const { Toast } = Common;

export function initTransaction() {
    const state = FcNavigationState.consumeTransaction();

    if (!state) {
        Toast.error('Unable to load FC transaction.');
    }
}
