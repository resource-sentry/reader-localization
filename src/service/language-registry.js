const Promise = require('bluebird'),
      fs      = require('fs'),
      https   = require('https'),
      Logger  = require('@resource-sentry/utils/lib/logger'),
      os      = require('os'),
      path    = require('path');

const Constants      = require('../model/constants'),
      LanguageTags   = require('../model/language-tags'),
      RegistryParser = require('../registry-parser');

class LanguageRegistry {
    constructor() {
        this.logger = Logger(this.constructor.name);
        this.cachedFilePath = path.join(os.tmpdir(), Constants.REGISTRY_FILENAME);
        this.languages = null;
        this.extLanguages = null;
        this.regions = null;
        this.scripts = null;
    }

    downloadRegistryToFile() {
        return new Promise((resolve, reject) => {
            let writeStream = fs.createWriteStream(this.cachedFilePath, {
                autoClose: true,
                encoding : 'utf8'
            });

            this.logger.verbose('Downloading IANA language tag registry...');

            writeStream.on('finish', () => resolve());

            https
                .get(
                    Constants.IANA_LANGUAGE_REGISTRY_URL,
                    {headers: {'User-Agent': 'Resource Sentry: Localization Plugin'}},
                    response => response.pipe(writeStream)
                )
                .on('error', error => {
                    fs.unlink(this.cachedFilePath);
                    reject(error);
                });
        });
    }

    getCachedData() {
        let access = Promise.promisify(fs.access);
        let readFile = Promise.promisify(fs.readFile);

        return Promise
            .resolve()
            .then(() => access(this.cachedFilePath, fs.constants.F_OK))
            .then(() => readFile(this.cachedFilePath, 'utf8'))
            .catch(error => null);
    }

    getLanguages() {
        return this.languages;
    }

    getExtendedLanguages() {
        return this.extLanguages;
    }

    getRegions() {
        return this.regions;
    }

    getScripts() {
        return this.scripts;
    }

    init(allowDownload = true) {
        return Promise
            .resolve()
            .then(() => this.getCachedData())
            .then(data => {
                if (data === null) {
                    if (allowDownload === true) {
                        return this.downloadRegistryToFile().then(() => this.getCachedData());
                    } else {
                        return Promise.reject('Registry data is not available.');
                    }
                } else {
                    return data;
                }
            })
            .then(data => this.parse(data));
    }

    parse(content) {
        let languageMeta;
        let entities = content.split('%%');
        let parser = new RegistryParser();

        this.languages = {};
        this.extLanguages = {};
        this.scripts = {};
        this.regions = {};

        entities.forEach(entity => {
            languageMeta = parser.parse(entity);

            if (languageMeta !== null) {
                switch (languageMeta.type) {
                    case LanguageTags.LANGUAGE:
                        this.languages[languageMeta.subtag] = languageMeta;
                        break;
                    case LanguageTags.EXT_LANG:
                        this.extLanguages[languageMeta.subtag] = languageMeta;
                        break;
                    case LanguageTags.SCRIPT:
                        this.scripts[languageMeta.subtag] = languageMeta;
                        break;
                    case LanguageTags.REGION:
                        this.regions[languageMeta.subtag] = languageMeta;
                        break;
                }
            }
        });
    }
}

module.exports = LanguageRegistry;
