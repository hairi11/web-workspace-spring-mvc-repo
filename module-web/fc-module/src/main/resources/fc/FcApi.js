const contextPath = document.body?.dataset.contextPath || '';
const BASE_URL = contextPath + '/fc/api';

const FcApi = {
    enquiry: BASE_URL + '/enquiry',
    detail: BASE_URL + '/detail',
    parameters: BASE_URL + '/parameters'
};

export default FcApi;
