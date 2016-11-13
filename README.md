# packaged development-assert-ts

This repo is for distribution on `npm`. The source for this module is in the
[main repo](https://github.com/zhouhoujun/development-assert-ts/src/mastert).
Please file issues and pull requests against that repo.
This package use to develop kit for typescript node project development via gulp tasks.

## Install

You can install this package either with `npm`.

### npm

```shell

npm install development-assert-ts

```

You can `import` modules:

## import module

```ts
import * as gulp from 'gulp';
import  { Development } from 'development-tool';
import { INodeTaskOption } from 'development-tool-web';
import 'development-assert-ts';

```

## Create development tool

```ts
Development.create(gulp, __dirname, {
    tasks:[
        <INodeTaskOption>{
            src: 'src',
            //testSrc: '...',
            //e2eSrc: '...',
            //watchSrc: '...'
            dist: 'lib',
            // buildDist:'build path',
            // releaseDist: 'release path',
            // depolyDist: 'depoly path'
            asserts:{
                ts: {
                    //src: '...',
                    //dist:'...',
                    loader: {
                        module:'development-assert-ts',
                        // add pipe works for module tasks.
                        pipe(stream, ctx, dist, gulp){ ... }
                        pipes: Pipe[] | (ctx, dist, gulp)=> Pipe[],
                        output: OutputPipe[] | (stream, ctx, dist, gulp)=> OutputPipe[]
                    },
                    //also can add pipe works here.
                    pipe(stream, ctx, dist, gulp){ ... }
                    pipes: Pipe[] | (ctx, dist, gulp)=> Pipe[],
                    output: OutputPipe[] | (stream, ctx, dist, gulp)=> OutputPipe[]
                },
                json: 'src/**/*.json',
                css:'src/common/**/*.css',
                moduleBcss: ['src/moduleB/**/*.css'],
                moduleAcss: {
                    src: ['src/apath/**/*.css', 'src/bpath/**/*.css'],
                    dist:'dist path',
                    buildDist:'buildDist path',
                    releaseDist: 'release Distpath',
                    depolyDist: 'depoly Distpath'
                },
                ...
            },
            loader: 'development-tool-web'
        }
    ]
});
```


https://github.com/zhouhoujun/development-assert-ts.git

## Documentation

Documentation is available on the
[development-assert-ts docs site](https://github.com/zhouhoujun/development-assert-ts).

## License

MIT © [Houjun](https://github.com/zhouhoujun/)