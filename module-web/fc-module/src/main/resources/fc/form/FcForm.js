export default class FcForm {

    constructor(root) {
        this.root = root || document;
    }

    getStatusElement() {
        return this.root.querySelector('#fcStatus');
    }
}
