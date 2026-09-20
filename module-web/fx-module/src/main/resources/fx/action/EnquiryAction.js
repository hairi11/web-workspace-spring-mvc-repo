import Common from '@company/common-js-web';
import { TransactionMode } from '../FxConstants.js';
import FxRows from '../FxRows.js';
import FxService from '../FxService.js';

const { DataTableBuilder, Dialog, NavigationState, Renderers, Toast } = Common;

let table = null;

export function initEnquiry() {
    table = buildTable();
    bindTableActions();
    bindCreateButton();
    bindReloadButton();
}

function selectCheckboxRenderer() {
    const render = window.jQuery
        && window.jQuery.fn
        && window.jQuery.fn.dataTable
        && window.jQuery.fn.dataTable.render;

    if (!render || typeof render.select !== 'function') {
        throw new Error('DataTables Select checkbox renderer is not available.');
    }

    return render.select();
}

function buildTable() {
    return new DataTableBuilder('#fxTable')
        .serverPage((page, size, options) => FxService.enquiry(
            page,
            size,
            options.sort
        ), {
            pageLength: 20,
            defaultOrder: [[1, 'desc'], [2, 'asc']],
            onError: (error) => {
                Toast.error('Failed to load FX records.');
                console.error(error);
            }
        })
        .option('select', {
            style: 'multi',
            selector: 'td.dt-select-column',
            headerCheckbox: false
        })
        .searchInput('#searchInput')
        .column(null, '', {
            orderable: false,
            searchable: false,
            className: 'dt-select-column',
            width: '36px',
            render: selectCheckboxRenderer()
        })
        .renderer('reportDate', 'Report Date', Renderers.date())
        .column('recordNo', 'Record No')
        .renderer('fxCategory', 'FX Category', Renderers.property('fxCategoryDescription'))
        .renderer('fxCode', 'FX Code', Renderers.property('fxCodeDescription'))
        .renderer('fxType', 'FX Type', Renderers.property('fxTypeDescription'))
        .renderer('fxAmount', 'FX Amount', Renderers.amount())
        .renderer('fxDate', 'FX Date', Renderers.date())
        .build();
}

function bindTableActions() {
    const view = document.querySelector('#viewFxButton');
    const edit = document.querySelector('#editFxButton');
    const remove = document.querySelector('#deleteFxButton');

    if (!view || !edit || !remove || !table || !table.table) return;

    const updateState = () => {
        const enabled = selectedRows().length > 0;
        view.disabled = !enabled;
        edit.disabled = !enabled;
        remove.disabled = !enabled;
    };

    table.table.on('select deselect draw', updateState);

    view.addEventListener('click', () => {
        const row = selectedRows()[0];
        if (!row) return;

        openTransaction(
            TransactionMode.VIEW,
            row.id,
            null,
            { page: 'enquiry' }
        );
    });

    edit.addEventListener('click', () => {
        const row = selectedRows()[0];
        if (!row) return;
        openExistingTransaction(row.masterId, row.id);
    });

    remove.addEventListener('click', async () => {
        const rows = selectedRows();
        if (!rows.length) return;
        await deleteTransactions(rows);
    });

    updateState();
}

function selectedRows() {
    if (!table || !table.table) return [];

    return table.table
        .rows({ selected: true })
        .data()
        .toArray();
}

async function deleteTransactions(rows) {
    const count = rows.length;
    const confirmed = await Dialog.confirm({
        title: count === 1 ? 'Delete FX Transaction' : 'Delete FX Transactions',
        message: count === 1
            ? 'Delete this FX transaction?'
            : 'Delete the ' + count + ' selected FX transactions?',
        yesLabel: 'Delete',
        noLabel: 'Cancel'
    });
    if (!confirmed) return;

    try {
        await Promise.all(rows.map((row) => FxService.deleteTransaction(row.id)));
        Toast.success(
            count === 1
                ? 'FX transaction deleted.'
                : count + ' FX transactions deleted.'
        );
        table.refresh(false);
    } catch (error) {
        Toast.error('Failed to delete selected FX transaction(s).');
        console.error(error);
        table.refresh(false);
    }
}

function bindCreateButton() {
    const button = document.querySelector('#createFxButton');
    if (!button) return;

    button.addEventListener('click', () => {
        const rows = FxRows.create();
        openTransaction(
            TransactionMode.CREATE,
            null,
            rows.rowsKey,
            { page: 'enquiry' }
        );
    });
}

async function openExistingTransaction(masterId, transactionId) {
    try {
        const [master, transactions] = await Promise.all([
            FxService.findMasterById(masterId),
            FxService.findTransactionsByMasterId(masterId)
        ]);

        const index = transactions.findIndex((transaction) => transaction.id === transactionId);
        if (!master || index < 0) throw new Error('FX transaction not found.');

        const rows = FxRows.load(master, transactions);
        openTransaction(
            TransactionMode.EDIT,
            index,
            rows.rowsKey,
            { page: 'enquiry' }
        );
    } catch (error) {
        Toast.error('Failed to load FX record.');
        console.error(error);
    }
}

function openTransaction(mode, key, rowsKey, returnTo) {
    NavigationState.set({
        page: 'transaction',
        action: mode,
        key: key,
        rowsKey: rowsKey,
        returnTo: returnTo
    });
    window.location.href = './transaction';
}

function bindReloadButton() {
    const reload = document.querySelector('#reloadButton');
    if (!reload) return;

    reload.addEventListener('click', () => {
        reload.disabled = true;

        try {
            table.refresh(false);
            Toast.success('FX records reloaded.');
        } finally {
            window.setTimeout(() => {
                reload.disabled = false;
            }, 300);
        }
    });
}
