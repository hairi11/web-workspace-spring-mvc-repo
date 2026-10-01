const test = require('node:test');
const assert = require('node:assert/strict');
const AjaxResponse = require('../src/ajax/AjaxResponse');

test('AjaxResponse object returns object payloads', function () {
    const response = new AjaxResponse({id: 1}, null, null);

    assert.deepEqual(response.object(), {id: 1});
    assert.equal(new AjaxResponse([], null, null).object(), null);
});

test('AjaxResponse array returns array payloads', function () {
    const response = new AjaxResponse([{id: 1}], null, null);

    assert.deepEqual(response.array(), [{id: 1}]);
    assert.deepEqual(new AjaxResponse({}, null, null).array(), []);
});

test('AjaxResponse path reads nested payload values', function () {
    const response = new AjaxResponse({
        data: {
            fcCode: [{id: 'fc', text: 'FC'}]
        }
    }, null, null);

    assert.deepEqual(response.path('data.fcCode', []), [
        {id: 'fc', text: 'FC'}
    ]);
    assert.deepEqual(response.path('data.missing', {}), {});
});
