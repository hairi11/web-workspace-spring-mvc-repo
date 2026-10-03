import Common from '@company/common-js-web';
import FcSupport from '../FcSupport.js';

const { Toast } = Common;

export function initTransaction() {
    const state = FcSupport.navigation.consumeTransaction();

    if (!state) {
        Toast.error('Unable to load FC transaction.');
    }
}
