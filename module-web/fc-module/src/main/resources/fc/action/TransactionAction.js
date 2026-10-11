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
    let currentIndex = 0;
    const seedValues = state.action === 'create'
        ? (state.values || {})
        : {};

    try {
        const working = await prepareWorkingRows(state);
        rowsKey = working.rowsKey;
        currentIndex = working.currentIndex;

        saveNavigationState(state, rowsKey, currentIndex);

        const values = mapValues(
            form,
            FcRows.row(rowsKey, currentIndex) || {}
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

        new ButtonBar(page.component('button-bar'))
            .primary({
                name: 'save',
                text: 'Save',
                onClick: () => {
                    saveCurrentRow(form, rowsKey, currentIndex);
                    Toast.success('Transaction saved.');
                }
            })
            .secondary([
                {
                    name: 'add',
                    text: 'Add',
                    onClick: () => {
                        saveCurrentRow(form, rowsKey, currentIndex);

                        const added = FcRows.add(
                            rowsKey,
                            seedValues
                        );

                        currentIndex = added.index;

                        saveNavigationState(
                            state,
                            rowsKey,
                            currentIndex
                        );

                        form.populate(
                            mapValues(form, seedValues)
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
            currentIndex: Number.isInteger(state.currentIndex)
                ? state.currentIndex
                : 0
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
            currentIndex: 0
        };
    }

    const working = FcRows.create(state.values || {});

    return {
        rowsKey: working.rowsKey,
        currentIndex: 0
    };
}

function saveCurrentRow(form, rowsKey, currentIndex) {
    const current = FcRows.row(rowsKey, currentIndex) || {};
    const values = translateValues(form.read());

    FcRows.update(
        rowsKey,
        currentIndex,
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

function saveNavigationState(state, rowsKey, currentIndex) {
    NavigationState.set(Object.assign({}, state, {
        rowsKey: rowsKey,
        currentIndex: currentIndex
    }));
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
