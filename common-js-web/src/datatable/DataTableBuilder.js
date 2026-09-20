const SecurityUtil = require('../util/SecurityUtil');

const DEFAULT_OPTIONS = {
    searching: false,
    pagingType: 'full_numbers',
    lengthMenu: [10, 20, 50, 100],
    language: {
        lengthMenu: 'Show _MENU_ entries',
        info: 'Showing _START_ to _END_ of _TOTAL_ entries',
        paginate: {
            first: "<i class='fa fa-angle-double-left' aria-hidden='true'></i>",
            previous: "<i class='fa fa-angle-left' aria-hidden='true'></i>",
            next: "<i class='fa fa-angle-right' aria-hidden='true'></i>",
            last: "<i class='fa fa-angle-double-right' aria-hidden='true'></i>"
        }
    },
    dom: 't<"row align-items-center mt-3"<"col-12 col-md-4"l><"col-12 col-md-4 text-md-center mt-2 mt-md-0"i><"col-12 col-md-4 d-flex justify-content-md-end mt-2 mt-md-0"p>>'
};

function cloneDefaults() {
    return Object.assign({}, DEFAULT_OPTIONS, {
        lengthMenu: DEFAULT_OPTIONS.lengthMenu.slice(),
        language: {
            lengthMenu: DEFAULT_OPTIONS.language.lengthMenu,
            info: DEFAULT_OPTIONS.language.info,
            paginate: Object.assign({}, DEFAULT_OPTIONS.language.paginate)
        },
        columns: []
    });
}

function loadBootstrapDropdown() {
    require('bootstrap/js/dist/dropdown');
}

function loadContextMenu() {
    if (!window.jQuery || typeof window.jQuery.contextMenu !== 'function') {
        throw new Error(
            'DataTable context actions require jquery-contextmenu in the module vendor bundle.'
        );
    }
}

function loadButtons() {
    if (
        !window.jQuery
        || !window.jQuery.fn
        || !window.jQuery.fn.dataTable
        || typeof window.jQuery.fn.dataTable.Buttons !== 'function'
    ) {
        throw new Error(
            'DataTable toolbar actions require DataTables Buttons in the module vendor bundle.'
        );
    }
}

class DataTableBuilder {
    constructor(selector) {
        this.selector = selector;
        this.options = cloneDefaults();
        this.actions = [];
        this.toolbarActions = [];
        this.actionTarget = 'menu';
        this.actionTitle = 'Actions';
        this.actionMode = 'dropdown';
        this.toolbarClassName = 'datatable-action-toolbar';
        this.table = null;
        this.searchSelector = null;
        this.actionHeader = null;
        this.contextSelector = null;
    }

    data(rows) {
        this.options.data = Array.isArray(rows) ? rows : [];
        return this;
    }

    option(name, value) {
        this.options[name] = value;
        return this;
    }

    column(data, title, config) {
        this.options.columns.push(Object.assign({
            data: data,
            title: title
        }, config || {}));
        return this;
    }

    renderer(data, title, renderer, config) {
        return this.column(data, title, Object.assign({render: renderer}, config || {}));
    }

    menuAction(config) {
        config = config || {};
        this.actionTarget = 'menu';

        if (config.title) {
            this.actionTitle = config.title;
        }

        if (config.mode !== undefined) {
            if (config.mode !== 'context' && config.mode !== 'dropdown') {
                throw new Error('DataTable action mode must be "context" or "dropdown".');
            }
            this.actionMode = config.mode;
        }

        return this;
    }

    toolbarAction(config) {
        config = config || {};
        this.actionTarget = 'toolbar';

        if (config.className) {
            this.toolbarClassName = SecurityUtil.sanitizeClassList(config.className)
                || 'datatable-action-toolbar';
        }

        return this;
    }

    addAction(action) {
        action = action || {};

        if (this.actionTarget === 'toolbar') {
            if (action.divider) {
                throw new Error('DataTable toolbar actions do not support dividers.');
            }

            this.toolbarActions.push(action);
        } else {
            this.actions.push(action);
        }

        return this;
    }

    searchInput(selector) {
        this.searchSelector = selector;
        return this;
    }

