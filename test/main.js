"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errors_1 = require("@onibi/errors");
const errorhandler_1 = __importDefault(require("@onibi/errorhandler"));
let app = (0, express_1.default)();
app.get('/404', (req, res) => {
    throw new errors_1.Http404Error();
});
// The errorHandler should always be the last thing added to the express app.
app.use((0, errorhandler_1.default)({
    // This should NEVER be true in a production env.
    includeStackTrace: true,
    // Send a 404 response if there is no error to catch.
    // Set this to false if you want
    generate404: true
}));
app.listen(8080);
