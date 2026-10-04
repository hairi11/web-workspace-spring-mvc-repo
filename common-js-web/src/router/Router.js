class Router {
    constructor(options) {
        this.options = Object.assign({
            resolveRoute: null
        }, options || {});
        this.routes = new Map();
    }

    route(name, handler, options) {
        if (!name || typeof handler !== 'function') {
            throw new Error('Router.route requires a route name and handler.');
        }

        this.routes.set(name, {
            handler: handler,
            options: options || {}
        });

        return this;
    }

    has(name) {
        return this.routes.has(name);
    }

    async dispatch(name, context) {
        const route = this.routes.get(name);
        if (!route) return;

        const options = route.options;
        const resolvedContext = typeof options.context === 'function'
            ? options.context()
            : context;

        if (
            typeof options.guard === 'function'
            && !options.guard(resolvedContext)
        ) {
            console.warn(
                options.warning || 'Route guard validation failed.',
                resolvedContext
            );
        }

        return route.handler(resolvedContext);
    }

    async dispatchCurrent() {
        if (typeof this.options.resolveRoute !== 'function') {
            throw new Error('Router.start requires a resolveRoute function.');
        }

        const name = this.options.resolveRoute();
        if (!name) return;

        return this.dispatch(name);
    }

    start() {
        const dispatch = () => this.dispatchCurrent();

        if (
            typeof document !== 'undefined'
            && document.readyState === 'loading'
        ) {
            document.addEventListener(
                'DOMContentLoaded',
                dispatch,
                { once: true }
            );
        } else {
            dispatch();
        }

        return this;
    }
}

module.exports = Router;
