import path from 'path';

module.exports = (env) => {
    const createConfig = require(path.join(__dirname, `./webpack.config.${env}`));
    return createConfig(env);
};
