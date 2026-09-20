# Changelog

## 8.0.4 - Split DataTables toolbar placement

- Toolbar actions with `placement: 'end'` are moved into a separate DataTables-generated button group after table initialization.
- Start actions stay compact on the left while end actions align reliably to the right without relying on auto margins inside Bootstrap `btn-group`.


## 8.0.3 - DataTables checkbox selection wrapper

- Added `selectCheckbox()` to keep the native DataTables Select checkbox renderer and column setup inside `DataTableBuilder`.
- Feature modules no longer need to call `dataTable.render.select()` directly.


## 8.0.2 - DataTables toolbar action wrapper

- Added `toolbarAction()` so feature modules declare toolbar actions through `DataTableBuilder`, matching the existing `menuAction()` wrapper pattern.
- DataTables Buttons now owns toolbar button rendering and selection-driven enable/disable state.
- Added single, multi, any, and no-selection action rules plus end placement and semantic variants.


## 8.0.1 - Third-party DataTable context menu

- Replaced custom right-click menu mechanics with `jquery-contextmenu` 2.10.2.
- Kept `menuAction({mode: 'context'})` as the module-facing wrapper API.
- Kept Bootstrap dropdown actions as the default `menuAction()` mode.


## 8.0.0 - Bootstrap wrapper refactor

- Kept project wrapper APIs while moving UI mechanics to Bootstrap 5.
- Button, dropdown, modal, dialog and toast wrappers now use Bootstrap presentation/behavior.
- Removed legacy custom button/modal/toast CSS from the web bundle.
- Simplified DatePicker to Flatpickr + Bootstrap input styling.
- Trimmed FormAction to the lifecycle used by the workspace.
- Trimmed DataTableBuilder to local data, server paging, columns, context actions and search.
- Updated module markup to Bootstrap button classes.
- Preserved exact decimal strings to avoid JavaScript floating-point precision loss.

## 7.0.0
- Completed v4 advanced forms.
- Completed v5 advanced DataTable helpers.
- Completed v6 request hardening and infrastructure helpers.
- Completed v7 developer experience, docs, tests and type declarations.
- Removed all platform-specific assumptions from the project scope.

- FormAction redesigned to Template Method Pattern; fluent/chaining form API removed.

## 7.1.0 - Security hardening

- Safe DOM rendering is now the default for Modal, Toast, field errors, and DataTable action labels.
- Raw HTML in `Modal.open()` requires explicit `trustedHtml: true` opt-in.
- Added `SecurityUtil`, `SafeDom`, and `FileValidator`.
- Added URL protocol validation and strict query serialization.
- Added prototype-pollution guards in configuration and form serialization.
- Cross-origin credentials are blocked by default unless explicitly enabled.
- Sensitive headers are removed from cross-origin requests by default.
- Added optional same-origin POST CSRF token provider.
- Logger redacts common secrets/tokens/passwords by default.
- Server/network error messages are normalized before surfacing.
- Added default JSON request body length limit.
- Added dedicated security regression tests.
