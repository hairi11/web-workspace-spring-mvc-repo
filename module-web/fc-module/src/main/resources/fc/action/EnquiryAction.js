import Common from '@company/common-js-web';
import { FormType } from '../FcConstants.js';
import FcFormValues from '../FcFormValues.js';
import FcService from '../FcService.js';

const { DataTableBuilder, DatePicker, Renderers, Select2, Toast } = Common;

let table = null;

export function initEnquiry() {
    table = prepareEnquiryTable();
    prepareEnquiryCriteria();
    prepareEnquirySearch();
}

async function prepareEnquiryCriteria() {
    DatePicker.range('#dateFrom', '#dateTo');

    const parameterSelects = {
        '#fcCodeSelect': {
            list: 'fcCode',
            placeholder: 'Select FC code'
        },
        '#fxCodeSelect': {
            list: 'fxCode',
            placeholder: 'Select FX code'
        }
    };

    try {
        const parameters = await FcService.findParameters(FormType.ENQUIRY);

        Object.entries(parameterSelects).forEach(([selector, config]) => {
            new Select2(selector, {
                placeholder: config.placeholder,
                allowClear: true
            })
                .build()
                .load(parameters[config.list] || []);
        });
    } catch (error) {
        Toast.error('Failed to load parameter list.');
        console.error(error);
    }
}

function prepareEnquiryTable() {
    return new DataTableBuilder('#fcTable')
        .serverPage((page, size, options) => FcService.enquiry(
            page,
            size,
            options.sort,
            FcFormValues.values()
        ), {
            pageLength: 20,
            onError: (error) => {
                Toast.error('Failed to load FC records.');
                console.error(error);
            }
        })
        .selectCheckbox({
            style: 'multi',
            selector: 'td',
            headerCheckbox: false
        })
        .column('stringValue', 'String')
        .renderer('dateValue', 'Date', Renderers.date())
        .renderer('currencyValue', 'Currency', Renderers.amount())
        .toolbarAction()
        .addAction({
            text: 'View',
            icon: 'fa fa-eye',
            selection: 'single',
            onClick: () => {}
        })
        .addAction({
            text: 'Edit',
            icon: 'fa fa-pen',
            selection: 'single',
            onClick: () => {}
        })
        .addAction({
            text: 'Delete',
            icon: 'fa fa-trash',
            selection: 'multi',
            variant: 'danger',
            onClick: () => {}
        })
        .addAction({
            text: 'Create',
            icon: 'fa fa-plus',
            selection: 'none',
            placement: 'end',
            variant: 'primary',
            onClick: () => {}
        })
        .menuAction({ mode: 'context' })
        .addAction({
            text: 'View',
            icon: 'fa fa-eye',
            onClick: () => {}
        })
        .addAction({
            text: 'Edit',
            icon: 'fa fa-pen',
            onClick: () => {}
        })
        .addAction({ divider: true })
        .addAction({
            text: 'Delete',
            icon: 'fa fa-trash',
            onClick: () => {}
        })
        .build();
}

function prepareEnquirySearch() {
    const search = document.querySelector('#searchButton');
    if (!search) return;

    search.addEventListener('click', () => {
        search.disabled = true;

        try {
            table.refresh(false);
            Toast.success('FC records searched.');
        } finally {
            window.setTimeout(() => {
                search.disabled = false;
            }, 300);
        }
    });
}
