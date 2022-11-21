# vite-plugin-imagemin-lts

**English** | [中文](./README.zh_CN.md)

[![npm][npm-img]][npm-url] [![node][node-img]][node-url]

A vite plugin for compressing image assets

Forked from [vite-plugin-imagemin](https://github.com/vbenjs/vite-plugin-imagemin) with long-time-support.

## Install (yarn or npm)

**node version:** >=12.0.0

**vite version:** >=2.0.0

```
yarn add vite-plugin-imagemin-lts -D
```

or

```
npm i vite-plugin-imagemin-lts -D
```

## Usage

- Configuration plugin in vite.config.ts

```ts
import viteImagemin from 'vite-plugin-imagemin-lts'

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
  }
}
```

### Options

| params   | type                                  | default | default                                                      |
| -------- | ------------------------------------- | ------- | ------------------------------------------------------------ |
| verbose  | `boolean`                             | `true`  | Whether to output the compressed result in the console       |
| filter   | `RegExp or (file: string) => boolean` | -       | Specify which resources are not compressed                   |
| disable  | `boolean`                             | `false` | Whether to disable                                           |
| skipLargerFile  | `boolean`                             | `false` | Whether to skip larger processed file (while remainting the raw file)                                    |
| svgo     | `object` or `false`                   | -       | See [Options](https://github.com/svg/svgo/#what-it-can-do)   |
| gifsicle | `object` or `false`                   | -       | See [Options](https://github.com/imagemin/imagemin-gifsicle) |
| mozjpeg  | `object` or `false`                   | -       | See [Options](https://github.com/imagemin/imagemin-mozjpeg)  |
| optipng  | `object` or `false`                   | -       | See [Options](https://github.com/imagemin/imagemin-optipng)  |
| pngquant | `object` or `false`                   | -       | See [Options](https://github.com/imagemin/imagemin-pngquant) |
| webp     | `object` or `false`                   | -       | See [Options](https://github.com/imagemin/imagemin-webp)     |

## Develop

### Install packages

```
cd packages/core && yarn install
```

### Build

```
cd packages/core && yarn build
```