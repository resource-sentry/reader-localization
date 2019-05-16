const RegistryParser = require('../src/registry-parser');

describe('Registry Parser', () => {

    let parser;

    beforeEach(() => {
        parser = new RegistryParser();
    });

    it('returns null for non-registry data', () => {
        expect(parser.parse('File-Date: 2019-04-30')).toBeNull();
    });

    it('parses type', () => {
        const blob = `
Type: language
Subtag: ae
Description: Avestan
Added: 2005-10-16`;
        expect(parser.parse(blob)).toHaveProperty('type', 'language');
    });

    it('parses subtag', () => {
        const blob = `
Type: language
Subtag: ay
Description: Aymara
Added: 2005-10-16
Suppress-Script: Latn
Scope: macrolanguage`;
        expect(parser.parse(blob)).toHaveProperty('subtag', 'ay');
    });

    it('parses description', () => {
        const blob = `
Type: language
Subtag: cu
Description: Church Slavic
Description: Church Slavonic
Description: Old Bulgarian
Description: Old Church Slavonic
Description: Old Slavonic
Added: 2005-10-16`;
        expect(parser.parse(blob)).toHaveProperty('description', 'Church Slavic');
    });

});
