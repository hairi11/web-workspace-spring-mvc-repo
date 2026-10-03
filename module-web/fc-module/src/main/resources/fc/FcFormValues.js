const FcFormValues = {
    values() {
        return {
            dateFrom: document.querySelector('#dateFrom')?.value || '',
            dateTo: document.querySelector('#dateTo')?.value || '',
            fcCode: document.querySelector('#fcCodeSelect')?.value || '',
            fxCode: document.querySelector('#fxCodeSelect')?.value || ''
        };
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
