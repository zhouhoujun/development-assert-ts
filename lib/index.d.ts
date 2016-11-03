import { IDynamicTask, IDynamicTasks } from 'development-core';
export interface ITsTaskOption {
    tsconfigFile?: string;
    tsconfig?: any;
    babelOption: any;
    sourceMaps: string;
}
export declare class TsTasks implements IDynamicTasks {
    tasks(): IDynamicTask[];
    private getTsProject(config);
}
