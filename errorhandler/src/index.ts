import { Request, Response } from 'express';
import { Http404Error, HttpError, Http500Error, ApiErrorResponse } from '@onibi/errors';

export interface BuilderOptions {
    /* Defaults to false, if set to true the `stackTrace` field of the `ApiErrorResponse` will be populated with the stack 
    trace of the error. WARNING: Including the stack trace can potentially leak sensitive information about the application
    to malicious actors, this should NEVER be set to true in a production environment. */
    includeStackTrace?: boolean;

    /* Defaults to true, when set to true the error handler will send a 404 response when there is no error to catch. Set this
    to false if you wish for middleware/paths after the error handler to be reachable. */
    generate404?: boolean;

    /* Defaults to true, if set to false non http errors will not be logged to the console before being converted to a 
    Http500Error. */
    logNonHttpErrors?: boolean;
};

/**
 * Generates express.js middleware that captures an `HttpError` and sends an `ApiErrorResponse` JSON object instead.
 * Normal javascript `Error` objects are converted to `Http500Error` errors.
 * 
 * @param {BuilderOptions} options - Options for 
 * 
 * @returns express.js error handler middleware.
 */
export function errorHandlerBuilder(options?: BuilderOptions) {
    let generate404 = !(options && options['generate404'] === false);
    let includeStackTrace = (options && options['includeStackTrace'] === true);
    let logNonHttpErrors = ((!options) || options['logNonHttpErrors'] !== false);

    if (includeStackTrace && process.env['NODE_ENV'] === 'production') {
        console.warn(`WARNING: Overwriting 'includeStackTrace' to false because NODE_ENV was set to 'production', what are you doing?`);
        includeStackTrace = false;
    }
    else if (includeStackTrace && process.env['NODE_ENV'] !== 'development') {
        console.warn(`WARNING: 'includeStackTrace' is set to true, this is not a production environment right?`)
    }

    return [
        (req: Request, res: Response, next: Function) => {
                if (generate404) {
                    next(new Http404Error(`Sorry, the path "${req.url}" does not exist.`, false));
                } else {
                    return next();
                }
        },
        (error: Error, req: Request, res: Response, next: Function) => {

            if (!(error instanceof HttpError)) {
                if (logNonHttpErrors) {
                    console.error(error);
                    console.error(error.stack);
                }
                error = new Http500Error(error);
            }

            let httpError: HttpError = <HttpError>error;

            res.status(httpError.statusCode);

            let body: ApiErrorResponse = httpError.toJSON();
            if (includeStackTrace)
                body.stackTrace = error.stack;

            res.json(body);

            res.end();
        }
    ];
}

export default errorHandlerBuilder;
