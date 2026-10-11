import Common from '@company/common-js-web';
import { FormType } from '../FcConstants.js';
import FcRows from '../FcRows.js';
import FcService from '../FcService.js';

const {
    FieldTranslator,
    FormAction,
    FormControls
} = Common;

class FcTransactionForm extends FormAction {
    constructor(selector, options) {
        super(selector);
        this.options = options || {};
        this.parameters = {};
        this.controls = null;
    }

    async loadParameters() {
        this.parameters = await FcService.findParameters(
            FormType.PARAMETER
        );

        return this.parameters;
    }

    onBuild() {
        this.controls = new FormControls(this.form)
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

        if (this.formState) {
            this.formState.resetBaseline();
        }
    }

    populate(values) {
        if (!this.controls || !values) return this;

        this.controls.populate(this.toFormValues(values));

        if (this.formState) {
            this.formState.resetBaseline();
        }

        return this;
    }

    buildRequestData(values) {
        return this.toStorageValues(values);
    }

    beforeSubmit(context) {
        this.saveWorkingRow(context.data);
        return false;
    }

    saveWorkingRow(data) {
        const rows = FcRows.get(this.options.rowsKey);
        if (!rows) return null;

        const index = Number.isInteger(this.options.key)
            ? this.options.key
            : null;
        const existing = Number.isInteger(index)
            ? rows.rows[index] || {}
            : {};
        const values = data || this.buildRequestData(
            this.serializeForm()
        );

        const saved = FcRows.upsertRow(
            this.options.rowsKey,
            index,
            Object.assign({}, existing, values)
        );

        if (saved && this.formState) {
            this.formState.resetBaseline();
        }

        return saved;
    }

    shouldTrackDirty() {
        return true;
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

        return this.controls.keys().reduce((values, key) => {
            const field = FieldTranslator.field(key);

            values[key] = source[field] !== undefined
                ? source[field]
                : source[key];

            return values;
        }, {});
    }
}

export default FcTransactionForm;
