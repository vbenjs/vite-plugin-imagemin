import type { Plugin, ResolvedConfig } from 'vite';
import type { VitePluginImageMin } from './types';
import path from 'path';
import { normalizePath } from 'vite';
import { isNotFalse, isBoolean, isRegExp, isFunction } from './utils';
import chalk from 'chalk';
import { debug as Debug } from 'debug';

import imagemin from 'imagemin';
import imageminGif from 'imagemin-gifsicle';
import imageminPng from 'imagemin-pngquant';
import imageminOptPng from 'imagemin-optipng';
import imageminJpeg from 'imagemin-mozjpeg';
import imageminSvgo from 'imagemin-svgo';
import imageminWebp from 'imagemin-webp';
import imageminJpegTran from 'imagemin-jpegtran';

const debug = Debug('vite-plugin-imagemin');

const extRE = /\.(png|jpeg|gif|jpg|bmp|svg)$/i;

const exportFn = (options: VitePluginImageMin = {}): Plugin => {
  let outputPath: string;
  let config: ResolvedConfig;

  const emptyPlugin: Plugin = {
    name: 'vite:imagemin',
  };

  const { disable = false, filter = extRE, verbose = true } = options;

  if (disable) {
    return emptyPlugin;
  }

  debug('plugin options:', options);
  let tinyMap = new Map<string, { size: number; oldSize: number; ratio: number }>();

  return {
    ...emptyPlugin,
    apply: 'build',
    enforce: 'post',
    configResolved(resolvedConfig) {
      config = resolvedConfig;
      outputPath = path.join(config.root, config.build.outDir);
      debug('resolvedConfig:', resolvedConfig);
    },
    async generateBundle(_options, bundler) {
      tinyMap = new Map();
      const files: string[] = [];

      Object.keys(bundler).forEach((key) => {
        filterFile(path.resolve(outputPath, key), filter) && files.push(key);
      });

      debug('files:', files);

      if (!files.length) {
        return;
      }

      const handles = files.map(async (filePath: string) => {
        let source = (bundler[filePath] as any).source;

        const fullFilePath = path.resolve(outputPath, filePath);
        let content: Buffer | null = null;
        try {
          content = await imagemin.buffer(source, {
            plugins: getImageminPlugins(options),
          });
        } catch (error) {
          console.log(error);
          config.logger.error('imagemin error:' + fullFilePath);
        }
        const oldSize = source.length;
        const size = content?.byteLength ?? 0;
        tinyMap.set(fullFilePath, {
          size: size / 1024,
          oldSize: oldSize / 1024,
          ratio: size / oldSize - 1,
        });
        if (content) {
          (bundler[filePath] as any).source = content;
        }
      });

      await Promise.all(handles);
    },
    closeBundle() {
      if (verbose) {
        handleOutputLogger(config, tinyMap);
      }
    },
  };
};

// Packed output logic
function handleOutputLogger(
  config: ResolvedConfig,
  recordMap: Map<string, { size: number; oldSize: number; ratio: number }>
) {
  config.logger.info(
    `\n${chalk.cyan('✨ [vite-plugin-imagemin]')}` + '- compressed image resource successfully: '
  );

  const keyLengths = Array.from(recordMap.keys(), (name) => name.length);
  const valueLengths = Array.from(
    recordMap.values(),
    (value) => `${Math.floor(100 * value.ratio)}`.length
  );

  const maxKeyLength = Math.max(...keyLengths);
  const valueKeyLength = Math.max(...valueLengths);
  recordMap.forEach((value, name) => {
    let { ratio, size, oldSize } = value;

    const rName = normalizePath(name).replace(
      normalizePath(`${config.root}/${config.build.outDir}/`),
      ''
    );
    ratio = Math.floor(100 * ratio);
    const fr = `${ratio}`;

    const denseRatio = ratio > 0 ? chalk.red(`+${fr}%`) : ratio <= 0 ? chalk.green(`${fr}%`) : '';

    const sizeStr = `${oldSize.toFixed(2)}kb / tiny: ${size.toFixed(2)}kb`;

    config.logger.info(
      // chalk.dim(config.build.outDir + '/') +
      chalk.blueBright(rName) +
        ' '.repeat(2 + maxKeyLength - name.length) +
        chalk.gray(`${denseRatio} ${' '.repeat(valueKeyLength - fr.length)}`) +
        ' ' +
        chalk.dim(sizeStr)
    );
  });
  config.logger.info('\n');
}

function filterFile(file: string, filter: RegExp | ((file: string) => boolean)) {
  if (filter) {
    const isRe = isRegExp(filter);
    const isFn = isFunction(filter);
    if (isRe) {
      return (filter as RegExp).test(file);
    }
    if (isFn) {
      return (filter as Function)(file);
    }
  }
  return false;
}

// imagemin compression plugin configuration
function getImageminPlugins(options: VitePluginImageMin = {}): imagemin.Plugin[] {
  const {
    gifsicle = true,
    webp = false,
    mozjpeg = false,
    pngquant = false,
    optipng = true,
    svgo = true,
    jpegTran = true,
  } = options;

  const plugins: imagemin.Plugin[] = [];

  if (isNotFalse(gifsicle)) {
    debug('gifsicle:', true);
    const opt = isBoolean(gifsicle) ? undefined : gifsicle;
    plugins.push(imageminGif(opt));
  }

  if (isNotFalse(mozjpeg)) {
    debug('mozjpeg:', true);
    const opt = isBoolean(mozjpeg) ? undefined : mozjpeg;
    plugins.push(imageminJpeg(opt));
  }

  if (isNotFalse(pngquant)) {
    debug('pngquant:', true);
    const opt = isBoolean(pngquant) ? undefined : pngquant;
    plugins.push(imageminPng(opt));
  }

  if (isNotFalse(optipng)) {
    debug('optipng:', true);
    const opt = isBoolean(optipng) ? undefined : optipng;
    plugins.push(imageminOptPng(opt));
  }

  if (isNotFalse(svgo)) {
    debug('svgo:', true);
    const opt = isBoolean(svgo) ? undefined : svgo;

    // if (opt !== null && isObject(opt) && Reflect.has(opt, 'plugins')) {
    //   (opt as any).plugins.push({
    //     name: 'preset-default',
    //   });
    // }
    plugins.push(imageminSvgo(opt));
  }

  if (isNotFalse(webp)) {
    debug('webp:', true);
    const opt = isBoolean(webp) ? undefined : webp;
    plugins.push(imageminWebp(opt));
  }

  if (isNotFalse(jpegTran)) {
    debug('webp:', true);
    const opt = isBoolean(jpegTran) ? undefined : jpegTran;
    plugins.push(imageminJpegTran(opt));
  }
  return plugins;
}

export default exportFn;

module.exports = exportFn;
