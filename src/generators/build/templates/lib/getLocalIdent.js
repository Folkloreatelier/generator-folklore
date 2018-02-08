const path = require('path');

const getLocalIdent = (context, localIdentName, localeName) => {
    const filePath = context.resourcePath;
    const directories = path.dirname(filePath).split('/');
    const dir = directories[directories.length - 1];
    const basename = path.basename(filePath, '.scss');
    const name = dir !== 'styles' ? `${dir}-${basename}` : basename;
    return localIdentName.replace(/\[\s*name\s*\]/gi, name)
        .replace(/\[\s*local\s*\]/gi, localeName);
};

module.exports = getLocalIdent;
