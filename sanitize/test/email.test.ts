import { InvalidEmailError, NullValueError, SanitizerError, UndefinedValueError } from '../src/errors';
import sanitize from '../src/index';

import { expect } from 'chai';
import 'mocha';

const VALID_EMAILS = [
    "matthijs@gmail.com",
    "john.doe@hotmail.com",
    "a.b.surname@yahoo.net",
    "Lower@Uppercase.fr",
    "fancy@tea.co.uk",
    "fully-qualified-domain@example.com",
    "example@s.example",                        // Valid top level domain: .example.
];

const STRANGE_VALID_EMAILS = [
    "style.email.with+symbol@example.com",
    "user.name+tag+sorting@example.com",
    "mailhost!username@example.org"
];

const INVALID_EMAILS = [
    "plainaddress",                              // Not even an email address.
    "Abc.example.com",                           // No @ symbol
    "A@b@c@example.com",                         // Only one @ is allowed outside quotation marks
    'a"b(c)d,e:f;g<h>i[j\\k]l@example.com',      // None of the special characters in this local-part are allowed outside quotation marks
    'just"not"right@example.com',                // Quoted strings must be dot separated or the only element making up the local-part
    'this is"not\\allowed@example.com',          // Spaces, quotes, and backslashes may only exist when within quoted strings and preceded by a backslash
    "@example.com",                              // Email is missing local part, i.e. there's nothing before @ symbol.
    'this\\ still\\"not\\\\allowed@example.com', // Even if escaped (preceded by a backslash), spaces, quotes, and backslashes must still be contained by quotes
    "validpart@no_so_valid.com",                 // Underscore is not allowed in domain part
    "Joe Smith <email@example.com>",             // Common copy pasting mistake.
    "email@example",                             // Missing top level domain extension.
    "#@%^%#$@#$@#.com",
    "email@example@example.com",
    ".email@example.com",
    "email.@example.com",
    "email..email@example.com",
    "あいうえお@example.com",
    "email@example.com (Joe Smith)",
];

const ESCAPED_AT_EMAIL = 'name”@”tag@example.com';

const IPV4_ADDRESS_EMAIL = "john.doe@[84.39.39.29]";
const IPV6_ADDRESS_EMAIL = "postmaster@[IPv6:2001:0db8:85a3:0000:0000:8a2e:0370:7334]";

const QUOTES_EMAILS = [
    'thisemail"hasquotes"@gmail.com',           // Email with quotes.
    '"email"@example.com',                      // Whole local part is in quotes.
    '" "@example.org',                          // Local part is not empty because of space between quotes.
    '"john..doe"@example.org',                  // Double dot allowed because in quotes.
]

describe('RFC5322 Email addresses', () => {

    it('should allow obvious valid emails', () => {
        for (const address of VALID_EMAILS) {
            let result: string = sanitize.email.rfc5322(address);
            expect(!!result.length).to.be.true;
        }
    });

    it('should allow strange valid emails', () => {
        for (const address of STRANGE_VALID_EMAILS) {
            let result: string = sanitize.email.rfc5322(address);
            expect(!!result.length).to.be.true;
        }
    });

    it('should not allow obvious bad emails', () => {
        for (const email of INVALID_EMAILS) {
            expect(() => {
                sanitize.email.rfc5322(email);
            }, `for email '${email}'`).to.throw(InvalidEmailError)
        }
    })

    it('should allow email with IPv4 addresses as domain', () => {
        let result: string = sanitize.email.rfc5322(IPV4_ADDRESS_EMAIL);
        expect(result).to.equal(IPV4_ADDRESS_EMAIL);
        expect(result.length > 0).to.be.true;
    });
});

describe('HTML Form Email addresses', () => {

    it('should allow obvious good emails', () => {
        for (const address of VALID_EMAILS) {
            let result: string = sanitize.email.htmlInput(address);
            expect(result.length).to.equal(address.length);
            expect(result.length > 0).to.be.true;
        }
    });

    it('should not allow escaped @ symbols', () => {
        expect(() => {
            sanitize.email.htmlInput(ESCAPED_AT_EMAIL);
        }).to.throw(InvalidEmailError)
    });

});