import * as gulp from 'gulp';
import { bindingConfig, runTaskSequence, IEnvOption, Operation } from 'development-core';
import * as mocha from 'gulp-mocha';
import * as minimist from 'minimist';
import * as path from 'path';

const del = require('del');

gulp.task('build', () => {
    var options: IEnvOption = minimist(process.argv.slice(2), {
        string: 'env',
        default: { env: process.env.NODE_ENV || 'development' }
    });
    return createTask(options);
});

let createTask = (env) => {
    let config = bindingConfig({
        env: env,
        option: { src: 'src/**/*.ts', buildDist: 'build', dist: 'lib' }
    });

    let tasks = config.generateTask([
        {
            name: 'test', src: 'test/**/*spec.ts', order: 1,
            oper: Operation.test | Operation.default,
            pipes: [mocha],
            output: null
        },
        { name: 'clean', order: 0, src: 'src', dist: 'lib', task: (config) => del(config.getDist()) }
    ]);

    return config.findTasksInDir(path.join(__dirname, './src')).then(ts => {
        console.log(ts);
        return runTaskSequence(gulp, tasks.concat(ts), config);
    });
}
