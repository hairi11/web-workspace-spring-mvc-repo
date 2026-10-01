const test = require('node:test');
const assert = require('node:assert/strict');
const Select2 = require('../src/select/Select2');

test('Select2 normalizes id and text items', function () {
    assert.deepEqual(
        Select2.normalizeItem({id: 'fc', text: 'FC', parentCode: null}),
        {id: 'fc', text: 'FC'}
    );
});

test('Select2 supports fallback value and label fields', function () {
    assert.deepEqual(
        Select2.normalizeItem({code: 'fx', description: 'FX'}),
        {id: 'fx', text: 'FX'}
    );
});
