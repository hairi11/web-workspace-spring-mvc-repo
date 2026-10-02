import Common from '@company/common-js-web';
import FcService from '../FcService.js';

const { NavigationState, Toast } = Common;

export async function initTransaction() {
    const state = NavigationState.consume();

    if (!state || state.action !== 'view' || !state.key) {
        return;
    }

    try {
        await FcService.findDetail(state.key);
    } catch (error) {
        Toast.error('Failed to load FC detail.');
        console.error(error);
    }
}
