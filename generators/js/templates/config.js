'use strict';

function getConfig(obj, str)
{
    return str.split('.').reduce(function(o, x) { return o[x]; }, obj);
}

function setConfig(obj, str, val)
{
    str = str.split('.');
    var currStr;
    while (str.length > 1)
    {
        currStr = str.shift();
        if(!obj[currStr])
        {
            obj[currStr] = {};
        }
        obj = obj[currStr];
    }
    var ret = obj[str.shift()] = val;
    return ret;
}

if (!Array.prototype.reduce)
{
    Array.prototype.reduce = function(callback /*, initialValue*/) {
        if (this === null) {
            throw new TypeError('Array.prototype.reduce called on null or undefined');
        }
        if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
        }
        var t = Object(this);
        var len = t.length >>> 0;
        var k = 0;
        var value;
        if (arguments.length === 2) {
            value = arguments[1];
        } else {
            while (k < len && !(k in t)) {
                k++; 
            }
            if (k >= len) {
                throw new TypeError('Reduce of empty array with no initial value');
            }
            value = t[k++];
        }
        for (; k < len; k++) {
            if (k in t) {
                value = callback(value, t[k], k, t);
            }
        }
        return value;
    };
}

var config = {};

module.exports = function(key, value)
{
    if(typeof(value) !== 'undefined')
    {
        return setConfig(config, key, value);
    }
    else if(typeof(key) === 'undefined')
    {
        return config;
    }
    
    return getConfig(config, key);
};
