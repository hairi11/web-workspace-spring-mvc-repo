import Common from '@company/common-js-web';

const { NavigationState } = Common;

export function initTransaction() {
    const state = NavigationState.consume();

    if (
        !state
        || (
            state.action !== 'create'
            && (
                state.action !== 'edit'
                || state.key == null
            )
        )
    ) {
        console.warn('Invalid FC transaction navigation state.', state);
    }
}
