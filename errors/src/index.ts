export interface ApiErrorResponse {
    /** HTTP status code. */
    code: number;

    /** Unique name/id for this error type. */
    name: string;

    /** Error message that describes the error in more detail, may be shown to end users. */
    message: string;

    /** Error message is safe to show to users/user friendly. */
    isUserSafe: boolean;

    /** Stack trace for the error, must be explicitly added by the error handler and should never be populated in production environments. */
    stackTrace?: string;
}

/**
 * Interface for custom error types that implement a toHttpError() function for converting the 
 * custom error to an HttpError.
 */
export interface ToHttpError {
    toHttpError(): HttpError;
}

function mergeDefaults(
    defaults: ApiErrorResponse, 
    config?: Partial<ApiErrorResponse>
): ApiErrorResponse {
    let out: any = {};
    for (const key in defaults) {
        const k = key as keyof ApiErrorResponse;
        if (config && Object.prototype.hasOwnProperty.call(config, key)) {
            out[key] = config[k];
        } else {
            out[key] = defaults[k];
        }
    }
    // Always get the status code from the defaults.
    if (defaults.code) {
        out.code = defaults.code;
    }
    return (out as ApiErrorResponse);
}


export abstract class HttpError extends Error implements ApiErrorResponse {
    code: number;
    name: string;
    message: string;
    isUserSafe: boolean;

    constructor(config: ApiErrorResponse) {
        super(config.message);
        this.code = config.code;
        this.name = config.name;
        this.message = config.message;
        this.isUserSafe = config.isUserSafe;
    }

    public toJSON(): ApiErrorResponse {
        return {
            code: this.code,
            name: this.name,
            message: this.message,
            isUserSafe: this.isUserSafe
        }
    }
}

/**
 * # Http400Error: Bad request.
 * The Http 400 Bad request status code indicates that the client request was malformed 
 * in some way and could not be processed because of it.
 * 
 * @extends HttpError
 */
export class Http400Error extends HttpError {
    static defaultError: ApiErrorResponse = {
        code: 400,
        name: '400BadRequest',
        message: 'The request could not be processed because it is malformed in some way.',
        isUserSafe: false,
    };

    constructor(config?: Partial<ApiErrorResponse>) {
        super(mergeDefaults(Http400Error.defaultError, config));
    }
}

/**
 * # Http401Error: Unauthorized.
 * The Http 401 Unauthorized response status code indicates that the client request has not been 
 * completed because it lacks valid authentication credentials for the requested resource. 
 * 
 * @extends HttpError
 */
export class Http401Error extends HttpError {
    static defaultError: ApiErrorResponse = {
        code: 401,
        name: '401UnauthorizedError',
        message: 'Request was not completed because it lacks valid authentication, try reauthenticating.',
        isUserSafe: false,
    };

    constructor(config?: Partial<ApiErrorResponse>) {
        super(mergeDefaults(Http401Error.defaultError, config));
    }

    /**
     * Creates a new Http401Error, with the `401InvalidUserPass` combination type. Use this error
     * as response to invalid username/password combinations.
     */
    static invalidUserPass(): Http401Error {
        return new Http401Error({
            name: '401InvalidUserPass',
            message: 'Invalid user/password combination, please try again',
            isUserSafe: true,
        });
    }
}

/**
 * # Http403Error: Authentication error.
 * The client has provided authentication but is not allowed to access the resource it has 
 * requested because the authentication is not sufficient.
 * 
 * @extends HttpError
 */
export class Http403Error extends HttpError {
    static defaultError: ApiErrorResponse = {
        code: 403,
        name: '403AuthenticationError',
        message: 'Request was not completed because the provided authentication does not provide access to this resource.',
        isUserSafe: true,
    };

    constructor(config?: Partial<ApiErrorResponse>) {
        super(mergeDefaults(Http403Error.defaultError, config));
    }
}

/**
 * # Http404Error: Authentication error.
 * The client has provided authentication but is not allowed to access the resource it has 
 * requested because the authentication is not sufficient.
 * 
 * @extends HttpError
 */
export class Http404Error extends HttpError {
    static defaultError: ApiErrorResponse = {
        code: 404,
        name: '404NotFound',
        message: 'The requested resource could not be found because it was deleted or never existed to begin with.',
        isUserSafe: true,
    };

    constructor(config?: Partial<ApiErrorResponse>) {
        super(mergeDefaults(Http404Error.defaultError, config));
    }

    /**
     * Generates a Http404Error with an error message that mentions the resource type in the user facing error message.
     * 
     * @param {string} resourceName - Type name of the resource.
     */
    static withName(resourceName: string) {
        return new Http404Error({
            message: `Sorry, this ${resourceName} does not exist or was deleted.`
        });
    }
}

/**
 * # Http415Error: Unsupported Media Type error.
 * The server refuses to accept the payload because the format is not supported.
 * 
 * @extends HttpError
 */
export class Http415Error extends HttpError {
    static defaultError: ApiErrorResponse = {
        code: 415,
        name: '415Unsupported',
        message: 'The provided media type is not supported.',
        isUserSafe: true,
    };

