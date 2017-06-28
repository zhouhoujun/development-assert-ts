import 'mocha';
import { expect } from 'chai';
import * as minimist from 'minimist';
import { Operation, IEnvOption, createContext, ITaskContext } from 'development-core';
import * as _ from 'lodash';
import * as path from 'path';
import * as fs from 'fs';

let root = path.dirname(__dirname);
const del = require('del');

describe('ts', function () {

    this.timeout(60000 * 10);

    let ctx: ITaskContext;
    before(async () => {
        ctx = createContext({
            env: { root: root},
            oper: Operation.build,
            option: { name: 'test1', src: 'test/src/*.ts', dist: 'test/dist1' }
        });
        await del(path.join(root, './test/dist1'));
        await del(path.join(root, './test/dist2'));
    });

    after(async () => {
        await del(path.join(root, './test/dist1'));
        await del(path.join(root, './test/dist2'));
    });


    // it('build complile test', async () => {
    //     // await del(ctx.getDist());
    //     // let ctx = createContext({
    //     //     env: { root: root},
    //     //     oper: Operation.build,
    //     //     option: { name: 'test1', src: 'src/*.ts', dist: 'dist1' }
    //     // });
    //     await ctx.findTasksInDir(path.join(root, '../src'))
    //         .then(() => {
    //             return ctx.run();
    //         });
    //     expect(fs.existsSync(path.join(ctx.getDist(), './index.js'))).true;
    //     expect(fs.existsSync(path.join(ctx.getDist(), './index.d.ts'))).false;
    // });

    it('release complile test', async () => {
        // let ctx2 = createContext({
        //     env: { root: root},
        //     oper: Operation.release,
        //     option: { name: 'test2', src: 'src/*.ts', dist: 'dist2' }
        // });
        ctx.setConfig({
            oper: Operation.release,
            option: { name: 'test2', src: 'test/src/*.ts', dist: 'test/dist2' }
        })
        await ctx.findTasksInDir(path.join(root, './src'))
            .then(() => {
                return ctx.run();
            });
        expect(fs.existsSync(path.join(ctx.getDist(), './index.js'))).true;
        expect(fs.existsSync(path.join(ctx.getDist(), './index.d.ts'))).true;
    });
});
