import Common from '@company/common-js-web';
import FcService from '../FcService.js';

const { DataTableBuilder, Renderers, Select2, Toast } = Common;

const FORM_TYPE = 'FC_ENQUIRY';
const PARAMETER_LIST = 'fcCode';

let parameterSelect = null;
let table = null;

export function initEnquiry() {
    table = buildTable();
    parameterSelect = buildParameterSelect();
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

function buildParameterSelect() {
    return new Select2('#parameterSelect', {
        placeholder: 'Select type',
        allowClear: true
    })
        .build()
        .disable();
}

async function loadParameterDropdown() {
    const select = document.querySelector('#parameterSelect');
    if (!select || !parameterSelect) return;

    try {
        const parameters = await FcService.findParameters(
            FORM_TYPE,
            PARAMETER_LIST
        );

        parameterSelect.destroy();

        select.options.length = 0;
        select.add(new Option('', ''));

        parameters.forEach((parameter) => {
            const value = parameterValue(parameter);
            const label = parameterLabel(parameter, value);

            select.add(new Option(label, value));
        });

        parameterSelect = new Select2('#parameterSelect', {
            placeholder: 'Select type',
            allowClear: true
        })
            .build()
            .enable();
    } catch (error) {
        parameterSelect.enable();
        Toast.error('Failed to load parameter list.');
        console.error(error);
    }
}

function parameterValue(parameter) {
    if (parameter === null || parameter === undefined) return '';
    if (typeof parameter !== 'object') return String(parameter);

    return firstValue(
        parameter.id,
        parameter.value,
        parameter.code
    );
}

function parameterLabel(parameter, fallback) {
    if (parameter === null || parameter === undefined) return fallback;
    if (typeof parameter !== 'object') return String(parameter);

    return firstValue(
        parameter.text,
        parameter.label,
        parameter.description,
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
