import Common from '@company/common-js-web';
import FcService from '../FcService.js';
import FcFormValues from '../FcFormValues.js';

const { NavigationState, Toast } = Common;

export async function initView() {
    const state = NavigationState.consume();

    if (
        !state
        || state.action !== 'view'
        || state.path == null
        || state.id == null
    ) {
        console.error('Missing FC view navigation state.', state);
        Toast.error('Unable to load FC detail.');
        return;
    }

    try {
        const response = await FcService.findDetail(state.path, state.id);
        populateView(response && response.data ? response.data : response);
    } catch (error) {
        Toast.error('Failed to load FC detail.');
        console.error(error);
    }
}

function populateView(detail) {
    if (!detail) return;

    FcFormValues.populateView(detail);
}
