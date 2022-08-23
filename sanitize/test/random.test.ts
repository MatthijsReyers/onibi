import { randomInt } from './random';

import { expect } from 'chai';
import 'mocha';

describe('Random integers', () => {

    it('should generate a number', () => {
        let result: number = randomInt(0, 10);
        expect(result).to.be.a('number');
        expect(result).not.to.be.NaN;
        expect(result).to.equal(0 + result);
    });

    it('should only generate values within given range', () => {
        for (let i = 0; i < 300; i++) {
            let result: number = randomInt(10, 30);
            expect(result >= 10).to.be.true;
            expect(result <= 30).to.be.true;
        }

        for (let i = 0; i < 300; i++) {
            let result: number = randomInt(-50, 30);
            expect(result >= -50).to.be.true;
            expect(result <= 30).to.be.true;
        }

        for (let i = 0; i < 300; i++) {
            let result: number = randomInt(-32, -10);
            expect(result >= -32).to.be.true;
            expect(result <= -10).to.be.true;
        }
    });

});
