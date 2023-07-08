
/**
 * Checks if a given variable is a null type or type that arguably should be converted to null, 
 * such as `undefined`.
 * 
 * @param obj 
 * @returns 
 */
export function isNullable(obj: any): boolean {
    if (obj === null) return true;
    if (obj === undefined) return true;
    if (typeof obj === 'number' && isNaN(obj)) return true;
    return false;
}