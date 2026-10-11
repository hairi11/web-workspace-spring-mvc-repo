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
        return Object.fromEntries(
            Object.entries(values || {}).map(([key, value]) => [
                FieldTranslator.field(key),
                value
            ])
        );
    }

    beforeSubmit(context) {
        const rows = FcRows.get(this.options.rowsKey);
        if (!rows) return false;

        const index = Number.isInteger(this.options.key)
            ? this.options.key
            : null;
        const existing = Number.isInteger(index)
            ? rows.rows[index] || {}
            : {};

        FcRows.upsertRow(
            this.options.rowsKey,
            index,
            Object.assign({}, existing, context.data)
        );

        return false;
    }

    async saveDirtyRow() {
        const values = this.serializeForm();
        const validation = await this.validateForm(values);

        if (!validation.valid) {
            this.showValidationErrors(validation.errors);
            return false;
        }

        this.clearValidationErrors();

        const rows = FcRows.get(this.options.rowsKey);
        if (!rows) return false;

        const index = Number.isInteger(this.options.key)
            ? this.options.key
            : null;
        const existing = Number.isInteger(index)
            ? rows.rows[index] || {}
            : {};
        const data = this.buildRequestData(values);

        const saved = FcRows.upsertRow(
            this.options.rowsKey,
            index,
            Object.assign({}, existing, data)
        );

        if (saved && this.formState) {
            this.formState.resetBaseline();
        }

        return Boolean(saved);
    }

    shouldTrackDirty() {
        return true;
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
