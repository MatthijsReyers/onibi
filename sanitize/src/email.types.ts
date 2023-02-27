
/**
 * Email sanitizer behaviour rules.
 */
export interface EmailSanitizerRules 
{
    /**
     * Set to error by default.
     */
    default: string | 'error';

    /**
     * Set to true by default.
     */
    trimStrings: boolean;
}