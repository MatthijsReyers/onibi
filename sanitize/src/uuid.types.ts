
export type Uuid = string;

/**
 * UUID sanitizer rules.
 */
export interface UuidSanitizerRules 
{
    /** 
     * Default value, any input not handled by these rules will be assigned this value. Set to 
     * error by default since uuids are usually random and unique so a default rarely makes sense.
     * Alternatively a function can be provided to generate a new uuid.
     */
    default: Uuid | 'error' | ((input: any) => Uuid);

    /**
     * Set to true by default.
     */
    trimStrings: boolean;
}

export type RuleKey = (keyof UuidSanitizerRules);
