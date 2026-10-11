import Common from '@company/common-js-web';
import { FormType } from '../FcConstants.js';
import FcRows from '../FcRows.js';
import FcService from '../FcService.js';

const {
    FieldTranslator,
    FormControls
} = Common;

class FcTransactionForm {
    constructor(target, options) {
        this.target = target;
        this.options = options || {};
        this.form = null;
        this.parameters = {};
    }

    async loadParameters() {
        this.parameters = await FcService.findParameters(
            FormType.PARAMETER
        );

        return this.parameters;
    }

    build() {
        this.form = new FormControls(this.target)
            .build()
            .labels((key) => FieldTranslator.label(key))
            .dates()
            .currencies()
            .choices(
                (key) => {
                    const parameter = key === 'string_value_11'
                        ? 'string_value_11_iso'
                        : FieldTranslator.field(key);

                    return this.parameters[parameter] || [];
                }
            );

        return this;
    }

    populate(values) {
        if (!this.form || !values) return this;

        this.form.populate(this.toFormValues(values));
        return this;
    }

    saveWorkingRow() {
        const rows = FcRows.get(this.options.rowsKey);
        if (!rows) return null;

        const existing = Number.isInteger(this.options.key)
            ? rows.rows[this.options.key] || {}
            : {};

        return FcRows.upsertRow(
            this.options.rowsKey,
            this.options.key,
            Object.assign(
                {},
                existing,
                this.toStorageValues(this.form.read())
            )
        );
    }

    toStorageValues(values) {
        return Object.fromEntries(
            Object.entries(values || {}).map(([key, value]) => [
                FieldTranslator.field(key),
                value
            ])
        );
    }

    toFormValues(source) {
        source = source || {};

        return this.form.keys().reduce((values, key) => {
            const field = FieldTranslator.field(key);

            values[key] = source[field] !== undefined
                ? source[field]
                : source[key];

            return values;
        }, {});
    }
}

export default FcTransactionForm;
