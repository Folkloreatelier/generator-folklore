'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Generator = function (_generators$Base) {
    _inherits(Generator, _generators$Base);

    _createClass(Generator, null, [{
        key: 'getConfigPath',
        value: function getConfigPath() {
            var home = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
            return _path2.default.join(home, '.config/yeoman-generator-folklore/config.json');
        }
    }]);

    function Generator() {
        var _ref;

        _classCallCheck(this, Generator);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_ref = Generator.__proto__ || Object.getPrototypeOf(Generator)).call.apply(_ref, [this].concat(args)));

        _this.promps = {
            project_name: {
                type: 'input',
                name: 'project_name',
                message: 'What is the name of the project?'
            }
        };

        _this.option('quiet', {
            type: Boolean,
            defaults: false
        });
        return _this;
    }

    _createClass(Generator, [{
        key: 'getConfig',
        value: function getConfig() {
            var configPath = Generator.getConfigPath();
            return this.fs.exists(configPath) ? this.fs.readJSON(configPath) : {};
        }
    }, {
        key: 'updateConfig',
        value: function updateConfig(data, force) {
            var forceUpdate = force || false;

            var config = _immutable2.default.fromJS(this.getConfig());
            var newConfig = Object.assign({}, config);
            _lodash2.default.each(data, function (value, key) {
                if (forceUpdate || value && value.length && value !== _lodash2.default.get(config, key)) {
                    newConfig = newConfig.set(key, value);
                }
            });

            var newData = newConfig.toJS();

            if (config !== newConfig) {
                var configPath = Generator.getConfigPath();
                this.fs.writeJSON(configPath, newData);
            }

            return newData;
        }
    }]);

    return Generator;
}(_yeomanGenerator2.default.Base);

exports.default = Generator;