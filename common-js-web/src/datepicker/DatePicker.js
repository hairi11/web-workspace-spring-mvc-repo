const DEFAULT_OPTIONS = {
    allowInput: true,
    dateFormat: 'Y-m-d',
    altInput: true,
    altFormat: 'd/m/Y',
    altInputClass: 'form-control',
    position: 'auto'
};

class DatePicker {
    constructor(selector, options) {
        this.selector = selector;
        this.options = Object.assign({}, DEFAULT_OPTIONS, options || {});
        this.element = null;
        this.instance = null;
        this.maskHandler = null;
    }

    option(name, value) {
        this.options[name] = value;
        return this;
    }

    optionsConfig(config) {
        Object.assign(this.options, config || {});
        return this;
    }

    build() {
        if (typeof window === 'undefined' || typeof window.flatpickr !== 'function') {
            throw new Error('DatePicker requires Flatpickr.');
        }

        this.element = typeof this.selector === 'string'
            ? document.querySelector(this.selector)
            : this.selector;

        if (!this.element) return this;

        this.element.classList.add('form-control');
        this.instance = window.flatpickr(this.element, this.options);
        this.bindMask();
        return this;
    }

    bindMask() {
        var input = this.instance && this.instance.altInput;
        if (!input) return;

        input.inputMode = 'numeric';
        input.maxLength = 10;
        input.placeholder = 'dd/mm/yyyy';

        this.maskHandler = function () {
            input.value = DatePicker.maskDateInput(input.value);
        };

        input.addEventListener('input', this.maskHandler);
    }

    setDate(value, triggerChange) {
        if (this.instance) {
            this.instance.setDate(value, triggerChange === true);
        }
        return this;
    }

    clear() {
        if (this.instance) this.instance.clear();
        return this;
    }

    open() {
        if (this.instance) this.instance.open();
        return this;
    }

    close() {
        if (this.instance) this.instance.close();
        return this;
    }

    destroy() {
        var input = this.instance && this.instance.altInput;

        if (input && this.maskHandler) {
            input.removeEventListener('input', this.maskHandler);
        }

        if (this.instance) this.instance.destroy();

        this.element = null;
        this.instance = null;
        this.maskHandler = null;
        return this;
    }

    getInstance() {
        return this.instance;
    }
}

DatePicker.range = function (fromSelector, toSelector, options) {
    options = options || {};

    var fromOptions = Object.assign({}, options.from || {});
    var toOptions = Object.assign({}, options.to || {});
    var fromOnChange = fromOptions.onChange;
    var toOnChange = toOptions.onChange;
    var fromPicker = null;
    var toPicker = null;

    fromOptions.onChange = function (selectedDates, dateStr, instance) {
        if (toPicker && toPicker.instance) {
            toPicker.instance.set(
                'minDate',
                selectedDates.length ? selectedDates[0] : null
            );
        }

        if (typeof fromOnChange === 'function') {
            fromOnChange(selectedDates, dateStr, instance);
        }
    };

    toOptions.onChange = function (selectedDates, dateStr, instance) {
        if (fromPicker && fromPicker.instance) {
            fromPicker.instance.set(
                'maxDate',
                selectedDates.length ? selectedDates[0] : null
            );
        }

        if (typeof toOnChange === 'function') {
            toOnChange(selectedDates, dateStr, instance);
        }
    };

    fromPicker = new DatePicker(fromSelector, fromOptions).build();
    toPicker = new DatePicker(toSelector, toOptions).build();

    if (fromPicker.instance
            && fromPicker.instance.selectedDates
            && fromPicker.instance.selectedDates.length
            && toPicker.instance) {
        toPicker.instance.set(
            'minDate',
            fromPicker.instance.selectedDates[0]
        );
    }

    if (toPicker.instance
            && toPicker.instance.selectedDates
            && toPicker.instance.selectedDates.length
            && fromPicker.instance) {
        fromPicker.instance.set(
            'maxDate',
            toPicker.instance.selectedDates[0]
        );
    }

    return {
        from: fromPicker,
        to: toPicker
    };
};

DatePicker.maskDateInput = function (value) {
    var digits = String(value || '').replace(/\D/g, '').slice(0, 8);
    var parts = [];

    if (digits.length) parts.push(digits.slice(0, 2));
    if (digits.length > 2) parts.push(digits.slice(2, 4));
    if (digits.length > 4) parts.push(digits.slice(4, 8));

    return parts.join('/');
};

DatePicker.DEFAULT_OPTIONS = DEFAULT_OPTIONS;

module.exports = DatePicker;
