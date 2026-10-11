import Common from '@company/common-js-web';

const {
    FieldTranslator,
    Renderers
} = Common;

const dateFormat = Renderers.date();
const amountFormat6 = Renderers.amount({
    minimumFractionDigits: 6,
    maximumFractionDigits: 6
});
const amountFormat4 = Renderers.amount({
    minimumFractionDigits: 4,
    maximumFractionDigits: 4
});

const fields = {
    string_value_1: {
        dimensions: ['transaction', 'view'],
        selector: '#stringValue1'
    },
    string_value_2: {
        dimensions: ['transaction', 'view'],
        selector: '#stringValue2'
    },
    string_value_3: {
        dimensions: ['transaction', 'view'],
        selector: '#stringValue3',
        transaction: { control: 'choice' }
    },
    string_value_4: { dimensions: ['transaction', 'view'], selector: '#stringValue4' },
    string_value_5: { dimensions: ['transaction', 'view'], selector: '#stringValue5' },
    string_value_6: { dimensions: ['transaction', 'view'], selector: '#stringValue6' },
    string_value_7: { dimensions: ['transaction', 'view'], selector: '#stringValue7' },
    string_value_8: { dimensions: ['transaction', 'view'], selector: '#stringValue8' },
    string_value_9: { dimensions: ['transaction', 'view'], selector: '#stringValue9' },
    string_value_10: { dimensions: ['transaction', 'view'], selector: '#stringValue10' },
    string_value_11: {
        dimensions: ['transaction', 'view'],
        selector: '#stringValue11',
        transaction: { control: 'choice' }
    },
    string_value_12: { dimensions: ['transaction', 'view'], selector: '#stringValue12' },
    string_value_13: { dimensions: ['transaction', 'view'], selector: '#stringValue13' },
    string_value_14: { dimensions: ['transaction', 'view'], selector: '#stringValue14' },
    string_value_15: { dimensions: ['transaction', 'view'], selector: '#stringValue15' },
    string_value_16: { dimensions: ['transaction', 'view'], selector: '#stringValue16' },
    string_value_17: { dimensions: ['transaction', 'view'], selector: '#stringValue17' },
    string_value_18: {
        dimensions: ['transaction', 'view'],
        selector: '#stringValue18',
        transaction: { control: 'choice' }
    },
    string_value_19: { dimensions: ['transaction', 'view'], selector: '#stringValue19' },
    string_value_20: { dimensions: ['transaction', 'view'], selector: '#stringValue20' },
    string_value_21: { dimensions: ['transaction', 'view'], selector: '#stringValue21' },
    string_value_22: {
        dimensions: ['transaction', 'view'],
        selector: '#stringValue22',
        transaction: { control: 'choice' }
    },
    string_value_23: { dimensions: ['transaction', 'view'], selector: '#stringValue23' },
    string_value_24: { dimensions: ['transaction', 'view'], selector: '#stringValue24' },
    string_value_25: {
        dimensions: ['transaction', 'view'],
        selector: '#stringValue25',
        transaction: { control: 'choice' }
    },
    string_value_26: { dimensions: ['transaction', 'view'], selector: '#stringValue26' },
    string_value_27: { dimensions: ['transaction', 'view'], selector: '#stringValue27' },
    string_value_28: { dimensions: ['transaction', 'view'], selector: '#stringValue28' },
    string_value_29: { dimensions: ['transaction', 'view'], selector: '#stringValue29' },
    string_value_30: { dimensions: ['transaction', 'view'], selector: '#stringValue30' },
    string_value_31: {
        dimensions: ['transaction', 'view'],
        selector: '#stringValue31',
        transaction: { control: 'choice' }
    },
    string_value_32: { dimensions: ['transaction', 'view'], selector: '#stringValue32' },
    string_value_33: {
        dimensions: ['enquiry', 'transaction', 'view'],
        selector: '#stringValue33',
        enquiry: {
            selector: '#string_value_33',
            control: 'select',
            parameter: 'string_value_33',
            controlOptions: {
                placeholder: 'Select FC code',
                allowClear: true
            }
        },
        transaction: { control: 'choice' }
    },
    string_value_34: { dimensions: ['transaction', 'view'], selector: '#stringValue34' },
    string_value_35: {
        dimensions: ['enquiry', 'transaction', 'view'],
        selector: '#stringValue35',
        enquiry: {
            selector: '#string_value_35',
            control: 'select',
            parameter: 'string_value_35',
            controlOptions: {
                placeholder: 'Select FX code',
                allowClear: true
            }
        },
        transaction: { control: 'choice' }
    },
    string_value_36: { dimensions: ['transaction', 'view'], selector: '#stringValue36' },
    string_value_37: { dimensions: ['transaction', 'view'], selector: '#stringValue37' },
    string_value_38: { dimensions: ['transaction', 'view'], selector: '#stringValue38' },

    date_value_1: {
        dimensions: ['transaction', 'view'],
        selector: '#dateValue1',
        transaction: { control: 'date' },
        view: { format: dateFormat }
    },
    date_value_2: {
        dimensions: ['transaction', 'view'],
        selector: '#dateValue2',
        transaction: { control: 'date' },
        view: { format: dateFormat }
    },
    date_value_3: {
        dimensions: ['transaction', 'view'],
        selector: '#dateValue3',
        transaction: { control: 'date' },
        view: { format: dateFormat }
    },
    date_value_4: {
        dimensions: ['transaction', 'view'],
        selector: '#dateValue4',
        transaction: { control: 'date' },
        view: { format: dateFormat }
    },
    date_value_5: {
        dimensions: ['transaction', 'view'],
        selector: '#dateValue5',
        transaction: { control: 'date' },
        view: { format: dateFormat }
    },
    date_value_6: {
        dimensions: ['transaction', 'view'],
        selector: '#dateValue6',
        transaction: { control: 'date' },
        view: { format: dateFormat }
    },

    amount_value: {
        dimensions: ['transaction', 'view'],
        selector: '#amountValue',
        format: amountFormat6,
        transaction: {
            control: 'currency',
            controlOptions: {
                precision: 14,
                decimalScale: 6,
                padFractionOnBlur: true
            }
        }
    },
    amount_value_2: {
        dimensions: ['transaction', 'view'],
        selector: '#amountValue2',
        format: amountFormat4,
        transaction: {
            control: 'currency',
            controlOptions: {
                precision: 20,
                decimalScale: 4,
                padFractionOnBlur: true
            }
        }
    },
    amount_value_3: {
        dimensions: ['transaction', 'view'],
        selector: '#amountValue3',
        format: amountFormat4,
        transaction: {
            control: 'currency',
            controlOptions: {
                precision: 20,
                decimalScale: 4,
                padFractionOnBlur: true
            }
        }
    },
    amount_value_4: {
        dimensions: ['transaction', 'view'],
        selector: '#amountValue4',
        format: amountFormat4,
        transaction: {
            control: 'currency',
            controlOptions: {
                precision: 20,
                decimalScale: 4,
                padFractionOnBlur: true
            }
        }
    },
    amount_value_5: {
        dimensions: ['transaction', 'view'],
        selector: '#amountValue5',
        format: amountFormat4,
        transaction: {
            control: 'currency',
            controlOptions: {
                precision: 20,
                decimalScale: 4,
                padFractionOnBlur: true
            }
        }
    },
    amount_value_6: {
        dimensions: ['transaction', 'view'],
        selector: '#amountValue6',
        format: amountFormat4,
        transaction: {
            control: 'currency',
            controlOptions: {
                precision: 20,
                decimalScale: 4,
                padFractionOnBlur: true
            }
        }
    },
    amount_value_7: {
        dimensions: ['transaction', 'view'],
        selector: '#amountValue7',
        format: amountFormat4,
        transaction: {
            control: 'currency',
            controlOptions: {
                precision: 20,
                decimalScale: 4,
                padFractionOnBlur: true
            }
        }
    },

    [FieldTranslator.field('date_value_6') + '_from']: {
        dimensions: ['enquiry'],
        selector: '#date_value_6_from',
        control: 'date'
    },
    [FieldTranslator.field('date_value_6') + '_to']: {
        dimensions: ['enquiry'],
        selector: '#date_value_6_to',
        control: 'date'
    },

    integer_value: {
        dimensions: ['transaction', 'view'],
        selector: '#integerValue',
        view: {
            format: Renderers.number({
                maximumFractionDigits: 0
            })
        }
    }
};

