const test = require('node:test');
const assert = require('node:assert/strict');
const DatePicker = require('../src/datepicker/DatePicker');

test('DatePicker exposes range helper', function () {
    assert.equal(typeof DatePicker.range, 'function');
});
