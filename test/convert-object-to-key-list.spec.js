const convertObjectToKeyList = require('../src/util/convert-object-to-key-list');

describe('Convert Object to Key List', () => {

    it('creates simple list', () => {
        let result = [];
        convertObjectToKeyList({hello: 1, world: 2}, result);
        expect(result).toEqual(['hello', 'world'])
    });

    it('sorts simple list', () => {
        let result = [];
        convertObjectToKeyList({c: 3, b: 2, a: 1}, result);
        expect(result).toEqual(['a', 'b', 'c']);
    });

    it('creates list with nested entities', () => {
        let result = [];
        convertObjectToKeyList({
            a: 1,
            b: {
                ba: 1,
                bb: {bba: 1, bbb: 2}
            },
            c: {ca: 1, cb: 2, cc: 3}
        }, result);
        expect(result).toEqual(['a', 'b.ba', 'b.bb.bba', 'b.bb.bbb', 'c.ca', 'c.cb', 'c.cc']);
    });

    it('sorts list with nested entities', () => {
        let result = [];
        convertObjectToKeyList({
            visit: {our: 'planet', here: '8'},
            alpha: {omega: 900, center: 800}
        }, result);
        expect(result).toEqual(['alpha.center', 'alpha.omega', 'visit.here', 'visit.our']);
    });

});
