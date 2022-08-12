export interface ApiErrorResponse {
    /** HTTP status code. */
    statusCode: number;

    /** Unique type id for this error type. */
    errorType: string;

    /** Generic name for this error type, may be shown to end users. */
    errorName: string;

    /** Error description for programmers/debugging, should NOT be shown to end users. */
    description: string;

    /** Error message that describes the error in more detail, may be shown to end users. */
    message: string;

    /** Error message is safe to show to users/user friendly. */
    isUserSafe: boolean;

    /** Stack trace for the error, must be explicitly added by the error handler and should never be populated in production environments. */
    stackTrace?: string;
}


export abstract class HttpError extends Error implements ApiErrorResponse {
    statusCode: number;
    errorType: string;
    errorName: string;
    description: string;
    message: string;
    isUserSafe: boolean;

    constructor(
        statusCode: number,
        errorType: string,
        errorName: string,
        description: string,
        message: string,
        isUserSafe: boolean = false
    ) {
        super(message);
        this.statusCode = statusCode;
        this.errorType = errorType;
        this.errorName = errorName;
        this.description = message;
        this.message = message;
        this.isUserSafe = isUserSafe;
    }

    public toJSON(): ApiErrorResponse {
        return {
            statusCode: this.statusCode,
            errorType: this.errorType,
            errorName: this.errorName,
            description: this.description,
            message: this.message,
            isUserSafe: this.isUserSafe
        }
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
    constructor() {
        super(
            401, '401UnauthorizedError',
            'Unauthorized request',
            'Request was not completed because it lacks valid authentication, try reauthenticating.',
            'Please log in to access this resource.',
            true
        );
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
    constructor(
        errorType: string = '403AuthenticationError',
        title: string = 'Authentication error',
        description: string = 'Request was not completed because the provided authentication does not provide access to this resource.',
        message: string = 'Sorry, you do not have access to this resource.',
        isUserSafe: boolean = true
    ) {
        super(
            403, errorType, title, description, message, isUserSafe
        );
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
    static defaultStatusCode: number = 404;
    static defaultErrorType: string = '404NotFound';
    static defaultTitle: string = 'Resource not found';
    static defaultDescription: string = 'The requested resource could not be found because it was deleted or never existed to begin with.';

    constructor(
        message: string = 'Sorry, this page does not exist or was deleted.',
        isUserSafe: boolean = true
    ) {
        super(
            Http404Error.defaultStatusCode,
            Http404Error.defaultErrorType,
            Http404Error.defaultTitle,
            Http404Error.defaultDescription,
            message,
            isUserSafe
        );
    }

    /**
     * Generates a Http404Error with an error message that mentions the resource type in the user facing error message.
     * 
     * @param {string} resourceName - Type name of the resource.
     */
    static withName(resourceName: string) {
        return new Http415Error(`Sorry, this ${resourceName} does not exist or was deleted.`, true);
    }
}

/**
 * # Http415Error: Unsupported Media Type error.
 * The server refuses to accept the payload because the format is not supported.
 * 
 * @extends HttpError
 */
export class Http415Error extends HttpError {
    static defaultStatusCode: number = 415;
    static defaultErrorType: string = '415Unsupported';
    static defaultTitle: string = 'Unsupported media type';
    static defaultDescription: string = 'Request was not completed because the provided media type is not supported.';

    constructor(
        message: string = 'Sorry, the provided media type is not supported.',
        isUserSafe: boolean = true
    ) {
        super(
            Http415Error.defaultStatusCode,
            Http415Error.defaultErrorType,
            Http415Error.defaultTitle,
            Http415Error.defaultDescription,
            message,
            isUserSafe
        );
    }

    /**
     * Generates a Http415Error with an error message that mentions the provided file type and optionally 
     * suggests which filetypes are supported.
     * 
     * @param {string} filetype  - File extension of the filetype that was provided.
     * @param {string[]} allowed - List of allowed filetypes that the user could provide instead. Defaults
     *                              to empty list in which case the error message will not suggest any filetypes.
     */
    public static withFileType(filetype: string, allowed: string[] = []): Http415Error {
        let message = `Sorry '${filetype}' files are not supported.`
        if (allowed.length)
            message += ` Please provide one of these instead: "${allowed.join('", "')}".`;
        return new Http415Error(message);
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
    static defaultStatusCode: number = 422;
    static defaultErrorType: string = '422UnprocessableEntity';
    static defaultTitle: string = 'Unprocessable entity';
    static defaultDescription: string = 'Request was understood but not completed because its instructions could not be processed.';

    constructor(
        title: string = Http422Error.defaultTitle,
        message: string = Http422Error.defaultDescription,
        isUserSafe: boolean = false
    ) {
        super(
            Http422Error.defaultStatusCode,
            Http422Error.defaultErrorType,
            title,
            Http422Error.defaultDescription,
            message,
            isUserSafe
        );
    }

    /**
     * Generates a Http422Error with an error message that mentions the name of the missing field 
     * in the user facing error message.
     * 
     * @param {string} field - Name of the missing field.
     */
    public static withMissingField(field: string) {
        return new Http422Error(
            '422MissingField',
            `Request is missing the '${field}' field, please provide a value.`,
            false
        );
    }

    /**
     * Generates a Http422Error with an error message that mentions the name of the field that was 
     * marked as null but cannot be null in the user facing error message.
     * 
     * @param {string} field - Name of the nulled field.
     * @param {boolean} userSafe - Mark error message as safe to show user.
     */
    public static withNullField(field: string, userSafe: boolean = true) {
        return new Http422Error(
            '422NotNullField',
            `Field '${field}' cannot be null, please provide a real value.`,
            userSafe
        );
    }

    /**
     * Generates a Http422Error with an error message that mentions the name of the field whose 
     * value was not a number, when a number was expected.
     * 
     * @param {string} field - Name of the nulled field.
     * @param {boolean} userSafe - Mark error message as safe to show user.
     */
    public static withNaNField(field: string, value: any, userSafe: boolean = true) {
        return new Http422Error(
            '422NotNumber',
            `Invalid value for field '${field}', value '${value}' is not a number`,
            userSafe
        );
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
    static defaultStatusCode: number = 500;
    static defaultErrorType: string = '500Internal';
    static defaultTitle: string = 'Internal server error';
    static defaultDescription: string = 'Request was understood but not completed because its instructions could not be processed.';
    static defaultMessage: string = 'An internal server error took place, please try again later.';

    native_err: Error;

    constructor(error: Error, message = Http500Error.defaultMessage) {
        super(
            Http500Error.defaultStatusCode,
            Http500Error.defaultErrorType,
            Http500Error.defaultTitle,
            Http500Error.defaultDescription,
            message,
            true
        );
        this.native_err = error;
    }
}

/**
 * ## Http500Error: Internal server error.
 * An internal server error has taken place, this is a last resort for when an error occurs 
 * completely unexpectedly and no more appropriate status code can be found.
 * 
 * @extends HttpError
 */
export class Http501Error extends HttpError {
    static defaultStatusCode: number = 501;
    static defaultErrorType: string = '501NotImplemented';
    static defaultTitle: string = 'Not implemented';
    static defaultDescription: string = 'Request was understood but the server does not yet support all the functionality required to fulfill the request.';
    static defaultMessage: string = 'The requested resource is not yet implemented.';

    constructor(message = Http501Error.defaultMessage) {
        super(
            Http501Error.defaultStatusCode,
            Http501Error.defaultErrorType,
            Http501Error.defaultTitle,
            Http501Error.defaultDescription,
            message,
            true
        );
    }
}
