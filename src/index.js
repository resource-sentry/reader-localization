const BaseReader   = require('@resource-sentry/utils/lib/base-reader'),
      Promise      = require('bluebird'),
      Categories   = require('@resource-sentry/utils/lib/categories'),
      fs           = require('fs'),
      glob         = require('fast-glob'),
      Logger       = require('@resource-sentry/utils/lib/logger'),
      ObjectWalker = require('@resource-sentry/utils/lib/object-walker'),
      path         = require('path');

const KeyConsistency   = require('./key-consistency'),
      LanguageRegistry = require('./service/language-registry'),
      LanguageTags     = require('./model/language-tags'),
      TagParser        = require('./tag-parser');

class LocalizationReader extends BaseReader {
    constructor(config) {
        super();
        this.logger = Logger(this.constructor.name);
        this.config = config;
    }

    getEntry() {
        return this.config.entry;
    }

    getLanguageTag(filePath) {
        return path.basename(filePath, '.json');
    }

    getLanguageTagsFromFilenames(list) {
        return list.map(filename => this.getLanguageTag(filename));
    }

    scan() {
        let fileData, languageTag, values;
        let english = null;
        let englishTag = /^en_*/;
        let fileContent = {};
        let entry = path.resolve(process.cwd(), this.getEntry());
        // TODO Explore the possibility to have configuration for depth
        let objectWalker = new ObjectWalker();

        this.logger.verbose('Exploring language files in ' + entry);

        return Promise
            .resolve()
            .then(() => glob('**/*.json', {cwd: entry}))
            .then(files => {

                return Promise
                    .resolve()
                    .then(() => this.validateLanguageLegitimacy(files))
                    .then(() => {
                        files.forEach(filePath => {
                            fileData = JSON.parse(fs.readFileSync(path.resolve(entry, filePath), 'utf8'));
                            fileContent[filePath] = fileData;
                        });
                    })
                    .then(() => this.validateFileStructure(fileContent))
                    .then(() => {
                        for (let filePath in fileContent) {
                            languageTag = this.getLanguageTag(filePath);
                            values = objectWalker.setObject(fileContent[filePath]).getValues();

                            values.sort((left, right) => {
                                return left.key.localeCompare(right.key);
                            });

                            this.logger.verbose(`Registering "${languageTag}" language`);

                            this.addValue(Categories.LANGUAGE, languageTag, values);

                            if (englishTag.test(languageTag) === true) {
                                english = values;
                            }
                        }

                        if (english === null) {
                            return Promise.reject('Can not find default (English) language.');
                        } else {
                            english.forEach(({key, value}) => {
                                this.addValue(Categories.TEXT, key, value);
                            });
                        }
                    });
            })
            .then(() => this.dispatch('dataDidChange'));
    }

    validateFileStructure(content) {
        let keyConsistency = new KeyConsistency();

        return Promise.each(
            Object.values(content),
            language => keyConsistency.validate(language)
        );
    }

    validateLanguageLegitimacy(filenames) {
        let languageTags;
        let tagError = null;
        let parsedTags = [];
        let languages = this.getLanguageTagsFromFilenames(filenames);
        let tagParser = new TagParser();
        let registry = new LanguageRegistry();

        return Promise
            .resolve()
            .then(() => {
                // First run: if we can extract the required part - language
                languages.forEach(tag => {
                    languageTags = tagParser.parse(tag);
                    parsedTags.push(languageTags);

                    if (languageTags[LanguageTags.LANGUAGE] === null) {
                        return Promise.reject(`Language file with the name "${tag}" does not include required language subtag.`);
                    }
                });
            })
            .then(() => registry.init())
            .then(() => {
                // Second run: check critical parts like language, variant, region with IANA registry
                parsedTags.forEach(tag => {
                    tagError = this.validateLanguageTag(tag, registry);

                    if (tagError !== null) {
                        return Promise.reject(`Issue with language legitimacy. Reason: ${tagError}`);
                    }

                });
            });
    }

    validateLanguageTag(parsedTag, registry) {
        let value;
        let error = null;
        let list = [
            {subtag: LanguageTags.LANGUAGE, valid: registry.getLanguages()},
            {subtag: LanguageTags.EXT_LANGUAGE, valid: registry.getExtendedLanguages()},
            {subtag: LanguageTags.REGION, valid: registry.getRegions()},
            {subtag: LanguageTags.SCRIPT, valid: registry.getScripts()}
        ];

        list.forEach(({subtag, valid}) => {
            value = parsedTag[subtag];

            if (value !== null && valid[value] === undefined) {
                error = `Subtag "${subtag}" with the value "${value}" is not valid.`;
            }
        });

        return error;
    }
}

module.exports = LocalizationReader;
