/// <reference types="gulp" />
import { Gulp } from 'gulp';
import { IAssertDist, IAsserts, ITaskInfo, PipeTask, Pipe, TransformSource, ITaskContext } from 'development-core';
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
export declare class TsCompile extends PipeTask {
    constructor(info: ITaskInfo);
    getInfo(): ITaskInfo;
    tsPipes(ctx: ITaskContext, dist: IAssertDist, gulp?: Gulp): Pipe[];
    source(ctx: ITaskContext, dist: IAssertDist, gulp: Gulp): TransformSource | Promise<TransformSource>;
    pipes(ctx: ITaskContext, dist: IAssertDist, gulp?: Gulp): Pipe[];
    private getTsProject(ctx);
}
