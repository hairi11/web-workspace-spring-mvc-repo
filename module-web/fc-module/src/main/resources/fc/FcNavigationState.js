import Common from '@company/common-js-web';

const { NavigationState } = Common;

const FcNavigationState = {
    consumeView() {
        const state = NavigationState.consume();

        if (
            !state
            || state.action !== 'view'
            || state.path == null
            || state.id == null
        ) {
            console.error('Missing FC view navigation state.', state);
            return null;
        }

        return state;
    }
};

export default FcNavigationState;
