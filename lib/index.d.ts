/// <reference types="gulp" />
import { Gulp } from 'gulp';
import { IAssertDist, IAsserts, ITaskInfo, PipeTask, Pipe, CtxType, TransformSource, ITaskContext } from 'development-core';
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
     * @type {CtxType<string>}
     * @memberOf ITsTaskOption
     */
    tsconfigFile?: CtxType<string>;
    /**
     * ts compile ctx.
     *
     * @type {CtxType<any>}
     * @memberof ITsTaskOption
     */
    tsconfig?: CtxType<any>;
    /**
     * zip compile js.
     *
     * @type {CtxType<boolean | Object>}
     * @memberOf ITsTaskOption
     */
    uglify?: CtxType<boolean | Object>;
    /**
     * ts pipes tasks.
     */
    tsPipes: CtxType<Pipe[]>;
    /**
     * sourceMaps path.
     *
     * @type {boolean}
     * @memberOf ITsTaskOption
     */
    sourceMaps?: CtxType<string | boolean>;
    /**
     * compile .tds define file.
     */
    withTDS?: CtxType<boolean>;
}
export declare class TsCompile extends PipeTask {
    constructor(info: ITaskInfo);
    getInfo(): ITaskInfo;
    tsPipes(ctx: ITaskContext, dist: IAssertDist, gulp?: Gulp): Pipe[];
    source(ctx: ITaskContext, dist: IAssertDist, gulp: Gulp): TransformSource | Promise<TransformSource>;
    pipes(ctx: ITaskContext, dist: IAssertDist, gulp?: Gulp): Pipe[];
    private getTsProject(ctx);
}
