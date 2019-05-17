const LanguageRegistry = require('../src/service/language-registry');

describe('Language Registry', () => {

    let registry;

    beforeEach(() => {
        registry = new LanguageRegistry();
    });

    it('caches IANA registry', () => {
        let registryWithCache = new LanguageRegistry();

        return expect(
            Promise
                .resolve()
                .then(() => registry.init(true))
                .then(() => registryWithCache.init(false))
                .then(() => registryWithCache.getLanguages())
        ).resolves.not.toBeNull();
    });

    it('creates language registry', () => {
        return expect(
            Promise
                .resolve()
                .then(() => registry.init())
                .then(() => registry.getLanguages())
        ).resolves.toHaveProperty('en');
    });

    it('creates extended language registry', () => {
        return expect(
            Promise
                .resolve()
                .then(() => registry.init())
                .then(() => registry.getExtendedLanguages())
        ).resolves.toHaveProperty('ase');
    });

    it('creates writing system variations registry', () => {
        return expect(
            Promise
                .resolve()
                .then(() => registry.init())
                .then(() => registry.getScripts())
        ).resolves.toHaveProperty('Maya');
    });

    it('creates linguistic variations registry', () => {
        return expect(
            Promise
                .resolve()
                .then(() => registry.init())
                .then(() => registry.getRegions())
        ).resolves.toHaveProperty('US');
    });

    it('provides full language name', () => {
        return expect(
            Promise
                .resolve()
                .then(() => registry.init())
                .then(() => registry.getLanguages())
        ).resolves.toHaveProperty(['en', 'description'], 'English');
    });

});
