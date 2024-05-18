import {WrapConfig} from './config'
import {shouldExit} from './utils'

export type WrapOption = {
  /**
   * This will override the global config that is defined by `defineWrapConfig`.
   *
   * Set `true` to exit the program when panic is called. By default is `false`.
   *
   * - In browser environment, it will throw error.
   * - In Node environment, it will call `process.exit()`
   */
  panic?: boolean
  /**
   * Exit code when panic. By default is `1`.
   *
   * This only works in Node environment.
   */
  exitCode?: number
}

/**
 * The value of Result type could be either Ok or Err. You must check it first
 * before using it.
 *
 * ```ts
 * let v: Result<number, Error>
 * if (!v.ok) {
 *   // Err<Error, number>
 *   console.error(v.error)
 * }
 * // Ok<number, Error>
 * v.value
 * ```
 *
 * Or you can `unwrap` the value directly without checking. But this would cause
 * the program panic when the value is Err.
 *
 * ```ts
 * let v: Result<number, never>
 * v.unwrap()
 * ```
 */
export type Result<T, E = unknown> = Ok<T, E> | Err<E, T>

/**
 * Wrap an ok value.
 *
 * ```ts
 * const pass = ok(1) // Result<number, never>
 * ```
 */
export function ok<T>(v: T): Result<T, never> {
  return new Ok(v)
}

/**
 * Wrap an error value
 *
 * ```ts
 * const fail = err('string') // Result<unknown, string>
 * ```
 */
export function err<E = unknown, T = unknown>(e: E): Result<T, E> {
  return new Err<E, T>(e)
}

type A<T, U> = {Ok: (v: T) => U}
type B<E, U> = {Err: (e: E) => U}
type C<T, E, U> = A<T, U> & B<E, U>

export interface R<T, E = unknown> {
  /**
   * Unwrap the contained value, will panic if the value is Err.
   *
   * ```ts
   * let v: Result<number, Error>
   * v.unwrap()
   * ```
   *
   * It receives `WrapOption` as the only parameter to control the behavior.
   *
   * ```ts
   * v.unwrap({panic: true, exitCode: 2})
   * ```
   */
  unwrap: (opt?: WrapOption) => T | never
  /**
   * It will return the given value if the contained value is Err. Otherwise
   * returns the Ok value.
   *
   * ```ts
   * ok(1).unwrapOr(2) // 1
   * err(1).unwrapOr(2) // 2
   * ```
   */
  unwrapOr: (v: T) => T
  /**
   * If will map the contained value, if it's an Err, to a value with the given
   * `mapFn`. Otherwise, it will return the Ok value.
   *
   * ```ts
   * err('error').unwrapOrElse(e => e.length)
   * ```
   */
  unwrapOrElse: <U>(mapFn: (e: E) => U) => T | U
  /**
   * It will panic with a customized error message if the contained value is Err.
   * Otherwise, returns the Ok value.
   *
   * ```ts
   * err('error').expect('it panic with error')
   * ```
   */
  expect: (errorMessage: string, opt?: WrapOption) => T | never
  /**
   * It will map the error by calling the given `errMapFn` if the unwrapped
   * value is Err. Otherwise, returns the Ok value.
   *
   * ```ts
   * err('error').mapErr(e => e.length)
   * ```
   */
  mapErr: <U>(errMapFn: (e: E) => U) => Result<T, U>
  /**
   * It handle Err and Ok Result value at one place, and returns the matched
   * function's value.
   *
   * ```ts
   * const res = ok<number, string>(1).match({
   *   Ok: v => v + 1,
   *   Err: e => e.length
   * })
   *
   * res // 2
   * ```
   */
  match: <U>(handler: A<T, U> | B<E, U> | C<T, E, U>) => U
}

export class Ok<T, E = never> implements R<T, E> {
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

  match<U>(handler: A<T, U> | B<E, U> | C<T, E, U>): U {
    if ('Ok' in handler) {
      return handler.Ok(this.value)
    }

    /* v8 ignore next 3 */
    return undefined as U
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

  match<U>(handler: A<T, U> | B<E, U> | C<T, E, U>): U {
    if ('Err' in handler) {
      return handler.Err(this.error)
    }

    /* v8 ignore next 3 */
    return undefined as U
  }
}
