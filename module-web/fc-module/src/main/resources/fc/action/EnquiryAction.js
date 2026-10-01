import Common from '@company/common-js-web';
import FcService from '../FcService.js';

const { DataTableBuilder, Renderers, Toast } = Common;

const FORM_TYPE = 'FC_ENQUIRY';

let table = null;

export function initEnquiry() {
    table = buildTable();
    loadParameterDropdown();
    bindReloadButton();
}

function buildTable() {
    return new DataTableBuilder('#fcTable')
        .serverPage((page, size, options) => FcService.enquiry(
            page,
            size,
            options.sort
        ), {
            pageLength: 20,
            defaultOrder: [[0, 'asc']],
            onError: (error) => {
                Toast.error('Failed to load FC records.');
                console.error(error);
            }
        })
        .column('recordNo', 'Record No')
        .renderer(
            'category',
            'Category',
            Renderers.property('categoryDescription')
        )
        .column('status', 'Status')
        .build();
}

async function loadParameterDropdown() {
    const select = document.querySelector('#parameterSelect');
    if (!select) return;

    select.disabled = true;

    try {
        const parameters = await FcService.findParameters(FORM_TYPE);

        select.options.length = 0;
        select.add(new Option('Select type', ''));

        parameters.forEach((parameter) => {
            const value = parameterValue(parameter);
            const label = parameterLabel(parameter, value);

            select.add(new Option(label, value));
        });
    } catch (error) {
        Toast.error('Failed to load parameter list.');
        console.error(error);
    } finally {
        select.disabled = false;
    }
}

function parameterValue(parameter) {
    if (parameter === null || parameter === undefined) return '';
    if (typeof parameter !== 'object') return String(parameter);

    return firstValue(
        parameter.value,
        parameter.code,
        parameter.parameterCode,
        parameter.parameterValue,
        parameter.id
    );
}

function parameterLabel(parameter, fallback) {
    if (parameter === null || parameter === undefined) return fallback;
    if (typeof parameter !== 'object') return String(parameter);

    return firstValue(
        parameter.label,
        parameter.description,
        parameter.parameterDescription,
        parameter.parameterName,
        parameter.name,
        fallback
    );
}

function firstValue() {
    for (let index = 0; index < arguments.length; index += 1) {
        const value = arguments[index];

        if (value !== null && value !== undefined && value !== '') {
            return String(value);
        }
    }

    return '';
}

function bindReloadButton() {
    const reload = document.querySelector('#reloadButton');
    if (!reload) return;

    reload.addEventListener('click', () => {
        reload.disabled = true;

        try {
            table.refresh(false);
            Toast.success('FC records reloaded.');
        } finally {
            window.setTimeout(() => {
                reload.disabled = false;
            }, 300);
        }
    });
}
