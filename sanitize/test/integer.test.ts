
import sanitize from './../src/index';
import { Http422Error } from '@onibi/errors';

import { expect } from 'chai';
import 'mocha';
import { randomInt } from './random';



describe('Unsigned integers', () => {

    it('should deal with null values', () => {
        let result: number;

        expect(() => {
            sanitize.strict.unsignedInt(null, 'unit test');
        }).to.throw(Http422Error, 'unit test');

        result = sanitize.unsignedInt(null);
        expect(result).to.equal(0);

        for (let i = 0; i < 15; i++) {
            result = sanitize.unsignedInt(null, i);
            expect(result).to.equal(i);
        }
    });

    it('should deal with undefined values', () => {
        let result: number;

        expect(() => {
            sanitize.strict.unsignedInt(undefined, 'unit test');
        }).to.throw(Http422Error, 'unit test');

        result = sanitize.unsignedInt(undefined);
        expect(result).to.equal(0);

        for (let i = 0; i < 15; i++) {
            result = sanitize.unsignedInt(undefined, i);
            expect(result).to.equal(i);
        }
    });

    it('should deal with NaN values', () => {
        let result: number;

        expect(() => {
            sanitize.strict.unsignedInt(NaN, 'unit test');
        }).to.throw(Http422Error, 'unit test');

        result = sanitize.unsignedInt(NaN);
        expect(result).to.equal(0);

        for (let i = 0; i < 15; i++) {
            result = sanitize.unsignedInt(NaN, i);
            expect(result).to.equal(i);
        }
    });

    it('should deal with negative values', () => {
        for (let i = 0; i < 300; i++) {
            let input: number = -1 * randomInt(0, 999999999);

            expect(() => {
                sanitize.strict.unsignedInt(input, 'unit test');
            }).to.throw(Http422Error, 'unit test');

            let result = sanitize.unsignedInt(input);
            expect(result).to.equal(0);
        }
    });


    it('should deal with positive values', () => {
        let result;
        for (let i = 0; i < 300; i++) {
            let input: number = randomInt(0, 999999999);

            result = sanitize.strict.unsignedInt(input, 'unit test');
            expect(result).to.equal(input);

            result = sanitize.unsignedInt(input);
            expect(result).to.equal(input);

            result = sanitize.unsignedInt('  ' + input);
            expect(result).to.equal(input);

            result = sanitize.unsignedInt(input + 0.0);
            expect(result).to.equal(input);

            result = sanitize.unsignedInt('' + input + '.000\t');
            expect(result).to.equal(input);
        }
    });
});