    serverPage(loader, config) {
        if (typeof loader !== 'function') {
            throw new Error('serverPage requires a loader function.');
        }

        config = Object.assign({
            pageLength: 20,
            contentProperty: 'content',
            totalProperty: 'totalElements',
            filteredTotalProperty: null,
            defaultOrder: null,
            onError: null
        }, config || {});

        this.options.serverSide = true;
        this.options.processing = true;
        this.options.pageLength = config.pageLength;

        if (Array.isArray(config.defaultOrder)) {
            this.options.order = config.defaultOrder;
        }

        this.options.ajax = async function (request, callback) {
            var size = Number(request.length) > 0
                ? Number(request.length)
                : Number(config.pageLength) || 20;
            var page = Math.floor(Math.max(0, Number(request.start) || 0) / size);
            var columns = Array.isArray(request.columns) ? request.columns : [];
            var sort = (request.order || []).map(function (order) {
                var column = columns[Number(order.column)];

                return column && column.data
                    ? {
                        field: column.data,
                        dir: String(order.dir).toLowerCase() === 'desc'
                            ? 'desc'
                            : 'asc'
                    }
                    : null;
            }).filter(Boolean);

            try {
                var response = await loader(page, size, {
                    sort: sort,
                    request: request
                });
                var result = response && response.data !== undefined
                    ? response.data
                    : (response || {});
                var rows = Array.isArray(result[config.contentProperty])
                    ? result[config.contentProperty]
                    : [];
                var total = Number(result[config.totalProperty]) || 0;
                var filtered = config.filteredTotalProperty
                    ? Number(result[config.filteredTotalProperty]) || 0
                    : total;

                callback({
                    draw: request.draw,
                    recordsTotal: total,
                    recordsFiltered: filtered,
                    data: rows
                });
            } catch (error) {
                if (typeof config.onError === 'function') {
                    config.onError(error, request);
                }

                callback({
                    draw: request.draw,
                    recordsTotal: 0,
                    recordsFiltered: 0,
                    data: []
                });
            }
        };

        return this;
    }

    build() {
        if (
            typeof window === 'undefined'
            || !window.jQuery
            || !window.jQuery.fn
            || !window.jQuery.fn.DataTable
        ) {
            throw new Error('DataTableBuilder requires jQuery DataTables.');
        }

        if (this.toolbarActions.length) {
            loadButtons();
            this.prepareToolbarActions();
        }

        if (this.actions.length && this.actionMode === 'dropdown') {
            loadBootstrapDropdown();
            this.appendActionColumn();
            this.ensureActionHeader();
        }

        this.table = window.jQuery(this.selector).DataTable(this.options);
        this.bindActions();
        this.bindToolbarActions();
        this.bindSearch();
        return this;
    }

    appendActionColumn() {
        this.options.columns.push({
            data: null,
            title: this.actionTitle,
            orderable: false,
            searchable: false,
            render: () => this.renderActions()
        });
    }

    ensureActionHeader() {
        var table = document.querySelector(this.selector);
        var row = table && table.querySelector('thead tr');

        if (!row || row.children.length >= this.options.columns.length) return;

        this.actionHeader = document.createElement('th');
        this.actionHeader.textContent = this.actionTitle;
        row.appendChild(this.actionHeader);
    }

    _renderActions() {
        return this.renderActions();
    }

    renderActions() {
        var html = '<div class="dropdown">'
            + '<button class="btn btn-sm btn-outline-secondary dropdown-toggle" '
            + 'type="button" data-bs-toggle="dropdown" aria-expanded="false">'
            + SecurityUtil.escapeHtml(this.actionTitle)
            + '</button><div class="dropdown-menu dropdown-menu-end">';

        html += this.renderActionItems('dt-common-action');
        return html + '</div></div>';
    }

    renderActionLabel(action) {
        var icon = SecurityUtil.sanitizeClassList(action.icon || '');
        var text = SecurityUtil.escapeHtml(action.text || '');

        return (icon ? '<i class="' + icon + '" aria-hidden="true"></i> ' : '')
            + text;
    }

    renderActionItems(actionClass) {
        var self = this;
        var html = '';

        this.actions.forEach(function (action, index) {
            if (action.divider) {
                html += '<div class="dropdown-divider"></div>';
                return;
            }

            var extra = SecurityUtil.sanitizeClassList(action.className || '');

            html += '<button type="button" class="dropdown-item '
                + actionClass
                + (extra ? ' ' + extra : '')
                + '" data-action-index="'
                + index
                + '">'
                + self.renderActionLabel(action)
                + '</button>';
        });

        return html;
    }

    toolbarActionClass(action) {
        var classes = ['dt-common-toolbar-action'];
        var variant = action.variant || 'secondary';

        if (variant === 'primary') {
            classes.push('dt-common-toolbar-primary');
        } else if (variant === 'danger') {
            classes.push('dt-common-toolbar-danger');
        }

        if (action.placement === 'end') {
            classes.push('dt-common-toolbar-end');
        }

        var extra = SecurityUtil.sanitizeClassList(action.className || '');
        if (extra) classes.push(extra);

        return classes.join(' ');
    }

    buildToolbarButtons() {
        var self = this;

        return this.toolbarActions.map(function (action, index) {
            return {
                name: 'commonToolbarAction' + index,
                text: self.renderActionLabel(action),
                className: self.toolbarActionClass(action),
                enabled: self.toolbarActionEnabled(action, 0),
                action: function (_event, dt) {
                    return self.runToolbarAction(action, dt);
                }
            };
        });
    }

