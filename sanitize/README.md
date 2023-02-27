
# @onibi/sanitize

Basic input validation tools, although the package does provide some sanitization and is called sanitize for historic reasons, this package should be viewed mostly as a tool for user input validation and is focused on providing descriptive and useful error messages which have built in methods for converting to a `HttpError` from the `@onibi/errors` package for seamless integration into express.js based REST API's.


## Usage examples

```ts
import sanitize from '@onibi/sanitize';

// Sanitizers have flexible settings that avoid throwing errors by default.
let x = sanitize.unsignedInt(34.7);     // Rounded to 35
let x = sanitize.unsignedInt(-73);      // Clamped to 0.
let y = sanitize.unsignedInt(null);     // Defaults to 0
```
