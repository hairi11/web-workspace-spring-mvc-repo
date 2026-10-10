import Common from '@company/common-js-web';
import FcApi from './FcApi.js';

const {
    Ajax,
    Storage
} = Common;

const parameterStorage = new Storage(window.sessionStorage);

const FcService = {
    enquiry: function (page, size, sort, criteria) {
        const sortParams = Array.isArray(sort)
            ? sort.map((item) => item.field + ',' + item.dir)
            : [];

        criteria = criteria || {};

        return Ajax.get(FcApi.enquiry, {
            cache: false,
            dedupe: true,
            query: Object.assign({
                page: page,
                size: size,
                sort: sortParams
            }, criteria)
        }).then((response) => response.object());
    },

    findDetail: function (path, id) {
        return Ajax.get(FcApi.detail, {
            cache: false,
            dedupe: true,
            query: {
                path: path,
                id: id
            }
        }).then((response) => response.object());
    },

    findParameters: function (formType) {
        const key = 'fc.parameters.' + formType;
        const cached = parameterStorage.get(key);

        if (cached !== null) return Promise.resolve(cached);

        return Ajax.get(FcApi.parameters, {
            cache: true,
            dedupe: true,
            query: {
                form_type: formType
            }
        }).then((response) => {
            return parameterStorage.set(
                key,
                response.path('data', {})
            ).get(key);
        });
    }
};

export default FcService;
