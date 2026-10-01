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
        .selectCheckbox({
            style: 'multi',
            selector: 'td',
            headerCheckbox: false
        })
        .searchInput('#searchInput')
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
            onClick: viewTransaction
        })
        .addAction({
            text: 'Edit',
            icon: 'fa fa-pen',
            selection: 'single',
            onClick: editTransaction
        })
        .addAction({
            text: 'Delete',
            icon: 'fa fa-trash',
            selection: 'multi',
            variant: 'danger',
            onClick: deleteTransactions
        })
        .addAction({
            text: 'Create',
            icon: 'fa fa-plus',
            selection: 'none',
            placement: 'end',
            variant: 'primary',
            onClick: createTransaction
        })
        .menuAction({ mode: 'context' })
        .addAction({
            text: 'View',
            icon: 'fa fa-eye',
            onClick: viewTransaction
        })
        .addAction({
            text: 'Edit',
            icon: 'fa fa-pen',
            onClick: editTransaction
        })
        .addAction({ divider: true })
        .addAction({
            text: 'Delete Transaction',
            icon: 'fa fa-trash',
            onClick: deleteTransaction
        })
        .build();
}

function viewTransaction(row) {
    openTransaction(
        TransactionMode.VIEW,
        row.id,
        null,
        { page: 'enquiry' }
    );
}

function editTransaction(row) {
    return openExistingTransaction(row.masterId, row.id);
}

function deleteTransaction(row) {
    return deleteTransactions([row]);
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

async function deleteTransactions(rows) {
    const count = rows.length;
    if (!count) return;

    const confirmed = await Dialog.confirm({
        title: count === 1 ? 'Delete FX Transaction' : 'Delete FX Transactions',
        message: count === 1
            ? 'Delete this FX transaction?'
            : 'Delete the ' + count + ' selected FX transactions?',
        yesLabel: 'Delete',
        noLabel: 'Cancel'
    });
    if (!confirmed) return;

    const results = await Promise.allSettled(
        rows.map((row) => FxService.deleteTransaction(row.id))
    );
    const failed = results.filter((result) => result.status === 'rejected');
    const deletedCount = count - failed.length;

    failed.forEach((result) => console.error(result.reason));

    if (deletedCount === count) {
        Toast.success(
            count === 1
                ? 'FX transaction deleted.'
                : count + ' FX transactions deleted.'
        );
    } else if (deletedCount === 0) {
        Toast.error('Failed to delete selected FX transaction(s).');
    } else {
        Toast.warning(
            deletedCount + ' FX transaction(s) deleted; '
            + failed.length + ' failed.'
        );
    }

    table.refresh(false);
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
