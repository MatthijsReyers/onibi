import sanitize, { EnumValueError, NullValueError } from '../src/index';
import utils from './utils';

import { expect } from 'chai';
import 'mocha';

const FRUITS = [
    'Apple', 'Pear', 'Banana', 'Kiwi', 'Orange'
];

const MULTI_TYPES = [
    'Name', 32, 4, 5, null
];

var fruitsCopy: string[];
var multiTypesCopy: any[];


describe('Enumerations', () => {
    before(() => {
        fruitsCopy = utils.copy(FRUITS);
        multiTypesCopy = utils.copy(MULTI_TYPES);
    })

    it('should not be case sensitive by default', () => {
        let value = sanitize.enums(FRUITS[0].toLowerCase(), utils.copy(FRUITS));
        expect(value).to.equal(FRUITS[0]);
        value = sanitize.enums(FRUITS[0].toUpperCase(), utils.copy(FRUITS));
        expect(value).to.equal(FRUITS[0]);
    });

    it('should be case sensitive when enabled', () => {
        expect(() => {
            sanitize.enums('apple', FRUITS, {
                caseSensitive: true
            })
        }).to.throw(EnumValueError, /(.*)apple(.*)Apple(.*)Kiwi(.*)/);
    });

    it('should not allow null values by default', () => {
        expect(() => {
            sanitize.enums(null, FRUITS);
        }).to.throw(NullValueError);
    });

    it('should allow null values when enabled', () => {
        let value = sanitize.enums(null, FRUITS, { allowNull: true });
        expect(value).to.be.null;
    });

    it('should allow null values when in enum array', () => {
        let value = sanitize.enums(null, MULTI_TYPES);
        expect(value).to.be.null;
    });

    after('should leave value arrays unchanged', () => {
        expect(FRUITS.length).to.equal(fruitsCopy.length);
        expect(MULTI_TYPES.length).to.equal(multiTypesCopy.length);

        expect(
            FRUITS.map((fruit, i) => fruit === fruitsCopy[i]).reduce((a, b) => a && b, true)
        ).to.be.true;
        expect(
            MULTI_TYPES.map((t, i) => t === multiTypesCopy[i]).reduce((a, b) => a && b, true)
        ).to.be.true;
    })
});
