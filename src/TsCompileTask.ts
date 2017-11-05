import * as path from 'path';
import { Gulp } from 'gulp';
import {
    Operation, IAssertDist, IAsserts, ITaskInfo, PipeTask, IOperate, Pipe, CtxType
    , TransformSource, task, ITaskContext, ITransform
} from 'development-core';
import * as _ from 'lodash';
import { ITsTaskOption } from './TsOption';
// import * as chalk from 'chalk';
const cache = require('gulp-cached');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');



@task({
    oper: Operation.default | Operation.autoWatch
})
export class TsCompile extends PipeTask {
    constructor(info: ITaskInfo) {
        super(info)
    }

    getInfo() {
        this.info.name = this.info.name || 'tscompile';
        return this.info;
    }

    tsPipes(ctx: ITaskContext, dist: IAssertDist, gulp?: Gulp): Pipe[] {
        let option = <ITsTaskOption>ctx.option;
        let pipes: Pipe[] = [
            (ctx) => cache('typescript'),
            (ctx) => sourcemaps.init()
        ];
        let tsps = ctx.to(option.tsPipes);
        if (tsps && tsps.length > 0) {
            pipes = pipes.concat(tsps);
        }
        pipes.push((ctx) => this.getTsProject(ctx));
        return pipes;
    }

    source(ctx: ITaskContext, dist: IAssertDist, gulp: Gulp): TransformSource | Promise<TransformSource> {
        let info = this.getInfo();
        let source = gulp.src(ctx.getSrc(info));
        let option = <ITsTaskOption>ctx.option;
        return this.pipes2Promise(source, ctx, dist, gulp, this.tsPipes(ctx, dist, gulp))
            .then(stream => {
                let hastds = ctx.to(option.withTDS);

                if (_.isUndefined(hastds) || _.isNull(hastds)) {
                    hastds = (ctx.oper & Operation.release) > 0;
                }
                if (hastds === false) {
                    return stream.js;
                } else {
                    return [
                        stream.js,
                        _.extend(stream.dts, <IOperate>{ nonePipe: true })
                    ]
                }
            });

    }

    pipes(ctx: ITaskContext, dist: IAssertDist, gulp?: Gulp): Pipe[] {
        let option = <ITsTaskOption>ctx.option;
        let pipes: Pipe[] = [];

        if (option.uglify) {
            pipes.splice(0, 0, {
                oper: Operation.deploy | Operation.release,
                toTransform: (ctx) => {
                    let uglifycfg = ctx.to(option.uglify);
                    return _.isBoolean(uglifycfg) ? uglify() : uglify(uglifycfg);
                }
            });
        }
        pipes = pipes.concat(super.pipes(ctx, dist, gulp));
        let smap = ctx.to(option.sourceMaps);
        if (smap !== false) {
            let mappath = (_.isBoolean(smap) || !smap) ? './sourcemaps' : smap;
            pipes.push((ctx) => sourcemaps.write(mappath));
        }
        return pipes;
    }

    private getTsProject(ctx: ITaskContext): ITransform {
        let option = <ITsTaskOption>ctx.option;
        if (option.tsconfig) {
            return ts(ctx.to(option.tsconfig));
        } else {
            let tsProject = ts.createProject(path.join(ctx.getRootPath() || '', ctx.to(option.tsconfigFile) || './tsconfig.json'));
            return tsProject();
        }
    }
}
