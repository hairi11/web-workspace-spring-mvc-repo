const ParameterKey = Object.freeze({
    string_value_11: 'string_value_11_iso'
});

function key(field, fallback) {
    return ParameterKey[field] || fallback || field;
}

function list(parameters, field, fallback) {
    return (parameters || {})[key(field, fallback)] || [];
}

export default {
    key,
    list
};
