import FcService from '../FcService.js';

export default class FcEnquiryAction {

    constructor(form) {
        this.form = form;
        this.rows = [];
    }

    async init() {
        const reloadButton = this.form.getReloadButton();
        const searchInput = this.form.getSearchInput();

        if (reloadButton) {
            reloadButton.addEventListener(
                'click',
                () => this.reload()
            );
        }

        if (searchInput) {
            searchInput.addEventListener(
                'input',
                () => this.filter()
            );
        }

        await this.load();
    }

    async load() {
        const payload = await FcService.enquiry(0, 100);
        this.rows = this.extractRows(payload);
        this.render();
    }

    async reload() {
        const reloadButton = this.form.getReloadButton();
        const searchInput = this.form.getSearchInput();

        if (reloadButton) reloadButton.disabled = true;
        if (searchInput) searchInput.value = '';

        try {
            await this.load();
        } finally {
            if (reloadButton) reloadButton.disabled = false;
        }
    }

    filter() {
        const searchInput = this.form.getSearchInput();
        const tableBody = this.form.getTableBody();
        if (!tableBody) return;

        const keyword = (searchInput?.value || '')
            .trim()
            .toLowerCase();

        for (const row of tableBody.querySelectorAll('tr')) {
            row.hidden = keyword !== ''
                && !row.textContent.toLowerCase().includes(keyword);
        }
    }

    render() {
        const tableBody = this.form.getTableBody();
        if (!tableBody) return;

        tableBody.replaceChildren();

        this.rows.forEach((row, index) => {
            const tr = document.createElement('tr');

            tr.append(
                this.cell(row.recordNo ?? index + 1),
                this.cell(
                    row.categoryDescription
                    ?? row.category
                    ?? '-'
                ),
                this.cell(row.status ?? '-')
            );

            tableBody.appendChild(tr);
        });

        this.filter();
    }

    extractRows(payload) {
        if (Array.isArray(payload)) return payload;
        if (Array.isArray(payload?.content)) return payload.content;
        if (Array.isArray(payload?.items)) return payload.items;
        return [];
    }

    cell(value) {
        const td = document.createElement('td');
        td.textContent = String(value ?? '');
        return td;
    }
}
