'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _isObject = require('lodash/isObject');

var _isObject2 = _interopRequireDefault(_isObject);

var _isArray = require('lodash/isArray');

var _isArray2 = _interopRequireDefault(_isArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tab = function tab(number) {
    return ' '.repeat(4 * number);
};
var formatWebpackEntries = function formatWebpackEntries(entries) {
    if (entries === null) {
        return null;
    }
    var lines = [];
    if ((0, _isArray2.default)(entries)) {
        lines.push('entry: [');
        entries.forEach(function (entry) {
            lines.push(tab(3) + '\'' + entry + '\',');
        });
        lines.push(tab(2) + '],');
    } else if ((0, _isObject2.default)(entries)) {
        lines.push('entry: {');
        Object.keys(entries).forEach(function (key) {
            lines.push('' + tab(3) + key + ': ' + JSON.stringify(entries[key]).replace(/"/gi, "'").replace(/','/gi, "', '") + ',');
        });
        lines.push(tab(2) + '},');
    } else {
        lines.push('entry: ' + JSON.stringify(entries, null, 4).replace(/"/gi, "'") + ',');
    }
    return lines.join('\n');
};

exports.default = formatWebpackEntries;