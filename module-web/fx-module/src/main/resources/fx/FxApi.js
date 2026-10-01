const contextPath = document.body?.dataset.contextPath || '';
const BASE_URL = contextPath + '/fx/api';

const FxApi = {
    enquiry: BASE_URL + '/enquiry',
    references: BASE_URL + '/references',
    validateDate: BASE_URL + '/validate-date',
    masters: BASE_URL + '/masters',
    save: BASE_URL + '/save',
    submit: BASE_URL + '/submit',

    masterById: function (id) {
        return this.masters + '/' + encodeURIComponent(id);
    },

    transactionsByMasterId: function (masterId) {
        return this.masterById(masterId) + '/transactions';
    },

    transactionById: function (id) {
        return BASE_URL + '/transactions/' + encodeURIComponent(id);
    }
};

export default FxApi;
