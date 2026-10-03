import Common from '@company/common-js-web';

const { DateUtil, RowStore } = Common;

const ROWS_KEY_PREFIX = 'fx.rows.';

function newRowsKey() {
    return 'new-' + crypto.randomUUID();
}

function rowsKeyForMaster(masterId) {
    return masterId === null || masterId === undefined
        ? newRowsKey()
        : 'master-' + String(masterId);
}

function cloneTransaction(transaction) {
    return Object.assign({}, transaction || {});
}

function cloneRows(rows) {
    return {
        rowsKey: rows.rowsKey,
        master: Object.assign({}, rows.master || {}),
        transactions: Array.isArray(rows.transactions)
            ? rows.transactions.map(cloneTransaction)
            : []
    };
}

const store = new RowStore({
    prefix: ROWS_KEY_PREFIX,
    clone: cloneRows,
    validate: (rows, rowsKey) => rows.rowsKey === rowsKey
        && rows.master
        && Array.isArray(rows.transactions)
});

const FxRows = {
    create: function () {
        return this.save({
            rowsKey: rowsKeyForMaster(null),
            master: {
                id: null,
                status: 'DRAFT',
                reportDate: DateUtil.toApiDate(new Date())
            },
            transactions: []
        });
    },

    load: function (master, transactions) {
        return this.save({
            rowsKey: rowsKeyForMaster(master && master.id),
            master: master || {},
            transactions: transactions || []
        });
    },

    get: function (rowsKey) {
        return store.get(rowsKey);
    },

    save: function (rows) {
        if (!rows || !rows.rowsKey) {
            throw new Error('FX rows key is required.');
        }

        return store.save(rows.rowsKey, rows);
    },

    clear: function (rowsKey) {
        store.clear(rowsKey);
    },

    upsertTransaction: function (rowsKey, index, transaction) {
        const rows = this.get(rowsKey);
        if (!rows) return null;

        if (Number.isInteger(index) && index >= 0 && index < rows.transactions.length) {
            rows.transactions[index] = cloneTransaction(transaction);
        } else {
            rows.transactions.push(cloneTransaction(transaction));
        }

        return this.save(rows);
    },

    removeTransaction: function (rowsKey, index) {
        const rows = this.get(rowsKey);
        if (!rows) return null;

        if (Number.isInteger(index) && index >= 0 && index < rows.transactions.length) {
            rows.transactions.splice(index, 1);
        }

        return this.save(rows);
    }
};

export default FxRows;
