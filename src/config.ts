import {panic as defaultPanic} from 'panicit';

export type Panic = (
  message: any,
  opt?: {cause?: any; shouldExit?: boolean; exitCode?: number}
) => never

export type TWrapConfig = {
  /**
   * If `true`, the program will exit when panic. By default is `false`.
   */
  panic: boolean
  /**
   * Customize `panic` function. By default will use `panic` from `panicit`.
   */
  panicFn: Panic
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
