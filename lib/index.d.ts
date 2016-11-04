import { IDynamicTaskOption, IDynamicTasks } from 'development-core';
export interface ITsTaskOption {
    tsconfigFile?: string;
    tsconfig?: any;
    babelOption: any;
    sourceMaps: string;
}
export declare class TsTasks implements IDynamicTasks {
    tasks(): IDynamicTaskOption[];
    private getTsProject(config);
}
