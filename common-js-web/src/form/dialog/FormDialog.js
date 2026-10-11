const Modal = require('../../modal/Modal');
const FormControls = require('../FormControls');

function button(text, className, type) {
    var element = document.createElement('button');
    element.type = type || 'button';
    element.className = className;
    element.textContent = text;
    return element;
}

function createField(config, index) {
    config = config || {};

    var group = document.createElement('div');
    var label = document.createElement('label');
    var field = document.createElement(
        config.multiline ? 'textarea'
            : (config.control === 'select' ? 'select' : 'input')
    );
    var name = config.name || ('field_' + index);
    var id = config.id || ('form-dialog-' + name + '-' + index);

    group.className = config.groupClassName || 'mb-3';

    label.className = config.labelClassName || 'form-label';
    label.htmlFor = id;
    label.textContent = config.label || name;

    field.id = id;
    field.name = name;
    field.className = config.className
        || (config.control === 'select' ? 'form-select' : 'form-control');

    if (field.tagName === 'INPUT') {
        field.type = config.type || 'text';
    }

    if (field.tagName === 'TEXTAREA') {
        field.rows = config.rows || 5;
    }

    if (config.control) {
        field.dataset.control = config.control;
    }

    if (config.placeholder !== undefined) {
        field.dataset.placeholder = config.placeholder;
    }

    if (config.allowClear !== undefined) {
        field.dataset.allowClear = String(Boolean(config.allowClear));
    }

    if (config.required) {
        field.required = true;
    }

    group.append(label, field);

    return {
        group: group,
        field: field,
        config: config
    };
}

function createContent(fields) {
    var content = document.createElement('div');
    var entries = (fields || []).map(function (config, index) {
        return createField(config, index);
    });

    entries.forEach(function (entry) {
        content.appendChild(entry.group);
    });

    return {
        content: content,
        entries: entries
    };
}

class FormDialog {
    static open(config) {
        config = config || {};

        var generated = config.content
            ? {content: config.content, entries: []}
            : createContent(config.fields);

        var content = generated.content;

        if (
            !content
            || typeof Node === 'undefined'
            || !(content instanceof Node)
        ) {
            throw new Error('FormDialog requires content or fields.');
        }

        var actions = document.createElement('div');
        var cancel = button(
            config.cancelLabel || 'Cancel',
            'btn btn-outline-secondary'
        );
        var submit = button(
            config.submitLabel || 'Save',
            'btn btn-primary'
        );

        actions.className = 'd-flex gap-2 ms-auto';
        actions.append(cancel, submit);

        return new Promise(function (resolve, reject) {
            var submitting = false;
            var result = null;
            var form = null;

            var modal = Modal.open({
                title: config.title || '',
                content: content,
                footer: actions,
                size: config.size || 'md',
                closable: config.closable,
                escapeClose: config.escapeClose,
                onClose: function (reason) {
                    resolve({
                        submitted: reason === 'submit',
                        value: reason === 'submit' ? result : null
                    });
                }
            });

            form = new FormControls(content).build();

            generated.entries.forEach(function (entry) {
                if (entry.config.control === 'select') {
                    form.select(
                        entry.field.name,
                        entry.config.data || []
                    );
                }
            });

            form.dates().currencies();

            if (config.values) {
                form.populate(config.values);
            }

            if (typeof config.onOpen === 'function') {
                config.onOpen(form, content, modal);
            }

            cancel.addEventListener('click', function () {
                if (!submitting) {
                    modal.close('cancel');
                }
            });

            submit.addEventListener('click', async function () {
                if (submitting) return;

                try {
                    submitting = true;
                    submit.disabled = true;
                    cancel.disabled = true;

                    var values = form.read();

                    result = typeof config.onSubmit === 'function'
                        ? await config.onSubmit(values, form, modal)
                        : values;

                    if (result === false) {
                        result = null;
                        return;
                    }

                    if (result === undefined) {
                        result = values;
                    }

                    modal.close('submit');
                } catch (error) {
                    if (typeof config.onError === 'function') {
                        config.onError(error, modal);
                        return;
                    }

                    reject(error);
                    modal.close('error');
                } finally {
                    submitting = false;
                    submit.disabled = false;
                    cancel.disabled = false;
                }
            });

            modal.element.addEventListener('shown.bs.modal', function () {
                var first = content.querySelector(
                    'input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])'
                );

                (first || submit).focus();
            }, {once: true});
        });
    }
}

module.exports = FormDialog;
