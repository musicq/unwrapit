import {panic as defaultPanic} from 'panicit'

export type Panic = (
  message: any,
  opt?: {cause?: any; shouldExit?: boolean; exitCode?: number}
) => never

export type TWrapConfig = {
  /**
   * Set `true` to exit the program when panic is called. By default is `false`.
   *
   * - In browser environment, it will throw error.
   * - In Node environment, it will call `process.exit()`
   */
  panic: boolean
  /**
   * Customize `panic` function.
   *
   * This is useful when you want to do some extra
   * logic like report errors or resource clean up before exit.
   *
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
 *
 * # Example
 * ```ts
 * import { defineWrapConfig } from 'unwrapit'
 *
 * defineWrapConfig({
 *   panic: true,
 *   panicFn: myPanicFn
 * })
 * ```
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
 * This is useful when you want to do some extra
 * logic like report errors or resource clean up before exit.
 *
 * By default will use `panic` from [`panicit`](https://github.com/musicq/panicit).
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
