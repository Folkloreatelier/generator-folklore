'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _generator = require('../../lib/generator');

var _generator2 = _interopRequireDefault(_generator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function (_Generator) {
    _inherits(AppGenerator, _Generator);

    // The name `constructor` is important here
    function AppGenerator() {
        var _ref;

        _classCallCheck(this, AppGenerator);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_ref = AppGenerator.__proto__ || Object.getPrototypeOf(AppGenerator)).call.apply(_ref, [this].concat(args)));

        _this.argument('project-name', {
            type: String,
            required: false
        });

        _this.argument('type', {
            type: String,
            required: false
        });
        return _this;
    }

    _createClass(AppGenerator, [{
        key: 'configuring',
        value: function configuring() {
            var composeWith = 'folklore:' + this.options.type;
            this.composeWith(composeWith, _extends({}, this.options));
        }
    }, {
        key: 'prompting',
        get: function get() {
            return {
                welcome: function welcome() {
                    if (this.options.quiet) {
                        return;
                    }

                    console.log(_chalk2.default.yellow('\n----------------------'));
                    console.log('FOLKLORE Generator');
                    console.log(_chalk2.default.yellow('----------------------\n'));
                },
                prompts: function prompts() {
                    var _this2 = this;

                    var prompts = [];

                    if (!this.options['project-name']) {
                        prompts.push(_generator2.default.prompts.project_name);
                    }

                    if (!this.options.type) {
                        prompts.push({
                            type: 'list',
                            name: 'type',
                            message: 'What type of project?',
                            choices: [{
                                name: 'HTML',
                                value: 'html'
                            }, {
                                name: 'Laravel',
                                value: 'laravel'
                            }, {
                                name: 'Javascript',
                                value: 'js'
                            }, {
                                name: 'NPM Package',
                                value: 'npm-package'
                            }, {
                                name: 'React Package',
                                value: 'react-package'
                            }]
                        });
                    }

                    if (!prompts.length) {
                        return null;
                    }

                    return this.prompt(prompts).then(function (answers) {
                        if (answers.type) {
                            _this2.options.type = answers.type;
                        }

                        if (answers['project-name']) {
                            _this2.options['project-name'] = answers['project-name'];
                        }
                    });
                }
            };
        }
    }]);

    return AppGenerator;
}(_generator2.default);