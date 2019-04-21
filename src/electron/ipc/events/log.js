const _ = require('../../../js/utils');
const path = require('path');
const fs = require('fs').promises;

const logFile = path.resolve('./logs.log');

module.exports = {

    /**
     * Logs smth
     * @param level Log level, can be 'DEBUG', 'INFO', 'WARN', 'ERROR' or 'FATAL'
     * @param text Log text
     * @returns {Promise<void>}
     */
    async log(level, text) {

        if (typeof level === 'object') {
            level = level.level;
            text = level.text;
        }

        level = level.toUpperCase();

        // Validate log level
        if (!['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'].includes(level)) {
            throw 'Unknown log level';
        }

        // Build log text
        const date = _.formatDate('[DD.MM.YYYY - HH:mm:ss]');
        const logText = `${date} (${level.toUpperCase()}) ${text}\n`;

        return fs.appendFile(logFile, logText);
    }
};
