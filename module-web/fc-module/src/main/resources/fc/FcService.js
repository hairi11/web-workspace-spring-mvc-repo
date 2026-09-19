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
    }
};

export default FcService;
