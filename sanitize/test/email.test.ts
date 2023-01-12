import { NullValueError, UndefinedValueError } from '../src/errors';
import sanitize from '../src/index';

import { expect } from 'chai';
import 'mocha';

const validEmails = [
    "matthijs@gmail.com",
    "a.b.surname@yahoo.net",
    "Lower@Uppercase.fr",
    "fancy@tea.co.uk"
];

describe('RFC5322 Email addresses', () => {

    it('should allow obvious good emails', () => {
        for (const address of validEmails) {
            let result: string = sanitize.email.rfc5322(address);
            expect(!!result.length).to.be.true;
        }
    });

    it('should allow escaped @ symbols', () => {
        let result: string = sanitize.email.rfc5322('name\\@tag@example.com');
        expect(!!result.length).to.be.true;
    });
});

describe('HTML Form Email addresses', () => {

    it('should allow obvious good emails', () => {
        for (const address of validEmails) {
            let result: string = sanitize.email(address);
            expect(!!result.length).to.be.true;
        }
    });
});
