class AjaxResponse {
    constructor(data, response, config) {
        this.data = data;
        this.response = response;
        this.config = config;
        this.status = response ? response.status : 0;
        this.ok = response ? response.ok : true;
        this.headers = response ? response.headers : null;
    }

    object() {
        return this.data
            && typeof this.data === 'object'
            && !Array.isArray(this.data)
                ? this.data
                : null;
    }

    array() {
        return Array.isArray(this.data)
            ? this.data
            : [];
    }

    path(path, fallback) {
        const value = String(path || '')
            .split('.')
            .filter(Boolean)
            .reduce(function (current, key) {
                return current != null
                    ? current[key]
                    : undefined;
            }, this.data);

        return value === undefined
            ? fallback
            : value;
    }
}

module.exports = AjaxResponse;
