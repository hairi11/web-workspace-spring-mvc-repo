import Common from '@company/common-js-web';
import { FormType } from '../FcConstants.js';
import FcRows from '../FcRows.js';
import FcService from '../FcService.js';

const {
    ButtonBar,
    FieldTranslator,
    FormControls,
    NavigationState,
    PageControls,
    Toast
} = Common;

export async function initTransaction(state) {
    const page = new PageControls(document).build();
    const form = new FormControls(
        page.component('transaction-form')
    )
        .build()
        .labels((key) => FieldTranslator.label(key));

    let rowsKey = null;
    let key = 0;
    const seedValues = state.action === 'create'
        ? (state.values || {})
        : {};

    try {
        const working = await prepareWorkingRows(state);
        rowsKey = working.rowsKey;
        key = working.key;

        saveNavigationState(state, rowsKey, key);

        const values = mapValues(
            form,
            FcRows.row(rowsKey, key) || {}
        );

        const parameters = await FcService.findParameters(
            FormType.PARAMETER
        );

        form
            .populate(values)
            .dates()
            .currencies()
            .choices(
                (key) => {
                    const parameter = key === 'string_value_11'
                        ? 'string_value_11_iso'
                        : FieldTranslator.field(key);

                    return parameters[parameter] || [];
                },
                values
            );

        const buttonBar = new ButtonBar(page.component('button-bar'))
            .navigator({
                previous: page.action('previous'),
                next: page.action('next'),
                index: key,
                count: FcRows.count(rowsKey),
                beforeNavigate: () => {
                    saveCurrentRow(form, rowsKey, key);
                    return true;
                },
                onNavigate: (targetIndex) => {
                    key = targetIndex;

                    saveNavigationState(
                        state,
                        rowsKey,
                        key
                    );

                    populateRow(form, rowsKey, key);
                }
            })
            .primary({
                name: 'save',
                text: 'Save',
                onClick: () => {
                    saveCurrentRow(form, rowsKey, key);
                    Toast.success('Transaction saved.');
                }
            })
            .secondary([
                {
                    name: 'add',
                    text: 'Add',
                    onClick: () => {
                        saveCurrentRow(form, rowsKey, key);

                        const added = FcRows.add(
                            rowsKey,
                            seedValues
                        );

                        key = added.index;

                        saveNavigationState(
                            state,
                            rowsKey,
                            key
                        );

                        populateRow(form, rowsKey, key);

                        buttonBar.updateNavigator(
                            key,
                            FcRows.count(rowsKey)
                        );
                    }
                },
                {
                    name: 'cancel',
                    text: 'Cancel',
                    onClick: () => {
                        FcRows.clear(rowsKey);
                        NavigationState.clear();
                        window.location.href = '../enquiry';
                    }
                }
            ])
            .build();
    } catch (error) {
        Toast.error(
            state.action === 'edit'
                ? 'Failed to load FC transaction.'
                : 'Failed to load transaction parameters.'
        );
        console.error(error);
    }
}

async function prepareWorkingRows(state) {
    if (state.rowsKey && FcRows.get(state.rowsKey)) {
        return {
            rowsKey: state.rowsKey,
            key: Number.isInteger(state.key)
                ? state.key
                : (Number.isInteger(state.currentIndex)
                    ? state.currentIndex
                    : 0)
        };
    }

    if (state.action === 'edit') {
        const loaded = FcRows.load(
            await FcService.findDetail(state.path, state.id)
        );

        const selectedIndex = FcRows.findIndex(
            loaded.rowsKey,
            state.path,
            state.id
        );
        const selected = FcRows.row(
            loaded.rowsKey,
            selectedIndex
        ) || {};

        FcRows.clear(loaded.rowsKey);

        const working = FcRows.create(selected);

        return {
            rowsKey: working.rowsKey,
            key: 0
        };
    }

    const working = FcRows.create(state.values || {});

    return {
        rowsKey: working.rowsKey,
        key: 0
    };
}

function populateRow(form, rowsKey, key) {
    form.populate(
        mapValues(
            form,
            FcRows.row(rowsKey, key) || {}
        )
    );
}

function saveCurrentRow(form, rowsKey, key) {
    const current = FcRows.row(rowsKey, key) || {};
    const values = translateValues(form.read());

    FcRows.update(
        rowsKey,
        key,
        Object.assign({}, current, values)
    );
}

function translateValues(values) {
    return Object.fromEntries(
        Object.entries(values || {}).map(([key, value]) => [
            FieldTranslator.field(key),
            value
        ])
    );
}

function saveNavigationState(state, rowsKey, key) {
    const next = Object.assign({}, state, {
        rowsKey: rowsKey,
        key: key
    });

    delete next.currentIndex;
    NavigationState.set(next);
}

function mapValues(form, source) {
    source = source || {};

    return form.keys().reduce((values, key) => {
        const field = FieldTranslator.field(key);

        values[key] = source[field] !== undefined
            ? source[field]
            : source[key];

        return values;
    }, {});
}
