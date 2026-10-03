const Storage = require('./Storage');

class RowStore {
    constructor(options) {
        options = options || {};

        if (!options.prefix) {
            throw new Error('RowStore prefix is required.');
        }

        this.prefix = options.prefix;
        this.clone = typeof options.clone === 'function'
            ? options.clone
            : function (value) { return value; };
        this.validate = typeof options.validate === 'function'
            ? options.validate
            : function () { return true; };
        this.storage = new Storage(
            options.provider || window.sessionStorage
        );
    }

    key(rowsKey) {
        return this.prefix + rowsKey;
    }

    get(rowsKey) {
        if (!rowsKey) return null;

        const value = this.storage.get(this.key(rowsKey));

        if (!value || !this.validate(value, rowsKey)) {
            return null;
        }

        return this.clone(value);
    }

    save(rowsKey, value) {
        if (!rowsKey) {
            throw new Error('RowStore rows key is required.');
        }

        const stored = this.clone(value);
        this.storage.set(this.key(rowsKey), stored);
        return this.clone(stored);
    }

    clear(rowsKey) {
        if (rowsKey) {
            this.storage.remove(this.key(rowsKey));
        }
    }
}

module.exports = RowStore;
