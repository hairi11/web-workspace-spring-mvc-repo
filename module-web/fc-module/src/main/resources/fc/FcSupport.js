import Common from '@company/common-js-web';

const { NavigationState, Renderers } = Common;

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

const navigation = {
    canView(row) {
        if (!row || row.path == null || row.id == null) {
            console.error('FC view requires row.path and row.id.', row);
            return false;
        }

        return true;
    },

    canEdit(row) {
        if (!row || row.string_value_1 == null) {
            console.error('FC edit requires row key.', row);
            return false;
        }

        return true;
    },

    consumeView() {
        return this.consume(
            (state) => state.action === 'view'
                && state.path != null
                && state.id != null,
            'Missing FC view navigation state.'
        );
    },

    consumeTransaction() {
        return this.consume(
            (state) => state.action === 'create'
                || (
                    state.action === 'edit'
                    && state.key != null
                ),
            'Missing FC transaction navigation state.'
        );
    },

    consume(validate, message) {
        const state = NavigationState.consume();

        if (!state || !validate(state)) {
            console.error(message, state);
            return null;
        }

        return state;
    }
};

const FcSupport = {
    navigation,
    viewFields
};

export default FcSupport;
