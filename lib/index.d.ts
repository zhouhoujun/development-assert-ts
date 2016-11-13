import { IDynamicTaskOption, IDynamicTasks } from 'development-core';
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
export declare class TsTasks implements IDynamicTasks {
    tasks(): IDynamicTaskOption[];
    private getTsProject(ctx);
}
