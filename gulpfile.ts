import * as gulp from 'gulp';
import { createContext, runTaskSequence, IEnvOption, Operation } from 'development-core';
import * as mocha from 'gulp-mocha';
import * as minimist from 'minimist';
import * as path from 'path';

const del = require('del');

gulp.task('start', () => {
    let env: IEnvOption = minimist(process.argv.slice(2), {
        string: 'env',
        default: { env: process.env.NODE_ENV || 'development' }
    }) as IEnvOption;
    env.root = __dirname;
    return createTask(env);
});

let createTask = (env: IEnvOption) => {
    let ctx = createContext({
        env: env,
        option: { src: 'src/**/*.ts', buildDist: 'build', dist: 'lib' }
    });

    let tasks = ctx.generateTask([
        {
            name: 'test', src: 'test/**/*spec.ts', order: (c) => 1 / c,
            oper: Operation.test | Operation.default,
            pipes: [() => mocha()],
            output: null
        },
        { name: 'clean', order: 0, src: 'src', dist: 'lib', task: (config) => del(config.getDist()) }
    ]);

    return ctx.findTasksInDir(path.join(__dirname, './src')).then(ts => {
        // console.log(ts);
        // return runTaskSequence(gulp, tasks.concat(ts), ctx);
        return ctx.run();
    });
}
