/// <reference types="gulp" />
import { Gulp } from 'gulp';
import { IAssertDist, ITaskInfo, PipeTask, Pipe, TransformSource, ITaskContext } from 'development-core';
export declare class TsCompile extends PipeTask {
    constructor(info: ITaskInfo);
    getInfo(): ITaskInfo;
    tsPipes(ctx: ITaskContext, dist: IAssertDist, gulp?: Gulp): Pipe[];
    source(ctx: ITaskContext, dist: IAssertDist, gulp: Gulp): TransformSource | Promise<TransformSource>;
    pipes(ctx: ITaskContext, dist: IAssertDist, gulp?: Gulp): Pipe[];
    private getTsProject(ctx);
}
