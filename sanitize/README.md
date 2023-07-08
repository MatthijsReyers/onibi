
# @onibi/sanitize

Basic input validation tools, although the package does provide some sanitization and is called sanitize for historic reasons, this package should be viewed mostly as a tool for user input validation and is focused on providing descriptive and useful error messages which have built in methods for converting to a `HttpError` from the `@onibi/errors` package for seamless integration into express.js based REST API's.


## Usage examples

```ts
import sanitize from '@onibi/sanitize';

// Sanitizers have flexible settings that avoid throwing errors by default.
let x = sanitize.int.signed(34.7);     // Rounded to 35
let x = sanitize.int.unsigned(-73);    // Clamped to 0.
let y = sanitize.int.unsigned(null);   // Defaults to 0
```

## Express integration

All `SanitizerError` types implement the `ToHttpError` interface from `@onibi/errors`, which means that they can be converted http errors that can be caught and converted to JSON by the `@onibi/errorhandler`.


## Basic documentation

Listed below is a basic list of sanitizer functions to help you get started, checkout the [full documentation on GitHub](https://github.com/MatthijsReyers/onibi/blob/main/sanitize/DOCS.md) for more details like the specific rules to change the sanitizer behaviour.

| Function | Description |
| :------- | :---------- |
| `int` | Basic integer sanitizer, note that this is just an alias for `int.signed`.
| `int.signed` | Signed integers, will round numbers to the nearest whole number and default to 0 for non numeric types.
| `int.unsigned` | Unsigned integers, based on the signed integers parser but will clamp any negative input to 0. 
| `int.ranged` | Ranged integers, will clamp any input to integers within the given range.
| `bool` | Basic boolean sanitizer, will convert input like `"Yes"` or `"TRUE"` to `true` and input like `"No"` or `"FALSE"` to `false`, note that you might want to customize the rules for stricter behavior.
| `enums` | Basic enum sanitizer, will try to convert the given input to one of the provided enum values.
| `email` | Email address, note that this is just an alias for `email.htmlInput`.
| `email.rfc5322` | RFC5322 email address, will throw an error for any strings that are not valid email addresses according to the RFC5322 specification.
| `email.htmlInput` | Email address, will throw an error for any email address that would not be valid according to the checks used by the HTML `<input type="email">` element, note that this is stricter than `email.rfc5322` and will not allow technically valid emails like `john.doe@[84.39.39.29]`. |
| `uuid` | UUID string sanitizer, will throw an error by default, but can also be provided with a default value or generator function.
