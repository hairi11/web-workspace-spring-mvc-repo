import Common from '@company/common-js-web';
import { MasterMode, TransactionMode } from '../FcConstants.js';
import FcRows from '../FcRows.js';

const {
    Button,
    DataTableBuilder,
    Dialog,
    FieldTranslator,
    NavigationState,
    Renderers
} = Common;

class FcMasterAction {
    constructor(options) {
        this.form = options.form;
        this.mode = options.mode;
        this.rowsKey = options.rowsKey;
        this.transactions = Array.isArray(options.transactions)
            ? options.transactions
            : [];
        this.table = null;
        this.addButton = null;
    }

    build() {
        const editing = this.mode === MasterMode.EDIT;

        this.table = this.buildTable();

        this.addButton = new Button('#addTransactionButton', {
            variant: Button.Variant.PRIMARY,
            hidden: !editing,
            onClick: () => this.openTransaction(
                TransactionMode.CREATE,
                null
            )
        }).build();

        return this;
    }

    configure() {
        const heading = document.querySelector('h1');

        if (heading) {
            heading.textContent = this.mode === MasterMode.EDIT
                ? 'Edit FC Master'
                : 'View FC Master';
        }

        return this;
    }

    buildTable() {
        const builder = new DataTableBuilder('#fcMasterTable')
            .data(this.getRows())
            .option('paging', false)
            .option('info', false)
            .option('ordering', false)
            .column('recordNo', 'No.')
            .renderer(
                FieldTranslator.field('date_value_4'),
                FieldTranslator.label('date_value_4'),
                Renderers.date()
            )
            .column(
                FieldTranslator.field('string_value_33'),
                FieldTranslator.label('string_value_33')
            )
            .column(
                FieldTranslator.field('string_value_35'),
                FieldTranslator.label('string_value_35')
            )
            .renderer(
                FieldTranslator.field('amount_value_2'),
                FieldTranslator.label('amount_value_2'),
                Renderers.amount({
                    minimumFractionDigits: 4,
                    maximumFractionDigits: 4
                })
            );

        if (this.mode === MasterMode.EDIT) {
            builder
                .menuAction({mode: 'context'})
                .addAction({
                    text: 'Edit',
                    icon: 'fa fa-pen',
                    onClick: (row) => this.openTransaction(
                        TransactionMode.EDIT,
                        row.rowIndex
                    )
                })
                .addAction({
                    text: 'Remove',
                    icon: 'fa fa-trash',
                    onClick: (row) => this.removeTransaction(row)
                });
        }

        return builder.build();
    }

    getRows() {
        return this.transactions.map((row, index) => Object.assign({}, row, {
            rowIndex: index,
            recordNo: row.recordNo || index + 1
        }));
    }

    openTransaction(mode, index) {
        NavigationState.set({
            page: 'form',
            action: mode,
            key: index,
            rowsKey: this.rowsKey,
            returnTo: {
                page: 'master',
                action: MasterMode.EDIT,
                rowsKey: this.rowsKey
            }
        });

        window.location.href = mode === TransactionMode.CREATE
            ? './transaction/create'
            : './transaction/edit';
    }

    async removeTransaction(row) {
        const confirmed = await Dialog.confirm({
            title: 'Remove Transaction',
            message: 'Remove this FC transaction?',
            yesLabel: 'Yes',
            noLabel: 'No'
        });

        if (!confirmed) return;

        const rows = FcRows.removeTransaction(
            this.rowsKey,
            row.rowIndex
        );
        if (!rows) return;

        this.transactions = rows.transactions;
        this.form.setTransactions(this.transactions);
        this.table.replaceData(this.getRows(), false);
    }
}

export default FcMasterAction;
