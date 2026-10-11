import Common from '@company/common-js-web';
import { FormType } from '../FcConstants.js';
import FcService from '../FcService.js';

const {
    Button,
    DataTableBuilder,
    FieldTranslator,
    FormControls,
    NavigationState,
    PageControls,
    Renderers,
    Toast
} = Common;

let table = null;
let criteria = null;
let page = null;

export function initEnquiry() {
    page = new PageControls(document).build();
    criteria = new FormControls(document).build();

    table = prepareEnquiryTable();
    prepareEnquiryCriteria();
    prepareEnquirySearch();
}

async function prepareEnquiryCriteria() {
    criteria.dateRange(
        'date_value_6_from',
        'date_value_6_to'
    );

    try {
        const parameters = await FcService.findParameters(FormType.PARAMETER);

        criteria.selects((key, config) => {
            const parameter = key === 'string_value_11'
                ? 'string_value_11_iso'
                : config.parameter;

            return parameters[parameter] || [];
        });
    } catch (error) {
        Toast.error('Failed to load parameter list.');
        console.error(error);
    }
}

function prepareEnquiryTable() {
    return new DataTableBuilder('#fcTable')
        .serverPage((page, size, options) => FcService.enquiry(
            page,
            size,
            options.sort,
            translateCriteria(criteria.read())
        ), {
            pageLength: 20,
            onError: (error) => {
                Toast.error('Failed to load FC records.');
                console.error(error);
            }
        })
        .selectCheckbox({
            style: 'multi',
            headerCheckbox: false
        })
        .column(
            FieldTranslator.field('string_value_15'),
            FieldTranslator.label('string_value_15')
        )
        .column(
            FieldTranslator.field('string_value_14'),
            FieldTranslator.label('string_value_14')
        )
        .renderer(
            FieldTranslator.field('date_value_4'),
            FieldTranslator.label('date_value_4'),
            Renderers.date(),
            { className: 'dt-align-center' }
        )
        .column(
            FieldTranslator.field('string_value_34'),
            FieldTranslator.label('string_value_34')
        )
        .column(
            FieldTranslator.field('string_value_36'),
            FieldTranslator.label('string_value_36')
        )
        .renderer(
            FieldTranslator.field('amount_value_2'),
            FieldTranslator.label('amount_value_2'),
            Renderers.amount({
                minimumFractionDigits: 4,
                maximumFractionDigits: 4
            }),
            { className: 'dt-align-right' }
        )
        .column(
            FieldTranslator.field('string_value_11'),
            FieldTranslator.label('string_value_11')
        )
        .renderer(
            FieldTranslator.field('date_value_5'),
            FieldTranslator.label('date_value_5'),
            Renderers.date(),
            { className: 'dt-align-center' }
        )
        .column(
            FieldTranslator.field('string_value_37'),
            FieldTranslator.label('string_value_37')
        )
        .toolbarAction()
        .addAction({
            text: 'View',
            icon: 'fa fa-eye',
            selection: 'single',
            onClick: viewRecord
        })
        .addAction({
            text: 'Edit',
            icon: 'fa fa-pen',
            selection: 'single',
            onClick: editRecord
        })
        .addAction({
            text: 'Delete',
            icon: 'fa fa-trash',
            selection: 'multi',
            variant: 'danger',
            onClick: () => {}
        })
        .addAction({
            text: 'Create',
            icon: 'fa fa-plus',
            selection: 'none',
            placement: 'end',
            variant: 'primary',
            onClick: createRecord
        })
        .menuAction({ mode: 'context' })
        .addAction({
            text: 'View',
            icon: 'fa fa-eye',
            onClick: viewRecord
        })
        .addAction({
            text: 'Edit',
            icon: 'fa fa-pen',
            onClick: editRecord
        })
        .addAction({ divider: true })
        .addAction({
            text: 'Delete',
            icon: 'fa fa-trash',
            onClick: () => {}
        })
        .build();
}

function translateCriteria(values) {
    return Object.fromEntries(
        Object.entries(values).map(([key, value]) => {
            const match = key.match(/^(.*?)(_from|_to)$/);
            const field = match
                ? FieldTranslator.field(match[1]) + match[2]
                : FieldTranslator.field(key);

            return [field, value];
        })
    );
}

function prepareEnquirySearch() {
    const search = new Button(page.action('search'), {
        onClick: () => {
            search.setDisabled(true);

            try {
                table.refresh(false);
                Toast.success('FC records searched.');
            } finally {
                window.setTimeout(() => {
                    search.setDisabled(false);
                }, 300);
            }
        }
    }).build();
}

function viewRecord(row) {
    NavigationState.set({
        page: 'view',
        action: 'view',
        path: row.path,
        id: row.id,
        returnTo: {
            page: 'enquiry'
        }
    });

    window.location.href = './transaction/view';
}

function editRecord(row) {
    NavigationState.set({
        page: 'form',
        action: 'edit',
        path: row.path,
        id: row.id,
        returnTo: {
            page: 'enquiry'
        }
    });

    window.location.href = './transaction/edit';
}

function createRecord() {
    NavigationState.set({
        page: 'form',
        action: 'create',
        returnTo: {
            page: 'enquiry'
        }
    });

    window.location.href = './transaction/create';
}
