import { InvalidUuidError } from "./errors";
import { RuleKey, Uuid, UuidSanitizerRules } from "./uuid.types";

const UUID_REGEX = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;

/**
 * Application wide integer sanitizer behavior.
 */
var globalRules: UuidSanitizerRules = {
    default: 'error',
    trimStrings: true,
}

/**
 * Gets a value from the global rules or the locally provided rules if given.
 */
function getRule<T>(ruleKey: RuleKey, rules?: Partial<UuidSanitizerRules>): T 
{
    if (rules && rules.hasOwnProperty(ruleKey) && ruleKey in rules)
        return <T>(<any>rules)[ruleKey];
    return <T>(<any>globalRules)[ruleKey];
}

/**
 * UUID sanitizer for UUID strings in the form '4ab23e20-fee3-11ed-8f2a-a1bf63269e35'.
 * 
 * @param {any} input - Input to sanitize.
 * @param {rules} Partial<UuidSanitizerRules> - (Optional) rules to locally overwrite the global uuid sanitization rules for this function call.
 * @param {string} field - (Optional) Name of the field that is being sanitized, (used in error messages).
 * @throws {InvalidUuidError} when the input is not a valid v1 UUID.
 * @returns {Uuid} 
 */
function uuid(input: any, rules?: Partial<UuidSanitizerRules>, field?: string): Uuid
{
    if (typeof input === 'string') {
        if (getRule<boolean>('trimStrings', rules)) {
            input = input.trim();
        }
        if (UUID_REGEX.test(input)) {
            return input;
        }
    }
    const defaultVal = getRule<string | ((input: any) => Uuid)>('default', rules);
    if (defaultVal === 'error') {
        throw new InvalidUuidError(''+input, field);
    }
    if (defaultVal instanceof Function) {
        return defaultVal(input);
    }
    return defaultVal;
}

namespace uuid
{
    /**
     * Set application wide rules for uuid sanitizer. Note that not all options have to be provided
     * and default or previously set values will be kept if a new value is not included.
     */
    export function setRules(rules: Partial<UuidSanitizerRules>) 
    {
        for (const ruleKey in rules) {
            if (Object.prototype.hasOwnProperty.call(rules, ruleKey)) {
                if (Object.prototype.hasOwnProperty.call(globalRules, ruleKey)) {
                    const value = (<any>rules)[ruleKey];
                    (<any>globalRules)[ruleKey] = value;
                }
                else {
                    console.warn(`Cannot update uuid sanitizer rule '${ruleKey}', see UuidSanitizerRules type for more info.`)
                }
            }
        }
    }
}

export = uuid;
