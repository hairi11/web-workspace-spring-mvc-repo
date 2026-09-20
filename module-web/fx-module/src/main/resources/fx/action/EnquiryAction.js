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

function tableDom() {
    return '<"datatable-action-toolbar"B>'
        + 't'
        + '<"row align-items-center mt-3"'
        + '<"col-12 col-md-4"l>'
        + '<"col-12 col-md-4 text-md-center mt-2 mt-md-0"i>'
        + '<"col-12 col-md-4 d-flex justify-content-md-end mt-2 mt-md-0"p>'
        + '>';
}

function tableButtons() {
    return [
        {
            extend: 'selectedSingle',
            text: '<i class="fa fa-eye" aria-hidden="true"></i><span>View</span>',
            className: 'datatable-action-button buttons-view',
            action: function (_event, dt) {
                const row = dt.row({ selected: true }).data();
                if (!row) return;

                openTransaction(
                    TransactionMode.VIEW,
                    row.id,
                    null,
                    { page: 'enquiry' }
                );
            }
        },
        {
            extend: 'selectedSingle',
            text: '<i class="fa fa-pen" aria-hidden="true"></i><span>Edit</span>',
            className: 'datatable-action-button buttons-edit',
            action: function (_event, dt) {
                const row = dt.row({ selected: true }).data();
                if (!row) return;
                openExistingTransaction(row.masterId, row.id);
            }
        },
        {
            name: 'deleteSelected',
            text: '<i class="fa fa-trash" aria-hidden="true"></i><span>Delete</span>',
            className: 'datatable-action-button datatable-action-button-danger buttons-delete',
            enabled: false,
            init: function (dt) {
                const update = () => {
                    const count = dt.rows({ selected: true }).count();
                    dt.button('deleteSelected:name').enable(count > 1);
                };

                dt.on(
                    'select.fxDeleteButton deselect.fxDeleteButton draw.fxDeleteButton',
                    update
                );
                update();
            },
            action: function (_event, dt) {
                const rows = dt.rows({ selected: true }).data().toArray();
                if (rows.length <= 1) return;
                deleteTransactions(rows);
            }
        },
        {
            text: '<i class="fa fa-plus" aria-hidden="true"></i><span>Create</span>',
            className: 'datatable-action-button datatable-action-button-primary buttons-create',
            action: function () {
                createTransaction();
            }
        }
    ];
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
        .option('dom', tableDom())
        .option('buttons', tableButtons())
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
