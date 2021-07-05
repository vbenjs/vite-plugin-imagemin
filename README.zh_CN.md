# vite-plugin-imagemin

**中文** | [English](./README.md)

[![npm][npm-img]][npm-url] [![node][node-img]][node-url]

一个压缩图片资产的 vite 插件

## 安装 (yarn or npm)

**node version:** >=12.0.0

**vite version:** >=2.0.0

```
yarn add vite-plugin-imagemin -D
```

or

```
npm i vite-plugin-imagemin -D
```

### 中国安装注意

由于 imagemin 在中国不好安装。现提供几个解决方案

1. 使用 yarn 在 package.json 内配置(推荐)

```json
"resolutions": {
    "bin-wrapper": "npm:bin-wrapper-china"
  },

```

2. 使用 npm,在电脑 host 文件加上如下配置即可

```bash

199.232.4.133 raw.githubusercontent.com
```

3. 使用 cnpm 安装(不推荐)

## 使用

- vite.config.ts 中的配置插件

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

### 配置说明

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| verbose | `boolean` | `true` | 是否在控制台输出压缩结果 |
| filter | `RegExp or (file: string) => boolean` | - | 指定哪些资源不压缩 |
| disable | `boolean` | `false` | 是否禁用 |
| svgo | `object` or `false` | - | 见 [Options](https://github.com/svg/svgo/#what-it-can-do) |
| gifsicle | `object` or `false` | - | 见 [Options](https://github.com/imagemin/imagemin-gifsicle) |
| mozjpeg | `object` or `false` | - | 见 [Options](https://github.com/imagemin/imagemin-mozjpeg) |
| optipng | `object` or `false` | - | 见 [Options](https://github.com/imagemin/imagemin-optipng) |
| pngquant | `object` or `false` | - | 见 [Options](https://github.com/imagemin/imagemin-pngquant) |
| webp | `object` or `false` | - | 见 [Options](https://github.com/imagemin/imagemin-webp) |

## 示例

**运行示例**

```bash

cd ./example

yarn install

yarn build

```

## 示例项目

[Vben Admin](https://github.com/anncwb/vue-vben-admin)

## License

MIT

## 灵感

[vite-plugin-compress](https://github.com/alloc/vite-plugin-compress)

[npm-img]: https://img.shields.io/npm/v/vite-plugin-style-import.svg
[npm-url]: https://npmjs.com/package/vite-plugin-style-import
[node-img]: https://img.shields.io/node/v/vite-plugin-style-import.svg
[node-url]: https://nodejs.org/en/about/releases/
