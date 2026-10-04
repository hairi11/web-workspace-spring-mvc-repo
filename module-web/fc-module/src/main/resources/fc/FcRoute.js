import Common from '@company/common-js-web';

const { NavigationRoute } = Common;

const FcRoute = {
    view(handler) {
        return NavigationRoute.guard(
            (state) => state.action === 'view'
                && state.path != null
                && state.id != null,
            'Invalid FC view navigation state.',
            handler
        );
    },

    transaction(handler) {
        return NavigationRoute.guard(
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
