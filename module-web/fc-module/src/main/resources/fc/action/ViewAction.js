import Common from '@company/common-js-web';
import FcRows from '../FcRows.js';
import FcService from '../FcService.js';

const {
    ButtonBar,
    FormRenderers,
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

export async function initView(state) {
    try {
        const rowsKey = FcRows.load(
            await FcService.findDetail(state.path, state.id)
        ).rowsKey;

        let currentIndex = FcRows.findIndex(
            rowsKey,
            state.path,
            state.id
        );

        const populateCurrentRow = () => {
            const row = FcRows.row(rowsKey, currentIndex);
            if (row) FormRenderers.populate(viewFields, row);
        };

        const count = FcRows.count(rowsKey);

        new ButtonBar('#viewButtonBar')
            .navigator({
                previous: '#previousButton',
                next: '#nextButton',
                index: currentIndex,
                count: count,
                hidden: count <= 1,
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

        populateCurrentRow();
    } catch (error) {
        Toast.error('Failed to load FC detail.');
        console.error(error);
    }
}
