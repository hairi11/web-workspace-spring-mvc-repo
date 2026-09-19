import Common from '@company/common-js-web';
import FcService from '../FcService.js';

const { DataTableBuilder, Renderers, Toast } = Common;

let table = null;

export function initEnquiry() {
    table = buildTable();
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
