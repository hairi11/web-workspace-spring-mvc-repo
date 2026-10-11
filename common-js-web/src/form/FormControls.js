const ChoiceInput = require('../select/ChoiceInput');
const CurrencyInput = require('../input/CurrencyInput');
const DatePicker = require('../datepicker/DatePicker');
const Select2 = require('../select/Select2');
const Renderers = require('../datatable/Renderers');

function dataBoolean(value) {
    if (value === undefined) return undefined;
    return value === '' || value === 'true';
}

function dataNumber(value) {
    if (value === undefined || value === '') return undefined;

    const number = Number(value);
    return Number.isFinite(number) ? number : undefined;
}

function dataFormat(field) {
    const format = field.dataset.format;

    if (format === 'date') {
        return Renderers.date(field.dataset.formatPattern);
    }

    if (format === 'amount' || format === 'number') {
        const options = {};
        const minimumFractionDigits = dataNumber(
            field.dataset.minimumFractionDigits
        );
        const maximumFractionDigits = dataNumber(
            field.dataset.maximumFractionDigits
        );

        if (minimumFractionDigits !== undefined) {
            options.minimumFractionDigits = minimumFractionDigits;
        }
        if (maximumFractionDigits !== undefined) {
            options.maximumFractionDigits = maximumFractionDigits;
        }

        return format === 'amount'
            ? Renderers.amount(options)
            : Renderers.number(options);
    }

    return undefined;
}

function fieldFromElement(field) {
    const controlOptions = {
        placeholder: field.dataset.placeholder,
        allowClear: dataBoolean(field.dataset.allowClear),
        precision: dataNumber(field.dataset.precision),
        decimalScale: dataNumber(field.dataset.decimalScale),
        padFractionOnBlur: dataBoolean(
            field.dataset.padFractionOnBlur
        )
    };

    Object.keys(controlOptions).forEach((key) => {
        if (controlOptions[key] === undefined) {
            delete controlOptions[key];
        }
    });

    return {
        element: field,
        property: field.dataset.property || 'value',
        defaultValue: field.dataset.defaultValue || '',
        control: field.dataset.control,
        parameter: field.dataset.parameter,
        controlOptions: controlOptions,
        format: dataFormat(field)
    };
}

function fieldConfig(value) {
    if (typeof value === 'string') {
        return {
            selector: value,
            property: 'value',
            defaultValue: ''
        };
    }

    return Object.assign({
        selector: '',
        element: null,
        property: 'value',
        defaultValue: ''
    }, value || {});
}

class FormControls {
    constructor(target, fields) {
        this.target = target;
        this.fields = fields || {};
        this.root = null;
        this.components = {};
    }

    build() {
        this.root = typeof this.target === 'string'
            ? document.querySelector(this.target)
            : this.target || null;

        if (!this.root) {
            throw new Error('FormControls root not found.');
        }

        if (!Object.keys(this.fields).length) {
            this.discover();
        }

        return this;
    }

    read() {
        return this.keys().reduce((values, key) => {
            values[key] = this.value(key);
            return values;
        }, {});
    }

    populate(values, options) {
        values = values || {};
        options = Object.assign({
            target: 'value'
        }, options || {});

        this.each((key, config, field) => {
            const value = values[key];
            const formatted = typeof config.format === 'function'
                ? config.format(value, 'display')
                : (value === null || value === undefined ? '' : value);

            if (options.target === 'text') {
                field.textContent = formatted;
            } else {
                this.value(key, formatted);
            }
        });

        return this;
    }

    labels(resolver) {
        this.each((key, config, field) => {
            const label = this.resolveLabel(field);

            if (label) {
                label.textContent = typeof resolver === 'function'
                    ? resolver(key, config, field)
                    : key;
            }
        });

        return this;
    }

    resolveLabel(field) {
        if (field.labels && field.labels.length) {
            return field.labels[0];
        }

        if (field.id) {
            const label = this.root.querySelector(
                'label[for="' + field.id + '"]'
            );

            if (label) return label;
        }

        return field.parentElement
            ? field.parentElement.querySelector('[data-form-label]')
            : null;
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

    dateRange(fromKey, toKey, options) {
        const fromField = this.field(fromKey);
        const toField = this.field(toKey);

        if (!fromField || !toField) return this;

        const range = DatePicker.range(fromField, toField, options);

        this.components[fromKey] = range.from;
        this.components[toKey] = range.to;
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

    selects(dataResolver) {
        this.eachControl('select', (key, config, field) => {
            const data = typeof dataResolver === 'function'
                ? dataResolver(key, config, field)
                : [];

            this.components[key] = new Select2(
                field,
                config.controlOptions
            )
                .build()
                .setData(data)
                .enable();
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

    field(key) {
        const config = fieldConfig(this.fields[key]);

        return config.element
            || (config.selector
                ? this.root.querySelector(config.selector)
                : null);
    }

    value(key, value) {
        const component = this.component(key);
        const field = this.field(key);
        const config = fieldConfig(this.fields[key]);

        if (arguments.length === 1) {
            if (component && typeof component.value === 'function') {
                return component.value();
            }

            if (!field) return null;

            const current = field[config.property];
            return current === null || current === undefined
                ? config.defaultValue
                : current;
        }

        if (component) {
            if (typeof component.setValue === 'function') {
                component.setValue(value);
                return value;
            }

            if (typeof component.setDate === 'function') {
                component.setDate(value);
                return value;
            }
        }

        if (field) {
            field[config.property] = value;
        }

        return value;
    }

    keys() {
        return Object.keys(this.fields);
    }

    discover() {
        const fields = this.root.querySelectorAll(
            '[name], [data-field]'
        );

        Array.prototype.forEach.call(fields, (field) => {
            const key = field.dataset.field || field.name;
            if (!key) return;

            this.fields[key] = fieldFromElement(field);
        });

        return this;
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
        this.keys().forEach((key) => {
            const config = fieldConfig(this.fields[key]);
            const field = this.field(key);

            if (field) callback(key, config, field);
        });

        return this;
    }
}

module.exports = FormControls;
