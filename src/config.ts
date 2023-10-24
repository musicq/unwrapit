import {panic as defaultPanic} from 'panicit'

export type TWrapConfig = {
  /**
   * If `true`, the program will exit when panic. By default is `false`.
   */
  panic: boolean
  /**
   * Customize `panic` function. By default will use `panic` from `panicit`.
   */
  panicFn: typeof defaultPanic
}

export const WrapConfig: TWrapConfig = {
  panic: false,
  panicFn: defaultPanic,
}

/**
 * Define global config for `unwrapit`.
 */
export function defineWrapConfig(config: Partial<TWrapConfig>) {
  if (typeof config.panic === 'boolean') {
    WrapConfig.panic = config.panic
  }

  if (typeof config.panicFn === 'function') {
    WrapConfig.panicFn = config.panicFn
  }
}
