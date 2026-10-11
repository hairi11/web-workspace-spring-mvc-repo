const Modal = require('../../modal/Modal');

function button(text, className, type) {
    var element = document.createElement('button');
    element.type = type || 'button';
    element.className = className;
    element.textContent = text;
    return element;
}

class FormDialog {
    static open(config) {
        config = config || {};

        if (
            !config.content
            || typeof Node === 'undefined'
            || !(config.content instanceof Node)
        ) {
            throw new Error('FormDialog requires DOM node content.');
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

            var modal = Modal.open({
                title: config.title || '',
                content: config.content,
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

            if (typeof config.onOpen === 'function') {
                config.onOpen(config.content, modal);
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

                    result = typeof config.onSubmit === 'function'
                        ? await config.onSubmit(config.content, modal)
                        : config.content;

                    if (result === false) {
                        result = null;
                        return;
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
                var first = config.content.querySelector(
                    'input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])'
                );

                (first || submit).focus();
            }, {once: true});
        });
    }
}

module.exports = FormDialog;
