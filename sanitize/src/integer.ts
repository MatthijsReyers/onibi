
/**
 * Flexible sanitizer for signed integers, will never throw an error and convert any invalid or 
 * negative input to a default value instead. Floating point numbers will be rounded to the 
 * nearest integer.
 * 
 * @param {any} input - Input to sanitize.
 * @param {number} defaultValue - (Optional) default value to be used if the given user input 
 *                                cannot be parsed, set to 0 if none is provided.
 */
export function signedInt(input: any, defaultValue: number = 0) {
    let value: number;
    if (typeof input === 'number')
        value = Math.round(input);
    else value = parseInt(input || `${defaultValue}`);
    if (isNaN(value) || !isFinite(value))
        return defaultValue;
    return value;
}

/**
 * Flexible sanitizer for unsigned integers, will never throw an error and convert any invalid 
 * or negative input to zero instead. Floating point numbers will be rounded to the nearest integer.
 * 
 * @param {any} input - Input to sanitize.
 * @param {number} defaultValue - (Optional) default value to be used if the given user input 
 *                                cannot be parsed, set to 0 if none is provided.
 */
export function unsignedInt(input: any, defaultValue: number = 0): number {
    let value = signedInt(input, defaultValue);
    if (value < 0)
        return defaultValue;
    return value;
}
