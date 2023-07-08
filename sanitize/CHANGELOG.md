# Changelog

## [2.1.0] - 2023-07-08
- Imported and implemented `ToHttpError` interface for proper support.

## [2.1.0] - 2023-07-08
- Moved field name to rules object for all sanitizers.
- Added orNull sanitizers to uuid and enum sanitizers.

## [2.0.4] - 2023-07-08
- Fixed field name not working in email sanitizer bug.

## [2.0.3] - 2023-05-30
- Added sanitizer for UUID strings.
- Fixed typo in integer sanitizer doc comments.

## [2.0.2] - 2023-05-30
- Added basic example docs to README.

## [2.0.1] - 2023-05-30
- Added sanitizer for email strings.
- Added sanitizer for string enums.
- **Breaking:** Removed separate strict mode sanitizers module.
