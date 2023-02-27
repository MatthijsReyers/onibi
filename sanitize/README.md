
# @onibi/sanitize

Basic input sanitization tools with strict mode versions that throw errors from the `@onibi/errors` module.


## Usage example

```ts
import sanitize from '@onibi/sanitize';

// Flexible sanitizers, will never throw an error.
let x = sanitize.unsignedInt(34.7);     // Rounded to 35
let x = sanitize.unsignedInt(-73);      // Rounded to 0.
let y = sanitize.unsignedInt(null);     // Defaults to 0
let y = sanitize.unsignedInt("0b0");    // Defaults to 0

// Strict transformers, will throw HttpError from '@onibi/errors'.
let x = sanitize.strict.unsignedInt(34.7);     // Error: not an integer.
let x = sanitize.strict.unsignedInt(-73);      // Error: negative number.
let x = sanitize.strict.unsignedInt(34.7);     // Rounded to 35
let y = sanitize.strict.unsignedInt(null);     // Error: unexpected null value.
let z = sanitize.strict.unsignedInt("0b0");    // Error: not a base 10 number
let z = sanitize.strict.unsignedInt("5");      // Parsed as 5.
let z = sanitize.strict.unsignedInt("5");      // Parsed as 5.
```
