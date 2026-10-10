const ChoiceInput = require('../select/ChoiceInput');
const CurrencyInput = require('../input/CurrencyInput');
const DatePicker = require('../datepicker/DatePicker');
const FormValues = require('./FormValues');

class FormControls {
    constructor(target, fields) {
        this.target = target;
        this.fields = fields || {};
        this.form = null;
        this.components = {};
    }

    build() {
        this.form = typeof this.target === 'string'
            ? document.querySelector(this.target)
            : this.target || null;

        if (!this.form) {
            throw new Error('FormControls form not found.');
        }

        return this;
    }

    labels(resolver) {
        this.each((key, config, field) => {
            const label = field.labels && field.labels.length
                ? field.labels[0]
                : null;

            if (label) {
                label.textContent = typeof resolver === 'function'
                    ? resolver(key, config, field)
                    : key;
            }
        });

        return this;
    }

    populate(values) {
        values = values || {};

        this.each((key, config, field) => {
            const value = values[key];
            const formatted = typeof config.format === 'function'
                ? config.format(value, 'display')
                : (value === null || value === undefined ? '' : value);

            field.value = formatted;
        });

        return this;
    }

    dates() {
        this.eachControl('date', (key, config, field) => {
            this.components[key] = new DatePicker(
                field,
                config.controlOptions
            ).build();
        });

        return this;
    }

    currencies() {
        this.eachControl('currency', (key, config, field) => {
            this.components[key] = new CurrencyInput(
                field,
                config.controlOptions
            ).build();
        });

        return this;
    }

    choices(dataResolver, values) {
        values = values || {};

        this.eachControl('choice', (key, config, field) => {
            this.components[key] = new ChoiceInput(field, Object.assign(
                {},
                config.controlOptions || {},
                {
                    data: typeof dataResolver === 'function'
                        ? dataResolver(key, config, field)
                        : []
                }
            ))
                .build()
                .setValue(values[key]);
        });

        return this;
    }

    component(key) {
        return this.components[key] || null;
    }

    eachControl(control, callback) {
        this.each((key, config, field) => {
            if (config.control === control) {
                callback(key, config, field);
            }
        });

        return this;
    }

    each(callback) {
        Object.keys(this.fields).forEach((key) => {
            const config = FormValues.config(this.fields[key]);
            const field = this.form.querySelector(config.selector);

            if (field) callback(key, config, field);
        });

        return this;
    }
}

module.exports = FormControls;
