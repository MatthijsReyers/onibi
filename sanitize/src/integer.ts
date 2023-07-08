import { NanValueError, NegativeValueError, NullValueError, UnexpectedValueError } from "./errors";
import { Field } from "./field";
import { ExtendedIntSanitizerRules, IntegerSanitizerRules, RangedIntSanitizerRules, 
         RuleKey, UnsignedIntSanitizerRules } from "./integer.types";

// const SIGNED_REGEX = /^(\s*)((((-(\s*))?)(\d+))|(0x([0-9a-fA-F]+)))(\s*)$/;
// const UNSIGNED_REGEX = /^(\s*)((\d+)|(0x([0-9a-fA-F]+)))(\s*)$/;

/**
 * Application wide integer sanitizer behavior.
 */
var globalRules: ExtendedIntSanitizerRules = {
    default:         0,
    nullValues:      'default',
    nanValues:       'default',
    undefinedValues: 'default',
    infiniteValues:  'clamp',
    trimStrings:     true,
    strictStrings:   false,

    outOfRangeValues: 'clamp',
    signedValues:     0,
}

/**
 * Gets a value from the global rules or the locally provided rules if given.
 */
function getRule<T>(ruleKey: RuleKey, rules?: Partial<ExtendedIntSanitizerRules>): T 
{
    if (rules && rules.hasOwnProperty(ruleKey) && ruleKey in rules)
        return <T>(<any>rules)[ruleKey];
    return <T>(<any>globalRules)[ruleKey];
}

/**
 * Flexible sanitizer for signed integers, will never throw an error and convert any invalid or 
 * negative input to a default value instead. Floating point numbers will be rounded to the 
 * nearest integer.
 * 
 * @param {any}   input  - Input to sanitize.
 * @param {rules} Partial<RangedIntSanitizerRules> - (Optional) rules to locally overwrite the 
 *                global integer sanitization rules for this function call.
 */
function int(input: any, rules?: Partial<IntegerSanitizerRules & Field>): number
{
    if (typeof input === 'string') {
        if (getRule<boolean>('trimStrings')) {
            input = input.trim()
        }
        input = parseInt(input);
        // TODO: String stuff..
    }
    if (typeof input === 'number') {
        if (Number.isNaN(input)) {
            let rule = getRule<number | 'default' | 'allow' | 'error'>('nanValues', rules);
            if (rule === 'allow')
                return NaN;
            let defaultValue = getRule<number | 'error'>('default', rules);
            if (rule === 'error' || defaultValue === 'error')
                throw new NanValueError(rules?.field);
            if (rule === 'default')
                return defaultValue;
            return rule;
        }
        input = Math.round(input);
        if (!isFinite(input)) {
            let rule = getRule<number | 'default' | 'clamp' | 'error'>('infiniteValues', rules);
            if (rule === 'clamp') {
                if (input === Number.POSITIVE_INFINITY) return Number.MAX_SAFE_INTEGER;
                return Number.MIN_SAFE_INTEGER;
            }
        }
        return input;
    }
    let defaultValue = getRule<number | 'error'>('default', rules);
    if (defaultValue === 'error')
        throw new UnexpectedValueError(rules?.field);
    return defaultValue;
}

namespace int 
{
    export var signed = int;

    /**
     * Flexible sanitizer for unsigned integers, will never throw an error and convert any invalid 
     * or negative input to zero instead. Floating point numbers will be rounded to the nearest integer.
     * 
     * @param {any} input - Input to sanitize.
     * @param {number} defaultValue - (Optional) default value to be used if the given user input 
     *                 cannot be parsed, set to 0 if none is provided.
     */
    export function unsigned(input: any, rules?: Partial<UnsignedIntSanitizerRules & Field>): number 
    {
        let value = signed(input, rules);
        if (value < 0) {
            if (getRule('signedValues', rules) === 'default') {
                if (getRule('default', rules) === 'error') {
                    throw new NegativeValueError(rules?.field);
                } 
                return getRule('default', rules);
            }
            if (getRule('signedValues', rules) === 'error') {
                throw new NegativeValueError(rules?.field);
            }
            if (getRule('signedValues', rules) === 'abs') {
                return Math.abs(value);
            }
            return getRule<number>('signedValues', rules);
        }
        return value;
    }

    /**
     * Flexible sanitizer for integers in a given range, will never throw an error. Floating point 
     * numbers will be rounded to the nearest integer. Values outside the outside the range will be 
     * clamped to the given boundaries. Non numeric types and NaN values will result in the default 
     * value.
     * 
     * @param {any}    input - Input to sanitize.
     * @param {number} min   - Smallest value the input may be.
     * @param {number} max   - Biggest value the input may be. 
     * @param {rules}  Partial<RangedIntSanitizerRules> - (Optional) rules to locally overwrite the
     *                 global integer sanitization rules for this function call.
     */
    export function ranged(input: any, min: number, max: number, rules?: Partial<RangedIntSanitizerRules & Field>) 
    {
        let value = signed(input, rules);
        if (value < min) return min;
        if (value > max) return max;
        return value;
    }

    /**
     * Set application wide rules for integer sanitizer. Note that not all options have to be 
     * provided and default or previously set values will be kept if a new value is not included.
     */
    export function setRules(rules: Partial<ExtendedIntSanitizerRules>) 
    {
        for (const ruleKey in rules) {
            if (Object.prototype.hasOwnProperty.call(rules, ruleKey)) {
                if (Object.prototype.hasOwnProperty.call(globalRules, ruleKey)) {
                    const value = (<any>rules)[ruleKey];
                    (<any>globalRules)[ruleKey] = value;
                }
                else {
                    console.warn(`Cannot update integer sanitizer rule '${ruleKey}', see IntegerSanitizerRules type for more info.`)
                }
            }
        }
    }
}

export = int;
