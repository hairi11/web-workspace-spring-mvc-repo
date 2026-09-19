import Common from '@company/common-js-web';
import FcApi from './FcApi.js';

const { Ajax } = Common;

function responseData(response) {
    return response ? response.data : null;
}

const FcService = {
    enquiry: function (page, size) {
        return Ajax.get(FcApi.enquiry, {
            cache: false,
            dedupe: true,
            query: {
                page: page,
                size: size
            }
        }).then(responseData);
    }
};

export default FcService;
