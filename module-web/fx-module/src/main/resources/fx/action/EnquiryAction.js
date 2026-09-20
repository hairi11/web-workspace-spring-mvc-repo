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

function buildTable() {
    return new DataTableBuilder('#fxTable')
        .serverPage((page, size, options) => FxService.enquiry(
            page,
            size,
            options.sort
        ), {
            pageLength: 20,
            defaultOrder: [[0, 'desc'], [1, 'asc']],
            onError: (error) => {
                Toast.error('Failed to load FX records.');
                console.error(error);
            }
        })
        .option('select', { style: 'single' })
        .searchInput('#searchInput')
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
        const enabled = Boolean(selectedRow());
        view.disabled = !enabled;
        edit.disabled = !enabled;
        remove.disabled = !enabled;
    };

    table.table.on('select deselect draw', updateState);

    view.addEventListener('click', () => {
        const row = selectedRow();
        if (!row) return;

        openTransaction(
            TransactionMode.VIEW,
            row.id,
            null,
            { page: 'enquiry' }
        );
    });

    edit.addEventListener('click', () => {
        const row = selectedRow();
        if (!row) return;
        openExistingTransaction(row.masterId, row.id);
    });

    remove.addEventListener('click', async () => {
        const row = selectedRow();
        if (!row) return;
        await deleteTransaction(row);
    });

    updateState();
}

function selectedRow() {
    if (!table || !table.table) return null;

    const rows = table.table.rows({ selected: true });
    if (rows.count() !== 1) return null;

    return rows.data()[0] || null;
}

async function deleteTransaction(row) {
    const confirmed = await Dialog.confirm({
        title: 'Delete FX Transaction',
        message: 'Delete this FX transaction?',
        yesLabel: 'Delete',
        noLabel: 'Cancel'
    });
    if (!confirmed) return;

    try {
        await FxService.deleteTransaction(row.id);
        Toast.success('FX transaction deleted.');
        table.refresh(false);
    } catch (error) {
        Toast.error('Failed to delete FX transaction.');
        console.error(error);
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