const form = {
    dimensions: ['transaction'],
    selector: '#transactionForm'
};

const table = {
    dimensions: ['enquiry'],
    selector: '#fcTable'
};

const buttonBar = {
    dimensions: ['transaction', 'view'],
    transaction: {
        selector: '#transactionButtonBar'
    },
    view: {
        selector: '#viewButtonBar'
    }
};

const buttons = {
    search: {
        dimensions: ['enquiry'],
        selector: '#searchButton'
    },
    save: {
        dimensions: ['transaction'],
        target: '#saveButton',
        text: 'Save'
    },
    add: {
        dimensions: ['transaction'],
        target: '#addButton',
        text: 'Add'
    },
    cancel: {
        dimensions: ['transaction'],
        target: '#cancelButton',
        text: 'Cancel'
    },
    previous: {
        dimensions: ['view'],
        selector: '#previousButton'
    },
    next: {
        dimensions: ['view'],
        selector: '#nextButton'
    },
    back: {
        dimensions: ['view'],
        target: '#backButton',
        text: 'Back'
    }
};

function component(value, name) {
    if (!value || !value.dimensions.includes(name)) {
        return null;
    }

    const {
        dimensions,
        enquiry,
        transaction,
        view,
        ...base
    } = value;

    return Object.assign({}, base, value[name] || {});
}

function components(values, name) {
    return Object.fromEntries(
        Object.entries(values)
            .map(([key, value]) => [key, component(value, name)])
            .filter(([, value]) => value)
    );
}

function dimension(name) {
    return {
        fields: components(fields, name),
        form: component(form, name),
        table: component(table, name),
        buttonBar: component(buttonBar, name),
        buttons: components(buttons, name)
    };
}

const FcComponentConfig = {
    enquiry: dimension('enquiry'),
    transaction: dimension('transaction'),
    view: dimension('view')
};

export default FcComponentConfig;
