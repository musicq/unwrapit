import {panic as defaultPanic} from 'panicit'
import {TP, TR} from './types'
import {isPromiseLike} from './utils'

export type Panic = typeof defaultPanic
let _panic: Panic = defaultPanic

export type WrapOption = {
  // exit program if true in node
  panic: boolean
}

/**
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
export function setPanic(panic: Panic) {
  _panic = panic
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
 * Wrap an asynchronous function. This is useful when you are trying to wrap an
 * async function such as `fetch`.
 *
 * # Example
 *
 * ```ts
 * import {wrap} from 'unwrapit'
 *
 * const fetchWrapper = wrap(fetch)
 * const ret = (await fetchWrapper('www.google.com')).unwrap()
 * const json = await ret.json())
 * ```
 */

// For explicit type
//
// ```ts
// declare function foo(a: number): string
// let r = wrap<Error, TF<typeof foo>>(foo)
// // => (a: number) => Result<string, Error>
// ```
export function wrap<E, F extends [TP<any>, TR<any>]>(
  func: (...args: F[0]) => Promise<F[1]>
): (...args: F[0]) => Promise<Result<F[1], E>>

// For implicit type
//
// ```ts
// declare function foo(a: number): string
// let r = wrap(foo)
// // => (...args: string[]) => Result<string, unknown>
// ```
export function wrap<Args extends any[], Ret>(
  func: (...args: Args) => Promise<Ret>
): (...args: Args) => Promise<Result<Ret>>

/**
 * Wrap an synchronous function. This is useful when you are trying to parse a
 * synchronous function, such as `JSON.parse`.
 *
 * # Example
 *
 * ```ts
 * import {wrap} from 'unwrapit'
 *
 * const tryParseJson = wrap(() => JSON.parse(`{"package": "unwrapit!"}`))
 * // unwrap to get the value without checking if it could be failed.
 * const json = tryParseJson().unwrap()
 * ```
 */
// for explicit type
export function wrap<E, F extends [TP<any>, TR<any>]>(
  func: (...args: F[0]) => F[1]
): (...args: F[0]) => Result<F[1], E>
// for implicit type
export function wrap<Args extends any[], Ret>(
  func: (...args: Args) => Ret
): (...args: Args) => Result<Ret>

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
   * If the unwrapped value is Err, will map the error to ok value with the given mapFn.
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
    return _panic(this.error, {shouldExit: opt?.panic ?? false})
  }

  unwrapOr(v: T) {
    return v
  }

  unwrapOrElse<U>(mapFn: (e: E) => U): U {
    return mapFn(this.error)
  }

  expect(errorMessage: string, opt?: WrapOption | undefined): never {
    return _panic(errorMessage, {
      cause: this.error,
      shouldExit: opt?.panic ?? false,
    })
  }

  mapErr<U>(errMapFn: (e: E) => U): Err<U, T> {
    return new Err(errMapFn(this.error))
  }
}
