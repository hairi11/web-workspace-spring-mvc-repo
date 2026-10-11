class PageControls {
    constructor(root) {
        this.root = root || document;
        this.components = new Map();
        this.actions = new Map();
    }

    build() {
        this.components.clear();
        this.actions.clear();

        this.discover('[data-component]', 'component', this.components);
        this.discover('[data-action]', 'action', this.actions);
        return this;
    }

    component(name) {
        return this.components.get(name) || null;
    }

    action(name) {
        return this.actions.get(name) || null;
    }

    requireComponent(name) {
        return this.require(this.component(name), 'component', name);
    }

    requireAction(name) {
        return this.require(this.action(name), 'action', name);
    }

    discover(selector, datasetKey, target) {
        const elements = this.root.querySelectorAll(selector);

        Array.prototype.forEach.call(elements, (element) => {
            const name = element.dataset[datasetKey];
            if (name && !target.has(name)) {
                target.set(name, element);
            }
        });
    }

    require(element, type, name) {
        if (!element) {
            throw new Error(
                'Page ' + type + ' not found: ' + name
            );
        }

        return element;
    }
}

module.exports = PageControls;
