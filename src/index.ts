import * as path from 'path';
import { IDynamicTaskOption, Operation, ITaskConfig, IDynamicTasks, dynamicTask, ITransform } from 'development-core';
// import * as chalk from 'chalk';
const cache = require('gulp-cached');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');



export interface ITsTaskOption {
    /**
     * ts tsconfig.json file path.
     * 
     * @type {sring}
     * @memberOf ITsTaskOption
     */
    tsconfigFile?: string;
    /**
     * ts compile config.
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
                oper: Operation.build | Operation.e2e | Operation.test,
                pipes: [
                    () => cache('typescript'),
                    sourcemaps.init,
                    (config) => this.getTsProject(config),
                    (config) => babel((<ITsTaskOption>config.option).babelOption || { presets: ['es2015'] }),
                    (config) => sourcemaps.write((<ITsTaskOption>config.option).sourceMaps || './sourcemaps')
                ]
            },
            {
                name: 'tscompile',
                oper: Operation.release | Operation.deploy,
                pipes: [
                    () => cache('typescript'),
                    sourcemaps.init,
                    (config) => this.getTsProject(config)
                ],
                output: [
                    (tsmap, config, dt, gulp) => tsmap.dts.pipe(gulp.dest(config.getDist(dt))),
                    (tsmap, config, dt, gulp) => tsmap.js.pipe(babel((<ITsTaskOption>config.option).babelOption || { presets: ['es2015'] }))
                        .pipe(uglify()).pipe(sourcemaps.write((<ITsTaskOption>config.option).sourceMaps || './sourcemaps'))
                        .pipe(gulp.dest(config.getDist(dt)))
                ]
            },
            {
                name: 'tswatch',
                oper: Operation.build | Operation.e2e | Operation.test,
                watchTasks: ['tscompile']
            }
        ];
    }

    private getTsProject(config: ITaskConfig): ITransform {
        let option = <ITsTaskOption>config.option;
        if (option.tsconfig) {
            return ts(option.tsconfig);
        } else {
            let tsProject = ts.createProject(path.join(config.env.root || '', option.tsconfigFile || './tsconfig.json'));
            return tsProject();
        }
    }
}
