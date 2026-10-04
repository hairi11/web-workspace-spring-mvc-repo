class Router {
    constructor() {
        this.routes = new Map();
    }

    route(name, handler) {
        if (!name || typeof handler !== 'function') {
            throw new Error('Router.route requires a route name and handler.');
        }

        this.routes.set(name, handler);
        return this;
    }

    has(name) {
        return this.routes.has(name);
    }

    guard(validate, message, handler) {
        if (typeof validate !== 'function') {
            throw new Error('Router.guard requires a validate function.');
        }

        if (typeof handler !== 'function') {
            throw new Error('Router.guard requires a handler function.');
        }

        return function (context) {
            if (!validate(context)) {
                console.warn(message, context);
            }

            return handler(context);
        };
    }

    withContext(resolve, validate, message, handler) {
        if (typeof resolve !== 'function') {
            throw new Error('Router.withContext requires a resolve function.');
        }

        const guarded = this.guard(validate, message, handler);

        return function () {
            return guarded(resolve());
        };
    }

    async dispatch(name, context) {
        const handler = this.routes.get(name);
        if (!handler) return;
        return handler(context);
    }
}

module.exports = Router;
