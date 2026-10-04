import Common from '@company/common-js-web';

const { NavigationState } = Common;

function withState(validate, message, handler) {
    return function () {
        const state = NavigationState.consume();

        if (!state || !validate(state)) {
            console.warn(message, state);
        }

        return handler(state);
    };
}

const FcRoute = {
    view(handler) {
        return withState(
            (state) => state.action === 'view'
                && state.path != null
                && state.id != null,
            'Invalid FC view navigation state.',
            handler
        );
    },

    transaction(handler) {
        return withState(
            (state) => state.action === 'create'
                || (
                    state.action === 'edit'
                    && state.key != null
                ),
            'Invalid FC transaction navigation state.',
            handler
        );
    }
};

export default FcRoute;
