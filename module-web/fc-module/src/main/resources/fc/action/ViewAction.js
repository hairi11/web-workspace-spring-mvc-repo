import Common from '@company/common-js-web';
import FcService from '../FcService.js';

const { NavigationState, Toast } = Common;

export async function initView() {
    const state = NavigationState.consume();

    if (!state || state.action !== 'view' || !state.path || !state.id) {
        return;
    }

    try {
        await FcService.findDetail(state.path, state.id);
    } catch (error) {
        Toast.error('Failed to load FC detail.');
        console.error(error);
    }
}
