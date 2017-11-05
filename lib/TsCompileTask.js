"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var development_core_1 = require("development-core");
var _ = require("lodash");
// import * as chalk from 'chalk';
var cache = require('gulp-cached');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var TsCompile = (function (_super) {
    __extends(TsCompile, _super);
    function TsCompile(info) {
        return _super.call(this, info) || this;
    }
    TsCompile.prototype.getInfo = function () {
        this.info.name = this.info.name || 'tscompile';
        return this.info;
    };
    TsCompile.prototype.tsPipes = function (ctx, dist, gulp) {
        var _this = this;
        var option = ctx.option;
        var pipes = [
            function (ctx) { return cache('typescript'); },
            function (ctx) { return sourcemaps.init(); }
        ];
        var tsps = ctx.to(option.tsPipes);
        if (tsps && tsps.length > 0) {
            pipes = pipes.concat(tsps);
        }
        pipes.push(function (ctx) { return _this.getTsProject(ctx); });
        return pipes;
    };
    TsCompile.prototype.source = function (ctx, dist, gulp) {
        var info = this.getInfo();
        var source = gulp.src(ctx.getSrc(info));
        var option = ctx.option;
        return this.pipes2Promise(source, ctx, dist, gulp, this.tsPipes(ctx, dist, gulp))
            .then(function (stream) {
            var hastds = ctx.to(option.withTDS);
            if (_.isUndefined(hastds) || _.isNull(hastds)) {
                hastds = (ctx.oper & development_core_1.Operation.release) > 0;
            }
            if (hastds === false) {
                return stream.js;
            }
            else {
                return [
                    stream.js,
                    _.extend(stream.dts, { nonePipe: true })
                ];
            }
        });
    };
    TsCompile.prototype.pipes = function (ctx, dist, gulp) {
        var option = ctx.option;
        var pipes = [];
        if (option.uglify) {
            pipes.splice(0, 0, {
                oper: development_core_1.Operation.deploy | development_core_1.Operation.release,
                toTransform: function (ctx) {
                    var uglifycfg = ctx.to(option.uglify);
                    return _.isBoolean(uglifycfg) ? uglify() : uglify(uglifycfg);
                }
            });
        }
        pipes = pipes.concat(_super.prototype.pipes.call(this, ctx, dist, gulp));
        var smap = ctx.to(option.sourceMaps);
        if (smap !== false) {
            var mappath_1 = (_.isBoolean(smap) || !smap) ? './sourcemaps' : smap;
            pipes.push(function (ctx) { return sourcemaps.write(mappath_1); });
        }
        return pipes;
    };
    TsCompile.prototype.getTsProject = function (ctx) {
        var option = ctx.option;
        if (option.tsconfig) {
            return ts(ctx.to(option.tsconfig));
        }
        else {
            var tsProject = ts.createProject(path.join(ctx.getRootPath() || '', ctx.to(option.tsconfigFile) || './tsconfig.json'));
            return tsProject();
        }
    };
    TsCompile = __decorate([
        development_core_1.task({
            oper: development_core_1.Operation.default | development_core_1.Operation.autoWatch
        }),
        __metadata("design:paramtypes", [Object])
    ], TsCompile);
    return TsCompile;
}(development_core_1.PipeTask));
exports.TsCompile = TsCompile;

//# sourceMappingURL=sourcemaps/TsCompileTask.js.map
