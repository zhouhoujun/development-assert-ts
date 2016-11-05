"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = undefined && undefined.__metadata || function (k, v) {
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var path = require('path');
var development_core_1 = require('development-core');
// import * as chalk from 'chalk';
var cache = require('gulp-cached');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var TsTasks = function () {
    function TsTasks() {
        _classCallCheck(this, TsTasks);
    }

    _createClass(TsTasks, [{
        key: "tasks",
        value: function tasks() {
            var _this = this;

            return [{
                name: 'tscompile',
                oper: development_core_1.Operation.build | development_core_1.Operation.e2e | development_core_1.Operation.test,
                pipes: [function () {
                    return cache('typescript');
                }, sourcemaps.init, function (config) {
                    var transform = _this.getTsProject(config);
                    transform.transformSourcePipe = function (source) {
                        // console.log('transformSourcePipe: work.')
                        return source.pipe(transform)['js'];
                    };
                    return transform;
                }, function (config) {
                    return babel(config.option.babelOption || { presets: ['es2015'] });
                }, function (config) {
                    return sourcemaps.write(config.option.sourceMaps || './sourcemaps');
                }]
            }, {
                name: 'tscompile',
                oper: development_core_1.Operation.release | development_core_1.Operation.deploy,
                pipes: [function () {
                    return cache('typescript');
                }, sourcemaps.init, function (config) {
                    return _this.getTsProject(config);
                }],
                output: [function (tsmap, config, dt, gulp) {
                    return tsmap.dts.pipe(gulp.dest(config.getDist(dt)));
                }, function (tsmap, config, dt, gulp) {
                    return tsmap.js.pipe(babel(config.option.babelOption || { presets: ['es2015'] })).pipe(uglify()).pipe(sourcemaps.write(config.option.sourceMaps || './sourcemaps')).pipe(gulp.dest(config.getDist(dt)));
                }]
            }, {
                name: 'tswatch',
                oper: development_core_1.Operation.build | development_core_1.Operation.e2e | development_core_1.Operation.test,
                watchTasks: ['tscompile']
            }];
        }
    }, {
        key: "getTsProject",
        value: function getTsProject(config) {
            var option = config.option;
            if (option.tsconfig) {
                return ts(option.tsconfig);
            } else {
                var tsProject = ts.createProject(path.join(config.env.root || '', option.tsconfigFile || './tsconfig.json'));
                return tsProject();
            }
        }
    }]);

    return TsTasks;
}();
TsTasks = __decorate([development_core_1.dynamicTask, __metadata('design:paramtypes', [])], TsTasks);
exports.TsTasks = TsTasks;
//# sourceMappingURL=sourcemaps/index.js.map
