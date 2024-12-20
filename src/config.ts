import {panic as defaultPanic} from 'panicit'

export type Panic = typeof defaultPanic

export type WrapConfig = {
  /**
   * Set `true` to exit the program when panic is called. By default is `false`.
   *
   * - In browser environment, it will throw error.
   * - In Node environment, it will call `process.exit()` to terminate process.
   */
  panic: boolean
  /**
   * Customize `panic` function.
   *
   * This is useful when you want to do some extra logics,
   * such as reporting errors or doing resource clean up before exit.
   *
   * By default will use `panic` from [`panicit`](https://github.com/musicq/panicit).
   */
  panicFn: Panic
}

// global unwrapit config
export const wrapConfig: WrapConfig = {
  panic: false,
  panicFn: defaultPanic,
}

/**
 * Define global config for `unwrapit`.
 *
 * ```ts
 * import { defineUnwrapitConfig } from 'unwrapit'
 *
 * defineUnwrapitConfig({
 *   panic: true,
 *   panicFn: myPanicFn
 * })
 * ```
 */
export function defineUnwrapitConfig(config: Partial<WrapConfig>) {
  if (config.panic !== undefined) {
    wrapConfig.panic = !!config.panic
  }

  if (typeof config.panicFn === 'function') {
    wrapConfig.panicFn = config.panicFn
  }
}

/**
 * @deprecated
 * Use `defineUnwrapitConfig` instead.
 */
export const defineWrapConfig = defineUnwrapitConfig

/**
 * @deprecated
 * Use `defineWrapConfig` instead.
 *
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
export function setPanic(panic: WrapConfig['panicFn']) {
  defineUnwrapitConfig({panicFn: panic})
}
