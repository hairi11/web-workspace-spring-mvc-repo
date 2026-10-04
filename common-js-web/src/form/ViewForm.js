const FormValues = require('./FormValues');

class ViewForm {
    constructor(fields, options) {
        this.fields = fields || {};
        this.options = Object.assign({
            target: 'text'
        }, options || {});
    }

    populate(data) {
        FormValues.populate(
            this.fields,
            data,
            this.options
        );

        return this;
    }
}

module.exports = ViewForm;
