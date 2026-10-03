import Common from '@company/common-js-web';
import FcService from '../FcService.js';

const { NavigationState, Renderers, Toast } = Common;

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

    const fields = {
        string_value_1: {
            selector: '#stringValue1'
        },
        string_value_2: {
            selector: '#stringValue2'
        },
        date_value_1: {
            selector: '#dateValue1',
            format: Renderers.date()
        },
        string_value_3: {
            selector: '#stringValue3'
        },
        string_value_4: {
            selector: '#stringValue4'
        },
        amount_value: {
            selector: '#amountValue',
            format: Renderers.amount({
                minimumFractionDigits: 4,
                maximumFractionDigits: 4
            })
        },
        amount_value_2: {
            selector: '#amountValue2',
            format: Renderers.amount({
                minimumFractionDigits: 6,
                maximumFractionDigits: 6
            })
        },
        string_value_5: {
            selector: '#stringValue5'
        },
        date_value_2: {
            selector: '#dateValue2',
            format: Renderers.date()
        },
        string_value_6: {
            selector: '#stringValue6'
        }
    };

    Object.entries(fields).forEach(([name, config]) => {
        const field = document.querySelector(config.selector);
        if (!field) return;

        const value = detail[name];

        field.textContent = config.format
            ? config.format(value, 'display')
            : (value == null ? '' : value);
    });
}
