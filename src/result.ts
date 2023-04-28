import {panic} from 'panicit'

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
 * Wrap an synchronous function. This is useful when you are trying to parse an
 * JSON through `JSON.parse`.
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
export function wrap<TArgs extends any[], TReturn>(
  func: (...args: TArgs) => TReturn
): (...args: TArgs) => Result<TReturn>

/**
 * Wrap an promise value. This allows you could handle error gracefully.
 *
 * # Example
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
export function wrap<T extends Promise<any>>(
  promise: T
): Promise<Result<Awaited<T>>>

export function wrap(input: any) {
  if (typeof input === 'function') {
    return (...args: any[]) => {
      try {
        return ok(input(...args))
      } catch (e) {
        return err(e)
      }
    }
  }

  return input.then(ok).catch(err)
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
export function err<E = unknown, T = any>(e: E): Result<T, E> {
  return new Err<E, T>(e)
}

export interface R<T, E = unknown> {
  /**
   * unwrap value, panic if the value is Err.
   */
  unwrap: (opt?: { panic: boolean }) => [E] extends [never] ? T : never
  /**
   * if the unwrapped value is Err, will map to the given value instead.
   */
  unwrapOr: (v: T) => T
  /**
   * if the unwrapped value is Err, will panic with a customized error message.
   */
  expect: (
    errorMessage: string,
    opt?: { panic: boolean }
  ) => [E] extends [never] ? T : never
}

export class Ok<T> implements R<T, never> {
  readonly ok: true = true

  constructor(public readonly value: T) {}

  unwrap(opt?: { panic: boolean }) {
    return this.value
  }

  unwrapOr(v: T) {
    return this.value
  }

  // to provide same type hint
  expect(errorMessage: string, opt?: { panic: boolean }): T {
    return this.value
  }
}

export class Err<E, T = any> implements R<T, E> {
  readonly ok: false = false

  constructor(public readonly error: E) {}

  unwrap(opt?: { panic: boolean }) {
    return panic(this.error, { shouldExit: opt?.panic ?? true })
  }

  unwrapOr(v: T) {
    return v
  }

  expect(errorMessage: string, opt?: { panic: boolean }) {
    return panic(errorMessage, {
      cause: this.error,
      shouldExit: opt?.panic ?? true,
    })
  }
}
