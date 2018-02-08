'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _isObject = require('lodash/isObject');

var _isObject2 = _interopRequireDefault(_isObject);

var _isArray = require('lodash/isArray');

var _isArray2 = _interopRequireDefault(_isArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getWebpackEntries = function getWebpackEntries(webpackEntry, webpackEntries) {
    if (webpackEntry === null && webpackEntries === null) {
        return null;
    }
    var entry = webpackEntry;
    var entries = {};
    if (entry !== null) {
        entries = {
            main: entry
        };
    } else {
        entries = webpackEntries;
    }
    if (entries && !(0, _isObject2.default)(entries)) {
        var newEntries = {};
        if (!(0, _isArray2.default)(entries)) {
            entries = entries.length ? [entries] : [];
        }
        entries.forEach(function (it) {
            var entryParts = it.split(',');
            newEntries[entryParts[0]] = entryParts.slice(1);
        });
        entries = newEntries;
    }
    return entries;
};

exports.default = getWebpackEntries;