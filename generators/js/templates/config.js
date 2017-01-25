class Config {

    constructor(config) {
        this.config = config || {};
    }

    get(str) {
        if (typeof str === 'undefined') {
            return this.config;
        }
        return str.split('.').reduce((o, x) => o[x], this.config);
    }

    set(str, val) {
        const strArray = str.split('.');
        let newConfig = Object.assign({}, this.config);
        let currStr;
        while (strArray.length > 1) {
            currStr = strArray.shift();
            if (!newConfig[currStr]) {
                newConfig[currStr] = {};
            }
            newConfig = typeof this.config[currStr] === 'string' ? {
                default: this.config[currStr],
            } : Object.assign({}, this.config[currStr]);
        }
        newConfig[strArray.shift()] = val;
        this.config = newConfig;
        return newConfig;
    }
}

const config = new Config();

const configFunc = (key, value) => {
    if (typeof value !== 'undefined') {
        return config.set(key, value);
    } else if (typeof key === 'undefined') {
        return config.get();
    }
    return config.get(key);
};
configFunc.Config = Config;

module.exports = configFunc;
