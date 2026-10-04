import Common from '@company/common-js-web';

const { NavigationState, Router } = Common;
const router = new Router();

const withNavigationState = (validate, message, handler) =>
    router.withContext(
        () => NavigationState.consume(),
        (state) => state != null && validate(state),
        message,
        handler
    );

const FcRoute = {
    view(handler) {
        return withNavigationState(
            (state) => state.action === 'view'
                && state.path != null
                && state.id != null,
            'Invalid FC view navigation state.',
            handler
        );
    },

    transaction(handler) {
        return withNavigationState(
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