    prepareToolbarActions() {
        var className = SecurityUtil.sanitizeClassList(this.toolbarClassName)
            || 'datatable-action-toolbar';

        this.options.dom = '<"' + className + '"B>'
            + (this.options.dom || DEFAULT_OPTIONS.dom);
        this.options.buttons = this.buildToolbarButtons();
    }

    toolbarActionEnabled(action, count) {
        var selection = action.selection || 'none';

        if (selection === 'single') return count === 1;
        if (selection === 'multi') return count > 1;
        if (selection === 'any') return count > 0;
        return true;
    }

    runToolbarAction(action, dt) {
        if (typeof action.onClick !== 'function') return;

        var rows = dt.rows({selected: true});
        var data = rows.data().toArray();
        var selection = action.selection || 'none';

        if (!this.toolbarActionEnabled(action, data.length)) return;

        if (selection === 'single') {
            var row = dt.row({selected: true});
            return action.onClick(row.data(), row, dt);
        }

        if (selection === 'multi' || selection === 'any') {
            return action.onClick(data, rows, dt);
        }

        return action.onClick(null, null, dt);
    }

    bindToolbarActions() {
        if (!this.toolbarActions.length || !this.table) return;

        var self = this;
        var update = function () {
            var count = self.table.rows({selected: true}).count();

            self.toolbarActions.forEach(function (action, index) {
                self.table
                    .button(index)
                    .enable(self.toolbarActionEnabled(action, count));
            });
        };

        this.table.on(
            'select.commonJsToolbar deselect.commonJsToolbar draw.commonJsToolbar',
            update
        );
        update();
    }

    buildContextItems() {
        var self = this;
        var items = {};

        this.actions.forEach(function (action, index) {
            var key = 'action' + index;

            if (action.divider) {
                items[key] = '---------';
                return;
            }

            var className = SecurityUtil.sanitizeClassList(action.className || '');
            items[key] = {
                name: self.renderActionLabel(action),
                isHtmlName: true,
                className: className,
                callback: function (_key, options) {
                    var row = self.table.row(options.$trigger);

                    if (row && row.data() && typeof action.onClick === 'function') {
                        return action.onClick(row.data(), row, self.table);
                    }
                }
            };
        });

        return items;
    }

    bindActions() {
        if (!this.actions.length) return;

        if (this.actionMode === 'context') {
            this.bindContextMenu();
            return;
        }

        var self = this;

        window.jQuery(this.selector)
            .off('click.commonJsActions')
            .on('click.commonJsActions', '.dt-common-action', function () {
                var button = window.jQuery(this);
                var action = self.actions[Number(button.attr('data-action-index'))];
                var row = self.table.row(button.closest('tr'));

                if (action && typeof action.onClick === 'function') {
                    action.onClick(row.data(), row, self.table);
                }
            });
    }

    bindContextMenu() {
        loadContextMenu();

        this.contextSelector = this.selector + ' tbody tr';
        window.jQuery.contextMenu('destroy', this.contextSelector);
        window.jQuery.contextMenu({
            selector: this.contextSelector,
            trigger: 'right',
            items: this.buildContextItems()
        });
    }

    destroyContextMenu() {
        if (
            this.contextSelector
            && window.jQuery
            && typeof window.jQuery.contextMenu === 'function'
        ) {
            window.jQuery.contextMenu('destroy', this.contextSelector);
        }

        this.contextSelector = null;
    }

    bindSearch() {
        if (!this.searchSelector) return;

        var self = this;

        window.jQuery(this.searchSelector)
            .off('input.commonJsSearch')
            .on('input.commonJsSearch', function () {
                self.table.search(this.value || '').draw();
            });
    }

    refresh(resetPaging) {
        if (this.table && this.table.ajax) {
            this.table.ajax.reload(null, resetPaging !== false);
        }
        return this;
    }

    replaceData(rows, resetPaging) {
        if (!this.table) return this;

        this.table.clear();
        this.table.rows.add(Array.isArray(rows) ? rows : []);
        this.table.draw(resetPaging !== false);
        return this;
    }

    search(value) {
        if (this.table) this.table.search(value || '').draw();
        return this;
    }

    destroy() {
        if (this.actionMode === 'context') {
            this.destroyContextMenu();
        } else {
            window.jQuery(this.selector).off('.commonJsActions');
        }

        if (this.searchSelector) {
            window.jQuery(this.searchSelector).off('.commonJsSearch');
        }

        if (this.table && this.toolbarActions.length) {
            this.table.off('.commonJsToolbar');
        }

        if (this.table) {
            this.table.destroy();
            this.table = null;
        }

        if (this.actionHeader) {
            this.actionHeader.remove();
            this.actionHeader = null;
        }

        return this;
    }
}

DataTableBuilder.DEFAULT_OPTIONS = DEFAULT_OPTIONS;

module.exports = DataTableBuilder;
