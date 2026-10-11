export const FormType = Object.freeze({
    PARAMETER: 'FC_PARAMETER'
});


export const TransactionMode = Object.freeze({
    CREATE: 'create',
    EDIT: 'edit',
    VIEW: 'view',

    isCreate: function (mode) {
        return mode === this.CREATE;
    },

    isEdit: function (mode) {
        return mode === this.EDIT;
    },

    isView: function (mode) {
        return mode === this.VIEW;
    }
});
