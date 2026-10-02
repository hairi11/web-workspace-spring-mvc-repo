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

    setValue('#stringValue1', detail.string_value_1);
    setValue('#stringValue2', detail.string_value_2);
    setValue('#dateValue1', detail.date_value_1);
    setValue('#stringValue3', detail.string_value_3);
    setValue('#stringValue4', detail.string_value_4);
    setValue('#amountValue', detail.amount_value);
    setValue('#stringValue5', detail.string_value_5);
    setValue('#dateValue2', detail.date_value_2);
    setValue('#stringValue6', detail.string_value_6);
}

function setValue(selector, value) {
    const field = document.querySelector(selector);
    if (!field) return;

    field.value = value == null ? '' : value;
}
