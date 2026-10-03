import Common from '@company/common-js-web';
import FcService from '../FcService.js';
import FcFormValues from '../FcFormValues.js';

const { ButtonBar, NavigationState, Toast } = Common;

let viewState = null;
let rows = [];
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
        console.error('Missing FC view navigation state.', viewState);
        Toast.error('Unable to load FC detail.');
        return;
    }

    try {
        const response = await FcService.findDetail(
            viewState.path,
            viewState.id
        );

        rows = resolveRows(response);

        currentIndex = findCurrentIndex(
            rows,
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

function resolveRows(response) {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.rows)) return response.rows;
    if (Array.isArray(response?.data?.rows)) return response.data.rows;

    const detail = response && response.data
        ? response.data
        : response;

    return detail ? [detail] : [];
}

function findCurrentIndex(items, path, id) {
    const index = items.findIndex(
        (item) => item
            && item.path === path
            && item.id === id
    );

    return index < 0 ? 0 : index;
}

function prepareNavigator() {
    buttonBar = new ButtonBar('#viewButtonBar')
        .navigator({
            previous: '#previousButton',
            next: '#nextButton',
            index: currentIndex,
            count: rows.length,
            hidden: rows.length <= 1,
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
    const row = rows[currentIndex];
    if (!row) return;

    FcFormValues.populateView(row);
}
