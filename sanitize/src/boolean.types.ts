
/**
 * Boolean sanitizer behavior rules.
 */
export type BooleanSanitizerRules = {
    /** 
     * Default value, any input not handled by these rules will be assigned this value.
     * Default = false;
     */
    default: boolean | 'error';

    /**
     * Should null input be treated as true or false? When this options is set 'default' any null 
     * input will be converted into the default value instead, and when set to 'error' a 
     * NullValueError will be throw.
     * Default = 'default';
     */
    nullValues: boolean | 'default' | 'error';

    /**
     * Should NaN input be treated as true or false? When this options is set 'default' any NaN 
     * input will be converted into the default value instead, and when set to 'error' a 
     * NanValueError will be throw.
     * Default = 'default';
     */
    nanValues: boolean | 'default' | 'error';

    /**
     * Should 'undefined' be treated as true or false? When this options is set 'default' any 
     * undefined * input will be converted into the default value instead, and when set to 'error'
     * an UndefinedValueError will be throw.
     * Default = 'default';
     */
    undefinedValues: boolean | 'default' | 'error';

    /** 
     * Should leading and trailing spaces be removed from string types before converting them
     * to booleans? (Will cause " false" to be treated the same as "false"). Note that when this 
     * options is enabled all strings consisting only of spaces are treated as empty strings. 
     * Default = true 
     */
    trimStrings: boolean;

    /** 
     * Should string types be made lowercase before converting them to booleans? (Will cause 
     * "TRUE" to be treated the same as "true").
     * Default = true 
     */
    lowerStrings: boolean;

    /** 
     * Which strings should be converted to false. If this value is set to null all strings not
     * in trueStrings will be converted to false.
     * Default = ['false', 'no', '0', ''] 
     */
    falseStrings: string[] | null;

    /** 
     * Which strings should be converted to true. If this value is set to null all strings not
     * in trueStrings will be converted to true.
     * Default = ['true', 'yes', '1'] 
     */
    trueStrings: string[] | null;
};

export type RuleKey = keyof BooleanSanitizerRules;
