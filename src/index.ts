import type { Plugin, ResolvedConfig } from 'vite';
import type { VitePluginImageMin } from './types';
import path from 'path';
import { normalizePath } from 'vite';
import { isNotFalse, readAllFile, isBoolean } from './utils';
import fs from 'fs-extra';
import chalk from 'chalk';
import { debug as Debug } from 'debug';

import imagemin from 'imagemin';
import imageminGif from 'imagemin-gifsicle';
import imageminPng from 'imagemin-pngquant';
import imageminOptPng from 'imagemin-optipng';
import imageminJpeg from 'imagemin-mozjpeg';
import imageminSvgo from 'imagemin-svgo';
import imageminWebp from 'imagemin-webp';

const debug = Debug('vite-plugin-imagemin');

const extRE = /\.(png|jpeg|gif|jpg|bmp|svg)$/i;

const mtimeCache = new Map<string, number>();

export default (options: VitePluginImageMin = {}): Plugin => {
  let outputPath: string;
  let config: ResolvedConfig;

  const emptyPlugin: Plugin = {
    name: 'vite:imagemin',
  };

  const { disable = false, filter, verbose = true } = options;

  if (disable) {
    return emptyPlugin;
  }

  debug('plugin options:', options);

  return {
    ...emptyPlugin,
    apply: 'build',
    enforce: 'post',
    configResolved(resolvedConfig) {
      config = resolvedConfig;
      outputPath = path.join(config.root, config.build.outDir);
      debug('resolvedConfig:', resolvedConfig);
    },
    async writeBundle() {
      let files = readAllFile(outputPath, extRE, filter) || [];
      debug('files:', files);

      if (!files.length) {
        return;
      }

      const tinyMap = new Map<string, { size: number; oldSize: number; ratio: number }>();

      const handles = files.map(async (filePath: string) => {
        let { mtimeMs, size: oldSize } = await fs.stat(filePath);
        if (mtimeMs <= (mtimeCache.get(filePath) || 0)) return;

        let content = await fs.readFile(filePath);
        try {
          content = await imagemin.buffer(content, {
            plugins: getImageminPlugins(options),
          });
        } catch (error) {
          config.logger.error('imagemin error:' + filePath);
        }
        const size = content.byteLength;
        tinyMap.set(filePath, {
          size: size / 1024,
          oldSize: oldSize / 1024,
          ratio: size / oldSize - 1,
        });
        await fs.writeFile(filePath, content);
        mtimeCache.set(filePath, Date.now());
      });

      Promise.all(handles).then(() => {
        if (verbose) {
          handleOutputLogger(config, tinyMap);
        }
      });
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

    const denseRatio = ratio > 0 ? chalk.red(`+${fr}%`) : ratio < 0 ? chalk.green(`${fr}%`) : '';

    const sizeStr = `${oldSize.toFixed(2)}kb / tiny: ${size.toFixed(2)}kb`;

    config.logger.info(
      chalk.dim(config.build.outDir + '/') +
        chalk.blueBright(rName) +
        ' '.repeat(2 + maxKeyLength - name.length) +
        chalk.gray(`${denseRatio} ${' '.repeat(valueKeyLength - fr.length)}`) +
        ' ' +
        chalk.dim(sizeStr)
    );
  });
  config.logger.info('\n');
}

// imagemin compression plugin configuration
function getImageminPlugins(options: VitePluginImageMin = {}): imagemin.Plugin[] {
  const {
    gifsicle = true,
    webp = true,
    mozjpeg = true,
    pngquant = true,
    optipng = true,
    svgo = true,
  } = options;

  const plugins: imagemin.Plugin[] = [];
  if (isNotFalse(gifsicle)) {
    debug('gifsicle:', true);
    const opt = isBoolean(gifsicle) ? undefined : gifsicle;
    plugins.push(imageminGif(opt));
  }
  if (isNotFalse(webp)) {
    debug('webp:', true);
    const opt = isBoolean(webp) ? undefined : webp;
    plugins.push(imageminWebp(opt));
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
    plugins.push(imageminSvgo(opt));
  }

  return plugins;
}
