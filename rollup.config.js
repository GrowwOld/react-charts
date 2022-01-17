import postcssImport from "postcss-import";
import postcssUrl from "postcss-url";
import babel from 'rollup-plugin-babel'
import commonJS from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import externalDeps from 'rollup-plugin-peer-deps-external'
import size from 'rollup-plugin-size'
import { terser } from 'rollup-plugin-terser'
import visualizer from 'rollup-plugin-visualizer'
import postcss from "rollup-plugin-postcss";

const external = ['react', 'react-dom']

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM'
}

const inputSrcs = [['src/index.ts', 'react-charts', 'react-charts']]

const extensions = ['.js', '.jsx', '.ts', '.tsx']
const babelConfig = { extensions, runtimeHelpers: true }
const resolveConfig = { extensions }

export default inputSrcs
  .map(([input, name, file]) => {
    return [
      {
        input: input,
        output: {
          name,
          file: `lib/${file}.min.js`,
          format: 'commonjs',
          sourcemap: true,
          globals,
        },
        external,
        plugins: [
          postcss({
            plugins: [ postcssImport(), postcssUrl({ url: 'inline' }) ],
            extract: true,
            extract: 'index.css',
            extensions: [ '.css' ]
          }),
          resolve(resolveConfig),
          babel(babelConfig),

          commonJS(),

          externalDeps(),
          terser(),
          size(),
          visualizer({
            filename: 'stats-react.json',
            json: true,
            gzipSize: true,
            brotliSize: true,
          }),
        ],
      },
    ]
  })
  .flat()
