import Common from '@company/common-js-web';

const { NavigationState } = Common;

function withState(validate, message, handler) {
    return function () {
        const state = NavigationState.consume();
        const router = new Common.Router();

        return router.guard(
            (context) => context != null && validate(context),
            message,
            handler
        )(state);
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
