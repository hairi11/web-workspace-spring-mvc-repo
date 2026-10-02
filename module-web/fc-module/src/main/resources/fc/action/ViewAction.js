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
        renderDetail(detailData(response));
    } catch (error) {
        renderMessage('Unable to load detail.');
        Toast.error('Failed to load FC detail.');
        console.error(error);
    }
}

function detailData(response) {
    if (response && isPlainObject(response.data)) {
        return response.data;
    }

    return isPlainObject(response) ? response : {};
}

function renderDetail(detail) {
    const container = document.querySelector('#viewContent');
    if (!container) return;

    container.replaceChildren();

    const entries = Object.entries(detail);

    if (!entries.length) {
        renderMessage('No detail available.');
        return;
    }

    entries.forEach(([name, value]) => {
        container.appendChild(createField(name, value));
    });
}

function createField(name, value) {
    const group = document.createElement('div');
    group.className = 'form-group view-detail-field';

    const label = document.createElement('label');
    label.textContent = fieldLabel(name);

    const complex = value !== null && typeof value === 'object';
    const control = document.createElement(complex ? 'textarea' : 'input');

    if (!complex) {
        control.type = 'text';
    } else {
        control.rows = 4;
        group.classList.add('view-detail-field-wide');
    }

    control.value = displayValue(value);
    control.readOnly = true;
    control.setAttribute('aria-label', fieldLabel(name));

    group.append(label, control);
    return group;
}

function fieldLabel(name) {
    return String(name)
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (character) => character.toUpperCase());
}

function displayValue(value) {
    if (value === null || value === undefined) {
        return '';
    }

    if (typeof value === 'object') {
        return JSON.stringify(value, null, 2);
    }

    return String(value);
}

function renderMessage(message) {
    const container = document.querySelector('#viewContent');
    if (!container) return;

    const element = document.createElement('div');
    element.className = 'view-detail-message';
    element.textContent = message;

    container.replaceChildren(element);
}

function isPlainObject(value) {
    return value !== null &&
        typeof value === 'object' &&
        !Array.isArray(value);
}
