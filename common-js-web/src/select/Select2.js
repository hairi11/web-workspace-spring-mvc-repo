const DEFAULT_OPTIONS = {
    width: '100%'
};

function firstValue() {
    for (var index = 0; index < arguments.length; index += 1) {
        var value = arguments[index];

        if (value !== null && value !== undefined && value !== '') {
            return String(value);
        }
    }

    return '';
}

function normalizeItem(item) {
    if (item === null || item === undefined) {
        return {id: '', text: ''};
    }

    if (typeof item !== 'object') {
        var value = String(item);
        return {id: value, text: value};
    }

    var id = firstValue(
        item.id,
        item.value,
        item.code,
        item.parameterCode,
        item.parameterValue
    );

    return {
        id: id,
        text: firstValue(
            item.text,
            item.label,
            item.description,
            item.parameterDescription,
            item.parameterName,
            item.name,
            id
        )
    };
}

class Select2 {
    constructor(selector, options) {
        this.selector = selector;
        this.options = Object.assign({}, DEFAULT_OPTIONS, options || {});
        this.element = null;
        this.instance = null;
    }

    option(name, value) {
        this.options[name] = value;
        return this;
    }

    optionsConfig(config) {
        this.options = Object.assign(this.options, config || {});
        return this;
    }

    build() {
        if (typeof window === 'undefined' || !window.jQuery || !window.jQuery.fn.select2) {
            throw new Error('Select2 requires jQuery and Select2.');
        }

        this.element = window.jQuery(this.selector);

        if (!this.element.length) {
            return this;
        }

        this.element.select2(this.options);
        this.instance = this.element.data('select2') || null;
        return this;
    }

    setData(data) {
        if (!this.element || !this.element.length) {
            this.build();
        }

        if (!this.element || !this.element.length) {
            return this;
        }

        var element = this.element;
        var placeholder = this.options.placeholder || '';
        var items = Array.isArray(data)
            ? data.map(normalizeItem)
            : [];

        if (element.hasClass('select2-hidden-accessible')) {
            element.select2('destroy');
        }

        element.empty();

        if (placeholder || this.options.allowClear) {
            element.append(new Option('', ''));
        }

        items.forEach(function (item) {
            element.append(new Option(item.text, item.id));
        });

        element.select2(this.options);
        this.instance = element.data('select2') || null;
        return this;
    }

    async load(dataOrPromise) {
        if (!this.element || !this.element.length) {
            this.build();
        }

        this.disable();

        try {
            var data = await Promise.resolve(dataOrPromise);
            this.setData(data);
            return data;
        } finally {
            this.enable();
        }
    }

    value() {
        return this.element && this.element.length ? this.element.val() : null;
    }

    setValue(value, triggerChange) {
        if (!this.element || !this.element.length) return this;

        this.element.val(value);

        if (triggerChange === true) {
            this.element.trigger('change');
        } else {
            this.element.trigger('change.select2');
        }

        return this;
    }

    clear(triggerChange) {
        return this.setValue(null, triggerChange);
    }

    enable() {
        if (this.element && this.element.length) {
            this.element.prop('disabled', false).trigger('change.select2');
        }
        return this;
    }

    disable() {
        if (this.element && this.element.length) {
            this.element.prop('disabled', true).trigger('change.select2');
        }
        return this;
    }

    destroy() {
        if (this.element && this.element.length && this.element.hasClass('select2-hidden-accessible')) {
            this.element.select2('destroy');
        }

        this.instance = null;
        this.element = null;
        return this;
    }

    getInstance() {
        return this.instance;
    }
}

Select2.DEFAULT_OPTIONS = DEFAULT_OPTIONS;
Select2.normalizeItem = normalizeItem;

module.exports = Select2;
