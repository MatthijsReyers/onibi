import { NullValueError, UndefinedValueError } from '../src/errors';
import sanitize from './../src/index';

import { expect } from 'chai';
import 'mocha';

describe('Booleans', () => {

    it('should pass through boolean types', () => {
        let result: boolean = sanitize.bool(true);
        expect(result).to.true;

        result = sanitize.bool(false);
        expect(result).to.false;
    });

    it('should return true for true strings.', () => {
        let result: boolean = sanitize.bool("yes");
        expect(result).to.true;

        result = sanitize.bool("TRUE");
        expect(result).to.true;

        result = sanitize.bool("\tTrue");
        expect(result).to.true;

        result = sanitize.bool(false);
        expect(result).to.false;
    });

    it('should return false for false strings.', () => {
        let result: boolean = sanitize.bool("no");
        expect(result).to.false;

        result = sanitize.bool("FALSE");
        expect(result).to.false;

        result = sanitize.bool("False\t");
        expect(result).to.false;

        result = sanitize.bool("    ");
        expect(result).to.false;
    });

    it('should return false for custom false strings.', () => {
        let result: boolean = sanitize.bool("no");
        expect(result).to.false;

        result = sanitize.bool("FALSE");
        expect(result).to.false;

        sanitize.bool.setRules({
            falseStrings: ['matthijs', 'is', 'cool'],
            default: true
        });

        result = sanitize.bool("Matthijs");
        expect(result).to.false;

        result = sanitize.bool("cool");
        expect(result).to.false;

        // "no" is no longer in the false list so should return the default value (true).
        result = sanitize.bool("no");
        expect(result).to.true;

        // Reset rules as not to break the other tests.
        sanitize.bool.setRules({
            falseStrings: ['false', 'no', '0', ''],
            default: false
        });
    });
 
    it('should return false for custom false strings.', () => {
        let result: boolean = sanitize.bool("yes");
        expect(result).to.true;

        result = sanitize.bool("TRUE");
        expect(result).to.true;

        sanitize.bool.setRules({
            trueStrings: ['matthijs', 'is', 'cool'],
            default: false
        });

        result = sanitize.bool("Matthijs");
        expect(result).to.true;

        result = sanitize.bool("cool");
        expect(result).to.true;

        // "yes" is no longer in the true list so should return the default value (false).
        result = sanitize.bool("yes");
        expect(result).to.false;

        // Reset rules as not to break the other tests.
        sanitize.bool.setRules({
            trueStrings: ['true', 'yes', '1'],
            default: false
        });
    });

    it('should deal with undefined values', () => {
        let result: boolean;

        result = sanitize.bool(undefined);
        expect(result).to.be.false;

        expect(() => {
            sanitize.bool(undefined, { undefinedValues: 'error' });
        }).to.throw(UndefinedValueError, 'missing');

        sanitize.bool.setRules({ undefinedValues: 'error' })
        expect(() => {
            sanitize.bool(undefined);
        }).to.throw(UndefinedValueError, 'missing');

        sanitize.bool.setRules({ undefinedValues: true })
        result = sanitize.bool(undefined);
        expect(result).to.be.true;

        sanitize.bool.setRules({ undefinedValues: false })
        result = sanitize.bool(undefined);
        expect(result).to.be.false;

        sanitize.bool.setRules({ undefinedValues: 'default', default: true })
        result = sanitize.bool(undefined);
        expect(result).to.be.true;

        sanitize.bool.setRules({ default: false })
        result = sanitize.bool(undefined);
        expect(result).to.be.false;
    });

    it('should deal with null values', () => {
        let result: boolean;

        result = sanitize.bool(null);
        expect(result).to.be.false;

        expect(() => {
            sanitize.bool(null, { nullValues: 'error' });
        }).to.throw(NullValueError, 'cannot be null');

        sanitize.bool.setRules({ nullValues: 'error' })
        expect(() => {
            sanitize.bool(null);
        }).to.throw(NullValueError, 'cannot be null');

        sanitize.bool.setRules({ nullValues: true })
        result = sanitize.bool(null);
        expect(result).to.be.true;

        sanitize.bool.setRules({ nullValues: false })
        result = sanitize.bool(null);
        expect(result).to.be.false;

        sanitize.bool.setRules({ nullValues: 'default', default: true })
        result = sanitize.bool(null);
        expect(result).to.be.true;

        sanitize.bool.setRules({ default: false })
        result = sanitize.bool(null);
        expect(result).to.be.false;
    });
});
