import Common from '@company/common-js-web';

const { Storage } = Common;

const ROWS_KEY_PREFIX = 'fc.rows.';
const storage = new Storage(window.sessionStorage);

function newRowsKey() {
    return 'view-' + crypto.randomUUID();
}

function storageKey(rowsKey) {
    return ROWS_KEY_PREFIX + rowsKey;
}

function cloneRow(row) {
    return Object.assign({}, row || {});
}

function resolveRows(response) {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.rows)) return response.rows;
    if (Array.isArray(response?.data?.rows)) return response.data.rows;

    const detail = response && response.data
        ? response.data
        : response;

    return detail ? [detail] : [];
}

function cloneRows(rows) {
    return {
        rowsKey: rows.rowsKey,
        rows: Array.isArray(rows.rows)
            ? rows.rows.map(cloneRow)
            : []
    };
}

const FcRows = {
    load(response) {
        return this.save({
            rowsKey: newRowsKey(),
            rows: resolveRows(response)
        });
    },

    get(rowsKey) {
        if (!rowsKey) return null;

        const rows = storage.get(storageKey(rowsKey));

        if (
            !rows
            || rows.rowsKey !== rowsKey
            || !Array.isArray(rows.rows)
        ) {
            return null;
        }

        return cloneRows(rows);
    },

    save(rows) {
        if (!rows || !rows.rowsKey) {
            throw new Error('FC rows key is required.');
        }

        const value = cloneRows(rows);
        storage.set(storageKey(value.rowsKey), value);
        return value;
    },

    clear(rowsKey) {
        if (rowsKey) storage.remove(storageKey(rowsKey));
    },

    findIndex(rowsKey, path, id) {
        const rows = this.get(rowsKey);
        if (!rows) return 0;

        const index = rows.rows.findIndex(
            (row) => row
                && row.path === path
                && row.id === id
        );

        return index < 0 ? 0 : index;
    },

    row(rowsKey, index) {
        const rows = this.get(rowsKey);

        if (
            !rows
            || !Number.isInteger(index)
            || index < 0
            || index >= rows.rows.length
        ) {
            return null;
        }

        return cloneRow(rows.rows[index]);
    },

    count(rowsKey) {
        const rows = this.get(rowsKey);
        return rows ? rows.rows.length : 0;
    }
};

export default FcRows;
