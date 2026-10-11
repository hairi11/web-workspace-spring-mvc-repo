const Button = require('./Button');
const ButtonDropdown = require('./ButtonDropdown');
const Navigator = require('./Navigator');

let dropdownId = 0;

function asArray(value) {
    return Array.isArray(value) ? value : [value];
}

class ButtonBar {
    constructor(target) {
        this.target = target;
        this.element = null;
        this.primaryConfigs = [];
        this.secondaryConfigs = [];
        this.navigatorConfig = null;
        this.buttons = [];
        this.buttonMap = {};
        this.createdElements = [];
        this.navigatorComponent = null;
        this.dropdown = null;
        this.group = null;
    }

    primary(config) {
        return this.add(this.primaryConfigs, config, Button.Variant.PRIMARY);
    }

    secondary(config) {
        return this.add(this.secondaryConfigs, config, Button.Variant.SECONDARY);
    }

    navigator(config) {
        this.navigatorConfig = config || null;
        return this;
    }

    add(destination, config, variant) {
        asArray(config).filter(Boolean).forEach(function (item) {
            if (!item.target && !item.name) {
                throw new Error('Button target or name is required.');
            }

            destination.push({
                name: item.name || null,
                target: item.target || null,
                options: Object.assign({}, item, {variant: variant})
            });
        });
        return this;
    }

    build() {
        this.element = this.resolve(this.target);

        if (!this.element) {
            throw new Error('ButtonBar element not found.');
        }

        this.element.classList.add(
            'd-flex', 'justify-content-end', 'align-items-center',
            'flex-wrap', 'gap-2', 'mt-4', 'pt-3', 'border-top'
        );

        this.prepareConfigs(this.primaryConfigs);
        this.prepareConfigs(this.secondaryConfigs);
        this.buttons = this.buildButtons(this.primaryConfigs);
        this.buildSecondaries();

        if (this.navigatorConfig) {
            this.navigatorComponent = new Navigator(this.navigatorConfig).build();
        }

        return this;
    }

    buildSecondaries() {
        var visible = this.secondaryConfigs
            .filter((config) => config.options.hidden !== true)
            .sort(function (a, b) {
                return Number(a.options.placement === ButtonBar.Placement.END)
                    - Number(b.options.placement === ButtonBar.Placement.END);
            });
        var hidden = this.secondaryConfigs.filter(
            (config) => config.options.hidden === true
        );

        this.buttons.push.apply(this.buttons, this.buildButtons(hidden));

        var visiblePrimaryCount = this.primaryConfigs.filter(
            (config) => config.options.hidden !== true
        ).length;

        if (visiblePrimaryCount + visible.length <= 2 || visible.length <= 1) {
            this.buttons.push.apply(this.buttons, this.buildButtons(visible));
            return;
        }

        this.buildDropdown(visible);
    }

    prepareConfigs(configs) {
        configs.forEach((config) => {
            if (config.target) return;

            var element = document.createElement('button');
            element.type = 'button';

            if (config.name) {
                element.dataset.action = config.name;
            }

            this.element.appendChild(element);
            this.createdElements.push(element);
            config.target = element;
        });
    }

    buildButtons(configs) {
        return configs.map((config) => {
            var button = new Button(config.target, config.options).build();

            if (button.element) {
                button.element.style.minWidth = '140px';
            }

            if (config.name) {
                this.buttonMap[config.name] = button;
            }

            return button;
        });
    }

    button(name) {
        return this.buttonMap[name] || null;
    }

    buildDropdown(configs) {
        var dropdownButtons = configs.map((config) => {
            var options = Object.assign({}, config.options);
            delete options.onClick;

            var button = new Button(config.target, options).build();

            if (config.name) {
                this.buttonMap[config.name] = button;
            }

            return button;
        });
        var elements = dropdownButtons.map((button) => button.element);
        var wrapper = document.createElement('div');
        var trigger = document.createElement('button');
        var menu = document.createElement('div');

        wrapper.className = 'dropup';
        wrapper.style.minWidth = '140px';

        trigger.type = 'button';
        trigger.classList.add('button-bar-more-actions');
        trigger.textContent = ButtonBar.DEFAULT_DROPDOWN_LABEL;

        menu.className = 'dropdown-menu w-100';
        menu.id = 'button-dropdown-menu-' + (++dropdownId);
        trigger.setAttribute('aria-controls', menu.id);

        elements[0].parentNode.insertBefore(wrapper, elements[0]);
        wrapper.appendChild(trigger);
        wrapper.appendChild(menu);
        elements.forEach((element) => menu.appendChild(element));

        this.buttons.push.apply(this.buttons, dropdownButtons);

        this.group = {
            wrapper: wrapper,
            elements: elements,
            classes: elements.map(function (element) {
                return element.className;
            })
        };
        this.dropdown = new ButtonDropdown({
            trigger: trigger,
            menu: menu,
            items: configs.map((config, index) => Object.assign(
                {},
                config.options,
                {target: elements[index]}
            ))
        }).build();
    }

    destroy() {
        this.buttons.forEach((button) => button.destroy());
        this.buttons = [];
        this.buttonMap = {};

        if (this.navigatorComponent) this.navigatorComponent.destroy();
        if (this.dropdown) this.dropdown.destroy();

        this.navigatorComponent = null;
        this.dropdown = null;
        this.restoreGroup();

        this.createdElements.forEach(function (element) {
            if (element.parentNode) element.remove();
        });
        this.createdElements = [];

        this.element = null;
        return this;
    }

    restoreGroup() {
        if (!this.group) return;

        var wrapper = this.group.wrapper;
        if (wrapper.parentNode) {
            this.group.elements.forEach((element, index) => {
                element.className = this.group.classes[index];
                wrapper.parentNode.insertBefore(element, wrapper);
            });
            wrapper.remove();
        }

        this.group = null;
    }

    require(target) {
        var element = this.resolve(target);
        if (!element) throw new Error('Button element not found.');
        return element;
    }

    resolve(target) {
        return typeof target === 'string'
            ? document.querySelector(target)
            : target || null;
    }
}

ButtonBar.DEFAULT_DROPDOWN_LABEL = 'More actions';
ButtonBar.Placement = Object.freeze({END: 'end'});

module.exports = ButtonBar;
