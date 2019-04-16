const {remote} = require("electron");
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

module.exports = {

    /**
     * Update settings
     * @param settings Overwrite settings
     * @returns {Promise<*>}
     */
    async applySettings(settings) {

        // Valid object
        const validResult = validator.validate(settings, settingsSchema);

        // If object valid
        if (validResult.errors.length === 0) {

            try {

                // Load path
                const settingsPath = path.resolve(os.homedir(), 'candy');
                const settingFile = path.resolve(settingsPath, settingsFileName);

                // If path no exits
                if (!fs.existsSync(settingsPath)) {

                    // Create path
                    fs.mkdirSync(settingsPath, {recursive: true});
                }

                // Get global settings variable
                const userSettings = remote.getGlobal('_userSettings');

                // Overwrite the new properties
                for (const [key, value] of Object.entries(settings)) {
                    userSettings[key] = value;
                }

                // Create file and write the setting in this
                fs.writeFileSync(settingFile, JSON.stringify(userSettings, null, 4));

                // Return result no errors
                return [];

                // Errors by saving
            } catch (e) {

                // Return error message
                return [{
                    errorMsg: "Can not save settings.",
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
