import type { Options as GifsicleOptions } from 'imagemin-gifsicle'
import type { Options as SvgoOptions } from 'imagemin-svgo'
import type { Options as MozjpegOptions } from 'imagemin-mozjpeg'
import type { Options as OptipngOptions } from 'imagemin-optipng'
import type { Options as PngquantOptions } from 'imagemin-pngquant'
import type { Options as WebpOptions } from 'imagemin-webp'
import type { Options as JpegOptions } from 'imagemin-jpegtran'

type EnabledOptions<T> = T | false

export interface SvgOption extends SvgoOptions {
  plugins: any[]
}

export interface VitePluginImageMin {
  /**
   * Log compressed files and their compression ratios.
   * @default: true
   */
  verbose?: boolean
  /**
   * Filter files that do not need to be compressed
   */
  filter?: RegExp | ((file: string) => boolean)
  /**
   * Whether to enable compression
   * @default: false
   */
  disable?: boolean
  /**
   * gif compression configuration
   * @default: {enabled:true}
   */
  gifsicle?: EnabledOptions<GifsicleOptions>
  /**
   * svg compression configuration
   * @default: {enabled:true}
   */
  svgo?: EnabledOptions<SvgOption>
  /**
   * jpeg compression configuration
   * @default: {enabled:false}
   */
  mozjpeg?: EnabledOptions<MozjpegOptions>
  /**
   * png compression configuration
   * @default: {enabled:true}
   */
  optipng?: EnabledOptions<OptipngOptions>
  /**
   * png compression configuration
   * @default: {enabled:false}
   */
  pngquant?: EnabledOptions<PngquantOptions>
  /**
   * webp compression configuration
   * @default: {enabled:false}
   */
  webp?: EnabledOptions<WebpOptions>

  /**
   * jpeg compression configuration
   * @default: {enabled:true}
   */
  jpegTran?: EnabledOptions<JpegOptions>
}
