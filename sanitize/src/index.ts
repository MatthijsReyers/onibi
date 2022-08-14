import { Http422Error, Http400Error } from '@onibi/errors';

export const UNSIGNED_BASE10_REGEX = /^\d+$/g;



// export function signedInt(input:any): number {
//     return 0
// };

/**
 * Flexible sanitizer for unsigned integers, will never throw an error and convert any invalid 
 * or negative input to zero instead. Floating point numbers will be rounded to the nearest integer.
 * 
 * @param {any} input - User input to sanitize.
 */
export function unsignedInt(input: any): number {
    let value: number;
    if (typeof input === 'number')
        value = Math.round(input);
    else value = parseInt(input || '0');
    if (isNaN(value) || (value < 0) || !isFinite(value))
        return 0;
    return value;
}

/**
 * Strict sanitizer for unsigned integers. Will throw an HttpError if the value is:
 *  - Not in base 10 (i.e. contains non numeric characters).
 *  - Negative value (i.e. smaller than zero).
 *  - Null or undefined.
 * 
 * @param {any} input - User input to sanitize.
 * @param {string} fieldName - Name of the field that is being sanitized.
 * @param {boolean} userSafe - Should errors be marked as safe to show to users?
 * 
 * @throws {Http400Error} If value is not in base 10.
 * @throws {Http422Error} If the value is null, undefined or negative.
 */
export function unsignedIntStrict(input: any, fieldName: string, userSafe: boolean = true): number {
    if (input === null)
        throw Http422Error.withNullField(fieldName, userSafe);

    if (input === undefined)
        throw Http422Error.withMissingField(fieldName, userSafe);

    if (!('' + input).match(UNSIGNED_BASE10_REGEX))
        throw new Http400Error(`Expected field '${fieldName}' to a base 10 number.`, userSafe);

    let value = parseInt(('' + input), 10);

    if (value < 0)
        throw Http422Error.withNegativeField(fieldName, userSafe);

    return value;
}

export default {
    unsignedInt,
    unsignedIntStrict
};