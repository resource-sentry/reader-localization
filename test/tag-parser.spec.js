const TagParser = require('../src/tag-parser');

describe('Tag Parser', () => {

    let parser;

    beforeEach(() => {
        parser = new TagParser();
    });

    it('captures language from the tag', () => {
        expect(parser.parse('zh-cmn-Hans-CN')).toHaveProperty('language', 'zh');
    });

    it('captures region from the tag', () => {
        expect(parser.parse('ja-JP-u-ca-japanese')).toHaveProperty('region', 'JP');
    });

    it('captures script from the tag', () => {
        expect(parser.parse('zh-Hant-CN-x-private1-private2')).toHaveProperty('script', 'Hant');
    });

    it('captures variant from the tag', () => {
        expect(parser.parse('de-DE-1996')).toHaveProperty('variant', '1996');
    });

    it('captures extended language from the tag', () => {
        expect(parser.parse('zh-yue')).toHaveProperty('extlang', ['yue']);
    });

    it('captures simple language tag', () => {
        expect(parser.parse('en-GB')).toMatchObject({language: 'en', region: 'GB'});
    });

    it('captures extension from the tag', () => {
        expect(parser.parse('de-DE-u-co-phonebk')).toHaveProperty('extension', 'u-co-phonebk');
    });

    it('captures private use from the tag', () => {
        expect(parser.parse('en-US-x-twain')).toHaveProperty('privateUse', 'x-twain');
    });

});
