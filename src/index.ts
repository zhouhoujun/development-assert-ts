import * as path from 'path';
import { Gulp } from 'gulp';
import {
    Operation, IAssertDist, IAsserts, ITaskInfo, PipeTask, IOperate, Pipe
    , TransformSource, task, ITaskContext, ITransform
} from 'development-core';
import * as _ from 'lodash';
// import * as chalk from 'chalk';
const cache = require('gulp-cached');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');


/**
 * typescript assert task option.
 *
 * @export
 * @interface ITsTaskOption
 * @extends {IAsserts}
 */
export interface ITsTaskOption extends IAsserts {
    /**
     * ts tsconfig.json file path.
     *
     * @type {sring}
     * @memberOf ITsTaskOption
     */
    tsconfigFile?: string;
    /**
     * ts compile ctx.
     *
     * @type {*}
     * @memberOf ITsTaskOption
     */
    tsconfig?: any;

    /**
     * zip compile js.
     *
     * @type {(boolean | Object)}
     * @memberOf ITsTaskOption
     */
    uglify?: boolean | Object;

    /**
     * ts pipes tasks.
     */
    tsPipes: Pipe[];

    /**
     * babel 6 option.
     *
     * @type {*}
     * @memberOf ITsTaskOption
     */
    babelOption: any;

    /**
     * sourceMaps path.
     *
     * @type {boolean}
     * @memberOf ITsTaskOption
     */
    sourceMaps?: string | boolean;

    /**
     * compile .tds define file.
     */
    withTDS?: boolean;
}


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
        if (option.tsPipes && option.tsPipes.length > 0) {
            pipes = pipes.concat(option.tsPipes);
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
                if (option.withTDS === false || (ctx.oper & Operation.build)) {
                    return stream['js'];
                } else {
                    return [
                        stream['js'],
                        _.extend(stream['dts'], <IOperate>{ nonePipe: true })
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
                toTransform: (ctx) => _.isBoolean(option.uglify) ? uglify() : uglify(option.uglify)
            });
        }
        pipes = pipes.concat(super.pipes(ctx, dist, gulp));
        if (option.sourceMaps !== false) {
            let mappath = (_.isBoolean(option.sourceMaps) || !option.sourceMaps) ? './sourcemaps' : option.sourceMaps;
            pipes.push((ctx) => sourcemaps.write(mappath));
        }
        return pipes;
    }

    private getTsProject(ctx: ITaskContext): ITransform {
        let option = <ITsTaskOption>ctx.option;
        if (option.tsconfig) {
            return ts(option.tsconfig);
        } else {
            let tsProject = ts.createProject(path.join(ctx.getRootPath() || '', option.tsconfigFile || './tsconfig.json'));
            return tsProject();
        }
    }
}
