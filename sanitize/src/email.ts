import { EmailSanitizerRules } from "./email.types";
import { InvalidEmailError } from "./errors";


const HTML_EMAIL_INPUT = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const RFC5322_EMAIL = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

let globalRules: EmailSanitizerRules = {
    default: 'error'
}

/**
 * Gets a value from the global rules or the locally provided rules if given.
 */
function getRule<T>(ruleKey: keyof EmailSanitizerRules, rules?: Partial<EmailSanitizerRules>): T 
{
    if (rules && rules.hasOwnProperty(ruleKey) && ruleKey in rules)
        return <T>(<any>rules)[ruleKey];
    return <T>(<any>globalRules)[ruleKey];
}

/**
 * Checks if the given error matches and performs the default case if not.
 */
function check(regex: RegExp, input: any, rules?: EmailSanitizerRules, field?: string) 
{
    input = (input+'').trim().toLocaleLowerCase()
    if (input.match(regex)) 
        return input;
    const defaultValue = getRule<string | 'error'>('default', rules);
    if (defaultValue === 'error') {
        if (field) throw new InvalidEmailError(input, field);
        throw new InvalidEmailError(input);
    }
    return defaultValue;
}

/**
 * Checks that the given string is a valid email according too the rules used by the html email 
 * input element. Note that this check violates RFC 5322 in that it is both too strict before the 
 * '@' and too lose after.
 * 
 * @param {any}                 input - Input to sanitize.
 * @param {EmailSanitizerRules} rules - (Optional) rules to overwrite global email sanitizer rules 
 *                                      for this function call.
 * @param {string}              field - Name of the field that is being sanitized, (used in error 
 *                                      messages).
 */
function email(input: any, rules?: EmailSanitizerRules, field?: string): string
{
    return check(HTML_EMAIL_INPUT, input, rules, field);
}

namespace email
{
    /**
     * Checks that the given string is a valid email according to the rules described in RFC 5322.
     * Note that the used regex is rather large and allows unexpected emails with comments and IP
     * addresses, if performance is a concern and some deviation from the standard is permitted it
     * might be useful to use a simpler check like the one employed by the HTML input element.
     * 
     * @param {any}                 input - Input to sanitize.
     * @param {EmailSanitizerRules} rules - (Optional) rules to overwrite global email sanitizer 
     *                                      rules for this function call.
     * @param {string}              field - Name of the field that is being sanitized, (used in 
     *                                      error messages).
     */
    export function rfc5322(input: any, rules?: EmailSanitizerRules, field?: string): string
    {
        return check(RFC5322_EMAIL, input, rules, field);
    }

    export var htmlInput = email;
}

export = email;