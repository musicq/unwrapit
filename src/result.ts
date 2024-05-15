import {WrapConfig} from './config'
import {shouldExit} from './utils'

export type WrapOption = {
  /**
   * If `true`, the program will exit when panic. By default is `false`.
   */
  panic?: boolean
  /**
   * Exit code when panic. By default is `1`.
   */
  exitCode?: number
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
    return WrapConfig.panicFn(this.error, {
      shouldExit: shouldExit(opt),
      exitCode: opt?.exitCode,
    })
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
      exitCode: opt?.exitCode,
    })
  }

  mapErr<U>(errMapFn: (e: E) => U): Err<U, T> {
    return new Err(errMapFn(this.error))
  }
}
