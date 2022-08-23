import { Http422Error } from "@onibi/errors";
import { UNSIGNED_BASE10_REGEX } from "../regex";

/**
 * Strict sanitizer for integers. Guarantees that if an error is not thrown the returned 
 * value is zero or positive. 
 * 
 * Will throw an HttpError if the value is:
 *  - Not in base 10 (i.e. contains non numeric characters).
 *  - Negative value (i.e. smaller than zero).
 *  - Null or undefined.
 * 
 * @param {any} input - User input to sanitize.
 * @param {string} fieldName - Name of the field that is being sanitized.
 * @param {boolean} userSafe - Should errors be marked as safe to show to users?
 * 
 * @throws {Http422Error} If value is not in base 10.
 * @throws {Http422Error} If the value is null or undefined.
 */
export function signedInt(input: any, fieldName: string, userSafe: boolean = true): number {
    if (input === null)
        throw Http422Error.withNullField(fieldName, userSafe);

    if (input === undefined)
        throw Http422Error.withMissingField(fieldName, userSafe);

    if (('' + input).match(UNSIGNED_BASE10_REGEX)) {
        let value = parseInt(('' + input), 10);
        return value;
    }

    throw new Http422Error(
        '422WrongBase',
        'Wrong number base',
        `Expected field '${fieldName}' to a base 10 number.`, userSafe);
}

/**
 * Strict sanitizer for unsigned integers. Guarantees that if an error is not thrown the returned 
 * value is zero or positive. 
 * 
 * Will throw an HttpError if the value is:
 *  - Not in base 10 (i.e. contains non numeric characters).
 *  - Negative value (i.e. smaller than zero).
 *  - Null or undefined.
 * 
 * @param {any} input - User input to sanitize.
 * @param {string} fieldName - Name of the field that is being sanitized.
 * @param {boolean} userSafe - Should errors be marked as safe to show to users?
 * 
 * @throws {Http422Error} If value is not in base 10.
 * @throws {Http422Error} If the value is null, undefined, or negative.
 */
export function unsignedInt(input: any, fieldName: string, userSafe: boolean = true): number {
    if (input === null)
        throw Http422Error.withNullField(fieldName, userSafe);

    if (input === undefined)
        throw Http422Error.withMissingField(fieldName, userSafe);

    if (('' + input).match(UNSIGNED_BASE10_REGEX)) {
        let value = parseInt(('' + input), 10);

        if (value < 0)
            throw Http422Error.withNegativeField(fieldName, userSafe);

        return value;
    }

    throw new Http422Error(
        '422WrongBase',
        'Wrong number base',
        `Expected field '${fieldName}' to a base 10 number.`, userSafe);
}

export default {
    signedInt,
    unsignedInt
};
