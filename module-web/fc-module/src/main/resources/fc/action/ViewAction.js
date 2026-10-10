import Common from '@company/common-js-web';
import FcFields from '../FcFields.js';
import FcRows from '../FcRows.js';
import FcService from '../FcService.js';

const {
    ButtonBar,
    FieldTranslator,
    FormRenderers,
    Toast
} = Common;

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

        const applyLabels = () => {
            Object.keys(FcFields.view).forEach((key) => {
                const field = document.querySelector(FcFields.view[key].selector);
                const container = field?.closest(
                    '.view-detail-panel-row, .view-detail-side-field, .view-detail-field'
                );
                const label = container?.querySelector(
                    '.view-detail-panel-label, label'
                );

                if (label) label.textContent = FieldTranslator.label(key);
            });
        };

        const populateCurrentRow = () => {
            const row = FcRows.row(rowsKey, currentIndex);
            if (!row) return;

            const values = {};

            Object.keys(FcFields.view).forEach((key) => {
                const field = FieldTranslator.field(key);

                values[key] = row[field] !== undefined
                    ? row[field]
                    : row[key];
            });

            FormRenderers.populate(FcFields.view, values);
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
                    applyLabels();
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
