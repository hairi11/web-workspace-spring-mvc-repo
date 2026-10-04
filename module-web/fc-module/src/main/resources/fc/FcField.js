import Common from '@company/common-js-web';

const { Renderers } = Common;

const FcField = {
    view: {
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
    }
};

export default FcField;
