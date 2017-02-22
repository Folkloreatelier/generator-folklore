const path = require('path');

export default (env) => {
    const configPath = path.join(__dirname, `./webpack.config.${env}.js`);
    return require(configPath)(env);
};
