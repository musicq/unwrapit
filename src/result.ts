import {WrapConfig, defineWrapConfig, type TWrapConfig} from './config'
import {TP, TR} from './types'
import {isPromiseLike, shouldExit} from './utils'

export type WrapOption = {
  /**
   * If `true`, the program will exit when panic. By default is `false`.
   */
  panic?: boolean
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

/**
 * Union type of Ok and Err. When you create a result value with either
 * `ok` or `err`, it's a Result type.
 *
 * # Example
 * ```ts
 * import {ok, err} from 'unwrapit'
 * import type {Result} from 'unwrapit'
 *
 * const pass: Result<number, never> = ok(1)
 * const fail: Result<never, string> = err('error')
 *
 * // A Result type can `unwrap`.
 * pass.unwrap()
 * fail.unwrap()
 * ```
 */
export type Result<T, E = unknown> = Ok<T> | Err<E, T>

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

// infer function type implicitly
export function wrap<A extends any[], R>(
  fn: (...args: A) => Promise<R>
): (...args: A) => Promise<Result<Awaited<R>>>
export function wrap<A extends any[], R>(
  fn: (...args: A) => R
): (...args: A) => Result<R>

// specify error type
export function wrap<E, F extends (...args: any[]) => any>(
  fn: (...args: TP<F>) => Promise<TR<F>>
): (...args: TP<F>) => Promise<Result<TR<F>, E>>
export function wrap<E, F extends (...args: any[]) => any>(
  fn: (...args: TP<F>) => TR<F>
): (...args: TP<F>) => Result<TR<F>, E>

// specify error & return type
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

/**
 * Use when return some value this stands for success.
 *
 * # Example
 *
 * ```ts
 * import {ok} from 'unwrapit
 * import type {Result} from 'unwrapit
 *
 * const pass: Result<number, never> = ok(1)
 * ```
 */
export function ok<T>(v: T): Result<T, never> {
  return new Ok(v)
}

/**
 * Use when return some value this stands for error.
 *
 * # Example
 *
 * ```ts
 * import {err} from 'unwrapit
 * import type {Result} from 'unwrapit
 *
 * const fail: Result<never, string> = err('string')
 * ```
 */
export function err<E = unknown, T = unknown>(e: E): Result<T, E> {
  return new Err<E, T>(e)
}

export interface R<T, E = unknown> {
  /**
   * Unwrap the contained value, will panic if the value is Err.
   */
  unwrap: (opt?: WrapOption) => T | never
  /**
   * If the unwrapped value is Err, will map to the given value instead.
   */
  unwrapOr: (v: T) => T
  /**
   * If the unwrapped value is Err, will map the error to a value with the given mapFn.
   */
  unwrapOrElse: <U>(mapFn: (e: E) => U) => T | U
  /**
   * If the unwrapped value is Err, will panic with a customized error message.
   */
  expect: (errorMessage: string, opt?: WrapOption) => T | never
  /**
   * If the unwrapped value is Err, will map the error by calling the given `errMapFn`.
   */
  mapErr: <U>(errMapFn: (e: E) => U) => Result<T, U>
}

export class Ok<T> implements R<T, never> {
  readonly ok: true = true

  constructor(public readonly value: T) {}

  unwrap(opt?: WrapOption): T {
    return this.value
  }

  unwrapOr(v: T) {
    return this.value
  }

  unwrapOrElse<U>(mapFn: (e: never) => U): T {
    return this.value
  }

  expect(errorMessage: string, opt?: WrapOption): T {
    return this.value
  }

  mapErr<U>(errMapFn: (e: never) => U): Ok<T> {
    return this
  }
}

export class Err<E = unknown, T = unknown> implements R<T, E> {
  readonly ok: false = false

  constructor(public readonly error: E) {}

  unwrap(opt?: WrapOption): never {
    return WrapConfig.panicFn(this.error, {shouldExit: shouldExit(opt)})
  }

  unwrapOr(v: T) {
    return v
  }

  unwrapOrElse<U>(mapFn: (e: E) => U): U {
    return mapFn(this.error)
  }

  expect(errorMessage: string, opt?: WrapOption | undefined): never {
    return WrapConfig.panicFn(errorMessage, {
      cause: this.error,
      shouldExit: shouldExit(opt),
    })
  }

  mapErr<U>(errMapFn: (e: E) => U): Err<U, T> {
    return new Err(errMapFn(this.error))
  }
}
