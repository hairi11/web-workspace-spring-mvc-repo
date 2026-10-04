const NavigationState = require('../navigation/NavigationState');
const Router = require('./Router');

const router = new Router();

class NavigationRoute {
    static guard(validate, message, handler) {
        return router.withContext(
            function () {
                return NavigationState.consume();
            },
            function (state) {
                return state != null && validate(state);
            },
            message,
            handler
        );
    }
}

module.exports = NavigationRoute;
