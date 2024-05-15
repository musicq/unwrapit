import {panic as defaultPanic} from 'panicit'

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
   * Customize `panic` function.
   * By default will use `panic` from [`panicit`](https://github.com/musicq/panicit).
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
  WrapConfig.panic = Boolean(config.panic)

  if (typeof config.panicFn === 'function') {
    WrapConfig.panicFn = config.panicFn
  }
}

/**
 * @deprecated **Please use `defineWrapConfig` instead.**
 *
 * Customize `panic` function. By default will use `panic` from `panicit`.
 *
 * This is useful when you want to do handle some customized errors.
 *
 * # Example
 * ```ts
 * import {wrap, setPanic, err} from 'unwrapit'
 *
 * setPanic((msg: string) => {
 *   throw new Error(msg)
 * })
 * const fail: Result<never, string> = err('error')
 *
 * fail.unwrap() // will `throw new Error('error')`
 * ```
 */
export function setPanic(panic: TWrapConfig['panicFn']) {
  defineWrapConfig({panicFn: panic})
}
