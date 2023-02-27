import { BooleanSanitizerRules, RuleKey } from "./boolean.types";
import { NanValueError, NullValueError, UndefinedValueError, UnexpectedValueError } from "./errors";

/**
 * Application wide boolean sanitizer behavior.
 */
var globalRules: BooleanSanitizerRules = {
    default: false,
    nullValues: 'default',
    nanValues: 'default',
    undefinedValues: 'default',

    trimStrings:  true,
    lowerStrings: true,
    falseStrings: ['false', 'no', '0', ''],
    trueStrings:  ['true', 'yes', '1'] 
}

/**
 * Gets a value from the global rules or the locally provided rules if given.
 */
function getRule<T>(ruleKey: RuleKey, rules?: Partial<BooleanSanitizerRules>): T 
{
    if (rules && rules.hasOwnProperty(ruleKey))
        return <T>rules[ruleKey];
    return <T>globalRules[ruleKey];
}

/**
 * Flexible sanitizer for boolean values, will do its best to convert any given input to a boolean
 * value according to the given rules. Errors will only be thrown if a sanitizer rule is set to 
 * 'error'.
 * 
 * @param {any} input: The input that must be converted to a boolean.
 * @param {BooleanSanitizerRules} rules: (Optional) override the global sanitizer rules and use 
 *                                       these rules instead.
 * @param {string} fieldName: (Optional) name of the field that is being sanitized, shown in error 
 *                            messages if provided.
 */
function bool(input: any, rules?: Partial<BooleanSanitizerRules>, fieldName?: string): boolean
{
    if (typeof input === 'boolean') {
        return !!(input);
    }
    if (typeof input === 'string') {
        if (getRule<boolean>('trimStrings', rules))
            input = input.trim();
        if (getRule<boolean>('lowerStrings', rules))
            input = input.toLowerCase();
        if (getRule<string[]>('trueStrings', rules).indexOf(input) >= 0)
            return true;
        if (getRule<string[]>('falseStrings', rules).indexOf(input) >= 0)
            return false;
    }
    if (input === undefined) {
        if (getRule<any>('undefinedValues', rules) === 'error' 
        || (getRule<any>('undefinedValues', rules) === 'default' && getRule<any>('undefinedValues', rules) === 'error')) {
            throw new UndefinedValueError(fieldName);
        }
        if (getRule<any>('undefinedValues') === 'default') {
            return getRule<boolean>('default', rules);
        }
        return getRule<boolean>('undefinedValues', rules);
    }
    if (input === null) {
        if (getRule<any>('nullValues', rules) === 'error' 
        || (getRule<any>('nullValues', rules) === 'default' && getRule<any>('default', rules) === 'error')) {
            throw new NullValueError(fieldName);
        }
        if (getRule<any>('nullValues') === 'default') {
            return getRule<boolean>('default', rules);
        }
        return getRule<boolean>('nullValues', rules);
    }
    if (isNaN(input)) {
        if (getRule<any>('nanValues', rules) === 'error' 
        || (getRule<any>('nanValues', rules) === 'default' && getRule<any>('default', rules) === 'error')) {
            throw new NanValueError(fieldName);
        }
        if (getRule<any>('nanValues') === 'default') {
            return getRule<boolean>('default', rules);
        }
        return getRule<boolean>('nanValues', rules);
    }
    if (getRule<boolean|'error'>('default') === 'error') {
        throw new UnexpectedValueError(fieldName, (input.toString()))
    }
    return !!getRule<boolean>('default', rules);
}

namespace bool 
{
    /**
     * Set application wide rules for boolean sanitizer. Note that not all options have to be provided
     * and default or previously set values will be kept if a new value is not included.
     */
    export function setRules(rules: Partial<BooleanSanitizerRules>) 
    {
        for (const ruleKey in rules) {
            if (Object.prototype.hasOwnProperty.call(rules, ruleKey)) {
                // If lowerStrings is enabled the true/false string lists will be automatically lowered as well.
                if (ruleKey === 'falseStrings' || ruleKey === 'trueStrings') {
                    let value = (<any>rules)[ruleKey];
                    if (getRule<boolean>('lowerStrings', rules))
                        value = value.map((s: string) => (''+s).toLowerCase());
                    if (getRule<boolean>('trimStrings', rules))
                        value = value.map((s: string) => (''+s).trim());
                    (<any>globalRules)[ruleKey] = value;
                }
                else if (Object.prototype.hasOwnProperty.call(globalRules, ruleKey)) {
                    const value = (<any>rules)[ruleKey];
                    (<any>globalRules)[ruleKey] = value;
                }
                else {
                    console.warn(`Cannot update boolean sanitizer rule '${ruleKey}', see BooleanSanitizerRules type for more info.`)
                }
            }
        }
    }
}

export = bool;