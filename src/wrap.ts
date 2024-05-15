/**
 * wrap can secure your functions. This means even if your functions throw errors,
 * it will still be safe to call them without worrying that they will cause
 * your program to crash.
 *
 * **wrap an async function**
 *
 * ```ts
 * import {wrap} from 'unwrapit'
 *
 * const fetchWrapper = wrap(fetch)
 * const ret = (await fetchWrapper('www.google.com')).unwrap()
 * const content = await ret.text()
 * ```
 *
 * **wrap a sync function**
 *
 * ```ts
 * import {wrap} from 'unwrapit'
 *
 * const tryParseJson = wrap(() => JSON.parse(`{"package": "unwrapit!"}`))
 * const json = tryParseJson().unwrap()
 * ```
 */

import {Result, err, ok} from './result'
import {TP, TR} from './types'
import {isPromiseLike} from './utils'

// infer function type implicitly
// for never return only
export function wrap<A extends any[], R extends never>(
  fn: (...args: A) => Result<never>
): (...args: A) => Result<R>

export function wrap<A extends any[], R>(
  fn: (...args: A) => Promise<R>
): (...args: A) => Promise<Result<Awaited<R>>>
export function wrap<A extends any[], R>(
  fn: (...args: A) => R
): (...args: A) => Result<R>

// specify error type
// for never return only
export function wrap<E, F extends (...args: any[]) => never>(
  fn: (...args: TP<F>) => never
): (...args: TP<F>) => Result<never, E>

export function wrap<E, F extends (...args: any[]) => any>(
  fn: (...args: TP<F>) => Promise<TR<F>>
): (...args: TP<F>) => Promise<Result<TR<F>, E>>
export function wrap<E, F extends (...args: any[]) => any>(
  fn: (...args: TP<F>) => TR<F>
): (...args: TP<F>) => Result<TR<F>, E>

// specify error & return type
// for never return only
export function wrap<E, F extends (...args: any[]) => any, R extends never>(
  fn: (...args: TP<F>) => ReturnType<F>
): (...args: TP<F>) => Result<R, E>
export function wrap<
  E,
  F extends (...args: any[]) => any,
  R extends ReturnType<F>
>(
  fn: (...args: TP<F>) => ReturnType<F>
): (
  ...args: TP<F>
) => R extends Promise<infer AR> ? Promise<Result<AR, E>> : Result<R, E>

/**
 * Wrap an promise value. This allows you could handle async errors gracefully.
 *
 * # Example
 *
 * ```ts
 * import {wrap} from 'unwrapit'
 *
 * const promise = new Promise<string>((resolve, reject) => {
 *   if (Math.random() < 0.5) return resolve('Yay')
 *   return reject(new Error('Random number is greater than 0.5.'))
 * })
 *
 * // ret type is string
 * const ret = (await wrap(promise)).unwrap()
 * ```
 */
export function wrap<E, T>(promise: Promise<T>): Promise<Result<T, E>>

/**
 * Wrap arbitrary value.
 *
 * # Example
 *
 * ```ts
 * import {wrap} from 'unwrapit'
 *
 * const r1 = wrap(1)
 * const r2 = wrap("string")
 * const r3 = wrap([1, 2, 3])
 * const r4 = wrap({a: 1, b: true})
 * ```
 */
export function wrap<T extends any>(value: T): Result<T, never>

export function wrap(input: any) {
  // wrap a function
  if (typeof input === 'function') {
    return (...args: any[]) => {
      try {
        const ret = input(...args)

        if (isPromiseLike(ret)) {
          return wrap(ret)
        }

        return ok(ret)
      } catch (e) {
        return err(e)
      }
    }
  }

  // wrap a promise value
  if (isPromiseLike(input)) {
    return input.then(ok).catch(err)
  }

  // wrap a value
  return ok(input)
}
