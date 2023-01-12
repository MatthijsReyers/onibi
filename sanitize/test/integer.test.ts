
import sanitize from './../src/index';
import * as random from './random';
import { expect } from 'chai';
import 'mocha';
import { NanValueError, NegativeValueError } from '../src/errors';

describe('Signed integers', () => {
    it('should parse random integers', () => {
        const ROUNDS = 100;
        for (let i = 0; i < ROUNDS; i++) {
            const value = random.randomInt(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
            const result = sanitize.int(`  ${value}\t`);
            expect(result).to.equal(value);
        }
    });

    it('should round random floats', () => {
        const ROUNDS = 100;
        for (let i = 0; i < ROUNDS; i++) {
            const value = random.randomFloat(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
            const result = sanitize.int(`  ${value}\t`);
            expect(result).to.equal(Math.round(value));
        }
    });
});

describe('Unsigned integers', () => {
    it('should replace negative values with custom ones', () => {
        let result: number;

        result = sanitize.int.unsigned(-82390, { signedValues: 66 });
        expect(result).to.equal(66);

        result = sanitize.int.unsigned(-34921);
        expect(result).to.equal(0);

        result = sanitize.int.unsigned(-34921, { default: 90, signedValues: 77 });
        expect(result).to.equal(77);

        sanitize.int.setRules({ default: 90, signedValues: 420 });

        result = sanitize.int.unsigned(-6327);
        expect(result).to.equal(420);

        sanitize.int.setRules({ default: 0, signedValues: 0 });

        result = sanitize.int.unsigned(-98391234);
        expect(result).to.equal(0);
    });

    it('should replace negative values with the default one', () => {
        let result: number;

        result = sanitize.int.unsigned(-82390, { signedValues: 'default' });
        expect(result).to.equal(0);

        result = sanitize.int.unsigned(-8);
        expect(result).to.equal(0);

        result = sanitize.int.unsigned(-323, { default: 90, signedValues: 'default' });
        expect(result).to.equal(90);

        sanitize.int.setRules({ default: 69, signedValues: 'default' });

        result = sanitize.int.unsigned(-420);
        expect(result).to.equal(69);

        result = sanitize.int.unsigned(-420, { default: 7823 });
        expect(result).to.equal(7823);

        sanitize.int.setRules({ default: 0, signedValues: 0 });

        result = sanitize.int.unsigned(-98391234);
        expect(result).to.equal(0);
    });

    it('should make negative values absolute', () => {
        let result: number;

        result = sanitize.int.unsigned(-78, { signedValues: 'abs' });
        expect(result).to.equal(78);

        result = sanitize.int.unsigned(-34921);
        expect(result).to.equal(0);

        result = sanitize.int.unsigned(-34921, { signedValues: 'abs' });
        expect(result).to.equal(34921);

        sanitize.int.setRules({ signedValues: 'abs' });

        result = sanitize.int.unsigned(-6327);
        expect(result).to.equal(6327);

        sanitize.int.setRules({ signedValues: 0 });

        result = sanitize.int.unsigned(-98391234);
        expect(result).to.equal(0);
    });

    it('should throw an error for negative values', () => {
        let result: number;

        expect(() => {
            sanitize.int.unsigned(-78, { signedValues: 'error' });
        }).to.throw(NegativeValueError, 'negative');

        result = sanitize.int.unsigned(-34921);
        expect(result).to.equal(0);

        sanitize.int.setRules({ signedValues: 'error' });

        expect(() => {
            sanitize.int.unsigned(-666);
        }).to.throw(NegativeValueError, 'negative');

        sanitize.int.setRules({ signedValues: 0 });

        result = sanitize.int.unsigned(-777);
        expect(result).to.equal(0);

        expect(() => {
            sanitize.int.unsigned(-235432236, {
                default: 'error', signedValues: 'default' 
            });
        }).to.throw(NegativeValueError, 'negative');

        result = sanitize.int.unsigned(-32);
        expect(result).to.equal(0);

        sanitize.int.setRules({ default: 'error', signedValues: 'default'});

        expect(() => {
            sanitize.int.unsigned(-235432236);
        }).to.throw(NegativeValueError, 'negative');

        sanitize.int.setRules({ default: 0, signedValues: 0 });
    });

    it('should throw an error with field name for negative values', () => {
        let result: number;

        expect(() => {
            sanitize.int.unsigned(-3920, { signedValues: 'error' }, 'WACKY');
        }).to.throw(NegativeValueError, 'WACKY');

        result = sanitize.int.unsigned(-1);
        expect(result).to.equal(0);

        sanitize.int.setRules({ signedValues: 'error' });

        expect(() => {
            sanitize.int.unsigned(-22, {}, 'QUACKY');
        }).to.throw(NegativeValueError, 'negative');

        sanitize.int.setRules({ signedValues: 0 });

        result = sanitize.int.unsigned(-555, {}, 'TACKY');
        expect(result).to.equal(0);

        expect(() => {
            sanitize.int.unsigned(-908, {
                default: 'error', signedValues: 'default' 
            }, 'LACKY');
        }).to.throw(NegativeValueError, 'negative');

        result = sanitize.int.unsigned(-32, {}, 'MACKY');
        expect(result).to.equal(0);

        sanitize.int.setRules({ default: 'error', signedValues: 'default'});

        expect(() => {
            sanitize.int.unsigned(-233, {}, 'YACKY');
        }).to.throw(NegativeValueError, 'YACKY');

        sanitize.int.setRules({ default: 0, signedValues: 0 });
    });
});

describe('Ranged integers', () => {
    it('should clamp out of range values within the range', () => {
        let result: number;

        result = sanitize.int.ranged(-20, -10, 10);
        expect(result).to.equal(-10);

        result = sanitize.int.ranged(1000, 832, 999);
        expect(result).to.equal(999);

        result = sanitize.int.ranged(831, 832, 999);
        expect(result).to.equal(832);

        result = sanitize.int.ranged(89, -89, 73, { outOfRangeValues: 'clamp' });
        expect(result).to.equal(73);

        sanitize.int.setRules({ outOfRangeValues: 666 });

        result = sanitize.int.ranged(203, -100, 100, { outOfRangeValues: 'clamp' });
        expect(result).to.equal(100);

        sanitize.int.setRules({ outOfRangeValues: 'clamp' });
    });

    it('should replace out of range values within custom ones', () => {
        let result: number;

        // result = sanitize.int.ranged(-20, -10, 10);
        // expect(result).to.equal(-10);

        // result = sanitize.int.ranged(1000, 832, 999);
        // expect(result).to.equal(999);

        // result = sanitize.int.ranged(831, 832, 999);
        // expect(result).to.equal(832);

        // result = sanitize.int.ranged(89, -89, 73, { outOfRangeValues: 'clamp' });
        // expect(result).to.equal(73);

        // sanitize.int.setRules({ outOfRangeValues: 666 });

        // result = sanitize.int.ranged(203, -100, 100, { outOfRangeValues: 'clamp' });
        // expect(result).to.equal(100);

        // sanitize.int.setRules({ outOfRangeValues: 'clamp' });
    });
});

describe('Integer NaN values', () => {

    it('should replace NaN values with the default one', () => {
        let result: number;

        result = sanitize.int.signed(NaN, { nanValues: 'default' });
        expect(result).to.equal(0);

        result = sanitize.int.signed(-832);
        expect(result).to.equal(-832);

        result = sanitize.int.signed(NaN, { default: 90, nanValues: 'default' });
        expect(result).to.equal(90);

        sanitize.int.setRules({ default: 69, nanValues: 'default' });

        result = sanitize.int.signed(NaN);
        expect(result).to.equal(69);

        result = sanitize.int.signed(NaN, { default: 7823 });
        expect(result).to.equal(7823);

        result = sanitize.int.signed(9230);
        expect(result).to.equal(9230);

        sanitize.int.setRules({ default: 0, signedValues: 0 });

        result = sanitize.int.signed(44);
        expect(result).to.equal(44);

        result = sanitize.int.signed(NaN);
        expect(result).to.equal(0);
    });

    it('should replace NaN values with custom ones', () => {
        let result: number;

        result = sanitize.int.unsigned(NaN, { nanValues: 66 });
        expect(result).to.equal(66);

        result = sanitize.int.unsigned(NaN);
        expect(result).to.equal(0);

        result = sanitize.int.unsigned(NaN, { default: 90, nanValues: 77 });
        expect(result).to.equal(77);

        sanitize.int.setRules({ default: 90, nanValues: 420 });

        result = sanitize.int.unsigned(NaN);
        expect(result).to.equal(420);

        sanitize.int.setRules({ nanValues: 'default' });

        result = sanitize.int.unsigned(NaN);
        expect(result).to.equal(90);

        sanitize.int.setRules({ default: 0});

        result = sanitize.int.unsigned(NaN);
        expect(result).to.equal(0);
    });

    it('should allow NaN values', () => {
        let result: number;

        result = sanitize.int.signed(NaN, { nanValues: 'allow' });
        expect(result).to.be.NaN;

        result = sanitize.int(-8932);
        expect(result).to.equal(-8932);

        result = sanitize.int.unsigned('NaN', { nanValues: 'allow' });
        expect(result).to.be.NaN;

        sanitize.int.setRules({ nanValues: 'allow' });

        result = sanitize.int('FALKSALLKA');
        expect(result).to.be.NaN;

        result = sanitize.int.ranged(NaN, 0, 10);
        expect(result).to.be.NaN;
        sanitize.int.setRules({ nanValues: 'default' });

        result = sanitize.int.unsigned(NaN);
        expect(result).to.equal(0);
    });

    it('should throw an error for NaN values', () => {
        let result: number;

        expect(() => {
            sanitize.int(NaN, { nanValues: 'error' });
        }).to.throw(NanValueError);

        result = sanitize.int.signed(NaN);
        expect(result).to.equal(0);

        sanitize.int.setRules({ nanValues: 'error' });

        result = sanitize.int.signed(389);
        expect(result).to.equal(389);

        expect(() => {
            sanitize.int.signed(NaN);
        }).to.throw(NanValueError);

        sanitize.int.setRules({ nanValues: 'default' });

        result = sanitize.int(NaN);
        expect(result).to.equal(0);

        expect(() => {
            sanitize.int.unsigned(NaN, {
                default: 'error', nanValues: 'default' 
            });
        }).to.throw(NanValueError);

        result = sanitize.int.signed(-32);
        expect(result).to.equal(-32);

        sanitize.int.setRules({ default: 'error', nanValues: 'default' });

        expect(() => {
            sanitize.int.unsigned(NaN);
        }).to.throw(NanValueError);

        sanitize.int.setRules({ default: 0, nanValues: 'default' });

        result = sanitize.int.signed(392);
        expect(result).to.equal(392);
    });

    it('should throw an error with field name for negative values', () => {
        let result: number;

        expect(() => {
            sanitize.int(NaN, { nanValues: 'error' }, 'TOTO');
        }).to.throw(NanValueError, 'TOTO');

        result = sanitize.int.signed(NaN);
        expect(result).to.equal(0);

        sanitize.int.setRules({ nanValues: 'error' });

        result = sanitize.int.signed(389);
        expect(result).to.equal(389);

        expect(() => {
            sanitize.int.signed(NaN, {}, 'LOTO');
        }).to.throw(NanValueError, 'LOTO');

        sanitize.int.setRules({ nanValues: 'default' });

        result = sanitize.int(NaN, {}, 'MIYAMOTO');
        expect(result).to.equal(0);

        expect(() => {
            sanitize.int.unsigned(NaN, { default: 'error', nanValues: 'default' }, 'GOGO');
        }).to.throw(NanValueError, 'GOGO');

        result = sanitize.int.unsigned(899);
        expect(result).to.equal(899);

        sanitize.int.setRules({ default: 'error', nanValues: 'default' });

        expect(() => {
            sanitize.int.unsigned(NaN, {}, 'LOKO');
        }).to.throw(NanValueError, 'LOKO');

        sanitize.int.setRules({ default: 0, nanValues: 'default' });

        result = sanitize.int(2309320320);
        expect(result).to.equal(2309320320);
    });
});
