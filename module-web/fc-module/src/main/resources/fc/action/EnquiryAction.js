import Common from '@company/common-js-web';
import { FormType } from '../FcConstants.js';
import FcService from '../FcService.js';

const {
    Button,
    DataTableBuilder,
    FieldTranslator,
    FormControls,
    FormDialog,
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

        criteria.selects(
            (key, config) => parameters[
                FieldTranslator.field(config.parameter || key)
            ] || []
        );
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
            text: 'Amend',
            icon: 'fa fa-file-pen',
            selection: 'single',
            onClick: () => {}
        })
        .addAction({
            text: 'Roll',
            icon: 'fa fa-rotate',
            selection: 'single',
            onClick: () => {}
        })
        .addAction({
            text: 'Delete',
            icon: 'fa fa-trash',
            selection: 'any',
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
            text: 'Amend',
            icon: 'fa fa-file-pen',
            selection: 'single',
            onClick: () => {}
        })
        .addAction({
            text: 'Roll',
            icon: 'fa fa-rotate',
            selection: 'single',
            onClick: () => {}
        })
        .addAction({ divider: true })
        .addAction({
            text: 'Delete',
            icon: 'fa fa-trash',
            selection: 'any',
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

async function createRecord() {
    try {
        const parameters = await FcService.findParameters(
            FormType.PARAMETER
        );
        const content = createCreateDialogContent();

        const form = new FormControls(content)
            .build()
            .select(
                'string_value_13',
                parameters[
                    FieldTranslator.field('string_value_13')
                ] || []
            );

        const result = await FormDialog.open({
            title: 'Create Transaction',
            content: content,
            submitLabel: 'Create',
            cancelLabel: 'Cancel',
            onSubmit: () => {
                const values = form.read();

                if (!values.string_value_13) {
                    Toast.warning(
                        FieldTranslator.label('string_value_13')
                        + ' is required.'
                    );
                    return false;
                }

                return values;
            }
        });

        if (!result.submitted) return;

        NavigationState.set({
            page: 'form',
            action: 'create',
            values: result.value,
            returnTo: {
                page: 'enquiry'
            }
        });

        window.location.href = './transaction/create';
    } catch (error) {
        Toast.error('Failed to open create transaction.');
        console.error(error);
    }
}

function createCreateDialogContent() {
    const content = document.createElement('div');
    const group = document.createElement('div');
    const label = document.createElement('label');
    const select = document.createElement('select');

    const field = 'string_value_13';
    const id = 'create-' + field;

    group.className = 'mb-3';

    label.className = 'form-label';
    label.htmlFor = id;
    label.textContent = FieldTranslator.label(field);

    select.id = id;
    select.name = field;
    select.className = 'form-select';
    select.dataset.control = 'select';
    select.dataset.allowClear = 'true';

    group.append(label, select);
    content.appendChild(group);

    return content;
}
