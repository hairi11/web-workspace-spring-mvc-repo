class FieldTranslator {
    static get(key) {
        var mappings = typeof globalThis !== 'undefined'
            ? globalThis.FC_FIELD_TRANSLATOR
            : null;

        return mappings && mappings[key]
            ? mappings[key]
            : {};
    }

    static field(key) {
        return FieldTranslator.get(key).field || key;
    }

    static label(key) {
        return FieldTranslator.get(key).label || key;
    }
}

module.exports = FieldTranslator;
