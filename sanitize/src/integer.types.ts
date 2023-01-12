
/**
 * Integer sanitizer behaviour rules.
 */
export interface IntegerSanitizerRules 
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
    nullValues: number | 'default' | 'error';

    /**
     * How should NaN values be treated. When this options is set 'default' any NaN input will be
     * converted into the default value instead, and when set to 'error' a NaNValueError will be 
     * throw. NaN values can also be explicity allowed in which case any NaN input will result in
     * NaN being returned.
     */
    nanValues: number | 'default' | 'allow' | 'error';

    /**
     * How should positive and negative infinity should be treated. When this options is set to
     * 'clamp' values will be clamped to MAX_SAFE_INTEGER and MIN_SAFE_INTEGER respectively.
     * When set to 'error' an InfiniteValueError will be throw.
     */
    infiniteValues: number | 'clamp' | 'default' | 'error';

    /**
     * How should 'undefined' values be treated? When this options is set 'default' any undefined 
     * input will be converted into the default value instead, and when set to 'error' an 
     * UndefinedValueError will be throw.
     */
    undefinedValues: number | 'default' | 'error';

    /** 
     * Should leading and trailing spaces be removed from string types before converting them
     * to booleans? (Will cause "  8" to be treated the same as "8").
     */
    trimStrings: boolean;

    /**
     * If set to true all strings will be matched against a number regex and an error will be 
     * thrown if the input does not match. Note that the whitespace trimming happens before the 
     * regex when `trimStrings` is also enabled.
     */
    strictStrings: boolean;
};

/**
 * Sanitizer rules specifically for the rangedInt sanitizer.
 */
export interface RangedIntSanitizerRules extends IntegerSanitizerRules
{
    /**
     * How should numbers outside the provided range be treated? Default setting is 'clamp' which
     * clamps out of range values to the maximum or minimum allowed value.
     */
    outOfRangeValues: number | 'clamp' | 'default' | 'error';
};

/**
 * Sanitizer rules specifically for the rangedInt sanitizer.
 */
export interface UnsignedIntSanitizerRules extends IntegerSanitizerRules
{
    /**
     * How should signed (i.e. negative) numbers be treated? Default setting is '0' which means all
     * negative values will become zero instead.
     */
    signedValues: number | 'abs' |'default' | 'error';
};

export type ExtendedIntSanitizerRules = UnsignedIntSanitizerRules | RangedIntSanitizerRules;

export type RuleKey = (keyof RangedIntSanitizerRules) | (keyof UnsignedIntSanitizerRules);
