export default class FcEnquiryForm {

    constructor(root) {
        this.root = root || document;
    }

    getSearchInput() {
        return this.root.querySelector('#searchInput');
    }

    getReloadButton() {
        return this.root.querySelector('#reloadButton');
    }

    getTableBody() {
        return this.root.querySelector('#fcTable tbody');
    }
}
