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
    string_value_1: { selector: '#stringValue1' },
    string_value_2: { selector: '#stringValue2' },
    string_value_3: {
        selector: '#stringValue3',
        transaction: { control: 'choice' }
    },
    string_value_4: { selector: '#stringValue4' },
    string_value_5: { selector: '#stringValue5' },
    string_value_6: { selector: '#stringValue6' },
    string_value_7: { selector: '#stringValue7' },
    string_value_8: { selector: '#stringValue8' },
    string_value_9: { selector: '#stringValue9' },
    string_value_10: { selector: '#stringValue10' },
    string_value_11: {
        selector: '#stringValue11',
        transaction: { control: 'choice' }
    },
    string_value_12: { selector: '#stringValue12' },
    string_value_13: { selector: '#stringValue13' },
    string_value_14: { selector: '#stringValue14' },
    string_value_15: { selector: '#stringValue15' },
    string_value_16: { selector: '#stringValue16' },
    string_value_17: { selector: '#stringValue17' },
    string_value_18: {
        selector: '#stringValue18',
        transaction: { control: 'choice' }
    },
    string_value_19: { selector: '#stringValue19' },
    string_value_20: { selector: '#stringValue20' },
    string_value_21: { selector: '#stringValue21' },
    string_value_22: {
        selector: '#stringValue22',
        transaction: { control: 'choice' }
    },
    string_value_23: { selector: '#stringValue23' },
    string_value_24: { selector: '#stringValue24' },
    string_value_25: {
        selector: '#stringValue25',
        transaction: { control: 'choice' }
    },
    string_value_26: { selector: '#stringValue26' },
    string_value_27: { selector: '#stringValue27' },
    string_value_28: { selector: '#stringValue28' },
    string_value_29: { selector: '#stringValue29' },
    string_value_30: { selector: '#stringValue30' },
    string_value_31: {
        selector: '#stringValue31',
        transaction: { control: 'choice' }
    },
    string_value_32: { selector: '#stringValue32' },
    string_value_33: {
        selector: '#stringValue33',
        transaction: { control: 'choice' }
    },
    string_value_34: { selector: '#stringValue34' },
    string_value_35: {
        selector: '#stringValue35',
        transaction: { control: 'choice' }
    },
    string_value_36: { selector: '#stringValue36' },
    string_value_37: { selector: '#stringValue37' },
    string_value_38: { selector: '#stringValue38' },

    date_value_1: {
        selector: '#dateValue1',
        transaction: { control: 'date' },
        view: { format: dateFormat }
    },
    date_value_2: {
        selector: '#dateValue2',
        transaction: { control: 'date' },
        view: { format: dateFormat }
    },
    date_value_3: {
        selector: '#dateValue3',
        transaction: { control: 'date' },
        view: { format: dateFormat }
    },
    date_value_4: {
        selector: '#dateValue4',
        transaction: { control: 'date' },
        view: { format: dateFormat }
    },
    date_value_5: {
        selector: '#dateValue5',
        transaction: { control: 'date' },
        view: { format: dateFormat }
    },
    date_value_6: {
        selector: '#dateValue6',
        transaction: { control: 'date' },
        view: { format: dateFormat }
    },

    amount_value: {
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

    integer_value: {
        selector: '#integerValue',
        view: {
            format: Renderers.number({
                maximumFractionDigits: 0
            })
        }
    }
};

function dimension(name) {
    return Object.fromEntries(
        Object.entries(fields).map(([key, field]) => {
            const {
                transaction,
                view,
                ...base
            } = field;

            return [
                key,
                Object.assign({}, base, field[name] || {})
            ];
        })
    );
}

const FcFields = {
    enquiry: {
        dateFrom: {
            selector: '#dateFrom',
            control: 'date'
        },
        dateTo: {
            selector: '#dateTo',
            control: 'date'
        },
        [FieldTranslator.field('string_value_33')]: {
            selector: '#fcCodeSelect',
            parameter: 'fcCode',
            placeholder: 'Select FC code'
        },
        [FieldTranslator.field('string_value_18')]: {
            selector: '#fxCodeSelect',
            parameter: 'fxCode',
            placeholder: 'Select FX code'
        }
    },
    transaction: dimension('transaction'),
    view: dimension('view')
};

export default FcFields;
