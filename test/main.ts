import express from 'express';
import { Http404Error } from '@onibi/errors';
import handler from '@onibi/errorhandler';

let app = express();

app.get('/404', (req, res) => {
    throw new Http404Error();
})

// The errorHandler should always be the last thing added to the express app.
app.use(handler({
    // This should NEVER be true in a production env.
    includeStackTrace: true,
    // Send a 404 response if there is no error to catch.
    // Set this to false if you want
    generate404: true
}));

app.listen(8080);
