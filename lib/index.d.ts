import { IDynamicTaskOption, IDynamicTasks } from 'development-core';
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
export declare class TsTasks implements IDynamicTasks {
    tasks(): IDynamicTaskOption[];
    private getTsProject(config);
}
