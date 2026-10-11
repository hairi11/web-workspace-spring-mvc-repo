import Common from '@company/common-js-web';
import FcRows from '../FcRows.js';

const {
    ButtonBar,
    NavigationState
} = Common;

class FcTransactionAction {
    constructor(options) {
        this.form = options.form;
        this.state = options.state;
        this.rowsKey = options.rowsKey;
        this.key = options.key;
        this.seed = options.seed || {};
        this.returnTo = options.returnTo || {page: 'enquiry'};
        this.page = options.page;
        this.buttonBar = null;
    }

    build() {
        this.buttonBar = new ButtonBar(
            this.page.component('button-bar')
        )
            .navigator({
                previous: this.page.action('previous'),
                next: this.page.action('next'),
                index: this.key,
                count: FcRows.count(this.rowsKey),
                beforeNavigate: () => this.saveCurrent(),
                onNavigate: (targetIndex) => {
                    this.key = targetIndex;
                    this.saveState();
                    this.form.populate(
                        FcRows.row(this.rowsKey, this.key)
                    );
                }
            })
            .primary({
                name: 'save',
                text: 'Save',
                onClick: () => this.saveCurrent()
            })
            .secondary([
                {
                    name: 'add',
                    text: 'Add',
                    onClick: () => this.add()
                },
                {
                    name: 'cancel',
                    text: 'Cancel',
                    onClick: () => this.cancel()
                }
            ])
            .build();

        return this;
    }

    saveCurrent() {
        const rows = this.form.saveWorkingRow(this.key);
        return Boolean(rows);
    }

    add() {
        if (!this.saveCurrent()) return false;

        const rows = this.form.addWorkingRow(this.seed);
        if (!rows) return false;

        this.key = rows.rows.length - 1;
        this.saveState();
        this.form.populate(rows.rows[this.key]);

        this.buttonBar.updateNavigator(
            this.key,
            rows.rows.length
        );

        return true;
    }

    saveState() {
        NavigationState.set(Object.assign({}, this.state, {
            rowsKey: this.rowsKey,
            key: this.key
        }));

        return this;
    }

    cancel() {
        FcRows.clear(this.rowsKey);
        NavigationState.clear();
        window.location.href = '../enquiry';
    }
}

export default FcTransactionAction;
