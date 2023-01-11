
/**
 * Enum sanitizer behaviour rules.
 */
export interface EnumSanitizerRules 
{
    /** 
     * Default value, any input not handled by these rules will be assigned this value. Set to zero
     * by default, but can also be set to 'error' to throw an error instead.
     */
    default: number | 'error';

    /**
     * How should null values be treated? When this options is set 'default' any null input will be
     * converted into the default value instead, and when set to 'error' a NullValueError will be 
     * throw.
     */
    nullValues: number | null | 'default' | 'error';

    /** 
     * Should leading and trailing spaces be removed from string types before converting them
     * to booleans? (Will cause "\tVALUE " to be treated the same as "VALUE").
     */
    trimStrings: boolean;

    /**
     * TODO
     */
    caseSensitive: boolean;
};