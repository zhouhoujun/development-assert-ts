import * as path from 'path';
import { IDynamicTaskOption, Operation, ITaskContext, OutputPipe, IDynamicTasks, dynamicTask, ITransform } from 'development-core';
// import * as chalk from 'chalk';
const cache = require('gulp-cached');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');


/**
 * typescript task option.
 * 
 * @export
 * @interface ITsTaskOption
 */
export interface ITsTaskOption {
    /**
     * ts tsctx.json file path.
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
    sourceMaps: string;
}

@dynamicTask
export class TsTasks implements IDynamicTasks {

    tasks(): IDynamicTaskOption[] {
        return [
            {
                name: 'tscompile',
                oper: Operation.build,
                pipes: [
                    () => cache('typescript'),
                    () => sourcemaps.init(),
                    (ctx) => {
                        let transform = this.getTsProject(ctx);
                        transform.transformSourcePipe = (source) => source.pipe(transform)['js'];
                        return transform;
                    },
                    (ctx) => babel((<ITsTaskOption>ctx.option).babelOption || { presets: ['es2015'] }),
                    (ctx) => sourcemaps.write((<ITsTaskOption>ctx.option).sourceMaps || './sourcemaps')
                ]
            },
            {
                name: 'tscompile',
                oper: Operation.release | Operation.deploy,
                pipes: [
                    () => cache('typescript'),
                    () => sourcemaps.init(),
                    (ctx) => this.getTsProject(ctx)
                ],
                output: <OutputPipe[]>[
                    (tsmap, ctx, dt, gulp) => tsmap['dts'].pipe(gulp.dest(ctx.getDist(dt))),
                    (tsmap, ctx, dt, gulp) => tsmap['js'].pipe(babel((<ITsTaskOption>ctx.option).babelOption || { presets: ['es2015'] }))
                        .pipe(uglify()).pipe(sourcemaps.write((<ITsTaskOption>ctx.option).sourceMaps || './sourcemaps'))
                        .pipe(gulp.dest(ctx.getDist(dt)))
                ]
            },
            {
                name: 'tswatch',
                oper: Operation.build,
                watchTasks: ['tscompile']
            }
        ];
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
