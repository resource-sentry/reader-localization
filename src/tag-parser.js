const LanguageTags = require('./model/language-tags');

/**
 * RFC 5646: "Tag" refers to a complete language tag, such as "sr-Latn-RS" or az-Arab-IR".
 */
class TagParser {
    constructor() {
        // ISO 639 with permanently reserved blocks
        const extLang = '[a-z]{3}(?:-[a-z]{3}){0,2}';
        // ISO 639 or reserved for future use or registered language subtag
        const language = `([a-z]{2,3}(?:-${extLang})?|[a-z]{4}|[a-z]{5,8})`;
        // ISO 15924
        const script = '([a-z]{4})';
        // ISO 3166-1 or UN M.49 code
        const region = '([a-z]{2}|[0-9]{3})';
        // Registered variants
        const variant = '([a-z0-9]{5,8}|\\d[a-z0-9]{3})';
        // "x" reserved for private use
        const extension = '([a-wy-z0-9](?:-[a-z0-9]{2,8})+)';
        const privateUse = '(x(?:-[a-z0-9]{1,8})+)';
        const tag = `^${language}(?:-${script})?(?:-${region})?(?:-${variant})?(?:-${extension})?(?:-${privateUse})?$`;

        this.languageTag = new RegExp(tag, 'i');
    }

    formatLanguage(value) {
        let result = {};
        let languageTags = value.split('-');

        result[LanguageTags.LANGUAGE] = languageTags[0] || null;
        result[LanguageTags.EXT_LANGUAGE] = (languageTags.length > 1) ? languageTags.slice(1) : null;

        return result;
    }

    parse(tag) {
        let result = null;
        let matchResults = tag.match(this.languageTag);

        if (matchResults !== null) {
            result = {
                ...this.formatLanguage(matchResults[1]),
                [LanguageTags.SCRIPT]     : matchResults[2] || null,
                [LanguageTags.REGION]     : matchResults[3] || null,
                [LanguageTags.VARIANT]    : matchResults[4] || null,
                [LanguageTags.EXTENSION]  : matchResults[5] || null,
                [LanguageTags.PRIVATE_USE]: matchResults[6] || null
            };
        }

        return result;
    }
}

module.exports = TagParser;
