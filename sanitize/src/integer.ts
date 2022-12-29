
/**
 * Flexible sanitizer for integers in a given range, will never throw an error. Floating point 
 * numbers will be rounded to the nearest integer. Values outside the outside the range will be 
 * clamped to the given boundaries. Non numeric types and NaN values will result in the default 
 * value.
 * 
 * @param {any} input - Input to sanitize.
 * @param {number} min - Smallest value the input may be.
 * @param {number} max - Biggest value the input may be. 
 * @param {number} defaultValue - (Optional) default value to be used if the given user input 
 *                                cannot be parsed. A value outside the range be be provided but
 *                                the minimum value is used by default.
 */
export function rangedInt(input: any, min: number, max: number, defaultValue?: number)
{
    if (defaultValue === undefined)
        defaultValue = min;
    let value = signedInt(input, defaultValue);
    if (value < min) return min;
    if (value > max) return max;
    return value;
}

/**
 * Flexible sanitizer for signed integers, will never throw an error and convert any invalid or 
 * negative input to a default value instead. Floating point numbers will be rounded to the 
 * nearest integer.
 * 
 * @param {any} input - Input to sanitize.
 * @param {number} defaultValue - (Optional) default value to be used if the given user input 
 *                                cannot be parsed, set to 0 if none is provided.
 */
export function signedInt(input: any, defaultValue: number = 0) 
{
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
export function unsignedInt(input: any, defaultValue: number = 0): number 
{
    let value = signedInt(input, defaultValue);
    if (value < 0)
        return defaultValue;
    return value;
}
