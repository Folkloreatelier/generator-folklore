'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _generator = require('../../lib/generator');

var _generator2 = _interopRequireDefault(_generator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function (_Generator) {
    _inherits(ScssGenerator, _Generator);

    function ScssGenerator() {
        var _ref;

        _classCallCheck(this, ScssGenerator);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_ref = ScssGenerator.__proto__ || Object.getPrototypeOf(ScssGenerator)).call.apply(_ref, [this].concat(args)));

        _this.argument('project_name', {
            type: String,
            required: false
        });

        _this.option('project-path', {
            type: String,
            defaults: './'
        });

        _this.option('path', {
            type: String,
            defaults: 'src/scss'
        });
        return _this;
    }

    _createClass(ScssGenerator, [{
        key: 'prompting',
        get: function get() {
            return {
                welcome: function welcome() {
                    if (this.options.quiet) {
                        return;
                    }
                    console.log(_chalk2.default);
                    console.log(_chalk2.default.yellow('\n----------------------'));
                    console.log('SCSS Generator');
                    console.log(_chalk2.default.yellow('----------------------\n'));
                },
                prompts: function prompts() {
                    var _this2 = this;

                    var prompts = [];

                    if (!this.project_name) {
                        prompts.push(_generator2.default.prompts.project_name);
                    }

                    if (!prompts.length) {
                        return null;
                    }

                    return this.prompt(prompts).then(function (answers) {
                        if (answers.project_name) {
                            _this2.project_name = answers.project_name;
                        }
                    });
                }
            };
        }
    }, {
        key: 'writing',
        get: function get() {
            return {
                directory: function directory() {
                    var srcPath = this.templatePath('src');
                    var destPath = this.destinationPath(_lodash2.default.get(this.options, 'path'));
                    this.directory(srcPath, destPath);
                },
                sasslint: function sasslint() {
                    var srcPath = this.templatePath('sass-lint.yml');
                    var destPath = this.destinationPath('.sass-lint.yml');
                    this.fs.copy(srcPath, destPath);
                }
            };
        }
    }]);

    return ScssGenerator;
}(_generator2.default);