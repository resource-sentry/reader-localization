class RegistryParser {
    constructor() {
        // TODO Explore multi-description matching
        this.description = /Description:\s+(.+)/;
        this.subtag = /Subtag:\s+(.+)/;
        this.typeRegex = /Type:\s+(.+)/;
    }

    parse(content) {
        let result = null;
        let typeSearch = this.typeRegex.exec(content);
        let subtagSearch = this.subtag.exec(content);
        let descriptionSearch = this.description.exec(content);

        if (typeSearch !== null) {
            result = result || {};
            result.type = typeSearch[1];
        }

        if (subtagSearch !== null) {
            result = result || {};
            result.subtag = subtagSearch[1];
        }

        if (descriptionSearch !== null) {
            result = result || {};
            result.description = descriptionSearch[1];
        }

        return result;
    }
}

module.exports = RegistryParser;
