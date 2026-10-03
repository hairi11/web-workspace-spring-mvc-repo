import Common from '@company/common-js-web';
import FcService from '../FcService.js';
import FcFormValues from '../FcFormValues.js';

const { ButtonBar, NavigationState, Toast } = Common;

let viewState = null;
let buttonBar = null;

export async function initView() {
    viewState = NavigationState.consume();

    if (
        !viewState
        || viewState.action !== 'view'
        || viewState.path == null
        || viewState.id == null
    ) {
        console.error('Missing FC view navigation state.', viewState);
        Toast.error('Unable to load FC detail.');
        return;
    }

    prepareNavigator();

    const rows = Array.isArray(viewState.rows) ? viewState.rows : [];
    const currentRow = rows[viewState.index];

    if (currentRow) {
        populateView(currentRow);
        return;
    }

    try {
        await loadDetail({
            path: viewState.path,
            id: viewState.id
        });
    } catch (error) {
        Toast.error('Failed to load FC detail.');
        console.error(error);
    }
}

function prepareNavigator() {
    const rows = Array.isArray(viewState.rows) ? viewState.rows : [];
    const index = Number.isInteger(viewState.index)
        ? viewState.index
        : 0;

    buttonBar = new ButtonBar('#viewButtonBar')
        .navigator({
            previous: '#previousButton',
            next: '#nextButton',
            index: index,
            count: rows.length,
            hidden: rows.length <= 1,
            onNavigate: loadRow,
            onError: (error) => {
                Toast.error('Failed to load FC detail.');
                console.error(error);
            }
        })
        .secondary({
            target: '#backButton',
            text: 'Back',
            placement: ButtonBar.Placement.END
        })
        .build();
}

async function loadRow(index) {
    const rows = Array.isArray(viewState.rows) ? viewState.rows : [];
    const row = rows[index];

    if (!row) return;

    populateView(row);

    viewState.index = index;
    viewState.path = row.path;
    viewState.id = row.id;
}

async function loadDetail(row) {
    const response = await FcService.findDetail(row.path, row.id);
    const detail = response && response.data
        ? response.data
        : response;

    if (!detail) return;

    populateView(detail);
}

function populateView(detail) {
    FcFormValues.populateView(detail);
}
