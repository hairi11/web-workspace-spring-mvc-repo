import Common from '@company/common-js-web';
import FcService from '../FcService.js';

const { NavigationState, Toast } = Common;

export async function initView() {
    const state = NavigationState.consume();

    if (!state || state.action !== 'view' || !state.path || !state.id) {
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

    const fields = {
        string_value_1: '#stringValue1',
        string_value_2: '#stringValue2',
        date_value_1: '#dateValue1',
        string_value_3: '#stringValue3',
        string_value_4: '#stringValue4',
        amount_value: '#amountValue',
        string_value_5: '#stringValue5',
        date_value_2: '#dateValue2',
        string_value_6: '#stringValue6'
    };

    Object.entries(fields).forEach(([name, selector]) => {
        const field = document.querySelector(selector);
        if (!field) return;

        field.value = detail[name] == null
            ? ''
            : detail[name];
    });
}
