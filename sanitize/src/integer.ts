import { NegativeValueError } from "./errors";
import { ExtendedIntSanitizerRules, IntegerSanitizerRules, RangedIntSanitizerRules, 
         RuleKey, UnsignedIntSanitizerRules } from "./integer.types";

const SIGNED_REGEX = /^(\s*)((((-(\s*))?)(\d+))|(0x([0-9a-fA-F]+)))(\s*)$/;
const UNSIGNED_REGEX = /^(\s*)((\d+)|(0x([0-9a-fA-F]+)))(\s*)$/;

/**
 * Flexible sanitizer for signed integers, will never throw an error and convert any invalid or 
 * negative input to a default value instead. Floating point numbers will be rounded to the 
 * nearest integer.
 * 
 * @param {any}   input  - Input to sanitize.
 * @param {rules} Partial<RangedIntSanitizerRules> - (Optional) rules to locally overwrite the
 *                         global integer sanitization rules for this function call.
 * @param {string} field - Name of the field that is being sanitized, (used in error messages).
 */
function int(input: any, rules?: Partial<IntegerSanitizerRules>, field?: string): number
{
    // TODO
    return parseInt(input);
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
     *                                cannot be parsed, set to 0 if none is provided.
     * @param {string} field - Name of the field that is being sanitized, (used in error messages).
     */
    export function unsigned(input: any, rules?: Partial<UnsignedIntSanitizerRules>, 
                             field?: string): number 
    {
        let value = signed(input, rules, field);
        if (value < 0) {
            if (getRule('signedValues', rules) === 'default') {
                if (getRule('default', rules) === 'error') {
                    throw new NegativeValueError(field);
                } 
                return getRule('default', rules);
            }
            if (getRule('signedValues', rules) === 'error') {
                throw new NegativeValueError(field);
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
     *                       global integer sanitization rules for this function call.
     */
    export function ranged(input: any, min: number, max: number, 
                           rules?: Partial<RangedIntSanitizerRules>, field?: string) 
    {
        let value = signed(input, rules, field);
        if (value < min) return min;
        if (value > max) return max;
        return value;
    }

    /**
     * Application wide integer sanitizer behavior.
     */
    var globalRules: ExtendedIntSanitizerRules = {
        default: 0,
        nullValues: 'default',
        nanValues: 'default',
        undefinedValues: 'default',
        trimStrings:  true,
        strictStrings: false,

        outOfRangeValues: 'clamp',
        signedValues: 0,
    }

    /**
     * Set application wide rules for boolean sanitizer. Note that not all options have to be provided
     * and default or previously set values will be kept if a new value is not included.
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

    /**
     * Gets a value from the global rules or the locally provided rules if given.
     */
    function getRule<T>(ruleKey: RuleKey, rules?: Partial<ExtendedIntSanitizerRules>): T 
    {
        if (rules && rules.hasOwnProperty(ruleKey) && ruleKey in rules)
            return <T>(<any>rules)[ruleKey];
        return <T>(<any>globalRules)[ruleKey];
    }
}

export = int;
