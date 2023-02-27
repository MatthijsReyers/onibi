import { EnumSanitizerRules, RuleKey } from "./enums.types";
import { EnumValueError, NullValueError } from "./errors";

/**
 * Application wide integer sanitizer behavior.
 */
var globalRules: EnumSanitizerRules = {
    default:       undefined,
    allowNull:     false,
    trimStrings:   true,
    caseSensitive: false
}


/**
 * Gets a value from the global rules or the locally provided rules if given.
 */
function getRule<T>(ruleKey: RuleKey, rules?: Partial<EnumSanitizerRules>): T 
{
    if (rules && rules.hasOwnProperty(ruleKey) && ruleKey in rules)
        return <T>(<any>rules)[ruleKey];
    return <T>(<any>globalRules)[ruleKey];
}

/**
 * 
 * Note that this function will always return an item from the enum values array rather than the
 * provided user input.
 * 
 * @throws {NullValueError} if 
 * @throws {EnumValueError} if the input cannot be converted to a value from the enum values array
 *         and no default value was provided.
 * 
 * @param {any} input -
 * @param {T[]} values -
 * @param {Partial<EnumSanitizerRules>} rules - 
 * @param {string} field - (Optional) name of the field that is being sanitized 
 * @returns {T} Enum value from the enum values array.
 */
function enums<T>(input: any, values: T[], rules?: Partial<EnumSanitizerRules>, field?: string)
{
    if (input === null) {
        if (getRule('allowNull', rules) === true || values.includes(<any>null)) {
            return null;
        } else if  (getRule('default', rules) === undefined) {
            throw new NullValueError(field);
        }
    }
    if (typeof input === 'string' && getRule('trimStrings', rules) === true) {
        input = input.trim();
    }
    if (typeof input === 'string' && getRule('caseSensitive', rules) === false) {
        input = input.toLowerCase()
        for (const val of values) {
            if ((typeof val === 'string') && (val.toLowerCase() === input)) {
                return val;
            }
        }
    } 
    else for (const val of values) {
        if (val === input) {
            return val;
        }
    }
    if (getRule('default', rules) === undefined) {
        throw new EnumValueError(values, input, field);
    }
    return getRule<T>('default', rules);
}

namespace enums
{

}

export = enums;