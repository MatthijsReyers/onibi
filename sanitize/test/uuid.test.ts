
import sanitize from './../src/index';
import { expect } from 'chai';
import 'mocha';
import * as uuid from 'uuid';
import { InvalidUuidError } from '../src/errors';

describe('UUID strings', () => {

    const VALID_UUID = [
        '4ab23e20-fee3-11ed-8f2a-a1bf63269e35',
        '45453e20-fee3-11ed-8f2a-aadaf3269e35',
        '68bb4c90-fee3-11ed-a76e-4fc1bd8f5015',
        '3d2c5014-fee4-11ed-be56-0242ac120002',
    ];

    it('should allow valid UUID\'s', () => {
        for (const id of VALID_UUID) {
            const value = sanitize.uuid(id);
            expect(value).to.equal(id);
        }
        let id = uuid.v1();
        expect(sanitize.uuid(id)).to.equal(id);
        
        id = uuid.v4();
        expect(sanitize.uuid(id)).to.equal(id);
    });

    const INVALID_UUID = [
        '',
        'aa',
        'as9823-as89af',
        'aaf-asf-ds-fd-adfasd',
        '68bb4c90-fee3-11ed-a76e-4fc1b8f5015',
        '30fc47d-22b8-402e-8717-31dac9c11ebf',
        '30fc4)7d-22b8-402e-8717-31dac9c11ebf',
        '37d-22b8-402e-87&7-31dac9c11ebf',
        28939823,
    ];

    it('should throw an error for non UUID strings', () => {
        
        for (const invalid of INVALID_UUID) {
            expect(() => {
                sanitize.uuid(invalid)
            }).to.throw(InvalidUuidError, invalid+'');
        }
    });
});
