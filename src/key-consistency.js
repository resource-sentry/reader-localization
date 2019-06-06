const convertObjectToKeyList = require('./util/convert-object-to-key-list');

class KeyConsistency {
    constructor() {
        this.currentStructure = null;
    }

    compare(currentList, newList) {
        let i = 0;
        let len = currentList.length;

        for (i; i < len; ++i) {
            if (currentList[i] !== newList[i]) {
                throw new Error(`Key "${currentList[i]}" can not be found`);
            }
        }
    }

    validate(language) {
        let keyList;
        // First validation, just set current language as a blueprint for the future validations
        if (this.currentStructure === null) {
            this.currentStructure = convertObjectToKeyList(language);
        } else {
            keyList = convertObjectToKeyList(language);

            if (keyList.length > this.currentStructure.length) {
                throw new Error(`Extra keys found: "${keyList.slice(this.currentStructure.length).join(', ')}"`)
            } else {
                this.compare(this.currentStructure, keyList);
            }
        }
    }
}

module.exports = KeyConsistency;
