import type { Options as GifsicleOptions } from 'imagemin-gifsicle';
import type { Options as SvgoOptions } from 'imagemin-svgo';
import type { Options as MozjpegOptions } from 'imagemin-mozjpeg';
import type { Options as OptipngOptions } from 'imagemin-optipng';
import type { Options as PngquantOptions } from 'imagemin-pngquant';
import type { Options as WebpOptions } from 'imagemin-webp';

type EnabledOptions<T> = T | false;

export interface VitePluginImageMin {
  /**
   * Log compressed files and their compression ratios.
   * @default: true
   */
  verbose?: boolean;
  /**
   * Filter files that do not need to be compressed
   */
  filter?: RegExp | ((file: string) => boolean);
  /**
   * Whether to enable compression
   * @default: false
   */
  disable?: boolean;
  /**
   * gif compression configuration
   * @default: {enabled:true}
   */
  gifsicle?: EnabledOptions<GifsicleOptions>;
  /**
   * svg compression configuration
   * @default: {enabled:true}
   */
  svgo?: EnabledOptions<SvgoOptions>;
  /**
   * jpeg compression configuration
   * @default: {enabled:true}
   */
  mozjpeg?: EnabledOptions<MozjpegOptions>;
  /**
   * png compression configuration
   * @default: {enabled:true}
   */
  optipng?: EnabledOptions<OptipngOptions>;
  /**
   * png compression configuration
   * @default: {enabled:true}
   */
  pngquant?: EnabledOptions<PngquantOptions>;
  /**
   * webp compression configuration
   * @default: {enabled:true}
   */
  webp?: EnabledOptions<WebpOptions>;
}
