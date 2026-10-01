import Common from '@company/common-js-web';
import FcApi from './FcApi.js';

const { Ajax } = Common;

const FcService = {
    enquiry: function (page, size, sort, criteria) {
        const sortParams = Array.isArray(sort)
            ? sort.map((item) => item.field + ',' + item.dir)
            : [];

        criteria = criteria || {};

        return Ajax.get(FcApi.enquiry, {
            cache: false,
            dedupe: true,
            query: {
                page: page,
                size: size,
                sort: sortParams,
                dateFrom: criteria.dateFrom || '',
                dateTo: criteria.dateTo || '',
                fcCode: criteria.fcCode || '',
                fxCode: criteria.fxCode || ''
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
