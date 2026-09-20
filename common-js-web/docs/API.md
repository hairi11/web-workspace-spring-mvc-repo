# Common JS v8 API

## UI wrappers

### Button
Bootstrap-backed button wrapper.

### ButtonBar
Composes primary/secondary actions. When more than two actions are visible and multiple secondary actions exist, secondaries are grouped into a Bootstrap dropup.

### ButtonDropdown
Thin Bootstrap Dropdown wrapper.

### Modal
Thin Bootstrap Modal wrapper.

### Dialog
Promise-based `confirm`, `info`, `success`, `warning`, and `error` facade.

### Toast
Bootstrap Toast facade.

## Forms

### FormAction

Main lifecycle:

```text
serializeForm
validateForm
buildRequestData
beforeSubmit
sendRequest
onSuccess / onError
```

Public methods:

- `build()`
- `destroy()`
- `execute(submitter?)`
- `reset()`
- `isDirty()`
- `serializeForm()`
- `validateForm(values)`
- `showValidationErrors(errors)`
- `clearValidationErrors()`
- `setSubmitting(value)`

Override points:

- `getValidationRules()`
- `buildRequestData(values)`
- `shouldTrackDirty()`
- `beforeSubmit(context)`
- `sendRequest(context)`
- `onBuild(form)`
- `onDestroy(form)`
- `onSuccess(data, context, response)`
- `onError(error, context)`

### Validator

Includes required, email, pattern, length, custom and exact decimal precision/scale validation.

### FormDataConverter

`DECIMAL` values are normalized strings to preserve database precision.

## Inputs

### ChoiceInput
- up to 5 options → Bootstrap radios
- more than 5 → Select2

### CurrencyInput
Exact decimal masking with precision/scale limits.

### DatePicker
Flatpickr wrapper with `dd/mm/yyyy` visible input mask.

## DataTableBuilder

Supported configuration:

- `data(rows)`
- `option(name, value)`
- `serverPage(loader, config)`
- `column(data, title, config?)`
- `renderer(data, title, renderer, config?)`
- `selectCheckbox({style?, selector?, headerCheckbox?, title?, className?, width?})`
- `menuAction({mode?: 'dropdown' | 'context', title?})`
- `toolbarAction({className?})`
- `addAction(action)`
- `searchInput(selector)`

Runtime:

- `build()`
- `refresh(resetPaging?)`
- `replaceData(rows, resetPaging?)`
- `search(value)`
- `destroy()`

`selectCheckbox()` adds the DataTables Select checkbox column at the start of the table and owns the native Select renderer/configuration, so feature modules do not call `dataTable.render.select()` directly.

`dropdown` adds a visible Bootstrap action column. `context` keeps the table columns unchanged and delegates right-click menu rendering, positioning, keyboard behavior and lifecycle to `jquery-contextmenu`, which must be loaded by the feature module vendor bundle.

`toolbarAction()` switches subsequent `addAction()` calls to the DataTables Buttons toolbar. Toolbar actions support `selection: 'none' | 'single' | 'multi' | 'any'`, `placement: 'end'`, and `variant: 'primary' | 'danger' | 'secondary'`. DataTables Buttons owns button creation and enable/disable state; start/end placement uses native DataTables 2 `layout` positions rather than moving generated DOM. The feature module vendor bundle must load DataTables Buttons.

## HTTP

`Ajax` remains the project HTTP wrapper with GET/POST, interceptors, cancellation, retry, cache, dedupe and security guards.
