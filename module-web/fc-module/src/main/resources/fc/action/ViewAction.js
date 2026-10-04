import Common from '@company/common-js-web';
import FcRows from '../FcRows.js';
import FcService from '../FcService.js';

const {
    ButtonBar,
    FormValues,
    NavigationState,
    Renderers,
    Toast
} = Common;

const viewFields = {
    string_value_1: {
        selector: '#stringValue1'
    },
    string_value_2: {
        selector: '#stringValue2'
    },
    date_value_1: {
        selector: '#dateValue1',
        format: Renderers.date()
    },
    string_value_3: {
        selector: '#stringValue3'
    },
    string_value_4: {
        selector: '#stringValue4'
    },
    amount_value: {
        selector: '#amountValue',
        format: Renderers.amount({
            minimumFractionDigits: 4,
            maximumFractionDigits: 4
        })
    },
    amount_value_2: {
        selector: '#amountValue2',
        format: Renderers.amount({
            minimumFractionDigits: 6,
            maximumFractionDigits: 6
        })
    },
    string_value_5: {
        selector: '#stringValue5'
    },
    date_value_2: {
        selector: '#dateValue2',
        format: Renderers.date()
    },
    string_value_6: {
        selector: '#stringValue6'
    }
};

let viewState = null;
let rowsKey = null;
let currentIndex = 0;
let buttonBar = null;

export async function initView() {
    viewState = NavigationState.consume();

    if (
        !viewState
        || viewState.action !== 'view'
        || viewState.path == null
        || viewState.id == null
    ) {
        console.warn('Invalid FC view navigation state.', viewState);
    }

    try {
        const response = await FcService.findDetail(
            viewState.path,
            viewState.id
        );

        const rows = FcRows.load(response);
        rowsKey = rows.rowsKey;
        currentIndex = FcRows.findIndex(
            rowsKey,
            viewState.path,
            viewState.id
        );

        prepareNavigator();
        populateCurrentRow();
    } catch (error) {
        Toast.error('Failed to load FC detail.');
        console.error(error);
    }
}

function prepareNavigator() {
    buttonBar = new ButtonBar('#viewButtonBar')
        .navigator({
            previous: '#previousButton',
            next: '#nextButton',
            index: currentIndex,
            count: FcRows.count(rowsKey),
            hidden: FcRows.count(rowsKey) <= 1,
            onNavigate: (index) => {
                currentIndex = index;
                populateCurrentRow();
            }
        })
        .secondary({
            target: '#backButton',
            text: 'Back',
            placement: ButtonBar.Placement.END
        })
        .build();
}

function populateCurrentRow() {
    const row = FcRows.row(rowsKey, currentIndex);
    if (!row) return;

    FormValues.populate(viewFields, row, {
        target: 'text'
    });
}
