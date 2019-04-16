const fs = require('fs');
const path = require('path');
const os = require('os');

// Validator
const Validator = require('jsonschema').Validator;
const validator = new Validator();

// Settings Schema
const settingsSchema = require('../../../../config/settings.schema');

// Settings name
const settingsFileName = 'settings.json';

/**
 * Load settings from file or by error use the defaults
 * @returns {string}
 */
const userSettings = (() => {
    let settings;

    try {

        // Load path
        const settingsFile = path.resolve(os.homedir(), '.candy/', settingsFileName);

        // Load file and parse json
        settings = JSON.parse(fs.readFileSync(settingsFile, 'utf8'));
    } catch (e) {

        // By a error load the default settings
        settings = require('../../../../config/settings.default.json');

        // Resolve static paths
        settings.downloadDirectory = path.resolve(os.homedir(), 'Downloads');
        settings.temporaryDirectory = path.resolve(os.tmpdir(), 'candy');
    }

    // Re-create folders if missing
    const mkdirIfNotPresent = v => [!fs.existsSync(v) && fs.mkdirSync(v), v][1];
    const {downloadDirectory, temporaryDirectory} = settings;

    Object.defineProperties(settings, {
        downloadDirectory: {
            get: () => mkdirIfNotPresent(downloadDirectory)
        },

        temporaryDirectory: {
            get: () => mkdirIfNotPresent(temporaryDirectory)
        }
    });

    return settings;
})();

module.exports = {

    async getSettings() {
        return userSettings;
    },

    /**
     * Update settings
     * @param settings Overwrite settings
     * @returns {Promise<*>}
     */
    async applySettings(settings = {}) {

        // Valid object
        const validResult = validator.validate(settings, settingsSchema);

        // If object valid
        if (validResult.errors.length === 0) {

            try {

                // Load path
                const settingsPath = path.resolve(os.homedir(), '.candy');
                const settingFile = path.resolve(settingsPath, settingsFileName);

                // If path no exits
                if (!fs.existsSync(settingsPath)) {

                    // Create path
                    fs.mkdirSync(settingsPath, {recursive: true});
                }

                // Overwrite the new properties
                for (const [key, value] of Object.entries(settings)) {
                    userSettings[key] = value;
                }

                // Create file and write the setting in this
                fs.writeFileSync(settingFile, JSON.stringify(userSettings, null, 4));

                // Return result no errors
                return [];
            } catch (e) {

                // Return error message
                return [{
                    errorMsg: 'Can not save settings.',
                    validationError: e
                }];
            }
        }

        const result = [];

        // Get each error
        for (const error of validResult.errors) {

            // Add errors to the result
            result.push({
                errorMsg: 'Input values are not correct.',
                validationError: error.property
            });
        }

        // Return error result
        return result;
    }
};

