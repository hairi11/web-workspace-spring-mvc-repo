import Common from '@company/common-js-web';
import { TransactionMode } from '../FxConstants.js';
import FxRows from '../FxRows.js';
import FxService from '../FxService.js';

const { DataTableBuilder, Dialog, NavigationState, Renderers, Toast } = Common;

let table = null;

export function initEnquiry() {
    table = buildTable();
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
            selector: 'td',
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
        .toolbarAction()
        .addAction({
            text: 'View',
            icon: 'fa fa-eye',
            selection: 'single',
            onClick: (row) => openTransaction(
                TransactionMode.VIEW,
                row.id,
                null,
                { page: 'enquiry' }
            )
        })
        .addAction({
            text: 'Edit',
            icon: 'fa fa-pen',
            selection: 'single',
            onClick: (row) => openExistingTransaction(row.masterId, row.id)
        })
        .addAction({
            text: 'Delete',
            icon: 'fa fa-trash',
            selection: 'multi',
            variant: 'danger',
            onClick: (rows) => deleteTransactions(rows)
        })
        .addAction({
            text: 'Create',
            icon: 'fa fa-plus',
            selection: 'none',
            placement: 'end',
            variant: 'primary',
            onClick: () => createTransaction()
        })
        .menuAction({ mode: 'context' })
        .addAction({
            text: 'View',
            icon: 'fa fa-eye',
            onClick: (row) => openTransaction(
                TransactionMode.VIEW,
                row.id,
                null,
                { page: 'enquiry' }
            )
        })
        .addAction({
            text: 'Edit',
            icon: 'fa fa-pen',
            onClick: (row) => openExistingTransaction(row.masterId, row.id)
        })
        .addAction({ divider: true })
        .addAction({
            text: 'Delete Transaction',
            icon: 'fa fa-trash',
            onClick: (row) => deleteTransactions([row])
        })
        .build();
}

function createTransaction() {
    const rows = FxRows.create();
    openTransaction(
        TransactionMode.CREATE,
        null,
        rows.rowsKey,
        { page: 'enquiry' }
    );
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
