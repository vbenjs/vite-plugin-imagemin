# vite-plugin-imagemin

**English** | [中文](./README.zh_CN.md)

[![npm][npm-img]][npm-url] [![node][node-img]][node-url]

A vite plugin for compressing image assets

## Install (yarn or npm)

**node version:** >=12.0.0

**vite version:** >=2.0.0

```
yarn add vite-plugin-imagemin -D
```

or

```
npm i vite-plugin-imagemin -D
```

### China installation note

Because imagemin is not easy to install in China. Several solutions are now available

1. Use yarn to configure in package.json (recommended)

```json
"resolutions": {
    "bin-wrapper": "npm:bin-wrapper-china"
  },

```

2. Use npm, add the following configuration to the computer host file

```bash

199.232.4.133 raw.githubusercontent.com
```

3. Install with cnpm (not recommended)

## Usage

- Configuration plugin in vite.config.ts

```ts
import viteImagemin from 'vite-plugin-imagemin';

export default () => {
  return {
    plugins: [
      viteImagemin({
        gifsicle: {
          optimizationLevel: 7,
          interlaced: false,
        },
        optipng: {
          optimizationLevel: 7,
        },
        mozjpeg: {
          quality: 20,
        },
        pngquant: {
          quality: [0.8, 0.9],
          speed: 4,
        },
        svgo: {
          plugins: [
            {
              name: 'removeViewBox',
            },
            {
              name: 'removeEmptyAttrs',
              active: false,
            },
          ],
        },
      }),
    ],
  };
};
```

### Options

| params | type | default | default |
| --- | --- | --- | --- |
| verbose | `boolean` | `true` | Whether to output the compressed result in the console |
| filter | `RegExp or (file: string) => boolean` | - | Specify which resources are not compressed |
| disable | `boolean` | `false` | Whether to disable |
| svgo | `object` or `false` | - | See [Options](https://github.com/svg/svgo/#what-it-can-do) |
| gifsicle | `object` or `false` | - | See [Options](https://github.com/imagemin/imagemin-gifsicle) |
| mozjpeg | `object` or `false` | - | See [Options](https://github.com/imagemin/imagemin-mozjpeg) |
| optipng | `object` or `false` | - | See [Options](https://github.com/imagemin/imagemin-optipng) |
| pngquant | `object` or `false` | - | See [Options](https://github.com/imagemin/imagemin-pngquant) |
| webp | `object` or `false` | - | See [Options](https://github.com/imagemin/imagemin-webp) |

## Example

**Run Example**

```bash

cd ./example

yarn install

yarn build

```

## Sample project

[Vben Admin](https://github.com/anncwb/vue-vben-admin)

## License

MIT

## Inspiration

[vite-plugin-compress](https://github.com/alloc/vite-plugin-compress)

[npm-img]: https://img.shields.io/npm/v/vite-plugin-imagemin.svg
[npm-url]: https://npmjs.com/package/vite-plugin-imagemin
[node-img]: https://img.shields.io/node/v/vite-plugin-imagemin.svg
[node-url]: https://nodejs.org/en/about/releases/
