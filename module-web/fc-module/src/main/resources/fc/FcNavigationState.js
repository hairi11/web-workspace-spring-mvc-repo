import Common from '@company/common-js-web';

const { NavigationState } = Common;

const RETURN_TO_ENQUIRY = {
    page: 'enquiry'
};

const FcNavigationState = {
    setView(row) {
        if (!row || row.path == null || row.id == null) {
            console.error('FC view requires row.path and row.id.', row);
            return false;
        }

        NavigationState.set({
            page: 'view',
            action: 'view',
            path: row.path,
            id: row.id,
            returnTo: RETURN_TO_ENQUIRY
        });

        return true;
    },

    setEdit(row) {
        if (!row || row.string_value_1 == null) {
            console.error('FC edit requires row key.', row);
            return false;
        }

        NavigationState.set({
            page: 'form',
            action: 'edit',
            key: row.string_value_1,
            returnTo: RETURN_TO_ENQUIRY
        });

        return true;
    },

    setCreate() {
        NavigationState.set({
            page: 'form',
            action: 'create',
            returnTo: RETURN_TO_ENQUIRY
        });

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

export default FcNavigationState;
