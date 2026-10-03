import Common from '@company/common-js-web';

const { Renderers } = Common;

const viewFields = {
    string_value_1: {
        selector: '#stringValue1'
    },
    string_value_2: {
        selector: '#stringValue2'
    },
    date_value_1: {
        selector: '#dateValue1',
        format: Renderers.date()
    },
    string_value_3: {
        selector: '#stringValue3'
    },
    string_value_4: {
        selector: '#stringValue4'
    },
    amount_value: {
        selector: '#amountValue',
        format: Renderers.amount({
            minimumFractionDigits: 4,
            maximumFractionDigits: 4
        })
    },
    amount_value_2: {
        selector: '#amountValue2',
        format: Renderers.amount({
            minimumFractionDigits: 6,
            maximumFractionDigits: 6
        })
    },
    string_value_5: {
        selector: '#stringValue5'
    },
    date_value_2: {
        selector: '#dateValue2',
        format: Renderers.date()
    },
    string_value_6: {
        selector: '#stringValue6'
    }
};

const FcFormValues = {
    values() {
        return {
            dateFrom: document.querySelector('#dateFrom')?.value || '',
            dateTo: document.querySelector('#dateTo')?.value || '',
            fcCode: document.querySelector('#fcCodeSelect')?.value || '',
            fxCode: document.querySelector('#fxCodeSelect')?.value || ''
        };
    },

    populateView(data) {
        this.populate(viewFields, data, {
            target: 'text'
        });
    },

    populate(fields, data, options) {
        fields = fields || {};
        data = data || {};
        options = Object.assign({
            target: 'value'
        }, options || {});

        Object.entries(fields).forEach(([name, config]) => {
            const field = document.querySelector(config.selector);
            if (!field) return;

            const value = data[name];
            const formatted = config.format
                ? config.format(value, 'display')
                : (value == null ? '' : value);

            if (options.target === 'text') {
                field.textContent = formatted;
                return;
            }

            field.value = formatted;
        });
    }
};

export default FcFormValues;
