import Common from '@company/common-js-web';
import FcRows from '../FcRows.js';
import FcService from '../FcService.js';
import FcSupport from '../FcSupport.js';

const { ButtonBar, Toast } = Common;

let viewState = null;
let rowsKey = null;
let currentIndex = 0;
let buttonBar = null;

export async function initView() {
    viewState = FcSupport.navigation.consumeView();

    if (!viewState) {
        Toast.error('Unable to load FC detail.');
        return;
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

    FcSupport.form.populateView(row);
}
