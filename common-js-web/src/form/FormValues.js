const SecurityUtil = require('../util/SecurityUtil');

class FormValues {
    static serialize(form, options) {
        if (!form) return {};
        options = options || {};

        var maxFields = Math.max(1, Number(options.maxFields) || 1000);
        var data = new FormData(form);
        var result = Object.create(null);
        var count = 0;

        data.forEach(function (value, name) {
            count += 1;
            if (count > maxFields) {
                throw new Error('Form contains too many fields.');
            }

            name = String(name);
            SecurityUtil.assertSafeObjectKey(name);

            if (Object.prototype.hasOwnProperty.call(result, name)) {
                if (!Array.isArray(result[name])) {
                    result[name] = [result[name]];
                }
                result[name].push(value);
            } else {
                result[name] = value;
            }
        });

        return result;
    }

    static read(fields) {
        fields = fields || {};
        var values = {};

        Object.keys(fields).forEach(function (name) {
            var config = FormValues.config(fields[name]);
            var field = document.querySelector(config.selector);
            var value = field ? field[config.property] : null;

            values[name] = value === null || value === undefined
                ? config.defaultValue
                : value;
        });

        return values;
    }

    static populate(fields, data, options) {
        fields = fields || {};
        data = data || {};
        options = Object.assign({
            target: 'value'
        }, options || {});

        Object.keys(fields).forEach(function (name) {
            var config = FormValues.config(fields[name]);
            var field = document.querySelector(config.selector);
            if (!field) return;

            var value = data[name];
            var formatted = typeof config.format === 'function'
                ? config.format(value, 'display')
                : (value === null || value === undefined ? '' : value);

            if (options.target === 'text') {
                field.textContent = formatted;
            } else {
                field.value = formatted;
            }
        });

        return data;
    }

    static config(value) {
        if (typeof value === 'string') {
            return {
                selector: value,
                property: 'value',
                defaultValue: ''
            };
        }

        value = value || {};

        return Object.assign({
            selector: '',
            property: 'value',
            defaultValue: ''
        }, value);
    }
}

module.exports = FormValues;
