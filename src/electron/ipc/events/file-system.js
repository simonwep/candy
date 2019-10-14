const {dialog} = require('electron');

module.exports = {

    async chooseFolder() {
        const result = dialog.showOpenDialog({
            properties: ['openDirectory']
        });

        return result && result[0] || null;
    }
};
