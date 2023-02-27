
# @onibi/sanitize

Basic input validation tools, although the package does provide some sanitization and is called sanitize for historic reasons, this package should be viewed mostly as a tool for user input validation and is focused on providing descriptive and useful error messages which have built in methods for converting to a `HttpError` from the `@onibi/errors` package for seamless integration into express.js based REST API's.


## Usage examples

```ts
import sanitize from '@onibi/sanitize';

// Flexible sanitizers, will never throw an error.
let x = sanitize.unsignedInt(34.7);     // Rounded to 35
let x = sanitize.unsignedInt(-73);      // Clamped to 0.
let y = sanitize.unsignedInt(null);     // Defaults to 0

// Strict transformers, will throw HttpError from '@onibi/errors'.
let x = sanitize.strict.unsignedInt(34.7);     // Error: not an integer.
let x = sanitize.strict.unsignedInt(-73);      // Error: negative number.
let x = sanitize.strict.unsignedInt(34.7);     // Rounded to 35
let y = sanitize.strict.unsignedInt(null);     // Error: unexpected null value.
let z = sanitize.strict.unsignedInt("0b0");    // Error: not a base 10 number
let z = sanitize.strict.unsignedInt("5");      // Parsed as 5.
let z = sanitize.strict.unsignedInt("5");      // Parsed as 5.
```
