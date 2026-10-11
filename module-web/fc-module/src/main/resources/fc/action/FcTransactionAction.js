import Common from '@company/common-js-web';
import { TransactionMode } from '../FcConstants.js';

const {
    ButtonBar,
    NavigationState
} = Common;

class FcTransactionAction {
    constructor(options) {
        this.form = options.form;
        this.mode = options.mode;
        this.key = options.key;
        this.rowsKey = options.rowsKey;
        this.rows = options.rows;
        this.returnTo = options.returnTo;
        this.pageConfig = options.pageConfig;
        this.buttonBar = null;
    }

    build() {
        const count = this.rows ? this.rows.rows.length : 0;

        this.buttonBar = new ButtonBar('#transactionButtonBar')
            .navigator({
                previous: '[data-action="previous"]',
                next: '[data-action="next"]',
                index: this.key,
                count: count,
                beforeNavigate: () => this.form.saveDirtyRow(),
                onNavigate: (targetIndex) => this.openRow(targetIndex)
            })
            .primary({
                name: 'save',
                text: 'Save',
                onClick: () => this.form.execute()
            })
            .secondary([
                {
                    name: 'add',
                    text: 'Add',
                    onClick: async () => {
                        if (!await this.form.saveDirtyRow()) return;

                        this.openCreate(count);
                    }
                },
                {
                    name: 'cancel',
                    text: 'Cancel',
                    placement: ButtonBar.Placement.END,
                    onClick: () => this.navigateTo(this.returnTo)
                }
            ])
            .build();

        return this;
    }

    configure() {
        const heading = document.querySelector('h1');

        if (heading) {
            heading.textContent = this.pageConfig.title;
        }

        return this;
    }

    openRow(targetIndex) {
        NavigationState.set({
            page: 'form',
            action: TransactionMode.EDIT,
            key: targetIndex,
            rowsKey: this.rowsKey,
            returnTo: this.returnTo
        });

        window.location.href = './edit';
    }

    openCreate(targetIndex) {
        NavigationState.set({
            page: 'form',
            action: TransactionMode.CREATE,
            key: targetIndex,
            rowsKey: this.rowsKey,
            values: this.pageConfig.seed,
            returnTo: this.returnTo
        });

        window.location.href = './create';
    }

    navigateTo(target) {
        if (target && target.page === 'enquiry') {
            window.location.href = '../enquiry';
            return;
        }

        window.location.href = '../enquiry';
    }
}

export default FcTransactionAction;
