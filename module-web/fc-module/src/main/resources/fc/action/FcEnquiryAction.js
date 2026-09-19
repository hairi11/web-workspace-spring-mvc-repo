export default class FcEnquiryAction {

    constructor(form) {
        this.form = form;
    }

    init() {
        const reloadButton = this.form.getReloadButton();
        const searchInput = this.form.getSearchInput();

        if (reloadButton) {
            reloadButton.addEventListener('click', () => this.reload());
        }

        if (searchInput) {
            searchInput.addEventListener('input', () => this.filter());
        }
    }

    reload() {
        const searchInput = this.form.getSearchInput();
        if (searchInput) searchInput.value = '';
        this.filter();
    }

    filter() {
        const searchInput = this.form.getSearchInput();
        const tableBody = this.form.getTableBody();
        if (!tableBody) return;

        const keyword = (searchInput?.value || '').trim().toLowerCase();

        for (const row of tableBody.querySelectorAll('tr')) {
            row.hidden = keyword !== '' && !row.textContent.toLowerCase().includes(keyword);
        }
    }
}
