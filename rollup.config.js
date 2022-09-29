import babel from '@rollup/plugin-babel';

import pkg from './package.json';

export default {
    input: 'jsb.js',
    output: [
        {
            file: pkg.main,
            format: 'umd',
            name: 'jsb',
        },
        {
            file: pkg.module,
            format: 'es',
            name: 'jsb',
        },
    ],
    plugins: [
        babel({
            exclude: 'node_modules/**',
            babelHelpers: 'bundled'
        })
    ],
};
