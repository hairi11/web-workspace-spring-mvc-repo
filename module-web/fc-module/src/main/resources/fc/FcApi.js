const contextPath = document.body?.dataset.contextPath || '';
const BASE_URL = contextPath + '/fc/api';

const FcApi = {
    enquiry: BASE_URL + '/enquiry',
    parameters: BASE_URL + '/parameters'
};

export default FcApi;
