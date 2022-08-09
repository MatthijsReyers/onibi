
# @onibi/errors

Standardized error types for most common HTTP error status codes that have a built-in `.toJSON` method that converts the error into a standardized JSON response.
Best used in conjunction with the `@onibi/errorhandler` for express.js that automatically catches any `HttpError` and returns correct status code/JSON response.

<br>

## JSON response
All errors contain a `.toJSON` method that converts the error into a standardized JSON response according to the interface below:
```ts
interface ApiErrorResponse {
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
```

<br>

## Usage example

```ts
import express from 'express';
import { Http404Error } from '@onibi/errors';
import errorHandler from '@onibi/errorhandler';

let app = express();

app.get('/404', (req, res) => {
    throw new Http404Error();
})

// The errorHandler should always be the last thing added to the express app.
app.user(errorHandler);

app.listen(8080);
```
