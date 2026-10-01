import Common from '@company/common-js-web';
import FcApi from './FcApi.js';

const { Ajax } = Common;

function responseData(response) {
    return response ? response.data : null;
}

function responseObject(response) {
    const data = responseData(response);
    return data && typeof data === 'object' && !Array.isArray(data)
        ? data
        : null;
}

function responseParameterList(response, listName) {
    const payload = responseData(response);
    const data = payload && typeof payload === 'object' ? payload.data : null;

    if (!data || typeof data !== 'object' || Array.isArray(data)) {
        return [];
    }

    const list = data[listName];
    return Array.isArray(list) ? list : [];
}

const FcService = {
    enquiry: function (page, size, sort) {
        const sortParams = Array.isArray(sort)
            ? sort.map((item) => item.field + ',' + item.dir)
            : [];

        return Ajax.get(FcApi.enquiry, {
            cache: false,
            dedupe: true,
            query: {
                page: page,
                size: size,
                sort: sortParams
            }
        }).then(responseObject);
    },

    findParameters: function (formType, listName) {
        return Ajax.get(FcApi.parameters, {
            cache: true,
            dedupe: true,
            query: {
                form_type: formType
            }
        }).then((response) => responseParameterList(response, listName));
    }
};

export default FcService;
