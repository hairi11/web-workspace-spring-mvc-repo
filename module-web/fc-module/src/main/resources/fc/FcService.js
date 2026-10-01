import Common from '@company/common-js-web';
import FcApi from './FcApi.js';

const { Ajax } = Common;

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
        }).then((response) => response.object());
    },

    findParameters: function (formType) {
        return Ajax.get(FcApi.parameters, {
            cache: true,
            dedupe: true,
            query: {
                form_type: formType
            }
        }).then((response) => response.path('data', {}));
    }
};

export default FcService;
