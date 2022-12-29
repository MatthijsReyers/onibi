import { NanValueError, NullValueError, SanitizerError, UndefinedValueError } from "../errors";

const SIGNED_REGEX = /^(\s*)((((-(\s*))?)(\d+))|(0x([0-9a-fA-F]+)))(\s*)$/;
const UNSIGNED_REGEX = /^(\s*)((\d+)|(0x([0-9a-fA-F]+)))(\s*)$/;


/**
 * 
 * 
 * @param {any} input - Input to sanitize.
 * @param {string} fieldName - Name of the field that is being sanitized.
 * @param {number} min - Smallest value the input may be.
 * @param {number} max - Biggest value the input may be. 
 */
export function rangedInt(input: any, fieldName: string, min: number, max: number)
{
    let value = signedInt(input, fieldName);
    if (value < min) return min;
    if (value > max) return max;
    return value;
}

/**
 * Strict sanitizer for integers. Guarantees that if an error is thrown the provided input is not
 * an integer or not a number. In the case of strings leading
 * 
 * Will throw an SanitizerError if the value is:
 *  - Contains non numeric characters.
 *  - In base 16 but does not start with '0x'.
 *  - Null or undefined.
 *  - NaN or parsed to NaN.
 * 
 * @param {any} input - Input to sanitize.
 * @param {string} fieldName - Name of the field that is being sanitized.
 * 
 * @throws {Http422Error} If value is not in base 10.
 * @throws {NullValueError} If the value is null.
 * @throws {NanValueError} If the value is undefined.
 * @throws {NanValueError} If the value is NaN or not in base 10.
 */
export function signedInt(input: any, fieldName: string): number {
    if (input === null)
        throw new NullValueError(fieldName);

    if (isNaN(input)) 
        throw new NanValueError(fieldName);

    if (input === undefined)
        throw new UndefinedValueError(fieldName);

    input = (input + '');

    if (!input.test(SIGNED_REGEX)) 
        throw new NanValueError(fieldName);
    
    let value = parseInt(input, 10);

    // if (!isFinite(value))
    //     throw new Http422Error.withNonFiniteField(fieldName);

    if (isNaN(value)) 
        throw new NanValueError(fieldName);

    return value;
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
export function unsignedInt(input: any, fieldName: string): number {
    if (input === null)
        throw new NullValueError(fieldName);

    // if (input === undefined)
    //     throw Http422Error.withMissingField(fieldName);

    let value = parseInt(('' + input), 10);

    if (isNaN(value)) 
        throw new NanValueError(fieldName);

    // if (!isFinite(value))
    //     throw new Http422Error.withNonFiniteField(fieldName);

    // if (value < 0)
    //     throw Http422Error.withNegativeField(fieldName);

    return value;
}

export default {
    signedInt,
    unsignedInt,
    rangedInt,
};
