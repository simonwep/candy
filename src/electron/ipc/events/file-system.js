const {dialog} = require('electron');

module.exports = {

    async chooseFolder() {
        return dialog.showOpenDialog({
            properties: ['openDirectory']
        }).then(({canceled, filePaths}) => {
            return canceled ? null :
                filePaths.length ? filePaths[0] : null;
        }).catch(() => null);
    }
};
