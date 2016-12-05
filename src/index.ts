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
const babel = require('gulp-babel');


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
     * babel 6 option.
     * 
     * @type {*}
     * @memberOf ITsTaskOption
     */
    babelOption: any;

    /**
     * sourceMaps path.
     * 
     * @type {string}
     * @memberOf ITsTaskOption
     */
    sourceMaps?: string;
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

    source(ctx: ITaskContext, dist: IAssertDist, gulp: Gulp): TransformSource | Promise<TransformSource> {
        let info = this.getInfo();
        let source = gulp.src(ctx.getSrc(info))
            .pipe(cache('typescript'))
            .pipe(sourcemaps.init())
            .pipe(this.getTsProject(ctx));

        if (ctx.oper & Operation.build) {
            return source['js'];
        } else {
            return [
                source['js'],
                _.extend(source['dts'], <IOperate>{ nonePipe: true })
            ]
        }

    }

    pipes(ctx: ITaskContext, dist: IAssertDist, gulp?: Gulp): Pipe[] {
        let option = <ITsTaskOption>ctx.option;
        let pipes: Pipe[] = [
            (ctx) => babel(option.babelOption || { presets: ['es2015'] }),
            (ctx) => sourcemaps.write(option.sourceMaps || './sourcemaps')
        ];

        if (_.isUndefined(option.uglify)) {
            option.uglify = true;
        }
        if (option.uglify) {
            pipes.splice(1, 0, {
                oper: Operation.deploy | Operation.release,
                toTransform: (ctx) => _.isBoolean(option.uglify) ? uglify() : uglify(option.uglify)
            });
        }
        return pipes;
    }

    private getTsProject(ctx: ITaskContext): ITransform {
        let option = <ITsTaskOption>ctx.option;
        if (option.tsconfig) {
            return ts(option.tsconfig);
        } else {
            let tsProject = ts.createProject(path.join(ctx.env.root || '', option.tsconfigFile || './tsconfig.json'));
            return tsProject();
        }
    }
}
