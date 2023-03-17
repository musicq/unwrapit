type Ok<T> = {
  ok: true
  value: T
  unwrap: () => T
}

type Err<E = unknown> = {
  ok: false
  error: E
  unwrap: () => never
}

export type Result<T, E = unknown> = Ok<T> | Err<E>

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
 * const ret = wrap(promise).unwrap()
 * ```
 */
export function wrap<T extends Promise<any>>(promise: T): Result<Awaited<T>>

/**
 * Wrap either a function or a promise value
 *
 * # Example
 * ```ts
 * import {wrap} from 'unwrapit
 * ```
 */
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

export function ok<T>(v: T): Result<T, never> {
  return {
    ok: true,
    value: v,
    unwrap() {
      return v
    },
  }
}

export function err<T = unknown>(e: T): Result<never, T> {
  return {
    ok: false,
    error: e,
    unwrap() {
      throw e
    },
  }
}