    constructor(config?: Partial<ApiErrorResponse>) {
        super(mergeDefaults(Http415Error.defaultError, config));
    }

    /**
     * Generates a Http415Error with an error message that mentions the provided file type and optionally 
     * suggests which filetypes are supported.
     * 
     * @param {string} filetype  - File extension of the filetype that was provided.
     * @param {string[]} allowed - List of allowed filetypes that the user could provide instead. Defaults
     *                             to empty list in which case the error message will not suggest any filetypes.
     */
    public static withFileType(filetype: string, allowed: string[] = []): Http415Error {
        let message = `Sorry '${filetype}' files are not supported.`
        if (allowed.length) {
            message += ` Please provide one of these instead: "${allowed.join('", "')}".`;
        }
        return new Http415Error({ message });
    }
}

/**
 * # Http422Error: Unprocessable Entity error.
 * Unprocessable Entity response status code indicates that the server understands the content type
 * of the request entity, and the syntax of the request entity is correct, but it was unable to 
 * process the contained instructions.
 * 
 * @extends HttpError
 */
export class Http422Error extends HttpError {
    static defaultError: ApiErrorResponse = {
        code: 422,
        name: '422UnprocessableEntity',
        message: 'Request was understood but not completed because its instructions could not be processed.',
        isUserSafe: false,
    };

    constructor(config?: Partial<ApiErrorResponse>) {
        super(mergeDefaults(Http422Error.defaultError, config));
    }

    /**
     * Generates a Http422Error with an error message that mentions the name of the missing field 
     * in the user facing error message.
     * 
     * @param {string} field - Name of the missing field.
     * @param {boolean} isUserSafe - Does it make sense for end users to see this message?
     */
    public static withMissingField(field: string, isUserSafe: boolean = false) {
        return new Http422Error({
            name: '422MissingField',
            message: `Request is missing the '${field}' field, please provide a value.`,
            isUserSafe
        });
    }

    /**
     * Generates a Http422Error with an error message that says the value of the field cannot be a
     * negative number.
     * 
     * @param {string} field - Name of the negative field.
     * @param {boolean} isUserSafe - Does it make sense for end users to see this message?
     */
    public static withNegativeField(field: string, isUserSafe: boolean = true) {
        return new Http422Error({
            name: '422Negative',
            message: `Value for field '${field}' cannot be a negative number.`,
            isUserSafe
        });
    }

    /**
     * Generates a Http422Error with an error message that mentions the name of the field that was 
     * marked as null but cannot be null in the user facing error message.
     * 
     * @param {string} field - Name of the nulled field.
     * @param {boolean} isUserSafe - Does it make sense for end users to see this message?
     */
    public static withNullField(field: string, isUserSafe: boolean = false) {
        return new Http422Error({
            name: '422NotNullField',
            message: `Field '${field}' cannot be null, please provide a real value.`,
            isUserSafe
        });
    }

    /**
     * Generates a Http422Error with an error message that mentions the name of the field whose 
     * value was not a number, when a number was expected.
     * 
     * @param {string} field - Name of the NaN field.
     * @param {any} value - NaN value of the field (used in error message).
     * @param {boolean} isUserSafe - Does it make sense for end users to see this message?
     */
    public static withNaNField(field: string, value: any, isUserSafe: boolean = true) {
        return new Http422Error({
            name: '422NotNullField',
            message: `Invalid value for field '${field}', value '${value}' is not a number`,
            isUserSafe
        });
    }

    /**
     * Generates a Http422Error with an error message that mentions the name of the field whose 
     * value was some infinite value.
     * 
     * @param {string} field - Name of the non finite field.
     * @param {boolean} isUserSafe - Does it make sense for end users to see this message?
     */
    public static withNonFiniteField(field: string, isUserSafe: boolean = true) {
        return new Http422Error({
            name: '422NotFinite',
            message: `Expected field '${field}' to be a finite value.`,
            isUserSafe
        });
    }

}

/**
 * ## Http500Error: Internal server error.
 * An internal server error has taken place, this is a last resort for when an error occurs 
 * completely unexpectedly and no more appropriate status code can be found.
 * 
 * @extends HttpError
 */
export class Http500Error extends HttpError {
    static defaultError: ApiErrorResponse = {
        code: 500,
        name: '500Internal',
        message: 'An internal server error took place, please try again later.',
        isUserSafe: true,
    };

    nativeError: Error;

    constructor(error: Error, config: Partial<ApiErrorResponse>) {
        super(mergeDefaults(Http500Error.defaultError, config));
        this.nativeError = error;
    }
}

/**
 * ## Http501Error: Not implemented
 * The server returned an error because the executed code path was not implemented yet.
 * 
 * @extends HttpError
 */
export class Http501Error extends HttpError {
    static defaultError: ApiErrorResponse = {
        code: 501,
        name: '501NotImplemented',
        message: 'The requested resource is not yet implemented.',
        isUserSafe: true,
    };

    constructor(config?: Partial<ApiErrorResponse>) {
        super(mergeDefaults(Http501Error.defaultError, config));
    }
}
