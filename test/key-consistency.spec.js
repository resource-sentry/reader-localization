const KeyConsistency = require('../src/key-consistency');

describe('Key Consistency', () => {
    let consistency;

    beforeEach(() => {
        consistency = new KeyConsistency();
    });

    it('compares objects', () => {
        let payload = {a: 1, b: {ba: 1, bb: 2}, c: {ca: 1}};
        return expect(
            Promise
                .resolve()
                .then(() => consistency.validate(payload))
                .then(() => consistency.validate(payload))
        ).resolves.toBeUndefined();
    });

    it('detects length difference', () => {
        return expect(
            Promise
                .resolve()
                .then(() => consistency.validate({a: 1}))
                .then(() => consistency.validate({a: 1, b: 2}))
        ).rejects.toBeTruthy();
    });

    it('detects discrepancy in keys', () => {
        return expect(
            Promise
                .resolve()
                .then(() => consistency.validate({a: 1, b: 2}))
                .then(() => consistency.validate({a: 1, c: 2}))
        ).rejects.toBeTruthy();
    });


});
