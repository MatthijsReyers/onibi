
/**
 * Enum sanitizer behaviour rules.
 */
export interface EnumSanitizerRules 
{
    /** 
     * Default value, any input that cannot be converted to a member of the enum array will be set
     * to this value. Should no default value be provided an EnumValueError will be thrown for any
     * nonconforming input.
     */
    default?: any;

    /**
     * How should null values be allowed? When this options is set to true any null input will be
     * passed on, when set to false null input will be converted into the default value when 
     * available or a NullValueError will be thrown.
     * 
     * Note that adding null to the enum values array will have the same effect as locally setting 
     * this option to true. 
     */
    allowNull: boolean;

    /** 
     * Should leading and trailing spaces be removed from string types before converting them
     * to booleans? (Will cause "\tVALUE " to be treated the same as "VALUE").
     */
    trimStrings: boolean;

    /**
     * Should enum values be be compared with case sensitivity? (Will cause "VALUE" to be treated 
     * the same as "Value" or "value").
     */
    caseSensitive: boolean;
};

export type RuleKey = (keyof EnumSanitizerRules);
