# Reader: Localization

Recursively walks through file-system and builds optimized SVG snippets ready to be injected in HTML.
Reader complies with `RFC 5646`, `RFC 5234` specifications.

![Version](https://img.shields.io/npm/v/@resource-sentry/reader-localization.svg)
![Dependencies](https://david-dm.org/resource-sentry/reader-localization.svg)

## Installation

> yarn add --dev @resource-sentry/reader-localization

This reader replaces the Reader for JSON key values.
When the English language is analyzed, the same keys for texts will be created as if it would be used in Reader JSON.
It's required that language files have the same structure, i.e. all languages have the same set of keys.

## Configuration

English is considered a default language.

- `entry`, path to a directory with JSON language files.
- `soft`, skips language tag validation

## Example: Language File

```json
{
  "text": {
    "message": "Hello World"
  }
}
```

Reader will build a vocabulary of available languages and represent them in `rs.js` file ready for use in production code.
Maximum support available is up to:

- `255` languages
- `255` extended language tags
- `63` writing system variations
- `63` linguistic variations associated with or appropriate to a specific country, territory, or region

```javascript
import Rs from './rs';

Rs.getText(Rs.Text.TEXT_MESSAGE, 'en-US'); // "Hello World"
```
